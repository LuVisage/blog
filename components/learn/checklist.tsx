'use client'

import type { CourseId } from '@/lib/courses'
import { useLessonProgress } from './use-progress'
import { TickList } from './tick-list'

interface ChecklistProps {
  course: CourseId
  slug: string
  /** 存储键的一部分：一课可挂多张清单，各自的勾必须落在各自的索引数组里。 */
  name: string
  items: string[]
}

/** 自查清单：与今日自测同一套勾选机制，只是按 name 分开存。 */
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
