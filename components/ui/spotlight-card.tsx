'use client'

import { useRef, type ReactNode } from 'react'

/**
 * SpotlightCard — 聚光卡片（React Bits / Aceternity Spotlight 形态，自设计登记 §11.6）。
 * 鼠标在卡片内移动时，光标处浮现极淡 indigo 径向光斑（CSS 变量 --mx/--my 驱动，
 * rAF 节流，仅 transform/背景位移动画）。reduced-motion 下光斑静止在中心不跟手。
 */
export function SpotlightCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}
    >
      {children}
    </div>
  )
}
