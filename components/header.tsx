'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { IconSearch } from '@tabler/icons-react'
import { NAV_LINKS, SITE } from '@/lib/constants'
import { ThemeToggle } from './theme-toggle'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null)

  useEffect(() => setIsMac(/Mac|iPhone|iPad|iPod/.test(navigator.platform)), [])

  // 键帽承诺必须有 handler 接班：⌘K / Ctrl+K 全站跳搜索；已在搜索页只接回焦点。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k') return
      e.preventDefault()
      // trailingSlash:true 下 usePathname 带尾斜杠（/search/），等值比较会漏。
      if (pathname.startsWith('/search')) {
        document.querySelector<HTMLInputElement>('input[aria-label="搜索全站内容"]')?.focus()
      } else {
        router.push('/search')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pathname, router])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Esc 挂 window：打开后焦点仍停在汉堡上，遮罩收不到那个键。
  // 关闭后焦点交还汉堡：抽屉链接整片卸载，不接就掉回 body。
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
      // md 断点以下桌面导航 display:none，量出来是零宽。
      if (!active || !active.offsetWidth) {
        setIndicator(null)
        return
      }
      setIndicator({ x: active.offsetLeft, width: active.offsetWidth })
    }

    measure()
    const raf = requestAnimationFrame(measure)
    // webfont 换入后标签宽度会变，落地后再量一次。
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header className={`apple-nav sticky top-0 z-50 w-full${scrolled ? ' is-scrolled' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6" style={{ height: 'var(--nav-h)' }}>
          <Link
            href="/"
            className="pressable flex items-center gap-2.5 no-underline flex-shrink-0"
            aria-label={SITE.title}
          >
            <span className="accent-dot" aria-hidden="true" />
            <span
              className="font-serif font-bold"
              style={{ fontSize: 'var(--text-h3)', color: 'var(--ink)', letterSpacing: 'var(--tracking-heading)' }}
            >
              {SITE.title}
            </span>
          </Link>

          <nav ref={navRef} className="relative hidden lg:flex items-center" aria-label="主导航">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="nav-row pressable relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer"
                style={{ transitionDuration: 'var(--duration-fast)' }}
              >
                {link.label}
              </Link>
            ))}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-px origin-left transition-[transform,opacity]"
              style={{
                // 1px 基准 + scaleX：位移只走 transform；方头短杠无圆角，缩放与改宽像素等价。
                transform: `translateX(${indicator?.x ?? 0}px) scaleX(${indicator?.width ?? 0})`,
                background: 'var(--color-primary)',
                opacity: indicator ? 1 : 0,
                transitionDuration: 'var(--duration-base)',
                transitionTimingFunction: 'var(--ease)',
              }}
            />
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              className="pressable surface surface-hover flex items-center gap-2 h-10 px-3 no-underline"
              style={{ borderRadius: 'var(--radius-xs)', color: 'var(--muted)' }}
              aria-label="搜索"
              title="搜索"
            >
              <IconSearch size={15} strokeWidth={1.75} />
              <span className="text-sm hidden sm:inline">搜索</span>
              <kbd
                className="hidden md:inline-flex items-center px-1.5 py-0.5 text-xs font-mono"
                style={{ border: '1px solid var(--line)', color: 'var(--muted)', borderRadius: 'var(--radius-xs)' }}
              >
                {isMac ? '⌘K' : 'Ctrl K'}
              </kbd>
            </Link>
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
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ top: 'var(--nav-h)', background: 'var(--scrim)' }}
          role="button"
          tabIndex={0}
          aria-label="关闭导航菜单"
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setMobileMenuOpen(false)
            }
          }}
        />
      )}

      {mobileMenuOpen && (
        <nav
          className="lg:hidden relative z-50 animate-slide-down"
          aria-label="移动端导航"
          onKeyDown={(e) => {
            // 遮罩全屏：Tab 走出最后一行会落到遮罩背后看不见的正文上。
            // 抽屉链接首尾相接成环，出去的路是 Esc 与点遮罩。
            if (e.key !== 'Tab') return
            const links = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>('a[href]'))
            const i = links.indexOf(document.activeElement as HTMLAnchorElement)
            if (i === -1 || !links.length) return
            e.preventDefault()
            links[(i + (e.shiftKey ? -1 : 1) + links.length) % links.length].focus()
          }}
          style={{ background: 'var(--canvas)', borderBottom: '1px solid var(--line-strong)' }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="nav-row pressable relative block px-4 sm:px-6 py-3.5 text-sm font-medium transition-colors cursor-pointer"
              style={{ borderTop: '1px solid var(--line)', transitionDuration: 'var(--duration-fast)' }}
            >
              {isActive(link.href) && (
                <span
                  className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2"
                  style={{ background: 'var(--color-primary)' }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
