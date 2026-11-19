'use client'

import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      // 隐藏态若只 opacity:0，键盘会停在一枚看不见的控件上（pointer-events 挡不住键盘），
      // 所以 Tab 序列里也摘出去。
      tabIndex={visible ? 0 : -1}
      className="pressable w-11 h-11 rounded surface flex items-center justify-center fixed bottom-6 right-6 z-50 cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <IconArrowUp size={18} strokeWidth={2} style={{ color: 'var(--ink)' }} />
    </button>
  )
}
