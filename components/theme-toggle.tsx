'use client'

import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ThemeToggle() {
  // resolvedTheme 才是此刻真正画出来的那一套；theme 可能仍是 system，用它判断会把系统暗色误读成亮色。
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const toggle = useCallback(() => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark'
    // 圆形揭示靠 animationend 收尾，媒体查询不会自动关掉它，reduce 下直接换。
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next)
      return
    }
    // 不走 View Transition：它要在点击呈现窗里给整页拍快照，重页上实测越线；
    // 圆形揭示把唯一一次重样式藏在不透明遮罩之后——慢的那段读者看不见。
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    overlay.setAttribute('data-theme', next)
    const rect = btnRef.current?.getBoundingClientRect()
    if (rect) {
      overlay.style.setProperty('--toggle-x', `${rect.left + rect.width / 2}px`)
      overlay.style.setProperty('--toggle-y', `${rect.top + rect.height / 2}px`)
    }
    document.body.appendChild(overlay)
    requestAnimationFrame(() => overlay.classList.add('active'))
    overlay.addEventListener('animationend', (e) => {
      if (e.animationName === 'themeOverlayIn') {
        setTheme(next)
        overlay.classList.add('reverse')
      }
      if (e.animationName === 'themeOverlayOut') overlay.remove()
    })
  }, [resolvedTheme, setTheme])

  // 水合前留同尺寸空壳：按下去没反应的按钮比空白更骗人；data-js-only 在无 JS 时整块摘除。
  if (!mounted) {
    return (
      <span
        data-js-only
        aria-hidden="true"
        className="w-10 h-10 sm:w-11 sm:h-11 surface"
        style={{ borderRadius: 'var(--radius-xs)', display: 'inline-block' }}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  return (
    <button
      ref={btnRef}
      onClick={toggle}
      data-js-only
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      className="pressable w-10 h-10 sm:w-11 sm:h-11 surface surface-hover flex items-center justify-center cursor-pointer"
      style={{ borderRadius: 'var(--radius-xs)' }}
    >
      {isDark ? (
        <IconSun size={16} strokeWidth={1.75} style={{ color: 'var(--accent-text)' }} />
      ) : (
        <IconMoon size={16} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
      )}
    </button>
  )
}
