'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface BlurTextProps {
  /** The text to animate. */
  text: string
  /** CSS class for the text container. */
  className?: string
  /** Delay before animation starts (seconds). Default 0. */
  delay?: number
  /** Duration per character (seconds). Default 0.05. */
  duration?: number
  /** Initial blur amount (px). Default 8. */
  blurAmount?: number
  /** Whether to split by words instead of characters. Default false. */
  animateByWord?: boolean
  /** HTML tag to render. Default 'span'. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'
  /** Trigger on scroll (Intersection Observer). Default true. */
  animateOnScroll?: boolean
}

/**
 * BlurText — characters/words animate in from blur to clear with a staggered delay.
 * Adapted from React Bits' BlurText component.
 * Pure CSS transitions — no Framer Motion dependency needed for this one.
 */
export function BlurText({
  text,
  className,
  delay = 0,
  duration = 0.05,
  blurAmount = 8,
  animateByWord = false,
  as: Tag = 'span',
  animateOnScroll = true,
}: BlurTextProps) {
  const [isVisible, setIsVisible] = useState(!animateOnScroll)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!animateOnScroll) {
      setIsVisible(true)
      return
    }

    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [animateOnScroll])

  const segments = animateByWord ? text.split(' ') : text.split('')

  return (
    <Tag ref={containerRef as React.RefObject<never>} className={cn('inline', className)}>
      {segments.map((char, i) => {
        const isSpace = char === ' '
        return (
          <span
            key={i}
            aria-hidden={isSpace ? 'true' : undefined}
            className="inline-block transition-all duration-500 ease-out"
            style={{
              filter: isVisible ? 'blur(0px)' : `blur(${blurAmount}px)`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transitionDelay: `${delay + i * duration}s`,
              // Preserve space width
              width: isSpace ? '0.3em' : undefined,
            }}
          >
            {isSpace ? ' ' : char}
          </span>
        )
      })}
    </Tag>
  )
}
