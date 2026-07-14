'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  delay?: number // stagger delay in ms per child
}

export function RevealOnScroll({ children, className = '', threshold = 0.1, rootMargin = '0px 0px -40px 0px', delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Respect prefers-reduced-motion
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (prefersReduced) {
            setVisible(true)
          } else {
            // Stagger delay
            setTimeout(() => setVisible(true), delay)
          }
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-[0.98]'
      } ${className}`}
    >
      {children}
    </div>
  )
}

/** Wrapper that staggers children reveal */
export function RevealStagger({ children, className = '', baseDelay = 80 }: { children: ReactNode; className?: string; baseDelay?: number }) {
  return (
    <div className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <RevealOnScroll key={i} delay={i * baseDelay}>
              {child}
            </RevealOnScroll>
          ))
        : <RevealOnScroll>{children}</RevealOnScroll>
      }
    </div>
  )
}
