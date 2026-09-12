/**
 * Reading achievements — definitions and localStorage plumbing.
 *
 * Deliberately framework-free so the command palette can summarise progress
 * without pulling in the achievement component.
 */

export type AchievementId =
  | 'night-owl'
  | 'first-scroll'
  | 'half'
  | 'finished'
  | 'lingerer'
  | 'konami'

export interface Achievement {
  id: AchievementId
  label: string
  title: string
  description: string
}

export const ACHIEVEMENTS: Record<AchievementId, Achievement> = {
  'night-owl': {
    id: 'night-owl',
    label: '成就解锁',
    title: '夜读人',
    description: '凌晨还在翻文章。',
  },
  'first-scroll': {
    id: 'first-scroll',
    label: '成就解锁',
    title: '读进去了',
    description: '这篇往下滚过了四分之一。',
  },
  half: {
    id: 'half',
    label: '成就解锁',
    title: '半程',
    description: '一篇读到一半，剩下的不多了。',
  },
  finished: {
    id: 'finished',
    label: '成就解锁',
    title: '读完了',
    description: '滚到底了。评论区通常也在附近。',
  },
  lingerer: {
    id: 'lingerer',
    label: '成就解锁',
    title: '驻留者',
    description: '在这篇上停了五分钟以上。',
  },
  konami: {
    id: 'konami',
    label: '隐藏内容',
    title: '上上下下，左右左右，B A',
    description: '命令面板里多了两个别人看不到的选项。',
  },
}

export const ACHIEVEMENT_STORAGE_KEY = 'reading-achievements'

export function readUnlockedAchievements(): AchievementId[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENT_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return Array.isArray(parsed) ? parsed.filter((id) => id in ACHIEVEMENTS) : []
  } catch {
    return []
  }
}

/** Returns true only the first time this id is recorded, so toasts don't repeat. */
export function unlockAchievement(id: AchievementId): boolean {
  const current = readUnlockedAchievements()
  if (current.includes(id)) return false
  try {
    localStorage.setItem(ACHIEVEMENT_STORAGE_KEY, JSON.stringify([...current, id]))
  } catch {
    /* storage unavailable — still report first-time so the session feels right */
  }
  return true
}
