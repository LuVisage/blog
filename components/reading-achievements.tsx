'use client'

import { useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/toast'
import { ACHIEVEMENTS, unlockAchievement, type AchievementId } from '@/lib/achievements'
import { SECRET_UNLOCK_KEY } from '@/lib/accents'

const MILESTONES: { at: number; id: AchievementId }[] = [
  { at: 25, id: 'first-scroll' },
  { at: 50, id: 'half' },
  { at: 99, id: 'finished' },
]

const LINGER_MS = 5 * 60 * 1000

function fire(toast: ReturnType<typeof useToast>, id: AchievementId) {
  if (!unlockAchievement(id)) return
  const a = ACHIEVEMENTS[id]
  toast?.({ label: a.label, title: a.title, description: a.description, tone: 'achievement' })
}

/**
 * Scroll-milestone and dwell badges for a single article. Mounted once per post
 * page; already-earned ids are skipped so revisits stay quiet.
 */
export function ReadingAchievements() {
  const toast = useToast()
  const reached = useRef(new Set<number>())

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 5) fire(toast, 'night-owl')

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        if (scrollable <= 0) return
        const pct = (window.scrollY / scrollable) * 100
        for (const m of MILESTONES) {
          if (pct >= m.at && !reached.current.has(m.at)) {
            reached.current.add(m.at)
            fire(toast, m.id)
          }
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const linger = setTimeout(() => fire(toast, 'lingerer'), LINGER_MS)

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
      clearTimeout(linger)
    }
  }, [toast])

  return null
}

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

/**
 * The old code. Rewards the typist with two appearance presets nobody else
 * sees listed, then tells them where to look.
 */
export function KonamiEasterEgg() {
  const toast = useToast()

  useEffect(() => {
    let position = 0

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA')
      ) {
        position = 0
        return
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      position = key === KONAMI[position] ? position + 1 : key === KONAMI[0] ? 1 : 0

      if (position !== KONAMI.length) return
      position = 0

      try {
        localStorage.setItem(SECRET_UNLOCK_KEY, '1')
      } catch {
        /* still celebrate for this session */
      }
      window.dispatchEvent(new Event('site:unlock'))

      if (!unlockAchievement('konami')) return
      toast?.({
        ...ACHIEVEMENTS.konami,
        tone: 'secret',
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toast])

  return null
}
