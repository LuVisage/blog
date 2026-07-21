'use client'

import { useRef, type ReactNode, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  /** Whether to animate only once. Default true. */
  once?: boolean
}

/**
 * AnimatedContent — reveals content with a slide + fade using GSAP ScrollTrigger.
 * Replaces the Framer Motion version for better scroll performance.
 */
export function AnimatedContent({
  children,
  className,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
  once = true,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 })
      return
    }

    const getFromVars = () => {
      switch (direction) {
        case 'up': return { y: distance, opacity: 0 }
        case 'down': return { y: -distance, opacity: 0 }
        case 'left': return { x: distance, opacity: 0 }
        case 'right': return { x: -distance, opacity: 0 }
      }
    }

    const getToVars = (dir: string) => {
      switch (dir) {
        case 'up': case 'down': return { y: 0, opacity: 1 }
        case 'left': case 'right': return { x: 0, opacity: 1 }
      }
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(el, getFromVars(), {
        ...getToVars(direction),
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [direction, distance, duration, delay, once])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
