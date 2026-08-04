import { cn } from '@/lib/utils'
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

/**
 * EmptyState — a polished empty-state placeholder.
 * Uses Alchemy design tokens for consistent theming.
 */
export function EmptyState({
  className,
  icon,
  title = '还没有内容哦~',
  description = '期待更多精彩内容',
  action,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-20 sm:py-24', className)}>
      {/* Floating icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl glass-liquid mb-6 animate-float">
        {icon || (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted-soft)' }}>
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )}
      </div>

      <h3 className="heading-3 mb-2 text-center">{title}</h3>

      <p className="body-sm mb-6">{description}</p>

      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="btn-primary inline-flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="btn-primary inline-flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}
