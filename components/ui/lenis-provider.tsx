'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LenisContext = createContext<Lenis | null>(null)

/** 树内取 Lenis 实例（TOC / 回顶 / 命令面板锁滚动用）；未启用时返回 null，调用方回退原生路径。 */
export function useLenis() {
  return useContext(LenisContext)
}

/**
 * LenisProvider — 全站平滑滚动（React Bits / Lenis 形态，组件融合自设计登记 §11.6）。
 * 惯性滚动 + 与 GSAP ScrollTrigger 联动（lenis scroll → ScrollTrigger.update）。
 * reduced-motion 或触屏环境不启用（触屏浏览器原生惯性已足够）。
 * 实例经 React Context 下发（不依赖全局通道）；样式见 globals.css §11.6。
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const l = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    })
    // 双通道：Context（React 树内）+ 全局兜底（供非树内代码使用）
    ;(window as unknown as { __lenis?: Lenis }).__lenis = l
    l.on('scroll', ScrollTrigger.update)
    setLenis(l)

    return () => {
      if ((window as unknown as { __lenis?: Lenis }).__lenis === l) {
        ;(window as unknown as { __lenis?: Lenis }).__lenis = undefined
      }
      l.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
