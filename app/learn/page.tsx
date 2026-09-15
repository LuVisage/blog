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
  description: '五门成体系的交互教程：开发工具链、机器学习与深度学习 17 周、Python 工程化与后端实战、从零到生产级 Agent，以及 CCF CSP 认证冲刺。课次、周次与进度都在页面上，进度只存在你自己的浏览器里。',
  alternates: { canonical: siteUrl('learn') },
}

/**
 * Shelf order is the recommended learning path: tools first, then the model
 * theory, then turning models into services, then the Agent capstone. CSP is
 * the independent exam track and rides at the end.
 */
const CARDS: { course: CourseId; name: string; tagline: string }[] = [
  {
    course: 'devtool',
    name: '开发工具链：从 Git 到 CI/CD',
    tagline: '13 章把写代码绕不开的工具一次讲透：版本控制、包管理、构建、检查、测试、调试、容器与流水线。ML 课开课前建议先过第 1–2 章。',
  },
  {
    course: 'ml',
    name: '机器学习与深度学习 17 周',
    tagline: '零基础到 Transformer 与大语言模型的完整主线：Week00 补编程与数学直觉，Week01–06 传统机器学习，Week07 起手写神经网络，一路到 CV 实战与生成模型。',
  },
  {
    course: 'backend',
    name: 'Python 工程化与后端实战',
    tagline: '把模型变成服务的那段路：类型注解与测试、FastAPI 与 SSE 流式输出、PostgreSQL 与 Redis、Docker 部署，最后是向量检索与 RAG 工程化。',
  },
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

      <section className="mb-14 rounded-xl p-5" style={{ border: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        <h2 className="section-title mb-3">推荐学习路径</h2>
        <p className="body-sm max-w-3xl">
          想走「AI 应用工程师」这条路，按下面的顺序推进，知识点是一条线接一条线的：
          <strong>工具链</strong>的第 1–2 章解决代码与依赖，是所有课程的前置；
          <strong>机器学习与深度学习 17 周</strong>补齐模型原理，Week16 的大语言模型正好讲到 Agent 课的门口；
          <strong>Python 工程化与后端实战</strong>把模型装进服务，其 Week1–2 可与基础课并行；
          最后<strong>Agent 课</strong>把前两块拼成生产级项目。
          <strong>CSP 冲刺</strong>是独立的备考线，随时可以插进来。
        </p>
        <p className="meta mt-3">
          devtool Week01–02 → ml Week00–16 → backend Week1–5 → agent 40 天（CSP 随时）
        </p>
      </section>

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
            <li>勾选、完成标记全部写在这台设备的浏览器里，各门课各存各的，互不覆盖；不上传，也不需要账号。</li>
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
