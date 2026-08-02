'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { SearchTrigger } from './search-trigger'
import { useState, useEffect } from 'react'
import { IconSparkles } from '@tabler/icons-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-3 z-50 w-full px-4">
      <div className="max-w-5xl xl:max-w-6xl mx-auto">
        <div
          className="flex items-center justify-between h-14 px-4 sm:px-6 rounded-2xl glass transition-all duration-300"
          style={{
            boxShadow: scrolled
              ? '0 4px 16px rgba(0,0,0,0.06)'
              : undefined,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-lg font-bold no-underline"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            <IconSparkles size={20} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
            <span className="gradient-text">{SITE.title}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                    background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full"
                      style={{ background: 'var(--color-primary)' }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <SearchTrigger />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl glass flex items-center justify-center cursor-pointer"
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
            className="md:hidden fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden relative z-50 mt-2 rounded-2xl glass overflow-hidden animate-scale-in" role="navigation" aria-label="移动端导航">
            <div className="px-2 py-2 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                      background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full ml-2 align-middle"
                        style={{ background: 'var(--color-primary)' }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
