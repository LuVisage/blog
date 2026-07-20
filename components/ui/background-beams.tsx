'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Background Beams — Aceternity UI-inspired animated beam paths.
 * Uses SVG paths with gradient strokes that animate to create flowing light beams.
 */
export function BackgroundBeams({
  className,
  beamCount = 6,
  colors = ['rgba(180,180,200,0.12)', 'rgba(200,200,220,0.08)', 'rgba(160,160,180,0.06)'],
}: {
  className?: string
  beamCount?: number
  colors?: string[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const beams = container.querySelectorAll<SVGPathElement>('.beam-path')
    let rafId: number
    const startTime = performance.now()

    function animate(time: number) {
      const elapsed = (time - startTime) * 0.001 // seconds
      beams.forEach((beam, i) => {
        const offset = i * 1.2
        // Smooth oscillation of dashoffset for flowing effect
        const progress = ((elapsed + offset) % 8) / 8
        // Use sin for easing
        const eased = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5
        const dashOffset = eased * (beam.getTotalLength?.() || 200) * 2
        beam.style.strokeDashoffset = String(-dashOffset)
      })
      rafId = requestAnimationFrame(animate)
    }

    // Set initial dasharray
    beams.forEach((beam) => {
      const len = beam.getTotalLength?.() || 200
      beam.style.strokeDasharray = String(len * 1.5)
      beam.style.strokeDashoffset = String(-len * 0.5)
    })

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [beamCount])

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Beam 1 — sweeping curve */}
        <path
          className="beam-path"
          d="M-100,100 C200,50 400,300 600,150 C800,0 1000,200 1300,100"
          stroke={colors[0]}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Beam 2 — opposite curve */}
        <path
          className="beam-path"
          d="M-100,400 C300,500 500,200 700,350 C900,500 1100,300 1300,400"
          stroke={colors[1] || colors[0]}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Beam 3 — shallow wave */}
        <path
          className="beam-path"
          d="M-100,200 C200,150 400,250 600,180 C800,110 1000,220 1300,160"
          stroke={colors[2] || colors[0]}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Beam 4 — steeper wave */}
        <path
          className="beam-path"
          d="M-100,500 C250,350 450,550 700,400 C950,250 1100,450 1300,380"
          stroke={colors[0]}
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Beam 5 — flat wide arc */}
        <path
          className="beam-path"
          d="M-100,300 C300,200 600,400 900,250 C1100,150 1200,300 1300,280"
          stroke={colors[1] || colors[0]}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Beam 6 — diagonal sweep */}
        <path
          className="beam-path"
          d="M200,-50 C350,150 500,350 700,250 C900,150 1050,350 1250,250"
          stroke={colors[2] || colors[0]}
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Glow filters */}
        <defs>
          <filter id="beam-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  )
}
