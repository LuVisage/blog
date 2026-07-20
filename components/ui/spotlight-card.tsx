'use client'

import { useRef, useState, useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  /** Spotlight color. Default white. */
  spotlightColor?: string
  /** Spotlight size (px). Default 350. */
  spotlightSize?: number
}

/**
 * SpotlightCard — a subtle spotlight follows the cursor on the card.
 * Adapted from React Bits' SpotlightCard component.
 * Uses CSS radial-gradient positioned via CSS custom properties.
 */
export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(255, 255, 255, 0.12)',
  spotlightSize = 350,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setPosition(null)
  }, [])

  const isVisible = position !== null

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative overflow-hidden', className)}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 1 : 0,
          background: position
            ? `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`
            : undefined,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
