import type { Metadata } from 'next'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'
import { siteUrl } from '@/lib/constants'
import { COURSES, getCurriculumStats, getReferencePages, getWeeks, lessonHref, type CourseId } from '@/lib/curriculum'
import { simLessonCount } from '@/lib/sim/registry'
import { PageMasthead } from '@/components/page-masthead'
import { Ledger, LedgerRow } from '@/components/ledger-row'

export const metadata: Metadata = {
  title: '交互教程',
  description: '两份跟着做完的教程：从零到生产级 Agent 的 41 天学习笔记，和 CCF CSP 认证的 20 天冲刺计划。课次、周次与进度都在页面上，进度只存在你自己的浏览器里。',
  alternates: { canonical: siteUrl('learn') },
}

/** Short shelf copy; the course pages carry the long version. */
const CARDS: { course: CourseId; name: string; tagline: string }[] = [
  {
    course: 'agent',
    name: '从零到生产级 Agent',
    tagline: '一份跟着敲过的学习笔记搬上网页：LangChain 组件、RAG 与向量库、LangGraph 图编程、MCP 与多智能体，最后到带界面的毕业项目。',
  },
  {
    course: 'csp',
    name: 'CSP 认证 20 天冲刺',
    tagline: '写给自己的工作备考计划：第一周找回手感把 T1/T2/T3 焊死，第二周补图论、DP 与数据结构，第三周攻真题加两套全真模拟。',
  },
]

export default function LearnPage() {
  const courses = CARDS.map((card) => ({
    ...card,
    stats: getCurriculumStats(card.course),
    labs: simLessonCount(card.course),
    weeks: getWeeks(card.course),
    references: getReferencePages(card.course),
  }))

  const totalLessons = courses.reduce((sum, c) => sum + c.stats.lessons, 0)
  const totalMinutes = courses.reduce((sum, c) => sum + c.stats.minutes, 0)

  return (
    <div className="py-12 sm:py-16">
      <PageMasthead
        eyebrow="Learn / 交互教程"
        title="跟着做完的教程"
        lead="这里放的是我自己按天推进过的学习计划，改成了可以打卡的网页版：一课一天，读完做勾选，进度留在你自己的浏览器里。"
        counter={`${courses.length} 门课 · ${totalLessons} 课 · ${totalMinutes} 分钟`}
      />

      <div className="space-y-16">
        {courses.map((course, index) => (
          <section key={course.course}>
            <div className="grid grid-cols-1 md:grid-cols-[92px_minmax(0,1fr)] gap-x-10 gap-y-2 items-end mb-2">
              <span className="eyebrow eyebrow-accent">Course {String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="section-title">
                  <Link href={COURSES[course.course].path} className="hover:text-[var(--accent-text)] transition-colors">
                    {course.name}
                  </Link>
                  <span className="meta ml-2">{course.stats.lessons} 课</span>
                </h2>
                <p className="body-sm mt-2 max-w-2xl">{course.tagline}</p>
              </div>
            </div>

            <Ledger>
              {course.weeks.map(({ week, title, blurb, lessons }) => (
                <LedgerRow
                  key={week}
                  href={lessonHref(course.course, lessons[0].slug)}
                  label={week === 0 ? 'Day 0' : `Week ${String(week).padStart(2, '0')}`}
                  title={title}
                  desc={blurb}
                  meta={`${lessons.length} 课 · ${lessons.reduce((sum, l) => sum + l.readingTime, 0)} 分钟`}
                />
              ))}
              {course.references.map((page) => (
                <LedgerRow
                  key={page.slug}
                  href={lessonHref(course.course, page.slug)}
                  label="随查"
                  title={page.title}
                  desc={page.lead}
                  meta={`${page.readingTime} 分钟`}
                />
              ))}
            </Ledger>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={COURSES[course.course].path}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                进入课程
                <IconArrowRight size={15} strokeWidth={2} />
              </Link>
              <span className="meta">
                {course.stats.weeks} 周 · {course.stats.minutes} 分钟
                {course.labs ? ` · ${course.labs} 课带实验台` : ''}
              </span>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 pt-8 grid gap-10 md:grid-cols-2" style={{ borderTop: '1px solid var(--line-strong)' }}>
        <div>
          <h3 className="section-title mb-4">进度是怎么存的</h3>
          <ul className="space-y-3 body-sm">
            <li>勾选、完成标记全部写在这台设备的浏览器里，两门课各存各的，互不覆盖；不上传，也不需要账号。</li>
            <li>换设备或清缓存会归零，每门课页面上的重置按钮随时可以手动清空。</li>
          </ul>
        </div>
        <div>
          <h3 className="section-title mb-4">还有一件事</h3>
          <ul className="space-y-3 body-sm">
            <li>教程正文里的实验台全部在浏览器里算，标注「演示数据」的是为了讲清机制造的样例，不是实测结果。</li>
            <li>需要花真钱的部分只有 Agent 课的「真实调用」，那要用你自己的 Key、你自己的额度。</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
