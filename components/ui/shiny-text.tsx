'use client'

import { cn } from '@/lib/utils'

/**
 * ShinyText — ReactBits-inspired metallic shine sweep.
 * A highlight band sweeps across the text periodically,
 * giving it a polished metallic/chrome appearance.
 */
export function ShinyText({
  children,
  className,
  as: Tag = 'span',
  speed = 3,
  color = 'rgba(255,255,255,0.5)',
}: {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div'
  speed?: number
  color?: string
}) {
  return (
    <Tag
      className={cn('shiny-text relative inline-block', className)}
      style={{
        backgroundImage: `linear-gradient(110deg, transparent 30%, ${color} 45%, ${color} 50%, transparent 56%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: `shiny-sweep ${speed}s linear infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes shiny-sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </Tag>
  )
}

/**
 * AnimatedGradientText — flowing gradient text.
 * Multiple gradient colors cycle through the text.
 */
export function AnimatedGradientText({
  children,
  className,
  as: Tag = 'span',
  speed = 4,
  colors = ['#999999', '#777777', '#bbbbbb', '#888888', '#aaaaaa'],
}: {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div'
  speed?: number
  colors?: string[]
}) {
  const gradientColors = colors.join(', ')
  return (
    <Tag
      className={cn('gradient-text-flow inline-block', className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradientColors})`,
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: `gradient-flow ${speed}s ease infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </Tag>
  )
}
