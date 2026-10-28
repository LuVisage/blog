'use client'

import { useEffect, useState } from 'react'

const PROMPT = 'AI 探索者 & Agent 开发者'

/** Hero signature line — types itself out, then holds a blinking caret. */
export function TerminalGreeting() {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(PROMPT)
      return
    }
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(PROMPT.slice(0, i))
      if (i >= PROMPT.length) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [])

  return (
    <p className="font-mono text-sm" style={{ color: 'var(--muted)' }}>
      <span style={{ color: 'var(--accent-text)' }}>$</span>{' '}
      <span style={{ color: 'var(--body)' }}>echo &quot;{typed}&quot;</span>
      <span
        className="inline-block w-2 h-[1.05em] align-text-bottom ml-0.5 animate-caret"
        style={{ background: 'var(--accent)' }}
        aria-hidden="true"
      />
    </p>
  )
}
