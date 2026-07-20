'use client'

import { useEffect, useRef, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

interface ClickSparkProps {
  children: ReactNode
  className?: string
  /** Spark color. Default white. */
  sparkColor?: string
  /** Number of sparks per click. Default 8. */
  sparkCount?: number
  /** Spark spread radius. Default 20. */
  sparkRadius?: number
  /** Spark lifetime in ms. Default 600. */
  duration?: number
}

/**
 * ClickSpark — burst of spark particles on click.
 * Adapted from React Bits' ClickSpark component.
 * Wraps children and adds click-triggered particle bursts.
 */
export function ClickSpark({
  children,
  className,
  sparkColor = 'rgba(180, 180, 200, 0.8)',
  sparkCount = 8,
  sparkRadius = 20,
  duration = 600,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const animRef = useRef(0)

  const spawnSparks = useCallback(
    (x: number, y: number) => {
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5
        const speed = sparkRadius * (0.3 + Math.random() * 0.7)
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: duration,
          maxLife: duration,
          size: 2 + Math.random() * 2,
        })
      }
    },
    [sparkCount, sparkRadius, duration]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(container)

    let lastTime = performance.now()

    const animate = (now: number) => {
      const dt = now - lastTime
      lastTime = now
      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      ctx.clearRect(0, 0, width, height)

      sparksRef.current = sparksRef.current.filter((s) => {
        s.life -= dt
        if (s.life <= 0) return false

        s.x += (s.vx * dt) / 1000
        s.y += (s.vy * dt) / 1000
        s.vy += 50 * (dt / 1000) // gravity

        const progress = 1 - s.life / s.maxLife
        const alpha = 1 - progress
        const size = s.size * (1 - progress * 0.5)

        ctx.beginPath()
        ctx.arc(s.x, s.y, size, 0, Math.PI * 2)
        ctx.fillStyle = sparkColor.replace(/[\d.]+\)$/, `${alpha})`)
        ctx.fill()

        return true
      })

      animRef.current = requestAnimationFrame(animate)
    }

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      spawnSparks(e.clientX - rect.left, e.clientY - rect.top)
    }

    container.addEventListener('click', handleClick)
    lastTime = performance.now()
    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      observer.disconnect()
      container.removeEventListener('click', handleClick)
    }
  }, [sparkColor, spawnSparks])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
