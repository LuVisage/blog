'use client'

import { useEffect, useRef, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [obscured, setObscured] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // WCAG 2.4.11：固定角钮会盖住落在右下角的焦点站（页脚链接、代码块复制钮）。
  // 焦点与它相交期间让位（连 Tab 序列一起摘），焦点离开或滚走再回来。
  useEffect(() => {
    const check = () => {
      const el = document.activeElement
      const btn = btnRef.current
      if (!btn || !el || el === btn || el === document.body || el === document.documentElement) {
        setObscured(false)
        return
      }
      const a = el.getBoundingClientRect()
      const b = btn.getBoundingClientRect()
      setObscured(a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
    }
    check()
    window.addEventListener('focusin', check)
    window.addEventListener('focusout', check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('focusin', check)
      window.removeEventListener('focusout', check)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  const show = visible && !obscured

  return (
    <button
      ref={btnRef}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      // 隐藏态若只 opacity:0，键盘会停在一枚看不见的控件上（pointer-events 挡不住键盘），
      // 所以 Tab 序列里也摘出去。
      tabIndex={show ? 0 : -1}
      className="pressable w-11 h-11 border border-[var(--rule)] bg-[var(--surface)] flex items-center justify-center fixed bottom-6 right-6 z-50 cursor-pointer transition-colors hover:border-[var(--accent)]"
      style={{
        opacity: show ? 1 : 0,
        // 隐藏态不能位移：让位判定按矩形相交，藏起来时若下滑 20px，矩形会移出
        // 相交区→判「没盖」→回来→再判「盖」→自激振荡，量到的永远是可见相。
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <IconArrowUp size={18} strokeWidth={2} style={{ color: 'var(--ink)' }} />
    </button>
  )
}
