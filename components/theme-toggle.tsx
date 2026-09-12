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

  if (!mounted) return <button className="w-10 h-10 sm:w-11 sm:h-11 surface flex items-center justify-center" style={{ borderRadius: 10 }} aria-label="切换主题" />

  const isDark = theme === 'dark'
  return (
    <button ref={btnRef} onClick={toggleTheme} className="w-10 h-10 sm:w-11 sm:h-11 surface surface-hover flex items-center justify-center cursor-pointer" style={{ borderRadius: 10 }} aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}>
      {isDark ? <IconSun size={16} strokeWidth={1.75} style={{ color: 'var(--accent-text)' }} /> : <IconMoon size={16} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />}
    </button>
  )
}
