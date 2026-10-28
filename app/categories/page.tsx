import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { getAllCategories, getAllPosts, getAllSeries } from '@/lib/posts'
import { COURSES, getCurriculumStats, type CourseId } from '@/lib/curriculum'
import { PageMasthead } from '@/components/page-masthead'
import { LedgerRow, Ledger } from '@/components/ledger-row'
import { AnimatedContent } from '@/components/ui/animated-content'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFolder, IconArrowUpRight } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: '分类',
  description: `文章分类 - ${SITE.title}`,
}

/** 课程简称（与 /learn 的 CARDS 对应；分类页只取名称与统计，不复制 tagline） */
const COURSE_NAMES: Record<CourseId, string> = {
  devtool: '工具箱 · 开发工具链',
  ml: '机器学习与深度学习',
  backend: 'Python 工程化与后端',
  agent: '从零到生产级 Agent',
  csp: 'CSP 认证冲刺',
}

export default function CategoriesPage() {
  const categories = getAllCategories()
  const allPosts = getAllPosts()
  const series = getAllSeries()

  const latestByCategory = new Map<string, string>()
  allPosts.forEach((post) => {
    if (post.category && !latestByCategory.has(post.category)) {
      latestByCategory.set(post.category, post.title)
    }
  })

  const courses = (Object.keys(COURSES) as CourseId[]).map((course) => ({
    id: course,
    name: COURSE_NAMES[course],
    href: COURSES[course].path,
    stats: getCurriculumStats(course),
  }))

  return (
    <div>
      <PageMasthead
        eyebrow="分类 — Categories"
        title="分类"
        lead="文章按栏目归档，每个分类下是一组连续的思考。"
        counter={`${categories.length} 个分类 · ${allPosts.length} 篇文章`}
      />

      {categories.length > 0 ? (
        <AnimatedContent direction="up">
          <div>
            <div className="eyebrow mb-5">索引</div>
            <Ledger>
              {categories.map(({ category, count }, i) => (
                <LedgerRow
                  key={category}
                  ordinal={i + 1}
                  href={`/categories/${category}`}
                  title={category}
                  desc={latestByCategory.get(category) && `最新一篇 · ${latestByCategory.get(category)}`}
                  meta={`${count} 篇`}
                />
              ))}
            </Ledger>
          </div>
        </AnimatedContent>
      ) : (
        <EmptyState
          icon={<IconFolder size={30} strokeWidth={1.25} />}
          title="还没有分类"
          description="在文章 frontmatter 中添加 category 字段"
        />
      )}

      {/* ── 系列：同一主题下的连续思考（真实数据：getAllSeries） ── */}
      {series.length > 0 && (
        <AnimatedContent direction="up" delay={0.05}>
          <section className="mt-16 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="eyebrow mb-4">系列 · Series</div>
            <div className="flex flex-wrap gap-2">
              {series.map(({ series: name, count }) => (
                <Link
                  key={name}
                  href={`/series/${name}`}
                  className="capsule transition-colors"
                >
                  {name}
                  <span className="meta">{count}</span>
                </Link>
              ))}
            </div>
          </section>
        </AnimatedContent>
      )}

      {/* ── 课程：/learn 五门体系（真实数据：COURSES + getCurriculumStats） ── */}
      <AnimatedContent direction="up" delay={0.1}>
        <section className="mt-16 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <div className="eyebrow mb-2">课程 · Learn</div>
              <h2 className="section-title">成体系的学习路径</h2>
            </div>
            <Link href="/learn" className="btn-ghost text-sm">
              进入课程体系
              <IconArrowUpRight size={14} strokeWidth={2} />
            </Link>
          </div>
          <div>
            {courses.map((course) => (
              <Link
                key={course.id}
                href={course.href}
                className="group flex items-baseline justify-between gap-6 py-5 transition-colors"
                style={{ borderBottom: '1px solid var(--line)' }}
              >
                <div className="min-w-0">
                  <span
                    className="font-serif font-bold transition-colors group-hover:text-[var(--accent-text)]"
                    style={{ fontSize: 17, lineHeight: 1.4, color: 'var(--ink)' }}
                  >
                    {course.name}
                  </span>
                  <span className="meta ml-3">
                    {course.stats.lessons} 篇 · {course.stats.weeks} 周
                  </span>
                </div>
                <IconArrowUpRight
                  size={15}
                  strokeWidth={2}
                  className="flex-shrink-0 opacity-0 transition-all duration-[300ms] group-hover:opacity-100"
                  style={{ color: 'var(--accent-text)' }}
                />
              </Link>
            ))}
          </div>
        </section>
      </AnimatedContent>
    </div>
  )
}
