'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useCallback, useRef } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  const toggleTheme = useCallback(() => {
    const isDark = theme === 'dark'
    const newTheme = isDark ? 'light' : 'dark'

    // Strategy 1: View Transitions API (Chrome 111+, Edge 111+, Safari 18.2+)
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme)
      })
      return
    }

    // Strategy 2: Fallback radial overlay for Firefox and older browsers
    const overlay = document.createElement('div')
    overlay.className = 'theme-transition-overlay'
    overlay.setAttribute('data-theme', newTheme)

    // Calculate toggle button center position for the radial reveal origin
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      overlay.style.setProperty('--toggle-x', `${cx}px`)
      overlay.style.setProperty('--toggle-y', `${cy}px`)
    }

    document.body.appendChild(overlay)

    // Trigger the overlay animation
    requestAnimationFrame(() => {
      overlay.classList.add('active')
    })

    // Switch theme at the midpoint of the animation, then reverse
    overlay.addEventListener('animationend', (e) => {
      if (e.animationName === 'themeOverlayIn') {
        setTheme(newTheme)
        overlay.classList.add('reverse')
      }
      if (e.animationName === 'themeOverlayOut') {
        overlay.remove()
      }
    })
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 flex items-center justify-center"
        aria-label="切换主题"
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      ref={btnRef}
      onClick={toggleTheme}
      className="w-9 h-9 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 hover:bg-white/25 dark:hover:bg-black/30 flex items-center justify-center transition-all duration-200"
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
