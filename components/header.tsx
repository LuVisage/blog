'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { PaletteTrigger } from './palette-trigger'
import { AppearancePicker } from './appearance-picker'
import { useRef, useState, useEffect } from 'react'

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
    <header className="sticky top-3 z-50 w-full px-4">
      <div className="max-w-5xl xl:max-w-6xl mx-auto">
        <div
          className="flex items-center justify-between h-14 px-4 sm:px-5 rounded-xl overlay transition-colors duration-300"
          style={{
            borderColor: scrolled ? 'var(--line-strong)' : 'var(--line)',
          }}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline"
            aria-label={SITE.title}
          >
            <span
              className="w-2 h-2 flex-shrink-0"
              style={{ background: 'var(--accent)' }}
              aria-hidden="true"
            />
            <span
              className="font-serif font-bold tracking-tight"
              style={{ fontSize: 19, color: 'var(--ink)', letterSpacing: '-0.015em' }}
            >
              {SITE.title}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="relative hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{ color: isActive ? 'var(--ink)' : 'var(--muted)' }}
                >
                  {link.label}
                </Link>
              )
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0.5 left-0 h-[2px] rounded-full transition-[transform,width,opacity] duration-300"
              style={{
                width: indicator?.width ?? 0,
                transform: `translateX(${indicator?.x ?? 0}px)`,
                background: 'var(--accent)',
                opacity: indicator ? 1 : 0,
                transitionTimingFunction: 'var(--ease)',
              }}
            />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <PaletteTrigger />
            <AppearancePicker />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-lg surface flex items-center justify-center cursor-pointer"
              style={{ color: 'var(--muted)' }}
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

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40"
            role="button"
            tabIndex={0}
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') setMobileMenuOpen(false) }}
            style={{ background: 'var(--scrim)' }}
          />
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden relative z-50 mt-2 rounded-xl surface overflow-hidden animate-scale-in py-1.5" role="navigation" aria-label="移动端导航">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative block px-5 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer"
                  style={{ color: isActive ? 'var(--ink)' : 'var(--muted)' }}
                >
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-px"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                  {link.label}
                </Link>
              )
            })}
          </nav>
        )}
      </div>
    </header>
  )
}
