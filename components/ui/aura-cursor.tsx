'use client'

import { useEffect } from 'react'

/**
 * AuraCursor — 极淡 indigo 光标光晕（aura.build 方向·组件融合自设计登记 §11.5）。
 * 单一 fixed 元素 + transform-only 跟随（rAF 节流，无 reflow）；
 * 仅 pointer:fine 桌面启用，reduced-motion / 触屏自动关闭；SSR 安全。
 */
export function AuraCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const el = document.createElement('div')
    el.className = 'aura-cursor'
    document.body.appendChild(el)

    const SIZE = 520
    let raf = 0
    let tx = -SIZE
    let ty = -SIZE

    const render = () => {
      el.style.transform = `translate3d(${tx - SIZE / 2}px, ${ty - SIZE / 2}px, 0)`
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      tx = e.clientX
      ty = e.clientY
      el.classList.add('is-on')
      if (!raf) raf = requestAnimationFrame(render)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      el.remove()
    }
  }, [])

  return null
}
