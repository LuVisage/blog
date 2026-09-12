'use client'

import { useEffect, useMemo, useState } from 'react'
import { ALGOS, type AlgoDef, type Cell, type CellTone, type Grid, type Inputs } from '@/lib/sim/algo'
import { ControlRow, Range, SimFrame, Stat, TextField } from './frame'

/**
 * One player for every CSP lab. The engines differ wildly; the shape of a trace
 * does not — a sentence, the expression it just evaluated, and the arrays that
 * changed. So the chrome lives here and each algorithm only ships data.
 */

const TONES: Record<NonNullable<CellTone>, { color: string; border: string; background?: string; weight?: number }> = {
  idle: { color: 'var(--body)', border: 'var(--line)' },
  read: { color: 'var(--ink)', border: 'var(--line-strong)', background: 'var(--surface-2)' },
  active: { color: 'var(--accent-text)', border: 'var(--accent-line)', background: 'var(--accent-soft)' },
  write: { color: 'var(--ink)', border: 'var(--accent)', background: 'var(--accent-soft)', weight: 700 },
  hit: { color: 'var(--accent-text)', border: 'var(--accent-line)', weight: 700 },
  miss: { color: 'var(--danger)', border: 'var(--line)' },
  dim: { color: 'var(--faint)', border: 'var(--line)' },
}

function CellBox({ cell }: { cell: Cell }) {
  const tone = TONES[cell.tone ?? 'idle']
  return (
    <td className="p-0 text-center">
      <span
        className="inline-flex flex-col items-center justify-center tabular-nums"
        style={{
          minWidth: 34,
          minHeight: 30,
          padding: '2px 5px',
          border: `1px solid ${tone.border}`,
          borderRadius: 6,
          background: tone.background ?? 'transparent',
          color: tone.color,
          fontWeight: tone.weight ?? 400,
          fontFamily: 'var(--font-mono)',
          fontSize: 12.5,
          lineHeight: 1.25,
        }}
      >
        {cell.t}
        {cell.mark && (
          <span style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 0.02 }}>{cell.mark}</span>
        )}
      </span>
    </td>
  )
}

function GridView({ grid }: { grid: Grid }) {
  return (
    <div className="mt-3">
      <div className="eyebrow mb-2">{grid.label}</div>
      <div className="overflow-x-auto pb-1">
        <table className="border-collapse">
          {grid.cols && (
            <thead>
              <tr>
                <th className="p-0" />
                {grid.cols.map((head, i) => (
                  <th key={`${head}-${i}`} className="px-0 py-1 text-center">
                    <span className="meta tabular-nums" style={{ color: 'var(--faint)', fontFamily: 'var(--font-mono)' }}>
                      {head}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {grid.rows.map((row) => (
              <tr key={row.label}>
                <th className="pr-3 text-left whitespace-nowrap">
                  <span className="meta" style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {row.label}
                  </span>
                </th>
                {row.cells.map((cell, i) => (
                  <CellBox key={i} cell={cell} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function defaults(fields: AlgoDef['fields']): Inputs {
  const input: Inputs = {}
  for (const field of fields) input[field.key] = field.def
  return input
}

export function AlgoLab({ algo }: { algo: string }) {
  const def = ALGOS[algo]
  const [input, setInput] = useState<Inputs>(() => (def ? defaults(def.fields) : {}))
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)

  const run = useMemo(() => (def ? def.run(input) : { steps: [], verdict: '' }), [def, input])
  const total = run.steps.length
  /** A one-step lab is a table, not a trace: paint it without asking for a click. */
  const shown = total <= 1 ? total : Math.min(cursor, total)
  const step = run.steps[shown - 1]

  useEffect(() => {
    if (!playing) return
    if (shown >= total) {
      setPlaying(false)
      return
    }
    const timer = setTimeout(() => setCursor((value) => value + 1), 700)
    return () => clearTimeout(timer)
  }, [playing, shown, total])

  if (!def) return null

  const set = (key: string, value: string | number | boolean) => {
    setPlaying(false)
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  const log = run.steps.slice(Math.max(0, shown - 4), shown)

  return (
    <SimFrame label={def.title} hint={def.hint} source={def.source}>
      <div className="space-y-3">
        {def.fields.map((field) => (
          <ControlRow key={field.key} label={field.label}>
            {field.kind === 'range' ? (
              <Range
                value={Number(input[field.key] ?? field.def)}
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                suffix={field.suffix}
                onChange={(value) => set(field.key, value)}
              />
            ) : field.kind === 'toggle' ? (
              <button
                type="button"
                onClick={() => set(field.key, !input[field.key])}
                className="chip px-2.5 py-1 text-xs transition-colors"
                style={{
                  borderRadius: 7,
                  color: input[field.key] ? 'var(--ink)' : 'var(--muted)',
                  borderColor: input[field.key] ? 'var(--accent-line)' : 'var(--line)',
                  background: input[field.key] ? 'var(--accent-soft)' : 'transparent',
                }}
              >
                {input[field.key] ? field.on : field.off}
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <TextField
                  value={String(input[field.key] ?? field.def)}
                  label={field.label}
                  onChange={(value) => set(field.key, value)}
                />
                {field.hint && <span className="caption">{field.hint}</span>}
              </div>
            )}
          </ControlRow>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setCursor((value) => Math.min(value + 1, total))
          }}
          disabled={shown >= total}
          className="btn-secondary px-3 py-1.5 text-xs"
          style={{ color: 'var(--body)' }}
        >
          单步执行
        </button>
        <button
          type="button"
          onClick={() => {
            if (shown >= total) setCursor(0)
            setPlaying((value) => !value)
          }}
          disabled={total === 0}
          className="btn-secondary px-3 py-1.5 text-xs"
          style={{ color: 'var(--body)' }}
        >
          {playing ? '暂停' : '自动播放'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setCursor(0)
          }}
          className="btn-ghost px-3 py-1.5 text-xs"
          style={{ color: 'var(--muted)' }}
        >
          回到开头
        </button>
        <span className="meta tabular-nums ml-auto" style={{ color: 'var(--muted)' }}>
          步 {shown}/{total}
        </span>
      </div>

      {total === 0 && (
        <p className="body-sm mt-3" style={{ color: 'var(--muted)' }}>
          输入没解析出可算的东西，检查一下上面的格式提示。
        </p>
      )}

      {shown === 0 && total > 0 && (
        <p className="body-sm mt-3" style={{ color: 'var(--muted)' }}>
          还没开始。点「单步执行」走一步，或者直接自动播放。
        </p>
      )}

      {step && (
        <div
          className="mt-4 px-4 py-3.5"
          style={{ border: '1px solid var(--line-strong)', borderLeft: '2px solid var(--accent)', borderRadius: 8 }}
        >
          <p className="body-sm" style={{ color: 'var(--ink)' }}>
            {step.text}
          </p>
          {step.expr && (
            <p
              className="mt-2.5 px-3 py-2 text-xs overflow-x-auto whitespace-pre"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 7, color: 'var(--body)', fontFamily: 'var(--font-mono)' }}
            >
              {step.expr}
            </p>
          )}
          {step.grids?.map((grid) => <GridView key={grid.label} grid={grid} />)}
          {step.stats && (
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
              {step.stats.map((stat) => (
                <Stat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          )}
        </div>
      )}

      {log.length > 1 && (
        <ol className="mt-3 space-y-1">
          {log.map((past, i) => {
            const number = Math.max(0, shown - 4) + i + 1
            return (
              <li key={number} className="flex gap-2.5">
                <span className="meta tabular-nums flex-shrink-0" style={{ color: 'var(--faint)' }}>
                  {String(number).padStart(2, '0')}
                </span>
                <span className="caption">{past.text}</span>
              </li>
            )
          })}
        </ol>
      )}

      {shown >= total && total > 0 && (
        <p
          className="mt-4 px-4 py-3 text-sm"
          style={{ border: '1px solid var(--line)', borderRadius: 8, background: 'var(--surface-2)', color: 'var(--body)' }}
        >
          {run.verdict}
        </p>
      )}
    </SimFrame>
  )
}
