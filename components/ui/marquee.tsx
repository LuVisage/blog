'use client'

import { cn } from '@/lib/utils'

/**
 * Marquee — infinite horizontal scroll ticker.
 * Modern take on the classic marquee, used by Nim, Aceternity UI, and many 2025 portfolios.
 *
 * Usage:
 * ```tsx
 * <Marquee>
 *   {items.map(item => <span key={item}>{item}</span>)}
 * </Marquee>
 * ```
 */
export function Marquee({
  children,
  className,
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
  gradientEdges = true,
}: {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right'
  /** Speed in seconds for one full cycle of the duplicated content */
  speed?: number
  pauseOnHover?: boolean
  gradientEdges?: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden w-full',
        pauseOnHover && '[&:hover_.marquee-content]:[animation-play-state:paused]',
        className
      )}
    >
      {/* Gradient fade edges */}
      {gradientEdges && (
        <>
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-white/80 dark:from-black/50 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-white/80 dark:from-black/50 to-transparent" />
        </>
      )}

      {/* Scrolling track */}
      <div
        className="marquee-content flex items-center gap-8 w-max"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
        }}
      >
        {/* First copy */}
        <div className="flex items-center gap-8 flex-shrink-0">{children}</div>
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8 flex-shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

/**
 * Marquee Item — a separator dot + text, used inside Marquee.
 */
export function MarqueeItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400/40 dark:bg-gray-500/40 flex-shrink-0" />
      {children}
    </span>
  )
}
