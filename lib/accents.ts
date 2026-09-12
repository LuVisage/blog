/**
 * Appearance options.
 *
 * `hsl` here mirrors the [data-accent] blocks in globals.css. The stylesheet is
 * authoritative for what actually paints; this table only exists so the picker
 * can render a swatch without reading computed styles. Keep the two in sync.
 */

export type AccentId = 'violet' | 'cyan' | 'amber' | 'rose' | 'moss' | 'blue' | 'ink'
export type BackgroundId = 'editorial' | 'blueprint' | 'aurora' | 'clean' | 'static'

export interface AccentOption {
  id: AccentId
  label: string
  hsl: string
  /** Hidden from pickers until the Konami easter egg unlocks it. */
  secret?: boolean
}

export const ACCENTS: readonly AccentOption[] = [
  { id: 'violet', label: '紫罗兰', hsl: 'hsl(250 82% 69%)' },
  { id: 'cyan', label: '青', hsl: 'hsl(187 86% 57%)' },
  { id: 'amber', label: '琥珀', hsl: 'hsl(36 92% 60%)' },
  { id: 'rose', label: '玫红', hsl: 'hsl(340 82% 66%)' },
  { id: 'moss', label: '苔绿', hsl: 'hsl(152 62% 52%)' },
  { id: 'blue', label: '蓝', hsl: 'hsl(217 85% 65%)' },
  { id: 'ink', label: '墨', hsl: 'hsl(250 8% 62%)', secret: true },
] as const

export interface BackgroundOption {
  id: BackgroundId
  label: string
  hint: string
  secret?: boolean
}

export const BACKGROUNDS: readonly BackgroundOption[] = [
  { id: 'editorial', label: '编辑部', hint: '网格 + 光晕' },
  { id: 'blueprint', label: '蓝图', hint: '仅密网格' },
  { id: 'aurora', label: '极光', hint: '仅光晕' },
  { id: 'clean', label: '素净', hint: '无装饰' },
  { id: 'static', label: '噪点', hint: '胶片颗粒', secret: true },
] as const

/** Violet is the `:root` default, so it is expressed by the attribute absent. */
export const DEFAULT_ACCENT: AccentId = 'violet'
export const DEFAULT_BACKGROUND: BackgroundId = 'editorial'

export const ACCENT_STORAGE_KEY = 'site-accent'
export const BACKGROUND_STORAGE_KEY = 'site-background'

export function isAccentId(value: string | null | undefined): value is AccentId {
  return !!value && ACCENTS.some((a) => a.id === value)
}

export function isBackgroundId(value: string | null | undefined): value is BackgroundId {
  return !!value && BACKGROUNDS.some((b) => b.id === value)
}

/** Written by the Konami easter egg; gates the secret presets. */
export const SECRET_UNLOCK_KEY = 'site-secret-unlocked'

export function hasSecretUnlocked(): boolean {
  try {
    return localStorage.getItem(SECRET_UNLOCK_KEY) === '1'
  } catch {
    return false
  }
}

export function visibleAccents(unlocked: boolean): readonly AccentOption[] {
  return unlocked ? ACCENTS : ACCENTS.filter((a) => !a.secret)
}

export function visibleBackgrounds(unlocked: boolean): readonly BackgroundOption[] {
  return unlocked ? BACKGROUNDS : BACKGROUNDS.filter((b) => !b.secret)
}
