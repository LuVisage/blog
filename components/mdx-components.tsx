import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import type { ImgHTMLAttributes } from 'react'
import { BASE_PATH } from '@/lib/constants'

/**
 * 正文排版的唯一出处是 globals.css 第 6 节「Prose — the reading surface」。
 * 这里只保留 CSS 做不到的两件事：内部链接换成 next/link 才能带上部署 basePath，
 * 以及正文里的 <img> 需要补同一个前缀。任何 style/className 都会以行内样式的身份
 * 压过 .prose 规则，等于把同一套排版写两遍，所以不要再往这里加样式。
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      if (href?.startsWith('/')) {
        return (
          <Link href={href} {...props}>
            {children}
          </Link>
        )
      }
      const external = !!href && /^https?:\/\//i.test(href)
      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      )
    },
    img: ({ alt, src, ...props }) => {
      const imgSrc = src?.startsWith('/') && !src.startsWith(BASE_PATH) ? `${BASE_PATH}${src}` : src
      return <img src={imgSrc} alt={alt || ''} loading="lazy" {...(props as ImgHTMLAttributes<HTMLImageElement>)} />
    },
    ...components,
  }
}
