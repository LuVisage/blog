'use client'

import { useEffect, useState } from 'react'
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
  // 清单的行是正文，不像 chrome 那样能整块摘掉 —— 所以改的是「什么才算一个控件」：
  // 挂载前渲染同尺寸的普通行，水合完才升级为可勾选项。SSR 与首帧客户端都是 div，不产 mismatch。
  const [live, setLive] = useState(false)
  useEffect(() => setLive(true), [])
  const Row = live ? 'button' : 'div'

  return (
    <div className="learn-block not-prose" style={{ borderTop: '1px solid var(--line-strong)' }}>
      <div className="flex items-baseline gap-4 py-3">
        <span className="eyebrow min-w-0 truncate">{eyebrow}</span>
        {/* 状态比例尺：每勾一条就走 300ms 的一段，勾完即满格（§11.13） */}
        <span
          className="read-rule is-state min-w-[48px] self-center"
          style={{ '--p': items.length ? doneCount / items.length : 0 } as React.CSSProperties}
          aria-hidden="true"
        >
          <span className="read-rule__fill" />
        </span>
        {/* 计数是状态消息：容器常驻 DOM 并挂 live，读屏才会在勾选后报出「3 / 5」。
            勾选框自身的 aria-checked 只说明这一行变了，说明不了还剩几行。 */}
        <span
          className="meta tabular-nums flex-shrink-0"
          role="status"
          aria-live="polite"
          style={{ color: allDone ? 'var(--accent-text)' : 'var(--muted)' }}
        >
          {doneCount} / {items.length}
        </span>
      </div>

      <ol>
        {items.map((item, i) => {
          const active = on.has(i)
          return (
            <li key={i} className="rule" style={{ borderTop: i === 0 ? 'none' : undefined }}>
              <Row
                {...(live
                  ? {
                      type: 'button',
                      role: 'checkbox',
                      'aria-checked': active,
                      onClick: () => onToggle(i, items.length),
                    }
                  : {})}
                data-spotlight="row"
                className={`group w-full text-left grid grid-cols-[26px_minmax(0,1fr)_auto] items-start gap-3 py-4${
                  live ? ' pressable cursor-pointer' : ''
                }`}
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
                    borderRadius: 'var(--radius-xs)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--line-strong)'}`,
                    background: active ? 'var(--accent)' : 'transparent',
                  }}
                >
                  {active && (
                    <IconCheck
                      size={13}
                      strokeWidth={3}
                      className="tick-pop"
                      style={{ color: 'var(--on-accent)' }}
                    />
                  )}
                </span>
              </Row>
            </li>
          )
        })}
      </ol>

      {allDone && doneNote && (
        <p className="tick-note body-sm py-4" style={{ color: 'var(--accent-text)' }}>
          {doneNote}
        </p>
      )}
    </div>
  )
}
