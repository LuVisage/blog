'use client'

import { useEffect } from 'react'

/**
 * CustomCursor — 自定义光标（React Bits Custom Cursor 形态，自设计登记 §11.6）。
 * 桌面端：indigo 小圆点跟随；悬停可交互元素（a/button/[data-cursor]）时
 * 圆点放大为 3px 圆环。与 AuraCursor（氛围大光晕）分层共存。
 * pointer:fine + !reduced-motion 才挂载；原生光标保留（不减损可用性）。
 */
export function CustomCursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot = document.createElement('div')
    dot.className = 'custom-cursor-dot'
    const ring = document.createElement('div')
    ring.className = 'custom-cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let raf = 0
    let mx = -100
    let my = -100
    let rx = -100
    let ry = -100
    const SIZE = 14

    const render = () => {
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`
      // 环缓动跟随（0.16 lerp）
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.transform = `translate3d(${rx - SIZE / 2}px, ${ry - SIZE / 2}px, 0)`
      raf = 0
    }

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onOver = (e: Event) => {
      const t = e.target as Element
      if (t && t.closest('a, button, [data-cursor]')) ring.classList.add('is-hover')
    }
    const onOut = (e: Event) => {
      const t = e.target as Element
      if (t && t.closest('a, button, [data-cursor]')) ring.classList.remove('is-hover')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      cancelAnimationFrame(raf)
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}
