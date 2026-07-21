'use client'

import { useEffect, useRef } from 'react'

/**
 * CodeBlockEnhancer — wraps around rendered MDX content and adds:
 * 1. Language label (top-left) on each code block
 * 2. Copy button (top-right) on each code block
 *
 * Works with rehype-pretty-code output: figure[data-rehype-pretty-code-figure]
 */
export function CodeBlockEnhancer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || processedRef.current) return

    const figures = container.querySelectorAll<HTMLElement>(
      'figure[data-rehype-pretty-code-figure]'
    )

    figures.forEach((figure) => {
      // Prevent double-processing
      if (figure.dataset.copyEnhanced === 'true') return
      figure.dataset.copyEnhanced = 'true'

      const pre = figure.querySelector('pre')
      const code = figure.querySelector('code')
      if (!pre || !code) return

      // Make figure relatively positioned for absolute children
      figure.style.position = 'relative'

      // Extract language from data-language attribute (set by rehype-pretty-code)
      const lang = figure.dataset.language || code.dataset.language || ''

      // ── Language label (top-left) ──
      if (lang) {
        const label = document.createElement('span')
        label.className =
          'absolute top-2 left-3 z-10 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider pointer-events-none'
        label.style.backgroundColor = 'var(--color-primary-soft)'
        label.style.color = 'var(--color-muted-soft)'
        label.textContent = lang
        figure.appendChild(label)
      }

      // ── Copy button (top-right) ──
      const btn = document.createElement('button')
      btn.className =
        'absolute top-2 right-2 z-10 p-1.5 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-150'
      btn.style.backgroundColor = 'var(--color-primary-soft)'
      btn.style.color = 'var(--color-muted-soft)'
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = 'var(--color-border-strong)'
        btn.style.color = 'var(--color-ink)'
      })
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'var(--color-primary-soft)'
        btn.style.color = 'var(--color-muted-soft)'
      })
      btn.setAttribute('aria-label', '复制代码')
      btn.title = '复制代码'
      btn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

      btn.addEventListener('click', async () => {
        const text = code.textContent || ''
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          // Fallback for older browsers / non-HTTPS
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand('copy')
          } catch {
            // ignore
          }
          document.body.removeChild(textarea)
        }

        // Show checkmark briefly
        btn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
        btn.style.color = 'var(--color-success)'
        setTimeout(() => {
          btn.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
          btn.style.color = 'var(--color-muted-soft)'
        }, 2000)
      })

      figure.appendChild(btn)

      // Add group class for hover-based button visibility
      figure.classList.add('group')
    })

    processedRef.current = true
  }, [children])

  return <div ref={containerRef}>{children}</div>
}
