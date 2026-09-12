'use client'

import type { CourseId } from '@/lib/courses'
import { useLessonProgress } from './use-progress'
import { TickList } from './tick-list'

interface QuizProps {
  course: CourseId
  slug: string
  items: string[]
}

/**
 * 今日自测. The tutorial's questions are open-ended practice tasks, so this is a
 * self-check list, not a scored quiz — ticking means "I actually did this".
 */
export function Quiz({ course, slug, items }: QuizProps) {
  const { progress, toggleQuiz } = useLessonProgress(course, slug)
  return (
    <TickList
      eyebrow="Self-check / 逐条动手"
      items={items}
      checked={progress.quiz}
      onToggle={(index, total) => toggleQuiz(slug, index, total)}
      doneNote="全部勾完。这一课可以标记为已完成。"
    />
  )
}
