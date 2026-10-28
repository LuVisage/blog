import type { CSSProperties, ElementType } from 'react'
import { cn } from '@/lib/utils'

interface SplitRevealProps {
  text: string
  as?: ElementType
  className?: string
  /** 首个字符的延迟（ms）。默认 120，等 hero 上方元素先入场。 */
  delay?: number
  /** 每字符交错步进（ms）。默认 26。 */
  step?: number
}

/**
 * SplitReveal — 标题逐字符入场（Originkit 方向·组件融合自设计登记 SPEC_LEDGER §11.5）。
 * 纯 CSS animation + 交错 delay，SSR 安全、无 JS 依赖；
 * reduced-motion 时动画关闭（globals.css 统一处理）。
 * 读屏以 aria-label 读完整串，逐字 span 对辅助技术隐藏。
 */
export function SplitReveal({
  text,
  as: Tag = 'span',
  className,
  delay = 120,
  step = 26,
}: SplitRevealProps) {
  const chars = Array.from(text)
  return (
    <Tag className={cn('split-reveal', className)} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="sr-char"
          style={{ '--i': i, '--d': `${delay + i * step}ms` } as CSSProperties}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </Tag>
  )
}
