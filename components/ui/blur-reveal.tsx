import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BlurRevealProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

/**
 * 标题「模糊聚焦」入场（React Bits Blur Text 形态，自设计登记 §11.10）：
 * filter blur(8px) + translateY(10px) + opacity 0 → 清晰，
 * 500ms cubic-bezier(.16,1,.3,1)（are.na 档案动效曲线）。
 *
 * 组件不带状态：入场完全由 `.blur-reveal` 的 `@keyframes blurIn` 播一次（globals.css
 * §11.7 区），静态样式永远是「清晰」那一版，所以写进 HTML 的初态本身就是正确态。
 * 早先这里是 'use client' + IntersectionObserver + 1.2s 兜底 timer，把 `opacity: 0`
 * 烘进了 SSR —— 实测关掉 JS 后 6 篇文章的 h1 全是透明的（台账 §11.18 五）。
 * 反向兜底（初态 true，布局效应里再藏）也不行：首帧清晰、hydration 之后闪回模糊
 * 再入位，比缺陷更难看。和 .sr-char 同一套路子之后，无 JS、脚本被扩展拦掉、hydration
 * 失败三种情况拿到的都是最终态；reduced-motion 由全局守卫把时长与延迟一起清零，直接落位。
 */
export function BlurReveal({ children, className, style }: BlurRevealProps) {
  return (
    <h1 className={cn('blur-reveal', className)} style={style}>
      {children}
    </h1>
  )
}
