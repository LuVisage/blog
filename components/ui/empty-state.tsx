import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EmptyStateProps {
  className?: string
  /** Icon shown above the text. Can be emoji string or React node. */
  icon?: React.ReactNode
  /** Primary text. */
  title?: string
  /** Secondary hint text. */
  description?: string
  /** Optional action button. */
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
    <div className={cn('text-center py-16 sm:py-20', className)}>
      {/* Floating icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full glass mb-6 animate-float">
        {typeof icon === 'string' ? (
          <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
            {icon}
          </span>
        ) : (
          icon
        )}
      </div>

      <h3 className="heading-3 mb-2 text-center">{title}</h3>

      <p className="body-sm mb-6">{description}</p>

      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="btn-ghost inline-flex items-center gap-2"
            >
              {action.icon}
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="btn-ghost inline-flex items-center gap-2"
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
