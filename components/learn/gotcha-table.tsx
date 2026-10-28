import { inlineCode } from './inline-text'

interface GotchaRow {
  symptom: string
  cause: string
  fix: string
}

interface GotchaTableProps {
  rows: GotchaRow[]
}

/** 常见坑速查 — the tutorial keeps every lesson's error/cause/fix table in one shape. */
export function GotchaTable({ rows }: GotchaTableProps) {
  if (rows.length === 0) return null

  return (
    <div className="learn-block not-prose" style={{ borderTop: '1px solid var(--line-strong)' }}>
      <div className="hidden md:grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-6 py-3">
        <span className="eyebrow">现象</span>
        <span className="eyebrow">原因</span>
        <span className="eyebrow">解决</span>
      </div>

      {rows.map((row, i) => (
        <div
          key={i}
          data-spotlight="row"
          className="rule py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.2fr)] gap-2 md:gap-6"
        >
          <span className="text-sm font-medium" style={{ color: 'var(--ink)' }}>
            {inlineCode(row.symptom)}
          </span>
          <span className="body-sm md:mt-0 mt-1">
            <span className="eyebrow md:hidden mr-2">原因</span>
            {inlineCode(row.cause)}
          </span>
          <span className="body-sm md:mt-0 mt-1" style={{ color: 'var(--ink)' }}>
            <span className="eyebrow md:hidden mr-2">解决</span>
            <span aria-hidden className="hidden md:inline mr-1.5" style={{ color: 'var(--accent-text)' }}>
              →
            </span>
            {inlineCode(row.fix)}
          </span>
        </div>
      ))}
    </div>
  )
}
