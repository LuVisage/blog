'use client'

import { IconCheck } from '@tabler/icons-react'
import { inlineCode } from './inline-text'

interface TickListProps {
  eyebrow: string
  items: string[]
  /** Indexes currently ticked in whichever list this renders. */
  checked: number[]
  onToggle: (index: number, total: number) => void
  /** Shown once every item is ticked. Omit for a list that doesn't end the lesson. */
  doneNote?: string
}

/**
 * A ruled list of things the visitor ticks by hand. Shared by 今日自测 and the
 * 自查清单 so both read the same; only where their ticks are stored differs.
 */
export function TickList({ eyebrow, items, checked, onToggle, doneNote }: TickListProps) {
  const on = new Set(checked)
  const doneCount = items.filter((_, i) => on.has(i)).length
  const allDone = items.length > 0 && doneCount === items.length

  return (
    <div className="learn-block not-prose" style={{ borderTop: '1px solid var(--line-strong)' }}>
      <div className="flex items-baseline justify-between gap-4 py-3">
        <span className="eyebrow">{eyebrow}</span>
        <span className="meta tabular-nums" style={{ color: allDone ? 'var(--accent-text)' : 'var(--muted)' }}>
          {doneCount} / {items.length}
        </span>
      </div>

      <ol>
        {items.map((item, i) => {
          const active = on.has(i)
          return (
            <li key={i} className="rule" style={{ borderTop: i === 0 ? 'none' : undefined }}>
              <button
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => onToggle(i, items.length)}
                data-spotlight="row"
                className="group w-full text-left grid grid-cols-[26px_minmax(0,1fr)_auto] items-start gap-3 py-4 cursor-pointer"
              >
                <span
                  className="meta tabular-nums pt-0.5 transition-colors"
                  style={{ color: active ? 'var(--accent-text)' : 'var(--muted)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span
                  className="body-sm transition-colors"
                  style={{
                    color: active ? 'var(--muted)' : 'var(--body)',
                    textDecorationLine: active ? 'line-through' : 'none',
                    textDecorationColor: 'var(--line-strong)',
                  }}
                >
                  {inlineCode(item)}
                </span>

                <span
                  aria-hidden
                  className="mt-0.5 flex-shrink-0 grid place-items-center transition-colors"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--line-strong)'}`,
                    background: active ? 'var(--accent)' : 'transparent',
                  }}
                >
                  {active && <IconCheck size={13} strokeWidth={3} style={{ color: 'var(--on-accent)' }} />}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {allDone && doneNote && (
        <p className="body-sm py-4" style={{ color: 'var(--accent-text)' }}>
          {doneNote}
        </p>
      )}
    </div>
  )
}
