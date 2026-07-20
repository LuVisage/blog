'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AuroraBackgroundProps {
  className?: string
  children?: React.ReactNode
  /** Color stops for the aurora blobs. Defaults to neutral grays matching the blog theme. */
  colors?: string[]
  /** Animation speed multiplier. 1 = default. */
  speed?: number
  /** Opacity of the aurora effect. 0-1, default 0.4. */
  opacity?: number
}

/**
 * Aurora Background — an animated northern-lights-inspired canvas background.
 * Adapted from Aceternity UI's aurora-background component.
 * Matches the blog's neutral glass morphism aesthetic.
 */
export function AuroraBackground({
  className,
  children,
  colors = [
    'rgba(180, 180, 190, 0.3)',
    'rgba(150, 150, 165, 0.25)',
    'rgba(200, 200, 210, 0.2)',
    'rgba(170, 170, 185, 0.25)',
    'rgba(140, 140, 160, 0.2)',
  ],
  speed = 1,
  opacity = 0.4,
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Generate random blob positions
    const blobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      radius: 150 + Math.random() * 300,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      // Each blob has a different oscillation phase
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      periodX: 8 + Math.random() * 12,
      periodY: 10 + Math.random() * 14,
    }))

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement?.getBoundingClientRect() || canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = (timestamp: number) => {
      const dt = Math.min((timestamp - timeRef.current) / 1000, 0.1) * speed
      timeRef.current = timestamp

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = opacity

      // Draw each blob as a large radial gradient
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i]

        // Smooth oscillation using sin/cos
        const t = timestamp * 0.001
        const ox = Math.sin(t / blob.periodX + blob.phaseX) * 80
        const oy = Math.cos(t / blob.periodY + blob.phaseY) * 60

        // Slow drift
        blob.x += blob.vx * dt * 10
        blob.y += blob.vy * dt * 10

        // Wrap around
        if (blob.x > 120) blob.x = -20
        if (blob.x < -20) blob.x = 120
        if (blob.y > 120) blob.y = -20
        if (blob.y < -20) blob.y = 120

        const cx = (blob.x / 100) * width + ox
        const cy = (blob.y / 100) * height + oy

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, blob.radius)
        gradient.addColorStop(0, colors[i % colors.length])
        gradient.addColorStop(0.4, colors[i % colors.length]?.replace(/[\d.]+\)$/, '0.15)') ?? 'rgba(0,0,0,0)')
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(animate)
    }

    timeRef.current = performance.now()
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [colors, speed, opacity])

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
