'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: ReactNode
  className?: string
  /** Intensity of the 3D rotation. Default 20 (degrees max). */
  intensity?: number
  /** Scale on hover. Default 1.02. */
  hoverScale?: number
  /** Whether to show a subtle glare/gloss effect. Default true. */
  glare?: boolean
  /** Glare color. Default white. */
  glareColor?: string
  /** Container element type. Default 'div'. */
  as?: 'div' | 'article' | 'section'
}

/**
 * 3D Card Effect — tilts the card based on mouse position using CSS perspective.
 * Adapted from Aceternity UI's 3d-card component.
 * Uses Framer Motion (motion) for smooth spring animations.
 */
export function Card3D({
  children,
  className,
  intensity = 20,
  hoverScale = 1.02,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.15)',
  as: Tag = 'div',
}: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position relative to card center (-1 to 1)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-smoothed rotation values
  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [intensity, -intensity]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-intensity, intensity]), {
    stiffness: 150,
    damping: 20,
  })

  // Glare position transforms
  const glareX = useTransform(mouseX, [-1, 1], ['-50%', '150%'])
  const glareY = useTransform(mouseY, [-1, 1], ['-50%', '150%'])

  // Scale on hover
  const scale = useSpring(isHovered ? hoverScale : 1, {
    stiffness: 200,
    damping: 25,
  })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()

    // Calculate normalized position (-1 to 1)
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className={cn('relative', className)}
    >
      <Tag className="h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </Tag>

      {/* Glare overlay */}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, ${glareColor} 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      )}
    </motion.div>
  )
}
