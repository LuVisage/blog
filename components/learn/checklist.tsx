'use client'

import type { CourseId } from '@/lib/courses'
import { useLessonProgress } from './use-progress'
import { TickList } from './tick-list'

interface ChecklistProps {
  course: CourseId
  slug: string
  /** Names this list in localStorage. Required, because one lesson can carry
   *  several and their ticks must not land in the same index array. */
  name: string
  items: string[]
}

/**
 * The 自查清单 a lesson asks of itself: "can you do each of these without
 * looking". Same mechanic as 今日自测, stored per name.
 */
export function Checklist({ course, slug, name, items }: ChecklistProps) {
  const { progress, toggleList } = useLessonProgress(course, slug)
  return (
    <TickList
      eyebrow={`Checklist / ${name}`}
      items={items}
      checked={progress.lists[name] ?? []}
      onToggle={(index, total) => toggleList(slug, name, index, total)}
    />
  )
}
