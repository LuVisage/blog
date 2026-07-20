'use client'

import { useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WobbleCardProps {
  children: ReactNode
  className?: string
  /** Max rotation in degrees. Default 5. */
  intensity?: number
  /** Whether the card has a glossy overlay. Default true. */
  gloss?: boolean
}

/**
 * WobbleCard — a playful card that tilts/wobbles on hover.
 * Adapted from Aceternity UI's Wobble Card.
 * Uses CSS transforms with translate + rotate for a fun, bouncy effect.
 */
export function WobbleCard({
  children,
  className,
  intensity = 5,
  gloss = true,
}: WobbleCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glossPos, setGlossPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotateX = (y - 0.5) * -intensity * 2
    const rotateY = (x - 0.5) * intensity * 2
    const translateZ = 20

    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale3d(1.02, 1.02, 1.02)`
    )
    setGlossPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform('perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn('relative transition-all duration-500 ease-out', className)}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Glossy overlay */}
      {gloss && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 transition-opacity duration-300 overflow-hidden"
          style={{ opacity: isHovered ? 0.4 : 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${glossPos.x}% ${glossPos.y}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* Shadow lift */}
      <div
        className="absolute inset-0 rounded-[inherit] transition-all duration-500 -z-10"
        style={{
          boxShadow: isHovered
            ? '0 20px 60px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.1)'
            : '0 4px 12px rgba(0,0,0,0.06)',
          transform: isHovered ? 'translateZ(-10px)' : 'translateZ(0)',
        }}
      />

      {children}
    </div>
  )
}
