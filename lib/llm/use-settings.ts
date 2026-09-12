'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { DEFAULT_SETTINGS, eraseSettings, hasStoredSettings, readSettings, writeSettings, type LlmSettings } from './settings'

const listeners = new Set<() => void>()
let cached: { settings: LlmSettings; stored: boolean } | null = null

function notify() {
  cached = null
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('storage', notify)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('storage', notify)
  }
}

function getSnapshot() {
  if (!cached) cached = { settings: readSettings(), stored: hasStoredSettings() }
  return cached
}

const SERVER_SNAPSHOT = { settings: DEFAULT_SETTINGS, stored: false }

/** One shared view of the visitor's own key settings, including other tabs. */
export function useLlmSettings() {
  const { settings, stored } = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT)

  const save = useCallback((next: LlmSettings) => {
    writeSettings(next)
    notify()
  }, [])

  const erase = useCallback(() => {
    eraseSettings()
    notify()
  }, [])

  return { settings, stored, save, erase }
}
