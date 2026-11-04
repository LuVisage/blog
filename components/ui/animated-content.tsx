'use client'

import { useRef, type ReactNode, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, CustomEase)

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

    let detachFocusReveal: () => void = () => {}

    const ctx = gsap.context(() => {
      const targets = stagger > 0 ? Array.from(el.children) : el
      const to = getToVars(direction)
      const tw = gsap.fromTo(targets, getFromVars(), {
        ...to,
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

      // 焦点落进这一块，就把手里的入场直接做完，不再赌滚动有没有越线。
      // ScrollTrigger 的 start 是初始化时按当时布局算的，字体/图片回流后会偏；
      // 纯键盘一路 Tab 下去实测到过一格在 380ms 与 1580ms 两个采样点都还是
      // opacity:0 —— 焦点环画在透明块上，WCAG 2.4.7 不认。
      // 用 set 而不是补一段 tween：浏览器的「聚焦即滚动」发生在 focusin **之前**，
      // 它按聚焦那一刻的视觉盒（还带着入场位移）决定滚到哪；再动就是我们自己把
      // 刚聚焦的那一格挪走。
      const revealNow = (e: FocusEvent) => {
        const t = e.target instanceof Element ? e.target : null
        tw.scrollTrigger?.kill()
        tw.kill()
        ctx.add(() => gsap.set(targets, to))
        detachFocusReveal()
        // 上面那次 set 可能把刚聚焦的一格抬出视口（/learn/ml/day-10/ 的复制钮实测
        // 定在 y=-170 达 3.6s）。只在它真的不在视口里时重新滚进来 —— 无条件补一次
        // 等量 scrollBy 是错的：真按 Tab 走全站，34 格被这条补滚推出视口（Lenis 在
        // 飞的时候原生滚动会被它接管，补的量和落点都对不上）。
        if (t) {
          const r = t.getBoundingClientRect()
          if (r.top < 0 || r.bottom > window.innerHeight) {
            t.scrollIntoView({ block: 'center', behavior: 'instant' })
          }
        }
      }
      el.addEventListener('focusin', revealNow)
      detachFocusReveal = () => el.removeEventListener('focusin', revealNow)

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

    return () => {
      detachFocusReveal()
      ctx.revert()
    }
  }, [direction, distance, duration, delay, once, stagger, parallax])

  return (
    <div ref={revealRef} className={cn(className)}>
      {parallax > 0 ? <div ref={driftRef}>{children}</div> : children}
    </div>
  )
}
