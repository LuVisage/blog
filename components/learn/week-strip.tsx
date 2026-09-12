'use client'

import Link from 'next/link'
import { IconCheck } from '@tabler/icons-react'
import { lessonHref, type CourseId } from '@/lib/courses'
import type { LessonMeta } from '@/lib/curriculum'
import { useLearnProgress } from './use-progress'

interface WeekStripProps {
  course: CourseId
  current: string
  week: number
  weekTitle: string
  lessons: LessonMeta[]
}

/** Same-week hops. Horizontal so it uses the band width instead of stealing it. */
export function WeekStrip({ course, current, week, weekTitle, lessons }: WeekStripProps) {
  const { map } = useLearnProgress(course)
  if (lessons.length < 2) return null

  return (
    <nav aria-label="本周课次" className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="eyebrow flex-shrink-0" style={{ color: 'var(--muted)' }}>
        {week === 0 ? 'Day 0' : `Week ${String(week).padStart(2, '0')}`} · {weekTitle}
      </span>

      <ol className="flex flex-wrap items-center gap-1.5">
        {lessons.map((lesson) => {
          const active = lesson.slug === current
          const done = map[lesson.slug]?.done
          return (
            <li key={lesson.slug}>
              <Link
                href={lessonHref(course, lesson.slug)}
                aria-current={active ? 'page' : undefined}
                title={lesson.title}
                className="chip px-2.5 py-1 transition-colors"
                style={{
                  borderRadius: 7,
                  color: active ? 'var(--ink)' : 'var(--muted)',
                  borderColor: active ? 'var(--accent-line)' : 'var(--line)',
                  background: active ? 'var(--accent-soft)' : 'transparent',
                }}
              >
                <span
                  className="meta tabular-nums"
                  style={{ color: active ? 'var(--accent-text)' : 'var(--muted)' }}
                >
                  {String(lesson.day).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline max-w-[14ch] truncate text-xs">{lesson.title}</span>
                {done && (
                  <IconCheck size={12} strokeWidth={2.5} style={{ color: 'var(--accent-text)' }} />
                )}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
