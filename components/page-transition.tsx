'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/** Runs `onRouteChange` for every navigation, but not for the first paint. */
function useRouteChange(onRouteChange: () => void) {
  const pathname = usePathname()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    onRouteChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}

/**
 * Route-change choreography: the new page rises in while an accent hairline
 * sweeps across the top. The sweep is mounted at body level because `main`
 * opens its own stacking context and would trap it under the header.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const content = useRef<HTMLDivElement>(null)

  useRouteChange(() => {
    content.current?.animate(
      [
        { opacity: 0, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 420, easing: EASE }
    )
  })

  return <div ref={content}>{children}</div>
}

export function PageSweep() {
  const sweep = useRef<HTMLDivElement>(null)

  useRouteChange(() => {
    sweep.current?.animate(
      [
        { opacity: 1, transform: 'scaleX(0)' },
        { opacity: 1, transform: 'scaleX(1)', offset: 0.55 },
        { opacity: 0, transform: 'scaleX(1)' },
      ],
      { duration: 620, easing: EASE }
    )
  })

  return <div ref={sweep} className="page-sweep" aria-hidden="true" style={{ opacity: 0 }} />
}
