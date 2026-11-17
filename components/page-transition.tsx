'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

/**
 * 换页焦点交接（功能，不是动效）。
 *
 * 客户端导航会整块换掉正文 DOM，刚被点中的那条链接随之消失，焦点就掉在 BODY 上：
 * 读屏不会播报「到了新页面」，键盘用户下一次 Tab 还得从页首重新翻一遍。这里在
 * pathname 落地后补一次交接，并且只在「焦点确实没人接管」时动手 —— 页头那类跨页
 * 常驻的控件、以及 /search 这类挂载即聚焦输入框的页面都不会被抢。
 *
 * ZK 起换页不再有任何编排动画（微升 / 扫光线都已下线）：简洁风下换页就是换页，
 * 这个组件只剩焦点交接这一件功能。
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
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

  return <div>{children}</div>
}