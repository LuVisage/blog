'use client'

import { useEffect, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins once at app level
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * GSAP Provider — registers plugins and applies global GSAP configuration.
 * Mount once at layout level to ensure plugins are available everywhere.
 */
export function GSAPProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect reduced motion globally
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      gsap.globalTimeline.timeScale(0)
    }

    const handler = (e: MediaQueryListEvent) => {
      gsap.globalTimeline.timeScale(e.matches ? 0 : 1)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return <>{children}</>
}
