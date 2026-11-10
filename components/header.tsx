'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { PaletteTrigger } from './palette-trigger'
import { useRef, useState, useEffect } from 'react'

/**
 * Top navigation — 第 6 轮 Apple 产品叙事。
 * 玻璃吸顶（强度走 --glass-blur 令牌）、高 --nav-h（52px）、滚动后浮现细线；
 * 激活项仍由一条 2px 强调色实线指示。
 */
export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Esc 关抽屉：处理器挂在 window 上，而不是遮罩的 onKeyDown —— 打开后焦点仍停在
  // 汉堡按钮上，遮罩收不到那个键（chapter-bar 用的是同一种写法）。
  // 关掉后把焦点交还汉堡：抽屉里的链接整片卸载，焦点不接就掉回 <body>，
  // 键盘用户下一个 Tab 从头开始翻。
  useEffect(() => {
    if (!mobileMenuOpen) return
    const trigger = menuButtonRef.current
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      trigger?.focus()
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    let alive = true

    const measure = () => {
      if (!alive || !navRef.current) return
      const active = navRef.current.querySelector<HTMLElement>('[aria-current="page"]')
      // Below the md breakpoint the desktop nav is display:none and reports zero width.
      if (!active || !active.offsetWidth) {
        setIndicator(null)
        return
      }
      setIndicator({ x: active.offsetLeft, width: active.offsetWidth })
    }

    measure()
    const raf = requestAnimationFrame(measure)
    // Label widths shift once the webfonts swap in, so measure again after they land.
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  return (
    <header className={`apple-nav sticky top-0 z-50 w-full${scrolled ? ' is-scrolled' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6" style={{ height: 'var(--nav-h)' }}>
          {/* Wordmark */}
          <Link
            href="/"
            className="pressable flex items-center gap-2.5 no-underline flex-shrink-0"
            aria-label={SITE.title}
          >
            <span className="accent-dot" aria-hidden="true" />
            <span className="font-serif font-bold" style={{ fontSize: 'var(--text-h3)', color: 'var(--ink)', letterSpacing: 'var(--tracking-heading)' }}>
              {SITE.title}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="relative hidden lg:flex items-center" aria-label="主导航">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="nav-row pressable relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer"
                  style={{
                    transitionDuration: 'var(--duration-fast)',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-px origin-left transition-[transform,opacity]"
              style={{
                // 1px 基准 + scaleX：位移只走 transform（§1.8 契约不允许 animate width）。
                // 这根 2px 的方头短杠没有圆角，缩放与改宽在像素上等价。
                transform: `translateX(${indicator?.x ?? 0}px) scaleX(${indicator?.width ?? 0})`,
                background: 'var(--color-primary)',
                opacity: indicator ? 1 : 0,
                transitionDuration: 'var(--duration-base)',
                transitionTimingFunction: 'var(--ease)',
              }}
            />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <PaletteTrigger />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="pressable surface surface-hover tint-muted lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
              style={{ borderRadius: 'var(--radius-xs)' }}
              aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={mobileMenuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                ) : (
                  <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ top: 'var(--nav-h)', background: 'var(--scrim)' }}
          role="button"
          tabIndex={0}
          aria-label="关闭导航菜单"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMobileMenuOpen(false) } }}
        />
      )}

      {/* Mobile menu — hairline rows, no radius (抽屉菜单) */}
      {mobileMenuOpen && (
        <nav
          className="lg:hidden relative z-50 animate-slide-down"
          aria-label="移动端导航"
          onKeyDown={(e) => {
            // 遮罩是全屏的：Tab 走过最后一行会走进遮罩背后，焦点落在肉眼看不见的正文上。
            // 抽屉里只有这一组链接，首尾相接；出去的路是 Esc（交还焦点）和点遮罩。
            if (e.key !== 'Tab') return
            const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('a[href]'))
            const i = links.indexOf(document.activeElement as HTMLAnchorElement)
            if (i === -1 || !links.length) return
            e.preventDefault()
            links[(i + (e.shiftKey ? -1 : 1) + links.length) % links.length].focus()
          }}
          style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--line-strong)' }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className="nav-row pressable relative block px-4 sm:px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  borderTop: '1px solid var(--line)',
                  transitionDuration: 'var(--duration-fast)',
                }}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2"
                    style={{ background: 'var(--color-primary)' }}
                  />
                )}
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
