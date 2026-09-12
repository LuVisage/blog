import Link from 'next/link'
import type { ReactNode } from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import { getAllLessons, getReferencePages, getWeeks, lessonHref, type CourseId } from '@/lib/curriculum'
import { getSimSpecs } from '@/lib/sim/registry'
import { PageMasthead } from '@/components/page-masthead'
import { Ledger, LedgerRow } from '@/components/ledger-row'
import { ProgressWall } from '@/components/learn/progress-wall'

interface CourseOverviewProps {
  course: CourseId
  eyebrow: string
  title: string
  lead: string
  counter: string
  /** Free-form closing notes; two read best side by side, one spans the row. */
  notes: { heading: string; items: ReactNode[] }[]
}

/**
 * Course landing page: progress wall first, then one ledger per week.
 * Every course gets the same shape so a second one costs only copy.
 */
export function CourseOverview({ course, eyebrow, title, lead, counter, notes }: CourseOverviewProps) {
  const lessons = getAllLessons(course)
  const references = getReferencePages(course)
  const weeks = getWeeks(course)
  const first = lessons[0]

  return (
    <div className="py-12 sm:py-16">
      <PageMasthead
        eyebrow={eyebrow}
        title={title}
        lead={lead}
        counter={counter}
        actions={
          first && (
            <Link href={lessonHref(course, first.slug)} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              从 Day {first.day} 开始
              <IconArrowRight size={15} strokeWidth={2} />
            </Link>
          )
        }
      />

      <ProgressWall course={course} lessons={lessons} />

      <div className="space-y-16">
        {weeks.map(({ week, title: weekTitle, blurb, lessons: weekLessons }) => (
          <section key={week}>
            <div className="grid grid-cols-1 md:grid-cols-[92px_minmax(0,1fr)] gap-x-10 items-end mb-2">
              <span className="eyebrow eyebrow-accent">
                {week === 0 ? 'Day 0' : `Week ${String(week).padStart(2, '0')}`}
              </span>
              <div>
                <h2 className="section-title">
                  {weekTitle}
                  <span className="meta ml-2">{weekLessons.length} 课</span>
                </h2>
                {blurb && <p className="body-sm mt-2 max-w-2xl">{blurb}</p>}
              </div>
            </div>

            <Ledger>
              {weekLessons.map((lesson) => {
                const simCount = getSimSpecs(course, lesson.slug).length
                return (
                  <LedgerRow
                    key={lesson.slug}
                    href={lessonHref(course, lesson.slug)}
                    label={`Day ${lesson.day}`}
                    title={lesson.title}
                    desc={lesson.lead}
                    meta={`${lesson.readingTime} 分钟`}
                    note={[lesson.examples.length ? `${lesson.examples.length} 个案例` : '', simCount ? `${simCount} 个实验台` : ''].filter(Boolean).join(' · ') || undefined}
                  />
                )
              })}
            </Ledger>
          </section>
        ))}
      </div>

      {references.length > 0 && (
        <section className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-[92px_minmax(0,1fr)] gap-x-10 items-end mb-2">
            <span className="eyebrow eyebrow-accent">Reference</span>
            <div>
              <h2 className="section-title">
                随查手册
                <span className="meta ml-2">{references.length} 页</span>
              </h2>
              <p className="body-sm mt-2 max-w-2xl">不按天排，做题做到卡壳时直接翻这一页。</p>
            </div>
          </div>
          <Ledger>
            {references.map((page) => (
              <LedgerRow
                key={page.slug}
                href={lessonHref(course, page.slug)}
                label="随查"
                title={page.title}
                desc={page.lead}
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
