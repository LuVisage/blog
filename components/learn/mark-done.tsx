'use client'

import { IconCheck, IconCircle } from '@tabler/icons-react'
import type { CourseId } from '@/lib/courses'
import { useLessonProgress } from './use-progress'

export function MarkDone({ course, slug, label }: { course: CourseId; slug: string; label: string }) {
  const { progress, toggleDone } = useLessonProgress(course, slug)
  const done = progress.done

  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={() => toggleDone(slug)}
      className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-sm cursor-pointer transition-colors"
      style={
        done
          ? { borderColor: 'var(--accent)', color: 'var(--accent-text)' }
          : { color: 'var(--body)' }
      }
    >
      {done ? (
        <IconCheck size={15} strokeWidth={2.25} />
      ) : (
        <IconCircle size={15} strokeWidth={1.75} />
      )}
      {done ? '已完成' : label}
    </button>
  )
}
