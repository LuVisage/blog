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
}

/** One ruled line of an index — the list rows used by categories, series, friends and projects. */
export function LedgerRow({
  href, external, ordinal, title, label, desc, meta, note, lead,
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
        {label && <span className="eyebrow block mb-1.5">{label}</span>}
        <span
          className="font-serif font-bold truncate block transition-colors group-hover:text-[var(--accent-text)]"
          style={{ fontSize: 19, lineHeight: 1.4, color: 'var(--ink)', letterSpacing: '-0.01em' }}
        >
          {title}
        </span>
        {desc && <span className="body-sm line-clamp-2 block mt-1.5">{desc}</span>}
      </span>

      <span className="flex-shrink-0 text-right self-center flex items-center gap-3">
        {(meta || note) && (
          <span className="hidden sm:block">
            {meta && <span className="meta block">{meta}</span>}
            {note && <span className="caption block mt-1">{note}</span>}
          </span>
        )}
        {external
          ? <IconExternalLink size={15} strokeWidth={1.75} className="transition-colors" style={{ color: 'var(--muted)' }} />
          : <IconArrowUpRight size={16} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--muted)' }} />}
      </span>
    </>
  )

  const cls = 'group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6 py-5 rule'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" data-spotlight="row" className={cls}>
        {body}
      </a>
    )
  }
  return (
    <Link href={href} data-spotlight="row" className={cls}>
      {body}
    </Link>
  )
}

export function Ledger({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <div className="rule" />
    </div>
  )
}
