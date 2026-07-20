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
}

interface ParticlesProps {
  className?: string
  /** Number of particles. Default 80. */
  quantity?: number
  /** Particle colors. Default neutral grays. */
  colors?: string[]
  /** Particle size range [min, max]. Default [1.5, 4]. */
  sizeRange?: [number, number]
  /** Speed multiplier. Default 1. */
  speed?: number
  /** Whether particles react to mouse. Default true. */
  interactive?: boolean
  /** Interaction radius (px). Default 120. */
  interactiveRadius?: number
}

/**
 * Particles — a Canvas-based floating particle system.
 * Adapted from React Bits' Particles component.
 * Particles drift naturally and react to mouse proximity.
 */
export function Particles({
  className,
  quantity = 80,
  colors = ['rgba(180,180,190,0.5)', 'rgba(200,200,210,0.4)', 'rgba(160,160,175,0.45)'],
  sizeRange = [1.5, 4],
  speed = 1,
  interactive = true,
  interactiveRadius = 120,
}: ParticlesProps) {
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
    }

    const init = () => {
      resize()
      particlesRef.current = Array.from({ length: quantity }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        opacity: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      }))
    }

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 16.67, 3) * speed
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
        if (interactive) {
          const dx = p.x - mouseRef.current.x
          const dy = p.y - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < interactiveRadius && dist > 0) {
            const force = (1 - dist / interactiveRadius) * 2 * dt
            p.x += (dx / dist) * force * 30
            p.y += (dy / dist) * force * 30
          }
        }

        // Pulse opacity
        p.pulse += p.pulseSpeed * dt
        const currentOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
        ctx.globalAlpha = currentOpacity
        ctx.fill()
      }

      // Draw connections between nearby particles
      ctx.globalAlpha = 0.06
      ctx.strokeStyle = '#999999'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const a = particlesRef.current[i]
          const b = particlesRef.current[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
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

    init()
    window.addEventListener('resize', () => {
      resize()
      // Re-init particle positions
      for (const p of particlesRef.current) {
        p.x = Math.min(p.x, width)
        p.y = Math.min(p.y, height)
      }
    })
    if (interactive) {
      window.addEventListener('mousemove', handleMouse)
      window.addEventListener('touchmove', handleTouch)
    }

    timeRef.current = performance.now()
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
      window.removeEventListener('touchmove', handleTouch)
    }
  }, [quantity, colors, sizeRange, speed, interactive, interactiveRadius])

  return (
    <canvas
      ref={canvasRef}
      className={cn('fixed inset-0 pointer-events-none z-0', className)}
      aria-hidden="true"
    />
  )
}
