'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IconAward, IconSparkles, IconFlag, IconX } from '@tabler/icons-react'

export type ToastTone = 'info' | 'achievement' | 'secret'

export interface ToastInput {
  label: string
  title: string
  description?: string
  tone?: ToastTone
  /** ms; omit for the tone default */
  duration?: number
}

interface ToastRecord extends Required<Omit<ToastInput, 'description'>> {
  id: number
  description?: string
}

const TONE_DURATION: Record<ToastTone, number> = {
  info: 3600,
  achievement: 5200,
  secret: 6800,
}

function ToneIcon({ tone }: { tone: ToastTone }) {
  const props = { size: 16, strokeWidth: 1.75 }
  if (tone === 'secret') return <IconSparkles {...props} style={{ color: 'var(--accent-text)' }} />
  if (tone === 'achievement') return <IconAward {...props} style={{ color: 'var(--accent-text)' }} />
  return <IconFlag {...props} style={{ color: 'var(--muted)' }} />
}

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const seq = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (toast: ToastInput) => {
      const tone = toast.tone ?? 'info'
      const id = ++seq.current
      setToasts((current) => [...current.slice(-2), { ...toast, tone, duration: toast.duration ?? TONE_DURATION[tone], id }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), toast.duration ?? TONE_DURATION[tone])
      )
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="fixed bottom-5 left-4 sm:left-6 z-[70] flex flex-col gap-2 w-[min(320px,calc(100vw-2rem))] pointer-events-none"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="surface animate-fade-up pointer-events-auto flex items-start gap-3 px-4 py-3.5"
            style={{ borderRadius: 10 }}
          >
            <span className="mt-0.5 flex-shrink-0">
              <ToneIcon tone={toast.tone} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="eyebrow">{toast.label}</div>
              <p
                className="font-serif font-bold mt-1"
                style={{ fontSize: 15, lineHeight: 1.4, color: 'var(--ink)' }}
              >
                {toast.title}
              </p>
              {toast.description && (
                <p className="body-sm mt-1" style={{ fontSize: 13 }}>{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="flex-shrink-0 -mr-1.5 -mt-1.5 p-1.5 cursor-pointer transition-colors hover:text-[var(--ink)]"
              style={{ color: 'var(--faint)' }}
              aria-label="关闭提示"
            >
              <IconX size={13} strokeWidth={2} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
