'use client'

import type { CourseId } from '@/lib/courses'
import { touched } from '@/lib/learn-progress'
import { useLearnProgress } from './use-progress'

interface CourseProgressProps {
  course: CourseId
  /** Slugs of this course's ordered lessons — passed in so the count is real, not guessed. */
  slugs: string[]
}

/**
 * 一行课程进度：读这台浏览器里的 done 标记，用 §11.11 的比例尺画出来。
 * 没有进度时是一条空的尺 + `0/N 课` —— 那同时也在说这门课有多长。
 */
export function CourseProgress({ course, slugs }: CourseProgressProps) {
  const { map } = useLearnProgress(course)
  const done = slugs.filter((slug) => map[slug]?.done).length
  const started = slugs.filter((slug) => !map[slug]?.done && touched(map[slug])).length

  return (
    <span className="flex flex-1 items-center gap-3 sm:max-w-[220px]">
      <span
        className="read-rule is-state"
        style={{ '--p': slugs.length ? done / slugs.length : 0 } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="read-rule__fill" />
      </span>
      {/* 计数是状态消息：常驻容器 + live，本页上的进度变化才会被播报。 */}
      <span
        className="meta tabular-nums flex-shrink-0"
        role="status"
        aria-live="polite"
        style={{ color: done ? 'var(--accent-text)' : 'var(--muted)' }}
      >
        {done}/{slugs.length} 课{started > 0 && ` · ${started} 进行中`}
      </span>
    </span>
  )
}
