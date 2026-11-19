'use client'

import { useEffect, useRef } from 'react'

const COPY_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const CHECK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

/**
 * CodeBlockEnhancer —— 包住渲染好的 MDX 正文，给每个代码块
 *（rehype-pretty-code 的 figure[data-rehype-pretty-code-figure]）补左上角语言标签
 * 与右上角复制按钮。增强发生在客户端 DOM 上，SSR 产物保持干净。
 */
export function CodeBlockEnhancer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const processedRef = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || processedRef.current) return
    processedRef.current = true

    const figures = container.querySelectorAll<HTMLElement>('figure[data-rehype-pretty-code-figure]')

    figures.forEach((figure) => {
      // 双重防重：effect 可能因 children 引用变化重跑，figure 级标记兜住同一块。
      if (figure.dataset.copyEnhanced === 'true') return
      figure.dataset.copyEnhanced = 'true'

      const pre = figure.querySelector('pre')
      const code = figure.querySelector('code')
      if (!pre || !code) return

      figure.style.position = 'relative'

      const lang = figure.dataset.language || code.dataset.language || ''
      if (lang) {
        const label = document.createElement('span')
        label.className =
          'absolute top-2 left-3 z-10 px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider pointer-events-none'
        label.style.backgroundColor = 'var(--demo-chip)'
        label.style.color = 'var(--demo-muted)'
        label.textContent = lang
        figure.appendChild(label)
      }

      // .code-copy 在 hover:none 的设备上常驻可见：group-hover 的 opacity-0
      // 在触屏上等于永久隐身。淡入交给 .pressable（无层，会赢过 utility，
      // 所以这里不再挂 transition-*）。
      const btn = document.createElement('button')
      btn.className =
        'code-copy pressable absolute top-2 right-2 z-10 p-1.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
      const paint = (bg: string, fg: string) => {
        btn.style.backgroundColor = bg
        btn.style.color = fg
      }
      paint('var(--demo-chip)', 'var(--demo-muted)')
      btn.addEventListener('mouseenter', () => paint('var(--demo-chip-hover)', 'var(--demo-ink)'))
      btn.addEventListener('mouseleave', () => paint('var(--demo-chip)', 'var(--demo-muted)'))
      btn.setAttribute('aria-label', '复制代码')
      btn.title = '复制代码'
      btn.innerHTML = COPY_ICON

      let resetTimer = 0
      btn.addEventListener('click', async () => {
        const text = code.textContent || ''
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          // 旧浏览器 / 非 HTTPS 没有异步剪贴板：退到隐藏 textarea + execCommand。
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          try {
            document.execCommand('copy')
          } catch {
            // 两条路都失败也不抛：状态反馈照常，不白屏。
          }
          document.body.removeChild(textarea)
        }

        // 复制 → 已复制：图标切换 + 强调色 + 缩放进入，两秒后复位；
        // aria-label / title 同步更新，焦点停在钮上的读屏用户能听到状态变化。
        // 连点时先清掉上一枚复位定时器，保证「最后一次复制后两秒复位」。
        window.clearTimeout(resetTimer)
        btn.innerHTML = CHECK_ICON
        paint('var(--color-primary-subtle)', 'var(--accent-text)')
        btn.classList.add('animate-scale-in')
        btn.setAttribute('aria-label', '已复制')
        btn.title = '已复制'
        figure.classList.add('code-flash')
        resetTimer = window.setTimeout(() => {
          btn.innerHTML = COPY_ICON
          paint('var(--demo-chip)', 'var(--demo-muted)')
          btn.classList.remove('animate-scale-in')
          btn.setAttribute('aria-label', '复制代码')
          btn.title = '复制代码'
          figure.classList.remove('code-flash')
        }, 2000)
      })

      figure.appendChild(btn)
      // group 是 group-hover:opacity-100 的悬停源。
      figure.classList.add('group')
    })
  }, [children])

  return <div ref={containerRef}>{children}</div>
}
