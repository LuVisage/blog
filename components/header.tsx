'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { PaletteTrigger } from './palette-trigger'
import { useRef, useState, useEffect } from 'react'

/**
 * Top navigation.
 *
 * DESIGN_DNA §8.2：导航固定吸顶、高 4.375rem（70px）、层级只用一条发丝线表达
 * （§7 否定性规律：没有阴影、没有毛玻璃、没有圆角容器）。
 * 激活项由一条 2px 强调色实线指示（§12.1 强调色只出现在高权重位置）。
 */
export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--overlay)',
        borderBottom: `1px solid ${scrolled ? 'var(--line-strong)' : 'var(--line)'}`,
        transition: 'border-color var(--duration-fast) var(--ease)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6" style={{ height: 70 }}>
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
          <nav ref={navRef} className="relative hidden md:flex items-center" aria-label="主导航">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="pressable relative px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
                  style={{
                    color: isActive ? 'var(--ink)' : 'var(--muted)',
                    transitionDuration: 'var(--duration-fast)',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-px left-0 h-[2px] transition-[transform,width,opacity]"
              style={{
                width: indicator?.width ?? 0,
                transform: `translateX(${indicator?.x ?? 0}px)`,
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="pressable md:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
              style={{ color: 'var(--muted)', border: '1px solid var(--line)', borderRadius: 'var(--radius-xs)' }}
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
          className="md:hidden fixed inset-0 top-[70px] z-40"
          role="button"
          tabIndex={0}
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setMobileMenuOpen(false) }}
          style={{ background: 'var(--scrim)' }}
        />
      )}

      {/* Mobile menu — hairline rows, no radius (抽屉菜单) */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden relative z-50 animate-slide-down"
          aria-label="移动端导航"
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
                className="pressable relative block px-4 sm:px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  color: isActive ? 'var(--ink)' : 'var(--muted)',
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
