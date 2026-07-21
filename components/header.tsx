'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'
import { SearchTrigger } from './search-trigger'
import { useState } from 'react'
import { IconSparkles, IconPencil } from '@tabler/icons-react'

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-3 z-50 w-full px-4">
      <div className="max-w-5xl xl:max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-14 px-4 sm:px-6 rounded-2xl glass">
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
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 rounded-xl text-sm font-medium transition-colors duration-150"
                  style={{
                    color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                    backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <SearchTrigger />
            <a
              href="https://github.com/LuVisage/blog/new/main/content/posts/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-medium transition-colors duration-150 glass"
              title="在 GitHub 上创建新文章"
            >
              <IconPencil size={13} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
              <span className="hidden lg:inline">发布文章</span>
            </a>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-xl glass flex items-center justify-center"
              aria-label="菜单"
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

        {mobileMenuOpen && (
          <nav className="md:hidden mt-2 rounded-2xl glass overflow-hidden">
            <div className="px-2 py-2 space-y-0.5">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                      backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : 'transparent',
                    }}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <a
                href="https://github.com/LuVisage/blog/new/main/content/posts/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'var(--color-muted)' }}
              >
                <IconPencil size={16} style={{ color: 'var(--color-primary)' }} strokeWidth={2} />
                发布文章
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
