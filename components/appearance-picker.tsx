'use client'

import { useEffect, useRef, useState } from 'react'
import { IconPalette, IconCheck } from '@tabler/icons-react'
import {
  ACCENTS,
  BACKGROUNDS,
  visibleAccents,
  visibleBackgrounds,
  hasSecretUnlocked,
  type AccentId,
  type BackgroundId,
} from '@/lib/accents'
import { useAppearance } from '@/components/appearance-provider'

/**
 * Pointer-reachable counterpart to the palette's appearance commands. The
 * keyboard shortcut is invisible to most visitors, so the presets need a home
 * in the header too.
 */
export function AppearancePicker() {
  const { accent, background, setAccent, setBackground } = useAppearance()
  const [open, setOpen] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => setUnlocked(hasSecretUnlocked()), [])

  useEffect(() => {
    const onUnlock = () => setUnlocked(hasSecretUnlocked())
    window.addEventListener('site:unlock', onUnlock)
    return () => window.removeEventListener('site:unlock', onUnlock)
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const accents = unlocked ? ACCENTS : visibleAccents(false)
  const backgrounds = unlocked ? BACKGROUNDS : visibleBackgrounds(false)

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 sm:w-11 sm:h-11 surface surface-hover flex items-center justify-center cursor-pointer"
        style={{ borderRadius: 10, color: 'var(--muted)', borderColor: open ? 'var(--accent-line)' : undefined }}
        aria-label="外观设置"
        aria-expanded={open}
      >
        <IconPalette size={16} strokeWidth={1.75} />
      </button>

      {open && (
        <div
          className="surface absolute right-0 top-[calc(100%+8px)] z-50 w-[248px] p-4 animate-scale-in"
          style={{ borderRadius: 12, borderColor: 'var(--line-strong)', boxShadow: 'var(--shadow-pop)' }}
        >
          <div className="eyebrow mb-2.5">主题色</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {accents.map((option) => {
              const isActive = option.id === accent
              return (
                <button
                  key={option.id}
                  onClick={() => setAccent(option.id as AccentId)}
                  className="w-7 h-7 flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                  style={{
                    background: option.hsl,
                    borderRadius: 8,
                    boxShadow: isActive ? '0 0 0 2px var(--canvas), 0 0 0 3px var(--ink)' : 'inset 0 0 0 1px var(--line-strong)',
                  }}
                  aria-label={option.label}
                  aria-pressed={isActive}
                  title={option.label}
                >
                  {isActive && <IconCheck size={13} strokeWidth={3} style={{ color: 'var(--on-accent)' }} />}
                </button>
              )
            })}
          </div>

          <div className="eyebrow mb-2.5">背景</div>
          <div className="grid grid-cols-2 gap-1.5">
            {backgrounds.map((option) => {
              const isActive = option.id === background
              return (
                <button
                  key={option.id}
                  onClick={() => setBackground(option.id as BackgroundId)}
                  className="flex flex-col items-start gap-0.5 px-2.5 py-2 cursor-pointer transition-colors"
                  style={{
                    border: `1px solid ${isActive ? 'var(--accent-line)' : 'var(--line)'}`,
                    borderRadius: 8,
                    background: isActive ? 'var(--accent-soft)' : 'transparent',
                  }}
                  aria-pressed={isActive}
                >
                  <span className="text-xs" style={{ color: isActive ? 'var(--ink)' : 'var(--body)' }}>
                    {option.label}
                  </span>
                  <span className="caption" style={{ fontSize: 11 }}>{option.hint}</span>
                </button>
              )
            })}
          </div>

          {!unlocked && (
            <p className="caption mt-3.5 pt-3 rule" style={{ fontSize: 11 }}>
              还有一个隐藏预设，方向键能找到它。
            </p>
          )}
        </div>
      )}
    </div>
  )
}
