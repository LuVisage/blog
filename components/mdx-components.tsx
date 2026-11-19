import Link from 'next/link'
import type { MDXComponents } from 'mdx/types'
import type { HTMLAttributes, ImgHTMLAttributes, ReactNode } from 'react'
import { BASE_PATH } from '@/lib/constants'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: ReactNode }

/**
 * 章节永久链接：rehype-slug 已在构建期把 id 写进 h2/h3，这里补一枚空的 <a>。
 * 井号由 CSS 的 ::before 生成，不进 textContent —— 目录扫描器（use-toc-spy）
 * 读到的章节名因此不会被一个多余的「#」污染。空链接靠 aria-label 得到可读名。
 * 服务端渲染、无 JS 可用；点它得到 /posts/xxx/#section 这样的可分享地址。
 */
function HeadingAnchor({ id }: { id?: string }) {
  if (!id) return null
  return (
    <a
      className="heading-anchor"
      href={`#${id}`}
      aria-label="本节永久链接"
      title="本节永久链接"
    />
  )
}

function heading(Tag: 'h2' | 'h3') {
  return function Heading({ id, children, ...props }: HeadingProps) {
    return (
      <Tag id={id} {...props}>
        {children}
        <HeadingAnchor id={id} />
      </Tag>
    )
  }
}

/**
 * 正文排版的唯一出处是 globals.css 的 Prose 节。
 * 这里只保留 CSS 做不到的几件事：内部链接换成 next/link 才能带上部署 basePath，
 * 正文里的 <img> 补同一个前缀，标题补一枚可分享的章节锚点。
 * 任何 style/className 都会以行内样式的身份压过 .prose 规则，等于把同一套排版
 * 写两遍，所以不要再往这里加样式。
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
    h2: heading('h2'),
    h3: heading('h3'),
    ...components,
  }
}
