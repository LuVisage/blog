'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/** 与 CSS 的 --ease-out 同一条曲线：cubic-bezier(0.16, 1, 0.3, 1)。 */
const SOFT_EASE = CustomEase.create('dnaEaseSoft', 'M0,0 C0.16,1 0.3,1 1,1')

/**
 * 阅读面的滚动入场 —— 第 20 轮的轻版。
 *
 * 第 19 轮删掉的是「整段文字随滚动淡入」：文字被按在 opacity:0 上，
 * Ctrl+F、页内查找、打印拿到的都是一份被藏起来的文档，那确实是反模式。
 * 这一版只挑**非正文段落**的块（图、代码块、引语、表格、章节标题），
 * 初态也只是 opacity 0.62 / 位移 10px，条目本身一直可读；
 * 段落、列表、行内文字一概不碰。
 *
 * 只处理首屏之下的目标，视口内的块不参与，避免「先看见再被抹掉重演」。
 * 无 JS、reduced-motion 时正文照常完整呈现。
 */
export function ProseReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>('figure, pre, blockquote, table, h2, h3, .katex-display')
    ).filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0.62, y: 10 })
      ScrollTrigger.batch(targets, {
        start: 'top 92%',
        once: true,
        batchMax: 3,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: SOFT_EASE,
            overwrite: true,
          }),
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
