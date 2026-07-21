'use client'

import { useEffect, useRef } from 'react'

export function TerminalGreeting() {
  const cursorRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    let visible = true
    const interval = setInterval(() => {
      visible = !visible
      cursor.style.opacity = visible ? '1' : '0'
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-sm"
      style={{
        background: 'var(--color-primary-soft)',
        color: 'var(--color-body)',
        border: '1px solid var(--color-hairline)',
      }}
    >
      <span style={{ color: 'var(--color-primary)' }}>$</span>
      <span>echo "AI 探索者 & Agent 开发者"</span>
      <span
        ref={cursorRef}
        className="inline-block w-2 h-4 ml-0.5 rounded-sm"
        style={{ background: 'var(--color-primary)' }}
      />
    </div>
  )
}
