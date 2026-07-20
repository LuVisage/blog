'use client'

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * TextScramble — Motion-Primitives inspired text scrambling effect.
 * Randomly scrambles characters before revealing the target text.
 * Great for hero titles, loading states, or page transitions.
 */

const CHARS = '!<>-_\\[]{}—=+*^?#________'

interface TextScrambleProps {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div'
  /** Duration per character reveal in ms. Default 25. */
  speed?: number
  /** Initial delay in ms before scramble starts. Default 0. */
  delay?: number
  /** Whether to trigger on scroll visibility. Default false (plays immediately). */
  triggerOnScroll?: boolean
}

export function TextScramble({
  text,
  className,
  as: Tag = 'span',
  speed = 25,
  delay = 0,
  triggerOnScroll = false,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const [started, setStarted] = useState(!triggerOnScroll)
  const elementRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef(0)
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([])

  useEffect(() => {
    if (!started) return

    const timeout = setTimeout(() => {
      const chars: string[] = []

      const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = []
      for (let i = 0; i < text.length; i++) {
        const from = text[i] || ''
        const to = text[i] || ''
        const startTime = Math.floor(Math.random() * 40)
        const endTime = startTime + Math.floor(Math.random() * 40) + speed
        queue.push({ from, to, start: startTime, end: endTime })
      }

      queueRef.current = queue

      let frame = 0
      const update = () => {
        let output = ''
        let complete = 0

        for (let i = 0; i < queue.length; i++) {
          const { from, to, start, end } = queue[i]
          if (frame >= end) {
            output += to
            complete++
          } else if (frame >= start) {
            // During scramble
            if (Math.random() < 0.28) {
              output += CHARS[Math.floor(Math.random() * CHARS.length)]
            } else {
              output += from || CHARS[Math.floor(Math.random() * CHARS.length)]
            }
          } else {
            // Not started yet
            output += from || ''
          }
        }

        setDisplay(output)

        if (complete === queue.length) {
          setDisplay(text)
          return
        }

        frame++
        frameRef.current = requestAnimationFrame(update)
      }

      // 1 frame buffer
      frameRef.current = requestAnimationFrame(update)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frameRef.current)
    }
  }, [text, speed, delay, started])

  // Scroll trigger via IntersectionObserver
  useEffect(() => {
    if (!triggerOnScroll || !elementRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [triggerOnScroll])

  return (
    <Tag ref={elementRef as React.Ref<HTMLHeadingElement & HTMLSpanElement>} className={cn(className)}>
      {display}
    </Tag>
  )
}
