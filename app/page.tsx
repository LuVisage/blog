import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { getAllPosts, getAllSeries, getPostsBySeries } from '@/lib/posts'
import { COURSES, COURSE_IDS, getCurriculumStats, getWeeks, getAllLessons, lessonHref, type CourseId } from '@/lib/curriculum'
import { SITE, ABOUT, SOCIAL_LINKS, EMAIL_OBFUSCATED, basePathUrl } from '@/lib/constants'
import { EditorialList } from '@/components/editorial-list'
import { FigurePlate } from '@/components/figure-plate'
import { ObfuscatedEmailIcon } from '@/components/obfuscated-email'

/**
 * 首页 · A 方向「巨字工程出版」。
 *
 * hero 是巨字工程信条 + 作者原话简介（ABOUT.bio），右栏对位最新与教程入口，
 * 并以一块夜城横 banner 图版收住右栏（首屏可见的唯一图版，ZM D4 密度契约内）；
 * 往下四个编号区块：01 最新文章（规则线行）/ 02 交互教程（DAY 计数 + 验收章母题）/
 * 03 系列栏目（真实计数巨字）/ 04 反转黑带（关注方向 × 订阅）。
 * 所有计数、日期、课程进度都从 content/ 与 lib/ 现算，不编造。
 */

// 课程显示名与 /learn 的 CARDS 同源；首页只取名称与统计，不复制 tagline。
const COURSE_NAMES: Record<CourseId, string> = {
  devtool: '工具箱 · 开发工具链',
  ml: '机器学习与深度学习',
  backend: 'Python 工程化与后端实战',
  agent: '从零到生产级 Agent',
  csp: 'CSP 认证 20 天冲刺',
}
const COURSE_KIND: Record<CourseId, string> = {
  devtool: 'TOOLBOX · 工具手册',
  ml: 'LEARN · 主线课程',
  backend: 'CURRICULUM · 工程实战',
  agent: 'LEARN · 交互教程',
  csp: 'CURRICULUM · 备考冲刺',
}
const SIDE_COURSES: CourseId[] = ['agent', 'ml', 'devtool', 'csp']

const pad = (n: number) => String(n).padStart(2, '0')
const fmtDate = (d: string) => format(parseISO(d), 'yyyy.MM.dd', { locale: zhCN })

export default function HomePage() {
  const allPosts = getAllPosts()
  const series = getAllSeries()
  const latest = allPosts[0]
  const totalLessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)

  const backendWeeks = getWeeks('backend')
  const backendStats = getCurriculumStats('backend')

  return (
    <div>
      {/* hero：全幅巨字（作者原话）+ 右栏对位（最新 / 去哪） */}
      <section className="hero" aria-label="作者与主张">
        <div className="hero-grid">
          <div className="hero-main">
            <p className="hero-eyebrow">{SITE.title} — {ABOUT.title}</p>
            <p className="hero-lede">我相信</p>
            <h1 className="hero-h1">
              <span className="ln"><span>算法要跑通</span></span>
              <span className="ln"><span>工程要验收<i className="dot">。</i></span></span>
            </h1>
            <p className="hero-bio">{ABOUT.bio}</p>
            <p className="hero-attr">
              —— 作者自述 · <Link href="/about" className="no-underline" style={{ color: 'inherit' }}>ABOUT</Link>
            </p>
          </div>

          <aside className="hero-side" aria-label="最新与入口">
            <div className="side-card">
              <p className="side-k">LATEST{latest ? ` · ${fmtDate(latest.date)}` : ''}</p>
              {latest && (
                <>
                  <Link href={`/posts/${latest.slug}`} className="side-title no-underline">{latest.title}</Link>
                  <p className="side-meta">
                    {latest.category ? `分类 ${latest.category}` : '分类未标注'}
                    {latest.series ? ` · 系列 ${latest.series}` : ''}
                  </p>
                </>
              )}
              <Link href="/posts" className="side-more no-underline">全部 {pad(allPosts.length)} 篇 <span aria-hidden="true">↓</span></Link>
              <span className="seal" aria-hidden="true">跑通</span>
            </div>
            <div>
              <p className="side-k">LEARN · {pad(COURSE_IDS.length)} 门</p>
              <p className="side-note">每步附验收命令 · 共 {totalLessons} 课次。</p>
              <Link href="/learn" className="side-more no-underline">跟一个 DAY <span aria-hidden="true">↓</span></Link>
            </div>
            <FigurePlate
              src="/fig/city-band.webp"
              alt="像素画风的夜城横幅：绿色夜空下的厂房屋顶、脚手架与点点窗灯"
              width={1084}
              height={416}
            />
          </aside>
        </div>
      </section>

      {/* 01 最新文章 */}
      <section aria-labelledby="latest-title">
        <div className="shead">
          <span className="snum" aria-hidden="true">01</span>
          <h2 id="latest-title">最新文章</h2>
          <span className="smeta">
            LATEST · {pad(allPosts.length)} 篇 · 日期倒序 · <Link href="/posts">全部 →</Link>
          </span>
        </div>
        <EditorialList posts={allPosts.slice(0, 6)} />
      </section>

      {/* 02 交互教程：母题主场 —— DAY 计数 + 验收章 */}
      <section aria-labelledby="learn-title" style={{ marginTop: 'var(--space-96)' }}>
        <div className="shead">
          <span className="snum" aria-hidden="true">02</span>
          <h2 id="learn-title">交互教程</h2>
          <span className="smeta">
            LEARN / CURRICULUM / TOOLBOX · {pad(COURSE_IDS.length)} 门 · <Link href="/learn">进入 →</Link>
          </span>
        </div>

        <div className="learn-grid">
          {/* 左：backend 全展开 */}
          <div className="course-feature">
            <p className="course-k">{COURSE_KIND.backend}</p>
            <h3 className="course-name">
              <Link href={COURSES.backend.path} className="no-underline" style={{ color: 'inherit' }}>{COURSE_NAMES.backend}</Link>
            </h3>
            <p className="course-scale">{backendStats.lessons} 天 · {backendStats.weeks} 周 · 每天附验收命令</p>

            {backendWeeks.map(({ week, title, lessons }) => (
              <div className="week" key={week}>
                <p className="week-h">
                  WEEK {pad(week)} · {title}
                  <small>DAY {pad(lessons[0].day)}–{pad(lessons[lessons.length - 1].day)}</small>
                </p>
                <ul>
                  {lessons.map((lesson) => (
                    <li className="day" key={lesson.slug}>
                      <span className="daynum">DAY {pad(lesson.day)}</span>
                      <Link
                        href={lessonHref('backend', lesson.slug)}
                        className="daytitle no-underline transition-colors hover:text-[var(--accent-text)]"
                      >
                        {lesson.title}
                      </Link>
                      <span className="check" title="附验收命令" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="accept-note">
              <span className="check" aria-hidden="true" /> 红勾 = 该 DAY 附验收命令。学习进度只存在你自己的浏览器里。
            </p>
          </div>

          {/* 右：其余四门，对位排印 */}
          <div className="course-list">
            {SIDE_COURSES.map((course) => {
              const stats = getCurriculumStats(course)
              const lessons = getAllLessons(course)
              const first = lessons[0]
              const last = lessons[lessons.length - 1]
              return (
                <div className="course-row" key={course}>
                  <p className="course-k">{COURSE_KIND[course]}</p>
                  <div className="cr-head">
                    <h3 className="course-name">
                      <Link href={COURSES[course].path} className="no-underline" style={{ color: 'inherit' }}>{COURSE_NAMES[course]}</Link>
                    </h3>
                    <span className="course-scale">{stats.weeks} 周 · {stats.lessons} 天</span>
                  </div>
                  {first && (
                    <p className="cr-day">
                      <span className="daynum">DAY {pad(first.day)}</span>
                      <Link href={lessonHref(course, first.slug)} className="no-underline transition-colors hover:text-[var(--accent-text)]" style={{ color: 'var(--body)' }}>
                        {first.title}
                      </Link>
                      <span className="check" title="附验收命令" aria-hidden="true" />
                    </p>
                  )}
                  {last && last.slug !== first?.slug && (
                    <p className="cr-day">
                      <span className="daynum">DAY {pad(last.day)}</span>
                      <Link href={lessonHref(course, last.slug)} className="no-underline transition-colors hover:text-[var(--accent-text)]" style={{ color: 'var(--body)' }}>
                        {last.title}
                      </Link>
                      <span className="check" title="附验收命令" aria-hidden="true" />
                    </p>
                  )}
                </div>
              )
            })}
            <p className="learn-static">
              课程入口接 /learn 各课程页。<br />
              课内含 Quiz / Checklist / GotchaTable / DayComplete / 可交互模拟实验（labs）。
            </p>
          </div>
        </div>
      </section>

      {/* 03 系列栏目：真实计数 */}
      {series.length > 0 && (
        <section aria-labelledby="series-title" style={{ marginTop: 'var(--space-96)' }}>
          <div className="shead">
            <span className="snum" aria-hidden="true">03</span>
            <h2 id="series-title">系列栏目</h2>
            <span className="smeta">SERIES · 计数由真实文章表算得 · <Link href="/series">全部 →</Link></span>
          </div>
          <div className="ser-grid">
            {series.slice(0, 3).map(({ series: name, count }) => {
              const posts = getPostsBySeries(name)
              return (
                <div className="ser" key={name}>
                  <p className="ser-count">{pad(count)}<small>篇</small></p>
                  <h3 className="ser-name">
                    <span className="check" aria-hidden="true" />
                    <Link href={`/series/${name}`} className="no-underline" style={{ color: 'inherit' }}>{name}</Link>
                  </h3>
                  <ul className="ser-list">
                    {posts.slice(0, 3).map((post) => (
                      <li key={post.slug}>
                        <Link href={`/posts/${post.slug}`} className="no-underline">
                          {post.title}
                          <span className="mono">{fmtDate(post.date)}{post.seriesOrder ? ` · 第 ${post.seriesOrder} 篇` : ''}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 04 反转黑带：关注方向 × 订阅 */}
      <section className="darkband" aria-labelledby="focus-title">
        <div className="dark-grid">
          <div className="focus-col">
            <p className="dark-k">04 / FOCUS · ABOUT.FOCUSAREAS</p>
            <h2 className="dark-h" id="focus-title">关注方向</h2>
            <ul className="focus">
              {ABOUT.focusAreas.map((area) => (
                <li key={area.title}>
                  <span className="check lt" aria-hidden="true" />
                  <div>
                    <b>{area.title}</b>
                    <small>{area.desc}</small>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="dark-k">SUBSCRIBE · 三种订阅源真实存在</p>
            <h2 className="dark-h">订阅这份笔记</h2>
            <div className="feeds">
              <a className="feed no-underline" href={basePathUrl('/rss.xml')}><b>RSS 2.0</b><small>XML</small><span className="arr" aria-hidden="true">→</span></a>
              <a className="feed no-underline" href={basePathUrl('/atom.xml')}><b>ATOM 1.0</b><small>XML</small><span className="arr" aria-hidden="true">→</span></a>
              <a className="feed no-underline" href={basePathUrl('/feed.json')}><b>JSON FEED 1.1</b><small>JSON</small><span className="arr" aria-hidden="true">→</span></a>
            </div>
            <p className="dark-note">
              没有邮件列表，也不收集地址。把订阅源加进任意阅读器即可。
              <br />
              联系：
              <ObfuscatedEmailIcon encoded={EMAIL_OBFUSCATED} label="邮件" className="cursor-pointer" style={{ color: 'var(--footer-ink)' }}>
                邮箱 · 运行时解码
              </ObfuscatedEmailIcon>
              {SOCIAL_LINKS.github && (
                <>
                  {' · '}
                  <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--footer-ink)' }}>GitHub</a>
                </>
              )}
            </p>
            <a className="gh-big no-underline" href={SITE.repo} target="_blank" rel="noopener noreferrer">
              GITHUB 仓库 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
