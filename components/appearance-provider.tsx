'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  ACCENT_STORAGE_KEY,
  BACKGROUND_STORAGE_KEY,
  DEFAULT_ACCENT,
  DEFAULT_BACKGROUND,
  isAccentId,
  isBackgroundId,
  type AccentId,
  type BackgroundId,
} from '@/lib/accents'

interface AppearanceValue {
  accent: AccentId
  background: BackgroundId
  setAccent: (next: AccentId) => void
  setBackground: (next: BackgroundId) => void
}

const AppearanceContext = createContext<AppearanceValue | null>(null)

/** Mirrors the pre-paint script in layout.tsx: violet is the CSS default. */
function applyAccent(accent: AccentId) {
  const root = document.documentElement
  if (accent === DEFAULT_ACCENT) root.removeAttribute('data-accent')
  else root.setAttribute('data-accent', accent)
}

function applyBackground(background: BackgroundId) {
  const root = document.documentElement
  if (background === DEFAULT_BACKGROUND) root.removeAttribute('data-bg')
  else root.setAttribute('data-bg', background)
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<AccentId>(DEFAULT_ACCENT)
  const [background, setBackgroundState] = useState<BackgroundId>(DEFAULT_BACKGROUND)

  // The pre-paint script already put the right attributes on <html>. Adopt them
  // rather than re-reading storage, so a disabled-JS paint and this tree agree.
  useEffect(() => {
    const root = document.documentElement
    const resolvedAccent = isAccentId(root.dataset.accent) ? root.dataset.accent : DEFAULT_ACCENT
    const resolvedBg = isBackgroundId(root.dataset.bg) ? root.dataset.bg : DEFAULT_BACKGROUND
    setAccentState(resolvedAccent)
    setBackgroundState(resolvedBg)
    applyAccent(resolvedAccent)
    applyBackground(resolvedBg)
  }, [])

  const setAccent = useCallback((next: AccentId) => {
    setAccentState(next)
    applyAccent(next)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, next)
    } catch {
      /* private mode — the session still gets the change */
    }
  }, [])

  const setBackground = useCallback((next: BackgroundId) => {
    setBackgroundState(next)
    applyBackground(next)
    try {
      localStorage.setItem(BACKGROUND_STORAGE_KEY, next)
    } catch {
      /* same */
    }
  }, [])

  return (
    <AppearanceContext.Provider value={{ accent, background, setAccent, setBackground }}>
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance(): AppearanceValue {
  const ctx = useContext(AppearanceContext)
  if (!ctx) throw new Error('useAppearance must be used inside <AppearanceProvider>')
  return ctx
}
