'use client'

import { useEffect, useState } from 'react'
import { IconArrowUp } from '@tabler/icons-react'
import { useLenis } from '@/components/ui/lenis-provider'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = () => {
    // §11.6/§11.7：平滑滚动体系内用 Lenis 回顶，避免与原生 smooth 竞争
    if (lenis) lenis.scrollTo(0, { duration: 1.2 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={handleClick}
      aria-label="回到顶部"
      // 隐藏态只是 opacity:0 —— 按钮还留在 Tab 序列里，键盘用户会停在一枚看不见的
      // 控件上，焦点环无处可画（WCAG 2.4.7 要求焦点指示可见）。pointer-events:none
      // 挡得住鼠标，挡不住键盘，所以序列里也得把它摘出去。
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
