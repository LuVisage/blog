'use client'

import { type ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface BentoGridProps {
  children: ReactNode
  className?: string
  /** Number of columns on md+. Default 3. */
  cols?: 2 | 3 | 4
}

export function BentoGrid({ children, className, cols = 3 }: BentoGridProps) {
  const colClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[cols]

  return (
    <div className={cn('grid gap-3 sm:gap-4 auto-rows-min', colClass, className)}>
      {children}
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  /** Span columns on md+. Default 1. */
  colSpan?: 1 | 2 | 3
  /** Span rows. Default 1. */
  rowSpan?: 1 | 2
  /** Delay index for staggered animation. */
  index?: number
}

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
  index = 0,
}: BentoCardProps) {
  const colSpanClass = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
  }[colSpan]

  const rowSpanClass = {
    1: '',
    2: 'md:row-span-2',
  }[rowSpan]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'rounded-2xl card p-4 sm:p-6 overflow-hidden relative group',
        colSpanClass,
        rowSpanClass,
        className
      )}
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-white/5 dark:to-white/[0.02]" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}
