'use client'

import { useEffect, useRef } from 'react'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#_'

/**
 * ScrambleText — 解密文字（React Bits Scrambled/Decrypted 形态，自设计登记 §11.6）。
 * hover 时字符乱码翻滚、逐位揭示原文；离开立即还原。
 * 纯文本节点渲染，rAF 驱动；reduced-motion / 触屏直接显示原文。
 */
export function ScrambleText({
  text,
  className,
  speed = 2,
  tickMs = 24,
}: {
  text: string
  className?: string
  /** 每多少 tick 揭示一个字符。默认 2。 */
  speed?: number
  /** 单 tick 毫秒。默认 24。 */
  tickMs?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef(0)
  const startRef = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    // 中文等 CJK 标题不做符号乱码（跳读廉价感），直接显示原文
    if (/[\u4e00-\u9fff]/.test(text)) return
    const el = ref.current
    if (!el) return

    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const revealed = Math.min(text.length, Math.floor(elapsed / (tickMs * speed)))
      let out = ''
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') out += ' '
        else if (i < revealed) out += text[i]
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      el.textContent = out
      if (revealed < text.length) rafRef.current = requestAnimationFrame(tick)
      else el.textContent = text
    }

    const startAnim = () => {
      cancelAnimationFrame(rafRef.current)
      startRef.current = performance.now()
      rafRef.current = requestAnimationFrame(tick)
    }
    const stopAnim = () => {
      cancelAnimationFrame(rafRef.current)
      el.textContent = text
    }

    el.addEventListener('pointerenter', startAnim)
    el.addEventListener('pointerleave', stopAnim)
    return () => {
      el.removeEventListener('pointerenter', startAnim)
      el.removeEventListener('pointerleave', stopAnim)
      cancelAnimationFrame(rafRef.current)
    }
  }, [text, speed, tickMs])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  )
}
