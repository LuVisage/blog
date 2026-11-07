'use client'

import { useEffect } from 'react'

/**
 * CustomCursor — 自定义光标（React Bits Custom Cursor 形态，自设计登记 §11.6）。
 * 桌面端：indigo 小圆点跟随；悬停可交互元素（a/button/[data-cursor]）时
 * 外圈圆环从 14px 缓动放大到 36px 并换色。与 AuraCursor（氛围大光晕）分层共存。
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
    const HOVER_SIZE = 36
    let scale = 1
    let targetScale = 1

    const render = () => {
      dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`
      // 环缓动跟随（0.16 lerp）
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      scale += (targetScale - scale) * 0.16
      const settled =
        Math.abs(mx - rx) < 0.25 && Math.abs(my - ry) < 0.25 && Math.abs(targetScale - scale) < 0.004
      if (settled) {
        rx = mx
        ry = my
        scale = targetScale
      }
      // 缩放发生在 translate 之后：transform-origin 是环自己的中心，
      // 所以放大不会把环推离跟随点（旧的 width/height 写法会，中心每帧往右下漂）。
      ring.style.transform = `translate3d(${rx - SIZE / 2}px, ${ry - SIZE / 2}px, 0) scale(${scale})`
      raf = settled ? 0 : requestAnimationFrame(render)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
      kick()
    }

    const setHover = (hover: boolean) => {
      ring.classList.toggle('is-hover', hover)
      targetScale = hover ? HOVER_SIZE / SIZE : 1
      kick()
    }

    const onOver = (e: Event) => {
      const t = e.target as Element
      if (t && t.closest('a, button, [data-cursor]')) setHover(true)
    }
    const onOut = (e: Event) => {
      const t = e.target as Element
      if (t && t.closest('a, button, [data-cursor]')) setHover(false)
    }

    // 两个元素是 fixed left/top 0，transform 只在 pointermove 里写；
    // 不先归位，首屏会在左上角留下一个孤立的 indigo 点 + 环。
    render()

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
