import Link from 'next/link'

interface EmptyStateProps {
  className?: string
  icon?: React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
}

/** Empty state — a ruled gap in the index, not a floating card. */
export function EmptyState({
  className,
  icon,
  title = '还没有内容',
  description = '期待更多精彩内容',
  action,
}: EmptyStateProps) {
  return (
    <div className={`text-center py-20 sm:py-24 rule ${className ?? ''}`}>
      <div className="inline-flex items-center justify-center mb-5" style={{ color: 'var(--accent-text)' }}>
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>

      <h3 className="heading-3 mb-2">{title}</h3>
      <p className="body-sm mb-6 max-w-sm mx-auto">{description}</p>

      {action && (
        action.href ? (
          <Link href={action.href} className="btn-secondary inline-flex">
            {action.icon}
            {action.label}
          </Link>
        ) : action.onClick ? (
          <button onClick={action.onClick} className="btn-secondary inline-flex">
            {action.icon}
            {action.label}
          </button>
        ) : null
      )}
    </div>
  )
}
