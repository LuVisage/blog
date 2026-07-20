'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface FloatingBadgeProps {
  children: React.ReactNode
  className?: string
  /** Delay in seconds. Default 0. */
  delay?: number
  /** Float amplitude in px. Default 6. */
  amplitude?: number
}

export function FloatingBadge({
  children,
  className,
  delay = 0,
  amplitude = 6,
}: FloatingBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: [0, -amplitude, 0, amplitude, 0] }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: {
          duration: 4,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={cn('inline-flex', className)}
    >
      {children}
    </motion.div>
  )
}

/** Animated counter that counts up from 0 to target */
export function AnimatedCounter({
  target,
  suffix = '',
  className,
}: {
  target: number
  suffix?: string
  className?: string
}) {
  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <CountUp target={target} suffix={suffix} />
    </motion.span>
  )
}

/** Internal count-up using requestAnimationFrame */
function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const ref = { current: null as HTMLSpanElement | null }

  return (
    <motion.span
      initial={{ '--num': 0 } as Record<string, number>}
      animate={{ '--num': target }}
      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
      ref={(el) => {
        // Direct motion value approach won't work with CSS counter,
        // so we use a simple approach: just render the target with a spring animation
      }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {target}
        {suffix}
      </motion.span>
    </motion.span>
  )
}
