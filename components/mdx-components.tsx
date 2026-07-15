import type { MDXComponents } from 'mdx/types'
import type { ReactNode, ImgHTMLAttributes } from 'react'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-2xl font-semibold mt-8 mb-3 pb-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-medium mt-4 mb-2 text-gray-900 dark:text-white"
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ children, ...props }) => (
      <p className="my-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </p>
    ),
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        className="text-primary-600 dark:text-primary-400 underline decoration-primary-300 hover:decoration-primary-600 dark:decoration-primary-700 dark:hover:decoration-primary-300 underline-offset-2 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),
    ul: ({ children, ...props }) => (
      <ul className="my-4 pl-6 space-y-1 list-disc text-gray-700 dark:text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="my-4 pl-6 space-y-1 list-decimal text-gray-700 dark:text-gray-300" {...props}>
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
        className="my-4 pl-4 border-l-4 border-primary-400 dark:border-primary-600 bg-gray-50 dark:bg-gray-900/50 rounded-r-lg py-2 italic text-gray-800 dark:text-gray-300"
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
        className="my-8 border-gray-200 dark:border-gray-800"
        {...props}
      />
    ),
    table: ({ children, ...props }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
        <table className="min-w-full text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="px-4 py-3 text-left font-semibold bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td
        className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-300"
        {...props}
      >
        {children}
      </td>
    ),
    // NOTE: pre and code are intentionally NOT overridden here.
    // rehype-pretty-code controls code block styling via its own generated HTML
    // (figure[data-rehype-pretty-code-figure] etc.) and overriding pre/code
    // would conflict with the plugin's output.
    // Inline code styling is handled by globals.css via `.prose code:not(pre code)`.
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-gray-900 dark:text-white" {...props}>
        {children}
      </strong>
    ),
    ...components,
  }
}
