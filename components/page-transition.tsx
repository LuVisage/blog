'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/** Runs `onRouteChange` for every navigation, but not for the first paint. */
function useRouteChange(onRouteChange: () => void) {
  const pathname = usePathname()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    onRouteChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}

/**
 * 换页后把焦点交还给 <main>。
 *
 * 客户端导航会整块换掉正文 DOM，刚被点中的那条链接随之消失，焦点就掉在 BODY 上：
 * 读屏不会播报「到了新页面」，键盘用户下一次 Tab 还得从页首重新翻一遍。这里在
 * pathname 落地后补一次交接，并且只在「焦点确实没人接管」时动手 —— 页头那类跨页
 * 常驻的控件、以及 /search 这类挂载即聚焦输入框的页面都不会被抢；命令面板自己那条
 * 显式交接先跑的话，这里读到的 activeElement 已经是 <main>，自然跳过。
 *
 * 注意不能挂进 useRouteChange：那条 reduced-motion 直接 return，而焦点交接是功能
 * 不是动效。
 */
function useRouteFocusHandoff() {
  const pathname = usePathname()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (document.activeElement !== document.body) return
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname])
}

/**
 * Route-change choreography: the new page rises in while an accent hairline
 * sweeps across the top. The sweep is mounted at body level because `main`
 * opens its own stacking context and would trap it under the header.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null)

  useRouteFocusHandoff()
  useRouteChange(() => {
    content.current?.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 400, easing: EASE }
    )
  })

  return <div ref={content}>{children}</div>
}

export function PageSweep() {
  const sweep = useRef<HTMLDivElement>(null)

  useRouteChange(() => {
    sweep.current?.animate(
      [
        { opacity: 1, transform: 'scaleX(0)' },
        { opacity: 1, transform: 'scaleX(1)', offset: 0.55 },
        { opacity: 0, transform: 'scaleX(1)' },
      ],
      { duration: 500, easing: EASE }
    )
  })

  return <div ref={sweep} className="page-sweep" aria-hidden="true" style={{ opacity: 0 }} />
}
