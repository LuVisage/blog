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

export function MDXContent({ source, components: extra }: MDXContentProps) {
  const components = useMDXComponents(extra ?? {})

  return (
    <MDXRemote
      source={source}
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
