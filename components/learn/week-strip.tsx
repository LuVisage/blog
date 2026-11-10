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
 * Same-week hops. Horizontal so it uses the band width instead of stealing it.
 *
 * 标签独占一行、chip 行拿满带宽，不是为了好看：两者做 flex 兄弟时，chip 的宽度上限是
 * `max-w-[14ch]`，而 `ch` 跟着字体走 —— Noto 子集分批到货时每个 chip 宽了约 9px，
 * 七个一起把整行推过换行边界，于是「标签+chip 同行」↔「标签独占一行」来回翻，
 * 下方正文跟着上下跳 26px（实测 day-06 @1280：t=566ms 上跳、t=746ms 跳回，
 * CLS 0.127；三遍里复现一遍，字体到货时序决定，真实网络下只会更频繁）。
 * 标签让出那一行之后 chip 行拿到的是整条带宽而不是减去标签宽的余量，边界不再被跨过。
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
                {/* 窄屏上面那条被 display:none 摘掉了，读屏名只剩两位序号；补一条只对窄屏
                    可见的 sr-only 标题，宽屏再读一遍就是重读。 */}
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
