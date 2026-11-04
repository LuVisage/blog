'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback, useRef } from 'react'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const toggleTheme = useCallback(() => {
    const isDark = theme === 'dark'
    const newTheme = isDark ? 'light' : 'dark'
    // reduced-motion 下两条路径都要跳过：圆形揭示动画靠 animationend 收尾，
    // View Transition 的形态变化同样不受媒体查询约束（浏览器不会自动关掉它）。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTheme(newTheme); return }
    if (document.startViewTransition) { document.startViewTransition(() => setTheme(newTheme)); return }
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
  }, [theme, setTheme])

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

  const isDark = theme === 'dark'
  return (
    <button ref={btnRef} onClick={toggleTheme} data-js-only className="pressable w-10 h-10 sm:w-11 sm:h-11 surface surface-hover flex items-center justify-center cursor-pointer" style={{ borderRadius: 'var(--radius-xs)' }} aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
      {isDark ? <IconSun size={16} strokeWidth={1.75} style={{ color: 'var(--accent-text)' }} /> : <IconMoon size={16} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />}
    </button>
  )
}
