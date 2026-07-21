import type { MDXComponents } from 'mdx/types'
import type { ReactNode, ImgHTMLAttributes } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl font-bold mt-10 mb-4"
        style={{ color: 'var(--color-ink)' }}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-2xl font-semibold mt-8 mb-3 pb-2 border-b"
        style={{ color: 'var(--color-ink)', borderColor: 'var(--color-hairline)' }}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-semibold mt-6 mb-2"
        style={{ color: 'var(--color-ink)' }}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-medium mt-4 mb-2"
        style={{ color: 'var(--color-ink)' }}
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="my-4 leading-relaxed" style={{ color: 'var(--color-body)' }} {...props}>
        {children}
      </p>
    ),
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        className="underline underline-offset-2 transition-colors"
        style={{ color: 'var(--color-primary)' }}
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-4 pl-6 space-y-1 list-disc" style={{ color: 'var(--color-body)' }} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 pl-6 space-y-1 list-decimal" style={{ color: 'var(--color-body)' }} {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-relaxed" {...props}>
        {children}
      </li>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="my-4 pl-4 border-l-4 rounded-r-lg py-2 italic"
        style={{
          color: 'var(--color-body)',
          borderColor: 'var(--color-primary)',
          background: 'var(--color-primary-soft)',
        }}
        {...props}
      >
        {children}
      </blockquote>
    ),
    img: ({ alt, src, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || ''}
        className="my-6 rounded-xl shadow-lg w-full"
        loading="lazy"
        {...props as ImgHTMLAttributes<HTMLImageElement>}
      />
    ),
    hr: (props) => (
      <hr
        className="my-8"
        style={{ borderColor: 'var(--color-hairline)' }}
        {...props}
      />
    ),
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--color-hairline)' }}>
        <table className="min-w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left font-semibold"
        style={{
          color: 'var(--color-body)',
          background: 'var(--color-primary-soft)',
        }}
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 border-t"
        style={{
          color: 'var(--color-body)',
          borderColor: 'var(--color-hairline-soft)',
        }}
        {...props}
      >
        {children}
      </td>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold" style={{ color: 'var(--color-ink)' }} {...props}>
        {children}
      </strong>
    ),
    ...components,
  }
}
