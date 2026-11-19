import Link from 'next/link'
import type { ReactNode } from 'react'
import { IconArrowRight } from '@tabler/icons-react'

interface PageMastheadProps {
  eyebrow: string
  title: string
  lead?: string
  /** 规线条右端的 mono 标签。 */
  counter?: string
  actions?: ReactNode
}

export function PageMasthead({ eyebrow, title, lead, counter, actions }: PageMastheadProps) {
  return (
    <header className="mb-16 sm:mb-20">
      <div
        className="flex items-center justify-between gap-4 py-2.5"
        style={{ borderTop: '2px solid var(--ink)', borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">{eyebrow}</span>
        {counter && <span className="eyebrow eyebrow-accent">{counter}</span>}
      </div>

      <div className="pt-8 sm:pt-10 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <div className="min-w-0">
          <h1 className="heading-1">{title}</h1>
          {lead && <p className="editorial__intro">{lead}</p>}
        </div>
        {/* 不带 min-w-0 这格顶不住收缩，子级 truncate 永不生效：320px 上曾把 288px 父栏撑到 335px。 */}
        {actions && <div className="flex w-full min-w-0 flex-wrap items-center gap-3 sm:w-auto">{actions}</div>}
      </div>
    </header>
  )
}

interface SectionHeadProps {
  label: string
  title: string
  href?: string
  hrefLabel?: string
  count?: number | string
}

export function SectionHead({ label, title, href, hrefLabel, count }: SectionHeadProps) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <div className="eyebrow mb-2">{label}</div>
        <h2 className="section-title">
          {title}
          {count !== undefined && <span className="meta ml-2">{count}</span>}
        </h2>
      </div>
      {href && (
        <Link href={href} className="btn-ghost text-sm">
          {hrefLabel}
          <IconArrowRight size={14} strokeWidth={2} />
        </Link>
      )}
    </div>
  )
}
