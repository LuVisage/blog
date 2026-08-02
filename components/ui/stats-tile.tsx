'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsTileProps {
  value: number | React.ReactNode
  label: string
  icon?: React.ReactNode
  suffix?: string
}

export function StatsTile({ value, label, icon, suffix = '' }: StatsTileProps) {
  const isNumber = typeof value === 'number'
  const numValue = isNumber ? value : 0
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!isNumber || numValue === 0) {
      setDisplayValue(0)
      return
    }
    const el = ref.current
    if (!el || animated.current) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      setDisplayValue(numValue)
      animated.current = true
      return
    }

    // If already visible (e.g. above the fold on mobile), animate immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animated.current = true
      animateCount(0, numValue, 600, setDisplayValue)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !animated.current) {
          animated.current = true
          animateCount(0, numValue, 900, setDisplayValue)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isNumber, numValue])

  return (
    <div
      ref={ref}
      className="glass-card rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center gap-2 min-h-[100px]"
    >
      {icon && <div className="mb-0.5">{icon}</div>}
      <div
        className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
        style={{ color: 'var(--color-ink)' }}
      >
        {isNumber ? displayValue : value}
        {suffix}
      </div>
      <div className="text-xs font-medium tracking-wide uppercase" style={{ color: 'var(--color-muted)' }}>
        {label}
      </div>
    </div>
  )
}

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
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {children}
    </div>
  )
}
