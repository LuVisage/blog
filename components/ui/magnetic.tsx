'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Magnetic — 磁吸按钮（React Bits Magnetic 形态，组件融合自设计登记 §11.6）。
 * 鼠标靠近时按钮向光标轻微吸附（位移上限 6px），离开回弹；
 * rAF 节流 transform-only；reduced-motion 关闭。
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current
    if (!el) return

    let raf = 0
    let tx = 0
    let ty = 0

    const render = () => {
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      tx = dx * strength
      ty = dy * strength
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onLeave = () => {
      tx = 0
      ty = 0
      if (!raf) raf = requestAnimationFrame(render)
    }

    el.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave, { passive: true })
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <div ref={ref} className={className} style={{ transition: 'transform var(--duration-fast) var(--ease-out)' }}>
      {children}
    </div>
  )
}
