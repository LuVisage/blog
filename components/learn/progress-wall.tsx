'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { IconRotate } from '@tabler/icons-react'
import { lessonHref, type CourseId } from '@/lib/courses'
import type { LessonMeta } from '@/lib/curriculum'
import { touched } from '@/lib/learn-progress'
import { useLearnProgress } from './use-progress'

type DayState = 'done' | 'started' | 'idle'

const CELL: Record<DayState, { border: string; background: string; text: string }> = {
  done: { border: 'var(--accent)', background: 'var(--accent)', text: 'var(--on-accent)' },
  started: { border: 'var(--line)', background: 'var(--heat-2)', text: 'var(--faint)' },
  idle: { border: 'var(--line)', background: 'var(--surface-2)', text: 'var(--muted)' },
}

const LEGEND: { label: string; style: React.CSSProperties }[] = [
  { label: '未开始', style: { background: 'var(--surface-2)', border: '1px solid var(--line)' } },
  { label: '进行中', style: { background: 'var(--heat-2)' } },
  { label: '已完成', style: { background: 'var(--accent)', borderColor: 'var(--accent)' } },
]

/** 课次网格：颜色只编码访客自己的 localStorage 状态。 */
export function ProgressWall({ course, lessons }: { course: CourseId; lessons: LessonMeta[] }) {
  const { map, reset } = useLearnProgress(course)
  const shellRef = useRef<HTMLElement>(null)

  const stateOf = (slug: string): DayState => {
    const entry = map[slug]
    if (entry?.done) return 'done'
    if (touched(entry)) return 'started'
    return 'idle'
  }
  const states = lessons.map((lesson) => stateOf(lesson.slug))
  const completed = states.filter((state) => state === 'done').length
  const started = states.filter((state) => state === 'started').length

  return (
    <section ref={shellRef} aria-label="学习进度" tabIndex={-1} className="mb-14">
      <div
        className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-2.5"
        style={{ borderTop: '1px solid var(--line-strong)', borderBottom: '1px solid var(--line)' }}
      >
        <span className="eyebrow">Progress / 学习进度</span>
        <div className="flex items-center gap-5">
          {/* 计数是状态消息：常驻容器 + live，重置后才会有播报。 */}
          <span className="meta tabular-nums" role="status" aria-live="polite">
            {completed} 完成 · {started} 进行中 · {lessons.length} 总课次
          </span>
          {completed > 0 && (
            <button
              type="button"
              onClick={() => {
                reset()
                // 按钮随 completed 归零一起消失：先把焦点交还区块，
                // 否则 activeElement 掉回 BODY，键盘用户下一跳从文档开头重来。
                shellRef.current?.focus()
              }}
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
        {lessons.map((lesson, index) => {
          const cell = CELL[states[index]]
          return (
            <Link
              key={lesson.slug}
              href={lessonHref(course, lesson.slug)}
              title={`Day ${lesson.day} · ${lesson.title}`}
              className="group relative aspect-square grid place-items-center transition-transform duration-200 hover:scale-[1.12] hover:z-10"
              style={{
                borderRadius: 'var(--radius-xs)',
                border: `1px solid ${cell.border}`,
                background: cell.background,
              }}
            >
              <span className="text-[11px] font-mono tabular-nums transition-colors" style={{ color: cell.text }}>
                {lesson.day}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-5 mt-4 meta">
        {LEGEND.map((item) => (
          <span key={item.label} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3" style={item.style} />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  )
}
