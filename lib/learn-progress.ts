/**
 * Learning progress for the /learn courses — localStorage plumbing, no framework code.
 *
 * Everything lives in the visitor's own browser: nothing is sent anywhere, which
 * is also why the site needs no accounts and costs nothing to run.
 *
 * One key per course, because both courses number their lessons `day-NN`.
 */

import type { CourseId } from './courses'

export interface LessonProgress {
  /** Indexes of ticked items in that lesson's 今日自测. */
  quiz: number[]
  /** Ticked indexes per named 自查清单. Keyed by name because one lesson can carry
   *  several, and two lists sharing an index array would renumber each other. */
  lists: Record<string, number[]>
  done: boolean
}

export type ProgressMap = Record<string, LessonProgress>

export function progressKey(course: CourseId): string {
  return `learn.${course}.progress.v1`
}

const EMPTY: ProgressMap = {}

function readIndexes(value: unknown): number[] {
  return Array.isArray(value) ? value.filter((n) => Number.isInteger(n) && n >= 0) : []
}

function readLists(value: unknown): Record<string, number[]> {
  if (!value || typeof value !== 'object') return {}
  const out: Record<string, number[]> = {}
  for (const [name, indexes] of Object.entries(value)) out[name] = readIndexes(indexes)
  return out
}

/** True once the visitor has ticked anything, in any list. */
export function touched(progress: LessonProgress | undefined): boolean {
  if (!progress) return false
  if (progress.quiz.length > 0) return true
  return Object.values(progress.lists).some((indexes) => indexes.length > 0)
}

export function readProgress(course: CourseId): ProgressMap {
  try {
    const raw = localStorage.getItem(progressKey(course))
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return EMPTY
    const out: ProgressMap = {}
    for (const [slug, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue
      const v = value as Partial<LessonProgress>
      out[slug] = {
        quiz: readIndexes(v.quiz),
        lists: readLists(v.lists),
        done: v.done === true,
      }
    }
    return out
  } catch {
    return EMPTY
  }
}

export function writeProgress(course: CourseId, next: ProgressMap): void {
  try {
    localStorage.setItem(progressKey(course), JSON.stringify(next))
  } catch {
    /* private mode or quota — the page still works, it just won't persist */
  }
}

export function countCompleted(map: ProgressMap): number {
  return Object.values(map).filter((p) => p.done).length
}
