import type { ReactNode } from 'react'
import { getAllLessons, getReferencePages, getWeeks, lessonHref, type CourseId } from '@/lib/curriculum'
import { getSimSpecs } from '@/lib/sim/registry'
import { PageMasthead } from '@/components/page-masthead'
import { plainInline } from '@/components/inline-md'
import { Ledger, LedgerRow } from '@/components/ledger-row'
import { ProgressWall } from '@/components/learn/progress-wall'
import { ContinueCard } from '@/components/learn/continue-card'

interface CourseOverviewProps {
  course: CourseId
  eyebrow: string
  title: string
  lead: string
  counter: string
  /** 收尾随笔：两条并排最好读，一条独占整行。 */
  notes: { heading: string; items: ReactNode[] }[]
}

const pad = (n: number) => String(n).padStart(2, '0')

/** 周与手册共用的段头：左侧编号标签，右侧标题 + 计数 + 可选引言。 */
function SectionHead({ label, title, count, blurb }: { label: string; title: string; count: string; blurb?: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[92px_minmax(0,1fr)] gap-x-10 items-end mb-2">
      <span className="eyebrow eyebrow-accent">{label}</span>
      <div>
        <h2 className="section-title">
          {title}
          <span className="meta ml-2">{count}</span>
        </h2>
        {blurb && <p className="body-sm mt-2 max-w-2xl">{blurb}</p>}
      </div>
    </div>
  )
}

/**
 * 课程落地页：进度墙在前，每周一张台账。所有课程同一形状，第二门课只花文案。
 */
export function CourseOverview({ course, eyebrow, title, lead, counter, notes }: CourseOverviewProps) {
  const lessons = getAllLessons(course)
  const references = getReferencePages(course)
  const weeks = getWeeks(course)

  return (
    <div className="py-12 sm:py-16">
      <PageMasthead
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        counter={counter}
        actions={<ContinueCard course={course} lessons={lessons} />}
      />

      <ProgressWall course={course} lessons={lessons} />

      <div className="space-y-16">
        {weeks.map(({ week, title: weekTitle, blurb, lessons: weekLessons }) => (
          <section key={week}>
            <p className="week-h">
              {week === 0 ? 'DAY 0' : `WEEK ${pad(week)}`} · {weekTitle}
              <small>
                {weekLessons.length} 课 · DAY {pad(weekLessons[0].day)}–{pad(weekLessons[weekLessons.length - 1].day)}
              </small>
            </p>
            {blurb && <p className="body-sm mt-2 max-w-2xl">{blurb}</p>}
            <Ledger>
              {weekLessons.map((lesson) => {
                const simCount = getSimSpecs(course, lesson.slug).length
                const note = [
                  lesson.examples.length ? `${lesson.examples.length} 个案例` : '',
                  simCount ? `${simCount} 个实验台` : '',
                ]
                  .filter(Boolean)
                  .join(' · ')
                return (
                  <LedgerRow
                    key={lesson.slug}
                    href={lessonHref(course, lesson.slug)}
                    label={`DAY ${pad(lesson.day)}`}
                    title={lesson.title}
                    desc={plainInline(lesson.lead)}
                    meta={`${lesson.readingTime} 分钟`}
                    note={note || undefined}
                  />
                )
              })}
            </Ledger>
          </section>
        ))}
      </div>

      {references.length > 0 && (
        <section className="mt-16">
          <SectionHead
            label="Reference"
            title="随查手册"
            count={`${references.length} 页`}
            blurb="不按天排，做题做到卡壳时直接翻这一页。"
          />
          <Ledger>
            {references.map((page) => (
              <LedgerRow
                key={page.slug}
                href={lessonHref(course, page.slug)}
                label="随查"
                title={page.title}
                desc={plainInline(page.lead)}
                meta={`${page.readingTime} 分钟`}
              />
            ))}
          </Ledger>
        </section>
      )}

      {notes.length > 0 && (
        <section
          className="mt-16 pt-8 grid gap-10 md:grid-cols-2"
          style={{ borderTop: '1px solid var(--line-strong)' }}
        >
          {notes.map((note) => (
            <div key={note.heading}>
              <h3 className="section-title mb-4">{note.heading}</h3>
              <ul className="space-y-3 body-sm">
                {note.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
