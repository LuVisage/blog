'use client'

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'

/**
 * 跟手柔光：给标记了 `data-glow` 的行/卡片补一层极淡的径向高亮。
 *
 * 第 18 轮下线的是「聚光卡片」那种 260px indigo 光斑 + 跟手缩放 + 唯一阴影，
 * 它会把文字压在光里；这一版只有一层 `--row-glow`（强度与配色住在令牌里），
 * 鼠标坐标经 rAF 节流写进两个自定义属性，背景本身不随每帧重绘布局。
 * 事件委托挂在 document 上，一个页面只有一份监听器；触屏与 reduced-motion 直接不注册。
 */
export function GlowRows() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let pending: { el: HTMLElement; x: number; y: number } | null = null

    const apply = () => {
      raf = 0
      if (!pending) return
      const { el, x, y } = pending
      el.style.setProperty('--glow-x', `${x}px`)
      el.style.setProperty('--glow-y', `${y}px`)
    }

    const onMove = (e: MouseEvent) => {
      const t = e.target instanceof Element ? e.target.closest<HTMLElement>('[data-glow]') : null
      if (!t) return
      const r = t.getBoundingClientRect()
      pending = { el: t, x: e.clientX - r.left, y: e.clientY - r.top }
      if (!raf) raf = requestAnimationFrame(apply)
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}

/**
 * 刊头轻视差：只动 transform，位移封顶 `max` px，滚动联动不过渡。
 * 不改 opacity，SSR 与无 JS 拿到的都是最终态，不会先闪一下再入位。
 */
export function Parallax({
  children,
  max = 48,
  className,
  style,
}: {
  children: ReactNode
  max?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const el = ref.current
        if (!el) return
        const y = Math.min(max, window.scrollY * 0.16)
        el.style.transform = `translate3d(0, ${-y}px, 0)`
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [max])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
