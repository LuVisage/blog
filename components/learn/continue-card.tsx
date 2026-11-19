'use client'

import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { lessonHref, type CourseId } from '@/lib/courses'
import type { LessonMeta } from '@/lib/curriculum'
import { touched } from '@/lib/learn-progress'
import { useLearnProgress } from './use-progress'

interface ContinueCardProps {
  course: CourseId
  lessons: LessonMeta[]
}

/**
 * 课程页主行动：优先回到勾了一半的那一课，其次是第一所没完成的，全部读完指回开头。
 *
 * 进度只在 localStorage，服务端快照是空表，所以 SSR 与注水首帧一律渲染「第一课」，
 * 挂载后才换成真实目标 —— 两边不会打架。
 */
export function ContinueCard({ course, lessons }: ContinueCardProps) {
  const { map } = useLearnProgress(course)
  if (lessons.length === 0) return null

  const isDone = (lesson: LessonMeta) => Boolean(map[lesson.slug]?.done)
  const completed = lessons.filter(isDone).length
  const allDone = completed === lessons.length
  const started = lessons.find((lesson) => !isDone(lesson) && touched(map[lesson.slug]))
  const target = allDone
    ? lessons[0]
    : (started ?? lessons.find((lesson) => !isDone(lesson)) ?? lessons[0])

  const label =
    completed === 0
      ? 'Start / 从第一天开始'
      : allDone
        ? 'Done / 全部读完，可从头再走'
        : started
          ? 'Resume / 接着上次'
          : 'Next / 继续下一课'

  return (
    <div className="w-full min-w-0 sm:w-[300px]">
      <div className="flex items-baseline justify-between gap-3">
        <span className="eyebrow truncate" style={{ color: 'var(--accent-text)' }}>
          {label}
        </span>
        {/* 在本页勾完一课这格数字当场变；容器常驻才播得出。 */}
        <span className="meta tabular-nums flex-shrink-0" role="status" aria-live="polite">
          {completed}/{lessons.length}
        </span>
      </div>

      <div className="read-rule is-state mt-2" aria-hidden="true">
        <span
          className="read-rule__fill"
          style={{ '--p': completed / lessons.length } as React.CSSProperties}
        />
      </div>

      <Link
        href={lessonHref(course, target.slug)}
        className="pressable link-underline group mt-4 inline-flex max-w-full min-h-6 items-center gap-2.5 text-sm font-medium transition-colors hover:text-[var(--accent-text)] cursor-pointer tint-ink"
      >
        <span className="meta tabular-nums flex-shrink-0" style={{ color: 'var(--muted)' }}>
          Day {target.day}
        </span>
        <span className="min-w-0 truncate">{target.title}</span>
        <IconArrowRight
          size={14}
          strokeWidth={2}
          className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
        />
      </Link>
      <p className="meta mt-1.5" style={{ color: 'var(--muted)' }}>
        {target.readingTime} 分钟
      </p>
    </div>
  )
}
