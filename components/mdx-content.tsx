import { MDXRemote } from 'next-mdx-remote-client/rsc'
import type { MDXComponents } from 'mdx/types'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
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
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
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
