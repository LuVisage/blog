import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  /** Size variant. Default 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** Loader color. Default neutral gray. */
  color?: string
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

/**
 * Loader — a clean dual-ring spinner.
 * Inspired by Uiverse.io's top-rated loaders, adapted for the blog's neutral theme.
 * Pure CSS animation, no JS overhead.
 */
export function Loader({
  className,
  size = 'md',
  color = 'currentColor',
}: LoaderProps) {
  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      role="status"
      aria-label="加载中"
    >
      <svg
        className={cn('animate-spin', sizeMap[size])}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
          style={{ color }}
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ color }}
        />
      </svg>
      <span className="sr-only">加载中...</span>
    </div>
  )
}

/**
 * DotsLoader — bouncing dots loading indicator.
 * Inspired by Uiverse.io's popular dot loaders.
 */
export function DotsLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center gap-1.5', className)}
      role="status"
      aria-label="加载中"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s', background: 'var(--color-muted)' }}
        />
      ))}
      <span className="sr-only">加载中...</span>
    </div>
  )
}
