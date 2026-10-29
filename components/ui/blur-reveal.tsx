'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

interface BlurRevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * 标题「模糊聚焦」入场（React Bits Blur Text 形态，自设计登记 §11.10）：
 * filter blur(8px) + translateY(10px) + opacity 0 → 清晰，
 * 500ms cubic-bezier(.16,1,.3,1)（are.na 档案动效曲线）。
 * IO 触发（threshold 0.1）；1.2s 兜底 timer 防 IO/自动化异常导致标题不可见；
 * prefers-reduced-motion 直显。只动 filter/opacity/transform，不触发布局。
 */
export function BlurReveal({ children, className, style }: BlurRevealProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    io.observe(el)
    const timer = window.setTimeout(() => setVisible(true), 1200)
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <h1
      ref={ref}
      className={className}
      style={{
        ...style,
        filter: visible ? 'none' : 'blur(8px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(10px)',
        transition:
          'filter 500ms cubic-bezier(.16,1,.3,1), opacity 500ms cubic-bezier(.16,1,.3,1), transform 500ms cubic-bezier(.16,1,.3,1)',
        willChange: 'filter, opacity, transform',
      }}
    >
      {children}
    </h1>
  )
}
