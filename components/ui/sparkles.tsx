'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SparkleType {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  delay: number
  duration: number
}

interface SparklesProps {
  children: ReactNode
  className?: string
  /** Number of sparkles. Default 12. */
  count?: number
  /** Sparkle color. Default neutral gray. */
  color?: string
  /** Size range [min, max] in px. Default [12, 24]. */
  sizeRange?: [number, number]
}

/**
 * Sparkles — floating sparkle/twinkle particles around children.
 * Adapted from Aceternity UI's Sparkles component.
 * Pure CSS animation sparkle effect, wraps any element.
 */
export function Sparkles({
  children,
  className,
  count = 12,
  color = '#b0b0c0',
  sizeRange = [12, 24],
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<SparkleType[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const generate = () => {
      const items: SparkleType[] = []
      for (let i = 0; i < count; i++) {
        items.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
          rotation: Math.random() * 360,
          delay: Math.random() * 2,
          duration: 1 + Math.random() * 2,
        })
      }
      setSparkles(items)
    }
    generate()
  }, [count, sizeRange])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Sparkle particles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute pointer-events-none animate-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: `rotate(${s.rotation}deg)` }}
          >
            <path
              d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"
              fill={color}
              opacity={0.6}
            />
          </svg>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes sparkleAnim {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
        }
        .animate-sparkle {
          animation: sparkleAnim 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
