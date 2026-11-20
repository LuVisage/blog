import Link from 'next/link'
import type { ReactNode } from 'react'
import { FigurePlate } from '@/components/figure-plate'

interface EmptyStateProps {
  className?: string
  icon?: ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: ReactNode
  }
}

/** 空态是一间排印的空房：2px 墨线开合、巨字黑体标题、红色记号，不是一张浮卡。 */
export function EmptyState({
  className,
  icon,
  title = '还没有内容',
  description = '期待更多精彩内容',
  action,
}: EmptyStateProps) {
  let actionNode: ReactNode = null
  if (action?.href) {
    actionNode = (
      <Link href={action.href} className="btn-secondary inline-flex">
        {action.icon}
        {action.label}
      </Link>
    )
  } else if (action?.onClick) {
    actionNode = (
      <button onClick={action.onClick} className="btn-secondary inline-flex">
        {action.icon}
        {action.label}
      </button>
    )
  }

  return (
    <div
      className={`text-center py-20 sm:py-24 ${className ?? ''}`}
      style={{ borderTop: '2px solid var(--rule)', borderBottom: '1px solid var(--line)' }}
    >
      <div className="inline-flex items-center justify-center mb-6" style={{ color: 'var(--accent-text)' }}>
        {icon ?? (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>
      <h3 className="heading-2 mb-3">{title}</h3>
      <p className="body-sm mb-8 max-w-sm mx-auto">{description}</p>
      {actionNode}
      <FigurePlate
        className="mt-12 mx-auto max-w-[520px]"
        src="/fig/night-skyline.webp"
        alt="扁平卡通风格的夜晚城市天际线剪影，楼群亮着暖黄与红色窗灯"
        width={1040}
        height={470}
        fig="00"
        caption="夜城天际线"
        author="GDJ"
        source="https://openclipart.org/detail/310835/generic-skyline-at-night"
      />
    </div>
  )
}
