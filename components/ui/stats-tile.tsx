'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsTileProps {
  value: number
  label: string
  icon?: React.ReactNode
  suffix?: string
}

export function StatsTile({ value, label, icon, suffix = '' }: StatsTileProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || animated.current || value === 0) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setDisplayValue(value)
      animated.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !animated.current) {
          animated.current = true
          animateCount(0, value, 800, setDisplayValue)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center gap-1 min-h-[90px]"
    >
      {icon && <div className="mb-1">{icon}</div>}
      <div
        className="text-2xl sm:text-3xl font-bold font-mono"
        style={{ color: 'var(--color-ink)' }}
      >
        {displayValue}
        {suffix}
      </div>
      <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
        {label}
      </div>
    </div>
  )
}

/** Smooth count-up animation using requestAnimationFrame */
function animateCount(
  from: number,
  to: number,
  duration: number,
  onUpdate: (v: number) => void
) {
  const start = performance.now()
  function tick(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3)
    onUpdate(Math.round(from + (to - from) * eased))
    if (progress < 1) {
      requestAnimationFrame(tick)
    }
  }
  requestAnimationFrame(tick)
}

export function StatsTileRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {children}
    </div>
  )
}
