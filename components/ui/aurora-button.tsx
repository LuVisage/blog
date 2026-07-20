'use client'

import { cn } from '@/lib/utils'

interface AuroraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render as a link. */
  href?: string
  /** Button variant. Default 'primary'. */
  variant?: 'primary' | 'glass' | 'outline'
  /** Size. Default 'md'. */
  size?: 'sm' | 'md' | 'lg'
  /** External link (opens in new tab). */
  external?: boolean
}

/**
 * AuroraButton — a glass-morphism button with aurora gradient hover effect.
 * Inspired by Uiverse.io's "Button Mastery" (highest-rated aurora button).
 * Adapted to match the blog's neutral glass aesthetic.
 */
export function AuroraButton({
  children,
  className,
  href,
  variant = 'primary',
  size = 'md',
  external,
  ...props
}: AuroraButtonProps) {
  const baseClasses =
    'relative inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 overflow-hidden group'

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600',
      'text-white shadow-lg shadow-black/10',
      'hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
      // Aurora overlay on hover
      'before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
      'before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_70%),radial-gradient(circle_at_80%_50%,rgba(200,200,220,0.2),transparent_60%)]',
      'hover:before:opacity-100',
    ].join(' '),
    glass: [
      'bg-white/50 dark:bg-white/10',
      'border border-white/20 dark:border-white/10',
      'text-gray-800 dark:text-gray-200',
      'shadow-sm hover:shadow-md',
      'hover:border-white/30 dark:hover:border-white/15 hover:-translate-y-0.5',
      'backdrop-blur-sm',
      // Subtle aurora sheen
      'before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
      'before:bg-[radial-gradient(circle_at_30%_20%,rgba(200,200,220,0.15),transparent_60%)]',
      'hover:before:opacity-100',
    ].join(' '),
    outline: [
      'border-2 border-gray-300 dark:border-white/15',
      'text-gray-700 dark:text-gray-300',
      'hover:border-gray-400 dark:hover:border-white/25',
      'hover:bg-white/40 dark:hover:bg-white/5 hover:-translate-y-0.5',
    ].join(' '),
  }

  const classes = cn(baseClasses, sizeClasses[size], variantClasses[variant], className)

  if (href) {
    const isExternal = external ?? (href.startsWith('http') || href.startsWith('mailto:'))
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
