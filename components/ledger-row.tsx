import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { IconArrowUpRight, IconExternalLink } from '@tabler/icons-react'

interface LedgerRowProps {
  href: string
  external?: boolean
  ordinal?: number
  title: string
  /** 标题上方的小字行。 */
  label?: string
  desc?: string
  /** 右对齐 mono 数字，如文章数。 */
  meta?: string
  note?: string
  /** 左槽：头像或图标；缺省落序号。 */
  lead?: ReactNode
  /** 0–1：右侧计数比例尺，把同一清单里的数量差读成一条线。 */
  ratio?: number
}

const ROW_CLS =
  'pressable row-line group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3 sm:gap-6 py-5 rule'

/** 索引里的一条规线行——分类 / 系列 / 友链 / 项目共用。 */
export function LedgerRow({ href, external, ordinal, title, label, desc, meta, note, lead, ratio }: LedgerRowProps) {
  const body = (
    <>
      <span className="flex-shrink-0 w-9 self-center">
        {lead ?? (ordinal !== undefined && (
          <span
            className="tint-faint tabular-nums transition-colors group-hover:text-[var(--accent-text)]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, letterSpacing: '0.08em' }}
          >
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
              <span className="read-rule__fill" style={{ '--p': ratio } as CSSProperties} />
            </span>
          </span>
        )}
        {(meta || note) && (
          <span className="text-right">
            {meta && <span className="meta tabular-nums block">{meta}</span>}
            {note && <span className="caption block mt-1">{note}</span>}
          </span>
        )}
        {external ? (
          <IconExternalLink size={15} strokeWidth={1.75} className="transition-colors" style={{ color: 'var(--muted)' }} />
        ) : (
          <IconArrowUpRight size={16} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--muted)' }} />
        )}
      </span>
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={ROW_CLS}>
        {body}
      </a>
    )
  }
  return (
    <Link href={href} className={ROW_CLS}>
      {body}
    </Link>
  )
}

export function Ledger({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <div className="rule" />
    </div>
  )
}
