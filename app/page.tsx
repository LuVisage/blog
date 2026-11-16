import { getAllPosts, getAllTags, getAllCategories, getPopularPosts } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats, getReferencePages } from '@/lib/curriculum'
import { EditorialList } from '@/components/editorial-list'
import { SubscribeCard } from '@/components/subscribe-card'
import { CoursePlate } from '@/components/course-plate'
import { StatsTile } from '@/components/ui/stats-tile'
import { Parallax } from '@/components/ui/interaction'
import { AvatarImage } from '@/components/avatar-image'
import { SITE } from '@/lib/constants'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { IconArrowUpRight } from '@tabler/icons-react'

/**
 * 首页 · 第 20 轮「质感回炉」。
 *
 * 第 19 轮把它削成一条竖线：刊头只剩标题 + 三个数字，主栏是裸 SVG + 五行纯文字，
 * 侧栏全是没有锚点的段落。对照 CT-home-light 那版亮色稿（字标 / 终端指令 / 图标入口 /
 * 带缩略图的数据栏）和第 18 轮实测的 Maggie Appleton / Gwern 分栏，重新把
 * 「视觉锚点」补回来：签名色带、编号快捷入口、翻板数字、图版装裱、复合文章行、
 * 侧栏编号与标签云。骨架仍是 1200px 中轴 + 760/320 分栏，窄屏整列坍缩。
 *
 * 动效全部挂在 interaction.tsx / stats-tile 的 CSS 上：无 JS 时这些内容照样完整呈现。
 */
export default function HomePage() {
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()
  const featured = getPopularPosts(3)
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)
  const references = COURSE_IDS.reduce((sum, id) => sum + getReferencePages(id).length, 0)
  const latestDate = allPosts[0]?.date

  const quick = [
    { href: '/posts', label: '文章' },
    { href: '/learn', label: '教程' },
    { href: '/archive', label: '归档' },
    { href: '/search', label: '搜索' },
    { href: '/about', label: '关于' },
  ]

  const shelves = [
    { href: '/categories', label: '分类', count: categories.length },
    { href: '/tags', label: '标签', count: tags.length },
    { href: '/series', label: '系列', count: null },
    { href: '/subscribe', label: '订阅', count: null },
  ]

  return (
    <div className="editorial">
      <header className="editorial__masthead">
        <div className="editorial__signature" aria-hidden="true" />
        <Parallax className="editorial__masthead-inner" max={40}>
          <div className="editorial__masthead-main">
            <div className="eyebrow editorial__eyebrow">
              <span className="editorial__eyebrow-mark" aria-hidden="true" />
              BARON_ZHANG · 个人志
              <span className="editorial__eyebrow-sep">/</span>
              AI · Agent · LLM
            </div>
            <h1 className="editorial__title mt-4">写在 AI 时代的开发笔记</h1>
            <p className="editorial__intro">
              关于大模型、Agent 与工程实践的一手记录。不是转述文档，而是把跑通的代码、
              踩过的坑和取舍理由一并写下来；写得慢一点，但每篇都经得起追问。
            </p>

            {/* 编号入口带：第 19 轮删掉的纯文字导航，回来时带上序号、发丝线和箭头，
                它现在是刊头的「本期目录」而不是又一套全局导航。 */}
            <nav className="editorial__quick" aria-label="站内入口">
              {quick.map((q, i) => (
                <Link key={q.href} href={q.href} className="editorial__quick-item" data-glow>
                  <span className="editorial__quick-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="editorial__quick-label">{q.label}</span>
                  <IconArrowUpRight size={14} strokeWidth={1.75} className="editorial__quick-arrow" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="editorial__stats-pane">
            <div className="eyebrow editorial__stats-label">出版数据 · ISSUE 01</div>
            <div className="editorial__stats" aria-label="出版数据">
              <StatsTile value={allPosts.length} label="文章" />
              <StatsTile value={lessons} label="课次" />
              <StatsTile value={tags.length} label="标签" />
            </div>
            {latestDate && (
              <div className="editorial__stats-foot">
                <span>最近更新</span>
                <time dateTime={latestDate}>{format(parseISO(latestDate), 'yyyy.MM.dd', { locale: zhCN })}</time>
              </div>
            )}
          </div>
        </Parallax>
      </header>

      <div className="editorial__rule" />

      <div className="editorial__grid">
        <div className="editorial__main">
          <figure className="editorial__figure">
            <div className="editorial__figure-head">
              <span className="editorial__figure-mark" aria-hidden="true" />
              <span className="eyebrow">图版 01 · 课程编排</span>
              <Link href="/learn">
                查看课程体系 <IconArrowUpRight size={13} strokeWidth={1.75} />
              </Link>
            </div>
            <div className="editorial__figure-plate">
              <CoursePlate />
            </div>
            <figcaption>
              中心的 LLM 核心连着 {COURSE_IDS.length} 门课程、{lessons} 篇课次，另有 {references} 篇课程总览、周计划与速查页
              —— 点任一节点进入该课程。
              <Link href="/learn">查看课程体系 →</Link>
            </figcaption>
          </figure>

          <section className="editorial__section" aria-labelledby="latest-title">
            <div className="editorial__section-head">
              <h2 id="latest-title"><span className="section-mark" aria-hidden="true" />最新</h2>
              <Link href="/posts">全部 {allPosts.length} 篇 →</Link>
            </div>
            <EditorialList posts={allPosts.slice(0, 5)} />
          </section>
        </div>

        <aside className="editorial__side" aria-label="站点信息与导航">
          <section className="side-block" data-index="01">
            <h2>关于本站</h2>
            <div className="side-about">
              <span className="side-about__avatar"><AvatarImage src={SITE.avatar} alt={SITE.author.name} /></span>
              <p>
                AI 探索者 &amp; Agent 开发者。关注大模型应用、Agent 架构与工程实践，
                也记录把技术讲清楚的过程。
              </p>
            </div>
          </section>

          <section className="side-block" data-index="02">
            <div className="side-block__head">
              <h2>精选</h2>
              <Link href="/posts">全部 →</Link>
            </div>
            <ol className="side-list">
              {featured.map((post, i) => (
                <li key={post.slug}>
                  <span className="side-list__no">{String(i + 1).padStart(2, '0')}</span>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  <span>{format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="side-block" data-index="03">
            <div className="side-block__head">
              <h2>热门标签</h2>
              <Link href="/tags">全部 →</Link>
            </div>
            <div className="side-tagcloud">
              {tags.slice(0, 9).map(({ tag, count }) => (
                <Link key={tag} href={`/tags/${tag}`} className="side-tag">
                  #{tag}<span>{count}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="side-block" data-index="04">
            <h2>书架</h2>
            <ul className="side-links">
              {shelves.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    {item.label}
                    {item.count !== null && <span>{item.count}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="side-block editorial__subscribe" data-index="05" aria-labelledby="subscribe-title">
            <SubscribeCard />
          </section>
        </aside>
      </div>
    </div>
  )
}
