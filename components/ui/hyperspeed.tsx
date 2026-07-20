'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Hyperspeed — ReactBits-inspired warp-speed star field.
 * Creates a hyperspace tunnel effect with particles streaming from center.
 * Dramatic background for hero sections.
 */

interface Star {
  x: number
  y: number
  z: number
  speed: number
  size: number
  opacity: number
}

export function Hyperspeed({
  className,
  starCount = 200,
  speed = 1,
  centerX = 0.5,
  centerY = 0.5,
  colors = ['rgba(200,200,230,0.8)', 'rgba(180,180,210,0.6)', 'rgba(220,220,245,0.7)', 'rgba(255,255,255,0.9)'],
}: {
  className?: string
  starCount?: number
  speed?: number
  centerX?: number
  centerY?: number
  colors?: string[]
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    let w = window.innerWidth
    let h = window.innerHeight

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize stars at random positions in 3D space (z = depth)
    const initStars = () => {
      const stars: Star[] = []
      const cx = w * centerX
      const cy = h * centerY

      for (let i = 0; i < starCount; i++) {
        // Distribute in a cone from center
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * Math.max(w, h) * 1.5
        stars.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          z: Math.random() * 600 + 10, // depth
          speed: 1 + Math.random() * 4,
          size: 0.5 + Math.random() * 2.5,
          opacity: 0.3 + Math.random() * 0.7,
        })
      }
      starsRef.current = stars
    }
    initStars()

    const animate = () => {
      ctx.clearRect(0, 0, w, h)

      const cx = w * centerX
      const cy = h * centerY
      const stars = starsRef.current

      for (const star of stars) {
        // Move star toward viewer (decrease z = move toward center)
        star.z -= star.speed * speed * 0.8

        // Reset star when it passes through center
        if (star.z <= 1) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * Math.max(w, h) * 1.2
          star.x = cx + Math.cos(angle) * radius
          star.y = cy + Math.sin(angle) * radius
          star.z = 600 + Math.random() * 200
          star.speed = 1 + Math.random() * 4
          star.size = 0.5 + Math.random() * 2.5
          star.opacity = 0.3 + Math.random() * 0.7
        }

        // Project 3D → 2D (perspective projection)
        const scale = 300 / star.z
        const screenX = cx + (star.x - cx) * scale
        const screenY = cy + (star.y - cy) * scale

        // Size scales with proximity (closer = bigger)
        const displaySize = star.size * scale * 2

        // Opacity increases as star gets closer
        const depthFactor = Math.min(1, (600 - star.z) / 300)
        const alpha = star.opacity * (0.2 + depthFactor * 0.8)

        // Skip if off screen
        if (screenX < -50 || screenX > w + 50 || screenY < -50 || screenY > h + 50) continue

        // Draw star with glow
        const colorIndex = Math.floor(star.speed / 2) % colors.length
        const color = colors[colorIndex]

        // Glow
        const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, displaySize * 3)
        gradient.addColorStop(0, color.replace(/[\d.]+\)$/, `${alpha})`))
        gradient.addColorStop(0.3, color.replace(/[\d.]+\)$/, `${alpha * 0.4})`))
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(screenX, screenY, displaySize * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(screenX, screenY, displaySize, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(/[\d.]+\)$/, `${Math.min(1, alpha * 1.5)})`)
        ctx.fill()

        // Motion trail line
        const trailLength = star.speed * speed * 15 * scale
        const prevX = screenX + (screenX - cx) * trailLength * 0.02
        const prevY = screenY + (screenY - cy) * trailLength * 0.02

        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(screenX, screenY)
        ctx.strokeStyle = color.replace(/[\d.]+\)$/, `${alpha * 0.5})`)
        ctx.lineWidth = displaySize * 0.5
        ctx.stroke()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [starCount, speed, centerX, centerY, colors])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}
