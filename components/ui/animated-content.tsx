'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useInView } from 'motion/react'
import { cn } from '@/lib/utils'

interface AnimatedContentProps {
  children: ReactNode
  className?: string
  /** Animation direction. Default 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Animation distance in px. Default 24. */
  distance?: number
  /** Animation duration in seconds. Default 0.6. */
  duration?: number
  /** Delay in seconds. Default 0. */
  delay?: number
  /** Easing curve. Default cubic-bezier. */
  ease?: [number, number, number, number]
  /** Viewport threshold (0-1). Default 0.2. */
  threshold?: number
  /** Whether to animate only once. Default true. */
  once?: boolean
}

/**
 * AnimatedContent — reveals content with a slide + fade when scrolled into view.
 * Adapted from React Bits' AnimatedContent component.
 * Uses Framer Motion (motion) + Intersection Observer (useInView).
 */
export function AnimatedContent({
  children,
  className,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
  ease = [0.16, 1, 0.3, 1],
  threshold = 0.2,
  once = true,
}: AnimatedContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-20px 0px 0px 0px' })

  // Compute initial transform based on direction
  const getInitial = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 }
      case 'down':
        return { y: -distance, opacity: 0 }
      case 'left':
        return { x: distance, opacity: 0 }
      case 'right':
        return { x: -distance, opacity: 0 }
    }
  }

  const getAnimate = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 }
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={isInView ? getAnimate() : getInitial()}
      transition={{
        duration,
        delay,
        ease,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
