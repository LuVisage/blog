'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/** Pure CSS animated background — subtle sparkles, light orbs, and grid texture */
export function BackgroundDecor() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      {/* Gradient light orbs — barely visible atmosphere */}
      <div className="bg-pattern" />
      <div className="bg-grid" />

      {/* Subtle white sparkles — far fewer, barely there */}
      <Sparkle size={5} top="10%" left="15%" delay="0s" duration="3s" color="rgba(255,255,255,0.35)" />
      <Sparkle size={3} top="25%" left="75%" delay="0.5s" duration="2.5s" color="rgba(255,255,255,0.25)" />
      <Sparkle size={4} top="60%" left="10%" delay="1s" duration="4s" color="rgba(255,255,255,0.30)" />
      <Sparkle size={3} top="70%" left="85%" delay="1.5s" duration="3.5s" color="rgba(255,255,255,0.25)" />
      <Sparkle size={4} top="35%" left="50%" delay="0.8s" duration="2.8s" color="rgba(255,255,255,0.30)" />

      {/* Larger floating orbs — nearly invisible */}
      <FloatingOrb size={120} top="10%" left="80%" delay="0s" color="rgba(255,255,255,0.03)" />
      <FloatingOrb size={80} top="60%" left="5%" delay="2s" color="rgba(255,255,255,0.025)" />
      <FloatingOrb size={100} top="85%" left="70%" delay="4s" color="rgba(255,255,255,0.02)" />

      {/* Corner decorations */}
      <CornerDecor />
    </div>
  )
}

/** Twinkling star/sparkle */
function Sparkle({ size, top, left, delay, duration, color }: {
  size: number
  top: string
  left: string
  delay: string
  duration: string
  color: string
}) {
  return (
    <div
      className="absolute animate-twinkle"
      style={{
        width: size,
        height: size,
        top,
        left,
        animationDelay: delay,
        animationDuration: `${Math.random() * 2 + 1.5}s`,
        filter: `blur(${size > 5 ? '0.5px' : '0px'})`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 0l3.09 6.26L22 7.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 12.14 2 7.27l6.91-1.01z" />
      </svg>
    </div>
  )
}

/** Large soft floating orb */
function FloatingOrb({ size, top, left, delay, color }: {
  size: number
  top: string
  left: string
  delay: string
  color: string
}) {
  return (
    <div
      className="absolute rounded-full animate-float"
      style={{
        width: size,
        height: size,
        top,
        left,
        animationDelay: delay,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(20px)',
      }}
    />
  )
}

/** Decorative corner elements */
function CornerDecor() {
  return (
    <>
      {/* Top-left corner subtle branch */}
      <div className="absolute top-0 left-0 opacity-15 dark:opacity-08" style={{ transform: 'rotate(180deg)' }}>
        <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
          <path d="M0 0 C30 20, 50 60, 80 50 C100 40, 120 -10, 140 20 C160 50, 120 80, 100 90" stroke="#999999" strokeWidth="2" fill="none" opacity="0.5" />
          <circle cx="140" cy="18" r="8" fill="#bbbbbb" opacity="0.4" />
          <circle cx="90" cy="42" r="6" fill="#aaaaaa" opacity="0.3" />
          <circle cx="120" cy="10" r="5" fill="#cccccc" opacity="0.25" />
        </svg>
      </div>

      {/* Bottom-right corner stars */}
      <div className="absolute bottom-0 right-0 opacity-15 dark:opacity-10">
        <svg width="160" height="160" viewBox="0 0 200 200" fill="none">
          <path d="M160 120l8 2-2 8zm20-40l12 3-3 12zm-80 90l6 1.5-1.5 6zm50-20l10 2.5-2.5 10z" stroke="#999999" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="170" cy="110" r="3" fill="#bbbbbb" opacity="0.3" />
          <circle cx="140" cy="140" r="2" fill="#aaaaaa" opacity="0.2" />
        </svg>
      </div>
    </>
  )
}
