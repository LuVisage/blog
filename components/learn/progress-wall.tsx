'use client'

import Link from 'next/link'
import { IconRotate } from '@tabler/icons-react'
import { lessonHref, type CourseId } from '@/lib/courses'
import type { LessonMeta } from '@/lib/curriculum'
import { touched } from '@/lib/learn-progress'
import { useLearnProgress } from './use-progress'

/** The day grid. Colour encodes the visitor's own localStorage state, nothing else. */
export function ProgressWall({ course, lessons }: { course: CourseId; lessons: LessonMeta[] }) {
  const { map, reset } = useLearnProgress(course)
  const completed = lessons.filter((l) => map[l.slug]?.done).length
  const started = lessons.filter((l) => !map[l.slug]?.done && touched(map[l.slug])).length

  const stateOf = (slug: string): 'done' | 'started' | 'idle' => {
    const entry = map[slug]
    if (entry?.done) return 'done'
    if (touched(entry)) return 'started'
    return 'idle'
  }

  return (
    <section aria-label="学习进度" className="mb-14">
      <div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-2.5"
        style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">Progress / 学习进度</span>
        <div className="flex items-center gap-5">
          <span className="meta tabular-nums">
            {completed} 完成 · {started} 进行中 · {lessons.length} 总课次
          </span>
          {completed > 0 && (
            <button
              type="button"
              onClick={reset}
              className="btn-ghost inline-flex items-center gap-1.5 text-xs cursor-pointer transition-colors"
              title="清空本机浏览器里的进度"
            >
              <IconRotate size={13} strokeWidth={1.75} />
              重置
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] gap-1.5 mt-6">
        {lessons.map((lesson) => {
          const state = stateOf(lesson.slug)
          return (
            <Link
              key={lesson.slug}
              href={lessonHref(course, lesson.slug)}
              title={`Day ${lesson.day} · ${lesson.title}`}
              className="group relative aspect-square grid place-items-center transition-transform duration-200 hover:scale-[1.18] hover:z-10"
              style={{
                borderRadius: 4,
                border: `1px solid ${state === 'done' ? 'var(--accent)' : 'var(--line)'}`,
                background:
                  state === 'done'
                    ? 'var(--accent)'
                    : state === 'started'
                      ? 'var(--heat-2)'
                      : 'var(--surface-2)',
              }}
            >
              <span
                className="text-[10px] font-mono tabular-nums transition-colors"
                style={{ color: state === 'done' ? 'var(--on-accent)' : state === 'started' ? 'var(--faint)' : 'var(--muted)' }}
              >
                {lesson.day}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-5 mt-4 meta">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }} />
          未开始
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: 'var(--heat-2)' }} />
          进行中
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }} />
          已完成
        </span>
      </div>
    </section>
  )
}
