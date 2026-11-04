'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)

/** 与 CSS 的 --ease-out 同一条曲线（文档 §11.1 的 cubic-bezier(0.16, 1, 0.3, 1)）。 */
const DNA_EASE = CustomEase.create('dnaEaseProse', 'M0,0 C0.16,1 0.3,1 1,1')

/**
 * 下钻到真正的正文块。
 *
 * CodeBlockEnhancer（以及 MDX 外壳）会在 `.prose` 里再套一层只有单个子元素的 div，
 * 直接取 `root.children` 只会拿到那一个包裹层 —— 于是整篇文章被当成一块淡入，
 * 段落级渐入实际是失效的（第 7 轮复核发现）。逐层下钻比写死 `:scope > div > *` 稳。
 */
function blockChildren(root: HTMLElement): HTMLElement[] {
  let node = root
  for (let depth = 0; depth < 4; depth++) {
    const kids = Array.from(node.children) as HTMLElement[]
    if (kids.length === 1 && kids[0].tagName === 'DIV') {
      node = kids[0]
      continue
    }
    return kids
  }
  return Array.from(node.children) as HTMLElement[]
}

/**
 * 阅读面段落级渐入。
 *
 * 契约：只动 opacity + transform；单条 400ms、批内步进 40ms、总窗口 ≤500ms
 * （SPEC_LEDGER §1.8.2 的档位）。文档没有描述段落级编排，故属 [文档外] 签名动效，
 * 依据见 SPEC_LEDGER §1.8.4。
 *
 * 初态只在 JS 里设置，且只给首屏之下的块设置：视口内的段落不参与渐入，
 * 免得先看见再被抹掉重演一遍（闪烁）。无 JS、或系统开启「减少动态效果」时，
 * 正文照常完全可见。
 */
export function ProseReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const belowFold = blockChildren(root).filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    )
    if (belowFold.length === 0) return

    let detach: () => void = () => {}

    const ctx = gsap.context(() => {
      gsap.set(belowFold, { opacity: 0, y: 14 })
      ScrollTrigger.batch(belowFold, {
        start: 'top 88%',
        once: true,
        // 每批最多 4 个元素，避免长文一次性把整页拉起来
        batchMax: 4,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.04,
            ease: DNA_EASE,
            overwrite: true,
          }),
      })

      // 正文块里也有可聚焦的东西（行内链接、代码块复制钮、<summary>）。批处理的
      // 位置同样是挂载时算的，Tab 一步跳过去未必越线 —— 焦点落进哪一块就先把哪一块
      // 点亮，不让人停在 opacity:0 的内容上（WCAG 2.4.7）。
      // set 而不是 tween：浏览器的「聚焦即滚动」发生在 focusin 之前，量的是聚焦
      // 那一刻的视觉盒，tween 期间这块还在挪 —— 落点自然对不上。
      const revealOnFocus = (e: FocusEvent) => {
        const t = e.target
        if (!(t instanceof Element)) return
        const block = belowFold.find((b) => b.contains(t))
        if (!block || Number(getComputedStyle(block).opacity) > 0.99) return
        ctx.add(() => gsap.set(block, { opacity: 1, y: 0, clearProps: 'transform' }))
        // 同 AnimatedContent：set 之后若这一格已经不在视口里，重新滚进来；
        // 无条件补等量 scrollBy 会把一大片焦点站推出视口。
        const r = t.getBoundingClientRect()
        if (r.top < 0 || r.bottom > window.innerHeight) {
          t.scrollIntoView({ block: 'center', behavior: 'instant' })
        }
      }
      root.addEventListener('focusin', revealOnFocus)
      detach = () => root.removeEventListener('focusin', revealOnFocus)
    }, root)

    return () => {
      detach()
      ctx.revert()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
