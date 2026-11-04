import Link from 'next/link'
import { IconArrowUpRight, IconExternalLink } from '@tabler/icons-react'

interface LedgerRowProps {
  href: string
  external?: boolean
  ordinal?: number
  title: string
  /** Small caps line above the title. */
  label?: string
  desc?: string
  /** Right-aligned mono figure, e.g. a post count. */
  meta?: string
  note?: string
  /** Left slot: an avatar or icon. Falls back to the ordinal. */
  lead?: React.ReactNode
  /** 0–1：右侧计数比例尺（§11.11 的 .read-rule），把同一清单里的数量差读成一条线。 */
  ratio?: number
}

/** One ruled line of an index — the list rows used by categories, series, friends and projects. */
export function LedgerRow({
  href, external, ordinal, title, label, desc, meta, note, lead, ratio,
}: LedgerRowProps) {
  const body = (
    <>
      <span className="flex-shrink-0 w-9 self-center">
        {lead ?? (ordinal !== undefined && (
          <span className="meta tabular-nums transition-colors group-hover:text-[var(--accent-text)]">
            {String(ordinal).padStart(2, '0')}
          </span>
        ))}
      </span>

      <span className="min-w-0 block">
        {label && <span className="eyebrow block mb-1.5 row-title">{label}</span>}
        <span className="heading-3 row-title block transition-colors group-hover:text-[var(--accent-text)]">
          {title}
        </span>
        {desc && <span className="body-sm line-clamp-2 block mt-1.5">{desc}</span>}
      </span>

      <span className="flex-shrink-0 self-center flex items-center justify-end gap-3 sm:gap-5">
        {ratio !== undefined && (
          <span className="hidden sm:block w-24" aria-hidden="true">
            <span className="read-rule">
              <span className="read-rule__fill" style={{ '--p': ratio } as React.CSSProperties} />
            </span>
          </span>
        )}
        {(meta || note) && (
          <span className="text-right">
            {meta && <span className="meta tabular-nums block">{meta}</span>}
            {note && <span className="caption block mt-1">{note}</span>}
          </span>
        )}
        {external
          ? <IconExternalLink size={15} strokeWidth={1.75} className="transition-colors" style={{ color: 'var(--muted)' }} />
          : <IconArrowUpRight size={16} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--muted)' }} />}
      </span>
    </>
  )

  const cls = 'pressable row-line group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6 py-5 rule'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  )
}

export function Ledger({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* 台账行分级入场：单条 400ms、步进 40ms（SPEC_LEDGER §1.8.3） */}
      <div className="stagger">{children}</div>
      <div className="rule" />
    </div>
  )
}
