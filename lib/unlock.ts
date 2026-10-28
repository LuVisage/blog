/**
 * Konami easter egg flag.
 *
 * Used to gate the extras that stay hidden until the reader finds the code
 * (achievement toasts, the palette's secret entries). Kept apart from the
 * design tokens: it is behaviour, not appearance.
 */

/** Written by the Konami easter egg. */
export const SECRET_UNLOCK_KEY = 'site-secret-unlocked'

export function hasSecretUnlocked(): boolean {
  try {
    return localStorage.getItem(SECRET_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}
