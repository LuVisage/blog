'use client'

import { useRef, type ReactNode, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

/**
 * 文档 §11.1 的缓动 `cubic-bezier(0.16, 1, 0.3, 1)` 在 GSAP 侧等价实现，
 * 让 CSS 的 --ease-out 与 JS 动效用同一条曲线（SPEC_LEDGER §1.8.2）。
 */
const DNA_EASE = CustomEase.create('dnaEase', 'M0,0 C0.16,1 0.3,1 1,1')

/** §1.8.4：视差位移上限，取台账 §1.4 的外推档 48px，不新增档位。 */
const PARALLAX_MAX = 48

interface AnimatedContentProps {
  children: ReactNode
  className?: string
  /** Animation direction. Default 'up'. */
  direction?: 'up' | 'down' | 'left' | 'right'
  /** Animation distance in px. Default 24. */
  distance?: number
  /** Animation duration in seconds. Default 0.4（文档 §11.1 的 400ms 档）。 */
  duration?: number
  /** Delay in seconds. Default 0. */
  delay?: number
  /** Whether to animate only once. Default true. */
  once?: boolean
  /** 子项逐个入场的秒数步进。0 表示整块入场（CSS 的 .stagger 是首选做法）。 */
  stagger?: number
  /**
   * 随滚动上移的像素数（0 = 关闭）。属 [文档外] 签名动效，
   * 只用在首页刊头，位移上限 PARALLAX_MAX，依据见 SPEC_LEDGER §1.8.4。
   */
  parallax?: number
}

/**
 * AnimatedContent — reveals content with a slide + fade using GSAP ScrollTrigger.
 * 档位与缓动全部来自设计文档，见 SPEC_LEDGER §1.8。
 */
export function AnimatedContent({
  children,
  className,
  direction = 'up',
  distance = 24,
  duration = 0.4,
  delay = 0,
  once = true,
  stagger = 0,
  parallax = 0,
}: AnimatedContentProps) {
  const revealRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = revealRef.current
    if (!el) return

    // Respect reduced motion：连视差一起跳过，不做任何注册。
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0 })
      return
    }

    const getFromVars = () => {
      switch (direction) {
        case 'up': return { y: distance, opacity: 0 }
        case 'down': return { y: -distance, opacity: 0 }
        case 'left': return { x: distance, opacity: 0 }
        case 'right': return { x: -distance, opacity: 0 }
      }
    }

    const getToVars = (dir: 'up' | 'down' | 'left' | 'right') => {
      switch (dir) {
        case 'up': case 'down': return { y: 0, opacity: 1 }
        case 'left': case 'right': return { x: 0, opacity: 1 }
      }
    }

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : el
      gsap.fromTo(targets, getFromVars(), {
        ...getToVars(direction),
        duration,
        delay,
        stagger,
        ease: DNA_EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once,
        },
      })

      // 刊头视差：滚动联动（scrub），只动 transform，幅值封顶 PARALLAX_MAX。
      if (parallax > 0 && driftRef.current) {
        gsap.to(driftRef.current, {
          y: -Math.min(parallax, PARALLAX_MAX),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: '+=420',
            scrub: true,
          },
        })
      }
    }, el)

    return () => ctx.revert()
  }, [direction, distance, duration, delay, once, stagger, parallax])

  return (
    <div ref={revealRef} className={cn(className)}>
      {parallax > 0 ? <div ref={driftRef}>{children}</div> : children}
    </div>
  )
}
