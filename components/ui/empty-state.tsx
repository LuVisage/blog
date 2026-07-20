import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EmptyStateProps {
  className?: string
  /** Emoji/icon shown above the text. Default 🌸. */
  icon?: string
  /** Primary text. */
  title?: string
  /** Secondary hint text. */
  description?: string
  /** Optional action button. */
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

/**
 * EmptyState — a polished empty-state placeholder with soft animations.
 * Inspired by Uiverse.io card designs, adapted for the blog's glass theme.
 * Replaces the simple emoji+text pattern in post-card.tsx and other list pages.
 */
export function EmptyState({
  className,
  icon = '🌸',
  title = '还没有内容哦~',
  description = '期待更多精彩内容 ✨',
  action,
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16 sm:py-20', className)}>
      {/* Floating icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 mb-6 animate-float">
        <span className="text-3xl sm:text-4xl" role="img" aria-hidden="true">
          {icon}
        </span>
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {description}
      </p>

      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all"
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:-translate-y-0.5 shadow-sm hover:shadow-md transition-all"
            >
              {action.label}
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}
