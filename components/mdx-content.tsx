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

const MATH_BLOCK_TAGS = new Set(['p', 'li', 'dd', 'td', 'h3', 'h4', 'blockquote'])

/**
 * 给「含行内公式的块」在构建期打上 has-math，供 globals.css 的窄屏横滚出口使用。
 *
 * 原来那条 CSS 写的是 .prose p:has(.katex) 等七个选择器。:has() 要在后代变化时向上
 * 失效，而 day-10 有 9062 个元素、其中 7404 个是 KaTeX 后代：改一次阅读字号，实测
 * 触发 ~45 次重样式 / 5–6 次重排；换成这个类等价选择器后压到 ~13 次 / 1 次，
 * 重样式 131→101ms、INP 355→323ms（attr-ze.mjs，3 轮位次轮换，15 行全自证通过）。
 * 特异性不变：:has() 取参数里最高的特异性，p:has(.katex) 与 p.has-math 同为 (0,2,1)。
 *
 * 静态站里公式只在构建期产生，所以「构建期打标」与「运行期 :has()」命中同一批元素；
 * mathclass.mjs 对 out/ 里全部 92 个含公式页逐元素比对命中集合，漏标/多标一个就 FAIL。
 *
 * 遍历必须穿过非 element 节点：MDX 里的 <details> 之类 JSX 块在 hast 里是
 * mdxJsxFlowElement，按 type === 'element' 过滤会把整棵子树跳过 —— 第一版就这么漏了
 * 229 个块（day-10 漏 6 个，全在 <details> 里），是等价闸抓出来的。
 */
function rehypeMathBlocks() {
  return (tree: { type: string; tagName?: string; properties?: Record<string, unknown>; children?: unknown[] }) => {
    const walk = (node: typeof tree): boolean => {
      let hasMath = false
      for (const kid of node.children ?? []) {
        const k = kid as typeof tree
        const cls = k.properties?.className
        if (Array.isArray(cls) && cls.includes('katex')) hasMath = true
        if (walk(k)) hasMath = true
      }
      if (hasMath && node.type === 'element' && node.tagName && MATH_BLOCK_TAGS.has(node.tagName)) {
        const cls = node.properties?.className
        node.properties = node.properties ?? {}
        node.properties.className = Array.isArray(cls) ? [...cls, 'has-math'] : cls ? [cls, 'has-math'] : ['has-math']
      }
      return hasMath
    }
    walk(tree)
  }
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
            rehypeMathBlocks,
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
