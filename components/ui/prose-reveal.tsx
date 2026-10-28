'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger)

/** 与 CSS 的 --ease-out 同一条曲线（文档 §11.1 的 cubic-bezier(0.16, 1, 0.3, 1)）。 */
const DNA_EASE = CustomEase.create('dnaEaseProse', 'M0,0 C0.16,1 0.3,1 1,1')

/**
 * 阅读面段落级渐入。
 *
 * 目标：容器的直接子元素（标题、段落、引用、代码块、表格、列表），随滚动分批进场。
 * 契约：只动 opacity + transform；单条 400ms、批内步进 40ms、总窗口 ≤500ms
 * （SPEC_LEDGER §1.8.2 的档位）。文档没有描述段落级编排，故属 [文档外] 签名动效，
 * 依据见 SPEC_LEDGER §1.8.4。
 *
 * 初态只在 JS 里设置：无 JS、或系统开启「减少动态效果」时，正文照常完全可见。
 */
export function ProseReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const targets = Array.from(root.children) as HTMLElement[]
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(targets, {
        start: 'top 88%',
        once: true,
        // 每批最多 4 个元素，避免长文一次性把整页拉起来
        batchMax: 4,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: DNA_EASE, overwrite: true }
          ),
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
