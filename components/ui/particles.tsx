'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  pulse: number
  pulseSpeed: number
  /** Index into `COLORS`, fixed at init so the dust doesn't flicker. */
  color: number
}

/**
 * 本站只有一处用到它，参数全部写死在这里：数组若以 prop 传入，每次渲染都会换新身份，
 * 效果依赖数组随之改变，canvas 会被重新播种。
 *
 * 灰度尘埃刻意跟随不了主题，也不走 token：它在纸面和墨面上都要保持「几乎看不见」，
 * 唯一调用点是根布局的装饰层。
 */
const QUANTITY = 20
const SIZE_MIN = 1
const SIZE_MAX = 2
const SPEED = 0.35
const REPEL_RADIUS = 50
const COLORS = ['rgba(180,180,195,0.25)', 'rgba(200,200,215,0.15)', 'rgba(160,160,180,0.2)']

/**
 * Particles — a Canvas-based floating particle system.
 * Adapted from React Bits' Particles component.
 * Particles drift naturally and react to mouse proximity.
 */
export function Particles({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const animRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      // Backing store is in device pixels; keep drawing in CSS pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      resize()
      particlesRef.current = Array.from({ length: QUANTITY }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: SIZE_MIN + Math.random() * (SIZE_MAX - SIZE_MIN),
        opacity: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        color: Math.floor(Math.random() * COLORS.length),
      }))
    }

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 16.67, 3) * SPEED
      timeRef.current = timestamp

      ctx.clearRect(0, 0, width, height)

      for (const p of particlesRef.current) {
        // Drift
        p.x += p.vx * dt
        p.y += p.vy * dt

        // Wrap around edges
        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        // Mouse interaction - repel from cursor
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * 2 * dt
          p.x += (dx / dist) * force * 30
          p.y += (dy / dist) * force * 30
        }

        // Pulse opacity
        p.pulse += p.pulseSpeed * dt
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = COLORS[p.color]
        ctx.globalAlpha = currentOpacity
        ctx.fill()
      }

      ctx.globalAlpha = 1

      animRef.current = requestAnimationFrame(animate)
    }

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const handleResize = () => {
      resize()
      // Keep existing dust inside the new viewport rather than re-seeding it.
      for (const p of particlesRef.current) {
        p.x = Math.min(p.x, width)
        p.y = Math.min(p.y, height)
      }
    }

    init()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouse)
    window.addEventListener('touchmove', handleTouch)

    timeRef.current = performance.now()
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none z-[5]', className)}
      aria-hidden="true"
    />
  )
}
