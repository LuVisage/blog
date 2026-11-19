'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { IconFlag, IconSparkles, IconX } from '@tabler/icons-react'

export type ToastTone = 'info' | 'secret'

export interface ToastInput {
  label: string
  title: string
  description?: string
  tone?: ToastTone
  /** ms；不传按 tone 默认 */
  duration?: number
}

interface ToastRecord extends ToastInput {
  id: number
  tone: ToastTone
  duration: number
  /** 退场中：先播 200ms 淡出，再摘节点。 */
  leaving?: boolean
}

const TONE_DURATION: Record<ToastTone, number> = { info: 3600, secret: 6800 }
const EXIT_MS = 200

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const seq = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    const auto = timers.current.get(id)
    if (auto) clearTimeout(auto)
    timers.current.set(
      id,
      setTimeout(() => {
        setToasts((list) => list.filter((t) => t.id !== id))
        timers.current.delete(id)
      }, EXIT_MS)
    )
  }, [])

  const push = useCallback(
    (input: ToastInput) => {
      const tone = input.tone ?? 'info'
      const duration = input.duration ?? TONE_DURATION[tone]
      const id = ++seq.current
      // 最多三张叠放：再多会压住页脚链接的悬停与点击。
      setToasts((list) => [...list.slice(-2), { ...input, tone, duration, id }])
      timers.current.set(id, setTimeout(() => dismiss(id), duration))
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      {/* 卡体不吃指针：叠在左下角时正压着页脚链接，只有关闭按钮自己恢复 auto。 */}
      <div
        className="fixed bottom-5 left-4 sm:left-6 z-[70] flex flex-col gap-2 w-[min(320px,calc(100vw-2rem))] pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`surface ${t.leaving ? 'animate-fade-out' : 'animate-fade-up'} pointer-events-none flex items-start gap-3 px-4 py-3.5`}
            style={{ borderRadius: 'var(--radius-xs)', borderTop: '2px solid var(--rule)' }}
          >
            <span className="mt-0.5 flex-shrink-0">
              {t.tone === 'secret' ? (
                <IconSparkles size={16} strokeWidth={1.75} style={{ color: 'var(--accent-text)' }} />
              ) : (
                <IconFlag size={16} strokeWidth={1.75} style={{ color: 'var(--muted)' }} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="eyebrow">{t.label}</div>
              <p
                className="font-serif font-bold mt-1"
                style={{ fontSize: 'var(--text-reading-sm)', lineHeight: 1.4, color: 'var(--ink)' }}
              >
                {t.title}
              </p>
              {t.description && (
                <p className="body-sm mt-1" style={{ fontSize: 'var(--text-code)' }}>{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="关闭提示"
              className="pressable pointer-events-auto flex-shrink-0 -mr-1.5 -mt-1.5 p-1.5 cursor-pointer transition-colors hover:text-[var(--ink)] tint-faint"
            >
              <IconX size={13} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
