import { MDXRemote } from 'next-mdx-remote-client/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import { useMDXComponents } from './mdx-components'

interface MDXContentProps {
  source: string
}

export function MDXContent({ source }: MDXContentProps) {
  const components = useMDXComponents({})

  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
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
