import type { CSSProperties, ReactNode } from 'react'

interface StatsTileProps {
  value: number | ReactNode
  label: string
  suffix?: string
}

/** 滚筒的十格，从上到下 0…9；-digit*1em 正好停在目标那一格。 */
const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * One figure in a ledger row — deliberately not a card.
 * 数字以「翻板滚筒」落地（§11.7）：每位数字从 0 沿数字列滚到目标位
 * （1200ms，§1.8 档位），替代早期 count-up。
 * 滚筒是纯视觉，真值走 sr-only 文本，读屏拿到的永远是准确数字。
 *
 * 滚法交给 CSS：`--digit` 直接写目标位，`.flip-reel` 的静态样式就是终点，
 * `@keyframes reelRoll` 只补一个 `from { translateY(0) }`，缺 100% 关键帧时浏览器
 * 拿底样收敛（globals.css §11.7 区）。早先是 'use client' 里先把 `--digit` 归 0、
 * 进视口再改回来 —— 于是 SSR 的 HTML 存的就是 0，关掉 JS 首页计量条写着「文章 0 /
 * 分类 0」，sr-only 却在念真值（台账 §11.18 五）。现在这份 HTML 不可能出错：
 * 无 JS、reduced-motion、hydration 失败三种情况拿到的都是落定的数字，动画只是装饰。
 */
export function StatsTile({ value, label, suffix = '' }: StatsTileProps) {
  const isNumber = typeof value === 'number'
  const digits = isNumber ? String(value).split('').map(Number) : null

  return (
    <div>
      <div
        className="flip-digits font-serif font-bold leading-none tabular-nums"
        style={{ fontSize: 'var(--text-h2)', color: 'var(--ink)', letterSpacing: 'var(--tracking-heading)' }}
        aria-hidden={isNumber ? true : undefined}
      >
        {isNumber ? (
          <>
            {digits?.map((d, i) => (
              <span key={i} className="flip-digit" style={{ '--digit': d } as CSSProperties}>
                <span className="flip-reel">
                  {DIGITS.map((cell) => (
                    <span key={cell} className="flip-cell">{cell}</span>
                  ))}
                </span>
              </span>
            ))}
            {suffix && <span>{suffix}</span>}
          </>
        ) : (
          <>
            {value}
            {suffix}
          </>
        )}
      </div>
      {isNumber && <span className="sr-only">{value}{suffix}</span>}
      <div className="eyebrow mt-2">{label}</div>
    </div>
  )
}

/** Ledger of figures, separated by hairlines. */
export function StatsTileRow({ children }: { children: ReactNode }) {
  const items = Array.isArray(children) ? children.flat() : [children]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6">
      {items.map((child, i) => (
        <div key={i} className="cell-rule">
          {child}
        </div>
      ))}
    </div>
  )
}
