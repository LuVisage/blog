import type { Metadata } from 'next'
import Link from 'next/link'
import { SITE } from '@/lib/constants'
import { getAllCategories, getAllPosts, getAllSeries } from '@/lib/posts'
import { COURSES, getCurriculumStats, type CourseId } from '@/lib/curriculum'
import { PageMasthead } from '@/components/page-masthead'
import { LedgerRow, Ledger } from '@/components/ledger-row'
import { IndexRail } from '@/components/index-rail'
import { EmptyState } from '@/components/ui/empty-state'
import { IconFolder } from '@tabler/icons-react'

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

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-16 items-start">
        <div className="min-w-0">
          {categories.length > 0 ? (
            <div>
              <div>
                <div className="shead" style={{ flexWrap: 'wrap' }}>
                  <span className="snum" aria-hidden="true">01</span>
                  <h2>分类索引</h2>
                  <span className="smeta">CATEGORIES · {categories.length} 个</span>
                </div>
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
            </div>
          ) : (
            <EmptyState
              icon={<IconFolder size={30} strokeWidth={1.25} />}
              title="还没有分类"
              description="文章发出后，栏目会在这里汇总"
            />
          )}

          {/* ── 系列：同一主题下的连续思考（真实数据：getAllSeries） ── */}
          {series.length > 0 && (
            <div>
              <section style={{ marginTop: 'var(--space-64)' }}>
                <div className="shead" style={{ flexWrap: 'wrap' }}>
                  <span className="snum" aria-hidden="true">02</span>
                  <h2>系列栏目</h2>
                  <span className="smeta">SERIES · {series.length} 个 · <Link href="/series">全部 →</Link></span>
                </div>
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
            </div>
          )}

          {/* ── 课程：/learn 五门体系（真实数据：COURSES + getCurriculumStats） ── */}
          <div>
            <section style={{ marginTop: 'var(--space-64)' }}>
              <div className="shead" style={{ flexWrap: 'wrap' }}>
                <span className="snum" aria-hidden="true">03</span>
                <h2>成体系的学习路径</h2>
                <span className="smeta">LEARN · {courses.length} 门 · <Link href="/learn">进入 →</Link></span>
              </div>
              <Ledger>
                {courses.map((course, i) => (
                  <LedgerRow
                    key={course.id}
                    ordinal={i + 1}
                    href={course.href}
                    title={course.name}
                    meta={`${course.stats.lessons} 篇 · ${course.stats.weeks} 周`}
                  />
                ))}
              </Ledger>
            </section>
          </div>
        </div>

        <IndexRail hide={['categories', 'series']} />
      </div>
    </div>
  )
}
