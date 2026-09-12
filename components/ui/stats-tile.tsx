'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsTileProps {
  value: number | React.ReactNode
  label: string
  suffix?: string
}

/**
 * One figure in a ledger row — deliberately not a card.
 * The count-up is the only flourish; hierarchy comes from type, not surface.
 */
export function StatsTile({ value, label, suffix = '' }: StatsTileProps) {
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(numValue)
      animated.current = true
      return
    }

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
    <div ref={ref}>
      <div
        className="font-serif font-bold leading-none tabular-nums"
        style={{ fontSize: 30, color: 'var(--ink)', letterSpacing: '-0.02em' }}
      >
        {isNumber ? displayValue : value}
        {suffix}
      </div>
      <div className="eyebrow mt-2">{label}</div>
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
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    onUpdate(Math.round(from + (to - from) * eased))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

/** Ledger of figures, separated by hairlines. */
export function StatsTileRow({ children }: { children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.flat() : [children]
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-6">
      {items.map((child, i) => (
        <div
          key={i}
          className="px-8 first:pl-0"
          style={i > 0 ? { borderLeft: '1px solid var(--line)' } : undefined}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
