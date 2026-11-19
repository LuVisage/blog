'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, type ReactNode } from 'react'

// 客户端导航整块换正文，被点中的链接随之消失，焦点掉在 BODY 上：读屏不播报新页、
// 键盘下一跳 Tab 从页首翻起。pathname 落地后补一次交接，且只在焦点没人接管时动手——
// 常驻页头控件与 /search 挂载即聚焦的输入框都不抢。
export function PageTransition({ children }: { children: ReactNode }) {
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
