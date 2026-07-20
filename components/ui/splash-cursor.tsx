'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * SplashCursor — ReactBits-inspired liquid blob cursor trail.
 * Canvas-based metaball simulation: blobs follow the cursor and merge,
 * creating organic liquid trails. Massively more impressive than a dot cursor.
 */

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

export function SplashCursor({
  colors = ['rgba(180,180,210,0.5)', 'rgba(200,200,230,0.4)', 'rgba(160,160,190,0.45)'],
  blobCount = 8,
  maxRadius = 45,
  minRadius = 18,
}: {
  colors?: string[]
  blobCount?: number
  maxRadius?: number
  minRadius?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const mouseRef = useRef({ x: -500, y: -500 })
  const animRef = useRef(0)
  const trailRef = useRef<{ x: number; y: number }[]>([])

  const initBlobs = useCallback(() => {
    const blobs: Blob[] = []
    for (let i = 0; i < blobCount; i++) {
      blobs.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: minRadius + Math.random() * (maxRadius - minRadius),
        alpha: 0.3 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    blobsRef.current = blobs
  }, [blobCount, maxRadius, minRadius, colors])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    initBlobs()

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      // Add to trail
      trailRef.current.push({ x: e.clientX, y: e.clientY })
      if (trailRef.current.length > 30) trailRef.current.shift()
    }
    window.addEventListener('mousemove', handleMove, { passive: true })

    // Touch support
    const handleTouch = (e: TouchEvent) => {
      const t = e.touches[0]
      if (t) {
        mouseRef.current = { x: t.clientX, y: t.clientY }
        trailRef.current.push({ x: t.clientX, y: t.clientY })
        if (trailRef.current.length > 30) trailRef.current.shift()
      }
    }
    window.addEventListener('touchmove', handleTouch, { passive: true })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

      const { x: mx, y: my } = mouseRef.current
      const blobs = blobsRef.current

      // Draw trail as fading blobs
      const trail = trailRef.current
      for (let i = 0; i < trail.length; i++) {
        const t = trail[i]
        const age = (trail.length - i) / trail.length
        const r = 8 + age * 20
        const gradient = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r)
        gradient.addColorStop(0, colors[0].replace('0.5', String(0.15 * age)))
        gradient.addColorStop(0.5, colors[1].replace('0.4', String(0.08 * age)))
        gradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(t.x, t.y, r, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Update & draw blobs
      for (const blob of blobs) {
        // Attract toward mouse
        const dx = mx - blob.x
        const dy = my - blob.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = Math.min(0.08, 1 / (dist * 0.02 + 1) * 0.08)

        blob.vx += dx * force + (Math.random() - 0.5) * 0.3
        blob.vy += dy * force + (Math.random() - 0.5) * 0.3

        // Damping
        blob.vx *= 0.94
        blob.vy *= 0.94

        blob.x += blob.vx
        blob.y += blob.vy

        // Wrap around edges
        if (blob.x < -50) blob.x = window.innerWidth + 50
        if (blob.x > window.innerWidth + 50) blob.x = -50
        if (blob.y < -50) blob.y = window.innerHeight + 50
        if (blob.y > window.innerHeight + 50) blob.y = -50

        // Draw blob with glow
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(0.4, blob.color.replace(/[\d.]+\)$/, `${blob.alpha * 0.8})`))
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Metaball effect: draw connecting goo between nearby blobs
      ctx.globalCompositeOperation = 'lighter'
      for (let i = 0; i < blobs.length; i++) {
        for (let j = i + 1; j < blobs.length; j++) {
          const dx = blobs[i].x - blobs[j].x
          const dy = blobs[i].y - blobs[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const threshold = (blobs[i].radius + blobs[j].radius) * 1.2

          if (dist < threshold) {
            const mx = (blobs[i].x + blobs[j].x) / 2
            const my = (blobs[i].y + blobs[j].y) / 2
            const r = Math.min(blobs[i].radius, blobs[j].radius) * 0.6
            const grad = ctx.createRadialGradient(mx, my, 0, mx, my, r)
            grad.addColorStop(0, colors[0].replace('0.5', '0.3'))
            grad.addColorStop(1, 'transparent')
            ctx.beginPath()
            ctx.arc(mx, my, r, 0, Math.PI * 2)
            ctx.fillStyle = grad
            ctx.fill()
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over'

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleTouch)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [initBlobs, colors])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'plus-lighter' }}
      aria-hidden="true"
    />
  )
}
