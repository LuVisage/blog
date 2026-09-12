'use client'

import { useEffect } from 'react'

const GLOW = 'data-spotlight'
const TILT = 'data-tilt'

/**
 * Cursor-tracked glow (`data-spotlight`) and 3D lean (`data-tilt`, value = max degrees).
 * Mounted once: per-card React state would re-render on every pointermove.
 */
export function PointerFeedback() {
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!finePointer.matches || reducedMotion.matches) return

    let current: HTMLElement | null = null
    let frame = 0
    let next: { el: HTMLElement; x: number; y: number } | null = null

    const draw = () => {
      frame = 0
      if (!next) return
      const { el, x, y } = next
      next = null

      const box = el.getBoundingClientRect()
      if (!box.width || !box.height) return
      const fx = (x - box.left) / box.width
      const fy = (y - box.top) / box.height

      el.style.setProperty('--mx', `${fx * 100}%`)
      el.style.setProperty('--my', `${fy * 100}%`)

      const max = Number(el.getAttribute(TILT)) || 0
      if (max) {
        el.style.setProperty('--tilt-y', `${(fx - 0.5) * 2 * max}deg`)
        el.style.setProperty('--tilt-x', `${(0.5 - fy) * 2 * max}deg`)
      }
    }

    const release = (el: HTMLElement) => {
      el.style.removeProperty('--mx')
      el.style.removeProperty('--my')
      el.style.removeProperty('--tilt-x')
      el.style.removeProperty('--tilt-y')
    }

    const enter = (el: HTMLElement) => {
      if (current === el) return
      if (current) release(current)
      current = el
    }

    const onMove = (e: PointerEvent) => {
      if (!(e.target instanceof Element)) return
      const el = e.target.closest<HTMLElement>(`[${GLOW}]`)
      if (!el) return
      enter(el)
      next = { el, x: e.clientX, y: e.clientY }
      if (!frame) frame = requestAnimationFrame(draw)
    }

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      next = null
      if (current) release(current)
      current = null
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)

    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
      onLeave()
    }
  }, [])

  return null
}
