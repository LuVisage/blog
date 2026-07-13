'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { SearchTrigger } from './search-trigger'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-3 z-50 w-full px-4">
      <div className="max-w-5xl xl:max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-purple-950/40 border border-pink-100/60 dark:border-purple-500/20 shadow-lg shadow-pink-100/30 dark:shadow-purple-950/40">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
            style={{ fontFamily: "'ZCOOL KuaiLe', cursive" }}
          >
            ✦ {SITE.title}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30'
                      : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-950/20'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <SearchTrigger />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl border border-pink-100 dark:border-purple-500/20 flex items-center justify-center hover:bg-pink-50 dark:hover:bg-purple-950/30 transition-colors"
              aria-label="菜单"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-2 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-purple-950/50 border border-pink-100/60 dark:border-purple-500/20 shadow-lg overflow-hidden">
            <div className="px-2 py-2 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30'
                        : 'text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400'
                    }`}
                  >
                    {link.label}
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
