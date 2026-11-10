'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback, useRef } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeToggle() {
  // theme 是「用户选择」（可能是 system），resolvedTheme 才是此刻真正画出来的
  // 那一套。用 theme 判断会把系统暗色误读成亮色：按钮写着「切换到暗色」，
  // 按下去却还是暗色。
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const toggleTheme = useCallback(() => {
    const isDark = resolvedTheme === 'dark'
    const newTheme = isDark ? 'light' : 'dark'
    // reduced-motion 下直接换：圆形揭示靠 animationend 收尾，媒体查询不会自动关掉它。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTheme(newTheme); return }
    // 不走 View Transition：它要在点击的呈现窗里给整页拍两张快照。day-10 有 9036 个
    // 节点（7529 个 KaTeX），实测点击呈现段 285ms（快照绘制 ~170 + 重样式 ~175，
    // theme-who.mjs）。圆形揭示相反：按下立刻起动画，唯一一次重样式发生在遮罩
    // 铺满之后，被不透明遮罩盖住 —— 慢的那一段读者看不见，看见的那一段不慢。
    // （content-visibility 能把重样式降到 38ms，但深链锚点会落偏 2003px，已否决。）
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    overlay.setAttribute('data-theme', newTheme)
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      overlay.style.setProperty('--toggle-x', `${rect.left + rect.width / 2}px`)
      overlay.style.setProperty('--toggle-y', `${rect.top + rect.height / 2}px`)
    }
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('active'))
    overlay.addEventListener('animationend', (e) => {
      if (e.animationName === 'themeOverlayIn') { setTheme(newTheme); overlay.classList.add('reverse') }
      if (e.animationName === 'themeOverlayOut') overlay.remove()
    })
  }, [resolvedTheme, setTheme])

  // 占位那一帧也做成非交互的空壳：水合前它按下去不会有任何事，关 JS 则永远不会有 ——
  // 与其留一枚会骗人的按钮（§11.20 四），不如留同尺寸的空白，[data-js-only] 在无 JS 时整块摘除。
  if (!mounted)
    return (
      <span
        data-js-only
        className="w-10 h-10 sm:w-11 sm:h-11 surface"
        style={{ borderRadius: 'var(--radius-xs)', display: 'inline-block' }}
        aria-hidden="true"
      />
    )

  const isDark = resolvedTheme === 'dark'
  return (
    <button ref={btnRef} onClick={toggleTheme} data-js-only className="pressable w-10 h-10 sm:w-11 sm:h-11 surface surface-hover flex items-center justify-center cursor-pointer" style={{ borderRadius: 'var(--radius-xs)' }} aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
      {isDark ? <IconSun size={16} strokeWidth={1.75} style={{ color: 'var(--accent-text)' }} /> : <IconMoon size={16} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />}
    </button>
  )
}
