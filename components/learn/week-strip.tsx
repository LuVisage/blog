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

/**
 * 同周跳转，横向排布用满带宽。
 *
 * 标签必须独占一行：若与 chip 行做 flex 兄弟，chip 的 `max-w-[14ch]` 跟着字体走，
 * Noto 子集分批到货时每个 chip 变宽约 9px，七个一起把整行推过换行边界，
 * 「标签同行 ↔ 独占一行」来回翻，正文跟着跳（字体到货时序决定的 CLS）。
 * 标签让出那一行后，chip 行拿到整条带宽，边界不再被跨过。
 */
export function WeekStrip({ course, current, week, weekTitle, lessons }: WeekStripProps) {
  const { map } = useLearnProgress(course)
  if (lessons.length < 2) return null

  return (
    <nav aria-label="本周课次" className="mt-5">
      <span className="eyebrow block" style={{ color: 'var(--muted)' }}>
        {week === 0 ? 'Day 0' : `Week ${String(week).padStart(2, '0')}`} · {weekTitle}
      </span>

      <ol className="mt-2 flex flex-wrap items-center gap-1.5">
        {lessons.map((lesson) => {
          const active = lesson.slug === current
          const done = map[lesson.slug]?.done
          return (
            <li key={lesson.slug}>
              <Link
                href={lessonHref(course, lesson.slug)}
                aria-current={active ? 'page' : undefined}
                title={lesson.title}
                className="chip chip-toggle px-2.5 py-1"
              >
                <span
                  className="meta tabular-nums"
                  style={{ color: active ? 'var(--accent-text)' : 'var(--muted)' }}
                >
                  {String(lesson.day).padStart(2, '0')}
                </span>
                <span className="hidden sm:inline max-w-[14ch] truncate text-xs">{lesson.title}</span>
                {/* 窄屏摘掉了可见标题，读屏名只剩两位序号；sr-only 标题只补窄屏，宽屏不重读。 */}
                <span className="sr-only sm:hidden">{lesson.title}</span>
                {done && (
                  <>
                    <IconCheck size={12} strokeWidth={2.5} aria-hidden="true" style={{ color: 'var(--accent-text)' }} />
                    <span className="sr-only">已完成</span>
                  </>
                )}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
