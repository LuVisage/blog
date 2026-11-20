'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { NAV_LINKS, SITE, ABOUT } from '@/lib/constants'
import { IconSearch } from '@tabler/icons-react'
import { ThemeToggle } from './theme-toggle'

// 刊头走 A 方向「巨字工程出版」：wordmark + mono 编号索引 + 下划线检索入口。
// 当前态下划线由 .idx a[aria-current]::after 的 scaleX 承担（纯 CSS），
// 不再 JS 测量偏移 —— 少一组 resize/fonts.ready 监听，位移只走 transform。
// 名字驼峰边界的大写字母承担信号红缀字（旧名下划线锚位的继承），暗色翻色走 .wordmark em。
const [WM_A, WM_B] = SITE.title.split(/(?=[A-Z])/)

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

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

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  return (
    <header id="top" className={`apple-nav sticky top-0 z-50 w-full${scrolled ? ' is-scrolled' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6" style={{ height: 'var(--nav-h)' }}>
          <div className="mast-top flex-shrink-0">
            <Link href="/" className="wordmark pressable no-underline" aria-label={SITE.title}>
              {WM_A.toUpperCase()}
              {WM_B && (
                <>
                  <em>{WM_B[0].toUpperCase()}</em>
                  {WM_B.slice(1).toUpperCase()}
                </>
              )}
            </Link>
            <span className="wm-sub hidden xl:inline">
              {ABOUT.title}
              <span className="wm-x"> · 工程实践笔记</span>
            </span>
          </div>

          <nav className="idx hidden lg:flex" aria-label="主导航">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className="pressable no-underline cursor-pointer"
              >
                <i aria-hidden="true">{String(i + 1).padStart(2, '0')}</i>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link
              href="/search"
              className="mast-search pressable no-underline"
              aria-label="搜索"
              title="搜索全站内容"
            >
              <span className="hidden sm:inline">SEARCH</span>
              <IconSearch size={16} strokeWidth={2} className="sm:hidden" aria-hidden="true" />
              <kbd className="hidden md:inline-flex">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </Link>
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="pressable lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer"
              style={{ border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 'var(--radius-xs)' }}
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
          style={{ background: 'var(--canvas)', borderBottom: '2px solid var(--rule)' }}
        >
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className="pressable relative flex items-baseline gap-3 px-4 sm:px-6 py-3.5 text-sm font-medium no-underline transition-colors cursor-pointer"
              style={{
                borderTop: '1px solid var(--line)',
                color: isActive(link.href) ? 'var(--ink)' : 'var(--muted)',
                transitionDuration: 'var(--duration-fast)',
              }}
            >
              {isActive(link.href) && (
                <span
                  className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2"
                  style={{ background: 'var(--color-primary)' }}
                />
              )}
              <span className="font-mono text-xs" style={{ color: isActive(link.href) ? 'var(--accent-text)' : 'var(--faint)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
