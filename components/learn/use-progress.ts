'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  readProgress,
  writeProgress,
  type LessonProgress,
  type ProgressMap,
} from '@/lib/learn-progress'
import type { CourseId } from '@/lib/courses'

/** Flip one index, then rebuild over the full range so the array stays ordered
 *  and drops any index the current item list no longer has. */
function tickedIndexes(current: number[] | undefined, index: number, total: number): number[] {
  const on = new Set(current)
  if (on.has(index)) on.delete(index)
  else on.add(index)
  return Array.from({ length: total }, (_, i) => i).filter((i) => on.has(i))
}

const listeners = new Set<() => void>()
const EMPTY_SNAPSHOT: ProgressMap = {}
/** Every mutator spreads the entry, so this shared default is never written in place. */
const EMPTY_PROGRESS: LessonProgress = { quiz: [], lists: {}, done: false }
// One cache slot per course: they share a slug space, so a single slot would
// serve Agent progress to a CSP page after a visit between the two.
const cache = new Map<CourseId, ProgressMap | null>()

function notify() {
  cache.clear()
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

function getSnapshot(course: CourseId) {
  const hit = cache.get(course)
  if (hit) return hit
  const fresh = readProgress(course)
  cache.set(course, fresh)
  return fresh
}

/** Shared view of localStorage progress so the wall, quiz and footer never disagree. */
export function useLearnProgress(course: CourseId) {
  const map = useSyncExternalStore(subscribe, () => getSnapshot(course), () => EMPTY_SNAPSHOT)

  /** Mutations run against the live snapshot, not the last render, so clicks in the same frame compose. */
  const update = useCallback((slug: string, mutate: (prev: LessonProgress) => LessonProgress) => {
    const current = getSnapshot(course)
    const previous: LessonProgress = current[slug] ?? EMPTY_PROGRESS
    writeProgress(course, { ...current, [slug]: mutate(previous) })
    notify()
  }, [course])

  const toggleQuiz = useCallback(
    (slug: string, index: number, total: number) => {
      update(slug, (prev) => ({ ...prev, quiz: tickedIndexes(prev.quiz, index, total) }))
    },
    [update],
  )

  const toggleList = useCallback(
    (slug: string, name: string, index: number, total: number) => {
      update(slug, (prev) => ({
        ...prev,
        lists: { ...prev.lists, [name]: tickedIndexes(prev.lists[name], index, total) },
      }))
    },
    [update],
  )

  const toggleDone = useCallback(
    (slug: string) => update(slug, (prev) => ({ ...prev, done: !prev.done })),
    [update],
  )

  const reset = useCallback(() => {
    writeProgress(course, {})
    notify()
  }, [course])

  return { map, update, toggleQuiz, toggleList, toggleDone, reset }
}

export function useLessonProgress(course: CourseId, slug: string) {
  const { map, toggleQuiz, toggleList, toggleDone } = useLearnProgress(course)
  const progress: LessonProgress = map[slug] ?? EMPTY_PROGRESS
  return { progress, toggleQuiz, toggleList, toggleDone }
}
