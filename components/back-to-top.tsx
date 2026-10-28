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
      className="pressable w-11 h-11 rounded surface flex items-center justify-center fixed bottom-6 right-6 z-50 transition-all duration-300 cursor-pointer"
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
