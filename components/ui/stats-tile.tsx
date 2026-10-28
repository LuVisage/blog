'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

interface StatsTileProps {
  value: number | React.ReactNode
  label: string
  suffix?: string
}

/**
 * One figure in a ledger row — deliberately not a card.
 * 数字以「翻板滚筒」落地（§11.7）：每位数字从 0 沿数字列滚到目标位
 * （1.15s easeOutExpo），替代早期 count-up；IO 触发时机与档位沿用 §11.1。
 */
export function StatsTile({ value, label, suffix = '' }: StatsTileProps) {
  const isNumber = typeof value === 'number'
  const numValue = isNumber ? value : 0
  const [target, setTarget] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!isNumber || numValue === 0) {
      setTarget(0)
      return
    }
    const el = ref.current
    if (!el || animated.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTarget(numValue)
      animated.current = true
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animated.current = true
      setTarget(numValue)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !animated.current) {
          animated.current = true
          setTarget(numValue)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isNumber, numValue])

  const digits = isNumber ? String(numValue).split('').map(Number) : null
  const shown = target ?? 0
  const shownDigits = digits
    ? String(shown).padStart(digits.length, '0').split('').map(Number)
    : []

  return (
    <div ref={ref}>
      <div
        className="flip-digits font-serif font-bold leading-none tabular-nums"
        style={{ fontSize: 'var(--text-h2)', color: 'var(--ink)', letterSpacing: 'var(--tracking-heading)' }}
      >
        {isNumber ? (
          <>
            {digits?.map((_, i) => (
              <span key={i} className="flip-digit" style={{ '--digit': shownDigits[i] } as CSSProperties}>
                <span className="flip-reel">0123456789</span>
              </span>
            ))}
            {suffix && <span>{suffix}</span>}
          </>
        ) : (
          <>
            {value}
            {suffix}
          </>
        )}
      </div>
      <div className="eyebrow mt-2">{label}</div>
    </div>
  )
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
