'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

interface MovingBorderProps {
  children: React.ReactNode
  className?: string
  /** Border width in px. Default 2. */
  borderWidth?: number
  /** Duration of one full border rotation (seconds). Default 4. */
  duration?: number
  /** Border gradient colors. Defaults to neutral grays. */
  colors?: string[]
  /** Border radius. Default matches parent via 'rounded-[inherit]'. */
  borderRadius?: string
  /** Container element. Default 'button'. */
  as?: 'button' | 'a' | 'div'
}

/**
 * Moving Border — an animated gradient border that flows around the element.
 * Adapted from Aceternity UI's moving-border component.
 * Uses SVG + Framer Motion for smooth continuous animation.
 */
export function MovingBorder({
  children,
  className,
  borderWidth = 2,
  duration = 4,
  colors = ['#999999', '#bbbbbb', '#888888', '#aaaaaa'],
  borderRadius = '1.75rem',
  as: Tag = 'button',
}: MovingBorderProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  // For continuous rotation
  const pathLength = 100 // simplified — we use percentage-based animation

  return (
    <Tag
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden',
        className
      )}
      style={{ borderRadius }}
    >
      {/* Animated border SVG */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ borderRadius }}
      >
        <motion.svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0"
        >
          <motion.rect
            x="0"
            y="0"
            width="100"
            height="100"
            rx={parseInt(borderRadius) * 3 || 20}
            ry={parseInt(borderRadius) * 3 || 20}
            fill="none"
            strokeWidth={borderWidth}
            stroke="url(#moving-border-gradient)"
            initial={{ pathLength: 0, pathOffset: 0 }}
            animate={{
              pathOffset: [0, 1, 2],
            }}
            transition={{
              pathOffset: {
                duration,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
            style={{
              strokeDasharray: '30 70',
            }}
          />
          <defs>
            <motion.linearGradient
              id="moving-border-gradient"
              animate={{
                x1: ['0%', '100%', '0%'],
                y1: ['0%', '100%', '0%'],
                x2: ['100%', '0%', '100%'],
                y2: ['100%', '0%', '100%'],
              }}
              transition={{
                duration: duration * 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </motion.linearGradient>
          </defs>
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </Tag>
  )
}
