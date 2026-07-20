'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

interface MagnetProps {
  children: ReactNode
  className?: string
  /** Maximum pixel offset when attracted. Default 10. */
  strength?: number
  /** Padding around the element where magnet activates. Default 40. */
  padding?: number
  /** If true, the magnet effect is disabled. Default false. */
  disabled?: boolean
}

/**
 * Magnet — elements are gently pulled toward the cursor when nearby.
 * Adapted from React Bits' Magnet component.
 * Great for buttons, nav links, and social icons.
 */
export function Magnet({
  children,
  className,
  strength = 10,
  padding = 40,
  disabled = false,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isNearby, setIsNearby] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Check if cursor is within padded area
    const paddedRect = {
      left: rect.left - padding,
      right: rect.right + padding,
      top: rect.top - padding,
      bottom: rect.bottom + padding,
    }

    const isNear =
      e.clientX >= paddedRect.left &&
      e.clientX <= paddedRect.right &&
      e.clientY >= paddedRect.top &&
      e.clientY <= paddedRect.bottom

    setIsNearby(isNear)

    if (isNear) {
      // Calculate attraction: move TOWARD the cursor
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDist = Math.max(rect.width, rect.height) / 2 + padding

      // Closer = stronger attraction (up to `strength`)
      const factor = 1 - Math.min(distance / maxDist, 1)
      x.set(dx * factor * (strength / maxDist))
      y.set(dy * factor * (strength / maxDist))
    } else {
      x.set(0)
      y.set(0)
    }
  }

  const handleMouseLeave = () => {
    setIsNearby(false)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}
