import { MDXRemote } from 'next-mdx-remote-client/rsc'
import type { MDXComponents } from 'mdx/types'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { useMDXComponents } from './mdx-components'

interface MDXContentProps {
  source: string
  /** Extra tags merged over the shared article components. */
  components?: MDXComponents
}

/**
 * 正文里裸 URL 直接紧跟中文时，remark-gfm 的 autolink-literal 会把后面那串中文
 * 一起吞进 href（`http://x/docs（自动生成的` → href 带 `%EF%BC%88…`），点出去是
 * 一个坏地址；`**http://x**，点` 这种「给 URL 加粗」的写法更糟，连整句都会被并进
 * 链接、加粗也一起失效。这里在解析前补一个分隔空格，并把 URL 外层的 `**` 摘掉。
 *
 * 只动散文：围栏代码块与行内代码原样保留（那里面是给人抄的命令，不能插字符）。
 */
const ASCII_URL = /(https?:\/\/[\x21-\x7E]+)(?=[^\x00-\x7F])/g
const BOLD_URL = /\*\*(https?:\/\/[\x21-\x7E]+?)\*\*/g
const INLINE_CODE = /(`+)[\s\S]*?\1/g

function repairProse(segment: string) {
  return segment.replace(BOLD_URL, '$1').replace(ASCII_URL, '$1 ')
}

function normalizeUrlBoundaries(source: string) {
  let inFence = false
  return source
    .split('\n')
    .map((line) => {
      if (/^\s*(?:```|~~~)/.test(line)) {
        inFence = !inFence
        return line
      }
      if (inFence) return line
      let out = ''
      let last = 0
      for (const m of line.matchAll(INLINE_CODE)) {
        out += repairProse(line.slice(last, m.index)) + m[0]
        last = (m.index ?? 0) + m[0].length
      }
      return out + repairProse(line.slice(last))
    })
    .join('\n')
}

export function MDXContent({ source, components: extra }: MDXContentProps) {
  const components = useMDXComponents(extra ?? {})

  return (
    <MDXRemote
      source={normalizeUrlBoundaries(source)}
      components={components}
      options={{
        mdxOptions: {
          // Math first: the ML curriculum is full of $…$ spans, and extracting
          // them before GFM keeps braces out of the JSX expression parser.
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            rehypeKatex,
            [
              rehypePrettyCode,
              {
                theme: {
                  dark: 'github-dark-dimmed',
                  light: 'github-light',
                },
                keepBackground: false,
                defaultLang: 'plaintext',
              },
            ],
          ],
        },
      }}
    />
  )
}
