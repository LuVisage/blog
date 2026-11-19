'use client'

import type { CourseId } from '@/lib/courses'
import { touched } from '@/lib/learn-progress'
import { useLearnProgress } from './use-progress'

interface CourseProgressProps {
  course: CourseId
  /** 本课全部课次的 slug，计数才是真实的而不是猜的。 */
  slugs: string[]
}

/**
 * 一行课程进度：读本机 done 标记画比例尺。没有进度时是空尺 + `0/N 课`，
 * 那同时也在说这门课有多长。
 */
export function CourseProgress({ course, slugs }: CourseProgressProps) {
  const { map } = useLearnProgress(course)
  let done = 0
  let started = 0
  for (const slug of slugs) {
    const entry = map[slug]
    if (entry?.done) done += 1
    else if (touched(entry)) started += 1
  }

  return (
    <span className="flex flex-1 items-center gap-3 sm:max-w-[220px]">
      <span
        className="read-rule is-state"
        style={{ '--p': slugs.length ? done / slugs.length : 0 } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className="read-rule__fill" />
      </span>
      {/* 计数是状态消息：容器常驻 + live，本页的进度变化才会被播报。 */}
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
