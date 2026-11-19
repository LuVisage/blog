'use client'

import { useCallback, useSyncExternalStore } from 'react'
import {
  readProgress,
  writeProgress,
  type LessonProgress,
  type ProgressMap,
} from '@/lib/learn-progress'
import type { CourseId } from '@/lib/courses'

// 翻转一个下标后按全量范围重建：数组保持有序，且丢掉当前清单已不存在的下标。
function tickedIndexes(current: number[] | undefined, index: number, total: number): number[] {
  const on = new Set(current)
  if (on.has(index)) on.delete(index)
  else on.add(index)
  return Array.from({ length: total }, (_, i) => i).filter((i) => on.has(i))
}

const listeners = new Set<() => void>()
const EMPTY_SNAPSHOT: ProgressMap = {}
// 所有 mutator 都 spread 条目，这个共享默认值不会被原地写。
const EMPTY_PROGRESS: LessonProgress = { quiz: [], lists: {}, done: false }
// 每课程一个缓存槽：slug 空间共享，单槽会把 Agent 的进度喂给跨课访问后的 CSP 页。
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

/** localStorage 进度的共享视图：进度墙、quiz、页脚永不各执一词。 */
export function useLearnProgress(course: CourseId) {
  const map = useSyncExternalStore(subscribe, () => getSnapshot(course), () => EMPTY_SNAPSHOT)

  // 变更对着活快照跑而非上一次渲染，同帧连点也能正确复合。
  const update = useCallback(
    (slug: string, mutate: (prev: LessonProgress) => LessonProgress) => {
      const current = getSnapshot(course)
      const previous: LessonProgress = current[slug] ?? EMPTY_PROGRESS
      writeProgress(course, { ...current, [slug]: mutate(previous) })
      notify()
    },
    [course]
  )

  const toggleQuiz = useCallback(
    (slug: string, index: number, total: number) => {
      update(slug, (prev) => ({ ...prev, quiz: tickedIndexes(prev.quiz, index, total) }))
    },
    [update]
  )

  const toggleList = useCallback(
    (slug: string, name: string, index: number, total: number) => {
      update(slug, (prev) => ({
        ...prev,
        lists: { ...prev.lists, [name]: tickedIndexes(prev.lists[name], index, total) },
      }))
    },
    [update]
  )

  const toggleDone = useCallback(
    (slug: string) => update(slug, (prev) => ({ ...prev, done: !prev.done })),
    [update]
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
