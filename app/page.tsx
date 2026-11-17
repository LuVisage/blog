import { getAllPosts, getAllTags, getAllCategories, getPopularPosts } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'
import { EditorialList } from '@/components/editorial-list'
import { SubscribeCard } from '@/components/subscribe-card'
import { AvatarImage } from '@/components/avatar-image'
import { SITE } from '@/lib/constants'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 首页 · ZK 简洁风。
 *
 * 刊头只留 eyebrow / 标题 / 导语 / 一行计量；编号快捷入口、翻板数字、签名色带、
 * 视差与课程编排图版全部下线（入口全局导航已有，编排图在 /learn 有完整版）。
 * 主栏是纯文字文章行，侧栏保留身份、精选、标签、书架与订阅五个功能块。
 */
export default function HomePage() {
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()
  const featured = getPopularPosts(3)
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)
  const latestDate = allPosts[0]?.date

  const shelves = [
    { href: '/categories', label: '分类', count: categories.length },
    { href: '/tags', label: '标签', count: tags.length },
    { href: '/series', label: '系列', count: null },
    { href: '/subscribe', label: '订阅', count: null },
  ]

  return (
    <div className="editorial">
      <header className="editorial__masthead">
        <div className="editorial__masthead-main">
          <div className="eyebrow editorial__eyebrow">
            BARON_ZHANG · 个人志
            <span className="editorial__eyebrow-sep">/</span>
            AI · Agent · LLM
          </div>
          <h1 className="editorial__title mt-4">写在 AI 时代的开发笔记</h1>
          <p className="editorial__intro">
            关于大模型、Agent 与工程实践的一手记录。不是转述文档，而是把跑通的代码、
            踩过的坑和取舍理由一并写下来；写得慢一点，但每篇都经得起追问。
          </p>
          <p className="editorial__meta-line">
            {allPosts.length} 篇文章 · {lessons} 课次 · {tags.length} 标签
            {latestDate && (
              <>
                {' · 最近更新 '}
                <time dateTime={latestDate}>{format(parseISO(latestDate), 'yyyy.MM.dd', { locale: zhCN })}</time>
              </>
            )}
          </p>
        </div>
      </header>

      <div className="editorial__rule" />

      <div className="editorial__grid">
        <div className="editorial__main">
          <section className="editorial__section" aria-labelledby="latest-title">
            <div className="editorial__section-head">
              <h2 id="latest-title">最新</h2>
              <Link href="/posts">全部 {allPosts.length} 篇 →</Link>
            </div>
            <EditorialList posts={allPosts.slice(0, 5)} />
          </section>
        </div>

        <aside className="editorial__side" aria-label="站点信息与导航">
          <section className="side-block">
            <h2>关于本站</h2>
            <div className="side-about">
              <span className="side-about__avatar"><AvatarImage src={SITE.avatar} alt={SITE.author.name} /></span>
              <p>
                AI 探索者 &amp; Agent 开发者。关注大模型应用、Agent 架构与工程实践，
                也记录把技术讲清楚的过程。
              </p>
            </div>
          </section>

          <section className="side-block">
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

          <section className="side-block">
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

          <section className="side-block">
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

          <section className="side-block editorial__subscribe" aria-labelledby="subscribe-title">
            <SubscribeCard />
          </section>
        </aside>
      </div>
    </div>
  )
}