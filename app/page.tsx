import { basePathUrl } from '@/lib/constants'
import { getAllPosts, getAllTags, getAllCategories, getPopularPosts } from '@/lib/posts'
import { COURSE_IDS, getCurriculumStats } from '@/lib/curriculum'
import { EditorialList } from '@/components/editorial-list'
import { SubscribeCard } from '@/components/subscribe-card'
import { ModelViewer3D } from '@/components/model-viewer-3d'
import { AIHotNews } from '@/components/ai-hot-news'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

/**
 * 首页 · 第 8 轮「分栏编排」
 *
 * 实地量过布局型博客后重排：Maggie Appleton 用 1268px 容器 + 3 列网格，
 * 不同内容块跨 1/2 列；Gwern 用 895px 容器把 NEWEST / POPULAR 并排成双列；
 * Frank Chimero 把刊头做成固定半屏；Brian Lovin 用全局侧栏 + 多栏 list-detail。
 * 共同点：刊头跨全宽、内容按重要度分栏、容器全站一致、窄屏整列坍缩。
 *
 * 本站据此从「680px 一条竖线」改成：全宽刊头 → 主内容 + 常驻侧栏并排，
 * 容器宽度与文章列表 / 文章页对齐（同一个 1200px main 容器）。
 */
export default function HomePage() {
  const allPosts = getAllPosts()
  const tags = getAllTags()
  const categories = getAllCategories()
  const featured = getPopularPosts(3)
  const lessons = COURSE_IDS.reduce((sum, id) => sum + getCurriculumStats(id).lessons, 0)

  const shelves = [
    { href: '/bookmarks', label: '收藏夹', count: null },
    { href: '/categories', label: '分类', count: categories.length },
    { href: '/tags', label: '标签', count: tags.length },
    { href: '/series', label: '系列', count: null },
    { href: '/learn', label: '课程', count: lessons },
    { href: '/projects', label: '项目', count: null },
    { href: '/friends', label: '友链', count: null },
    { href: '/now', label: '现在', count: null },
    { href: '/uses', label: '工具', count: null },
    { href: '/subscribe', label: '订阅', count: null },
  ]

  return (
    <div className="editorial">
      <header className="editorial__masthead">
        <div className="editorial__masthead-inner">
          <div>
            <div className="eyebrow">AI · Agent · LLM · 个人志</div>
            <h1 className="editorial__title mt-4">写在 AI 时代的开发笔记</h1>
            <p className="editorial__intro">
              关于大模型、Agent 与工程实践的一手记录。不是转述文档，而是把跑通的代码、
              踩过的坑和取舍理由一并写下来；写得慢一点，但每篇都经得起追问。
            </p>
            <nav className="editorial__nav" aria-label="站内入口">
              <Link href="/posts">文章</Link>
              <Link href="/learn">教程</Link>
              <Link href="/archive">归档</Link>
              <Link href="/about">关于</Link>
              <Link href="/search">搜索</Link>
            </nav>
          </div>
          <dl className="editorial__stats" aria-label="出版数据">
            <div><dt>文章</dt><dd>{allPosts.length}</dd></div>
            <div><dt>课次</dt><dd>{lessons}</dd></div>
            <div><dt>标签</dt><dd>{tags.length}</dd></div>
          </dl>
        </div>
      </header>

      <div className="editorial__rule" />

      <div className="editorial__grid">
        {/* 主栏：模型的语义 + 文章正文流 */}
        <div className="editorial__main">
          <figure className="editorial__figure">
            <ModelViewer3D
              src={basePathUrl('/models/agent-network-web.glb')}
              poster={basePathUrl('/images/3d/agent-network-poster-alpha.webp')}
              posterAlt="LLM 核心与五个 Agent 节点组成的 3D 网络拓扑"
            />
            <figcaption>
              中心的 LLM 核心连着 {COURSE_IDS.length} 个 Agent 节点 —— 对应本站的 {COURSE_IDS.length} 门课程、{lessons} 篇课次。
              <Link href="/learn">查看课程体系 →</Link> · 拖拽可旋转
            </figcaption>
          </figure>

          <section className="editorial__section" aria-labelledby="latest-title">
            <div className="editorial__section-head">
              <h2 id="latest-title">最新</h2>
              <Link href="/posts">全部 {allPosts.length} 篇 →</Link>
            </div>
            <EditorialList posts={allPosts.slice(0, 5)} />
          </section>
        </div>

        {/* 侧栏：常驻的辅助信息，参考 Gwern 的紧凑链接列与 Brian Lovin 的全局侧栏 */}
        <aside className="editorial__side" aria-label="站点信息与导航">
          <section className="side-block">
            <h2>关于本站</h2>
            <p>
              AI 探索者 &amp; Agent 开发者。关注大模型应用、Agent 架构与工程实践，
              也记录把技术讲清楚的过程。
            </p>
          </section>

          <section className="side-block">
            <div className="side-block__head">
              <h2>精选</h2>
              <Link href="/posts">全部 →</Link>
            </div>
            <ol className="side-list">
              {featured.map((post) => (
                <li key={post.slug}>
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  <span>{format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}</span>
                </li>
              ))}
            </ol>
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

          <section className="side-block editorial__aside" aria-label="外部热榜">
            <AIHotNews />
            <noscript
              dangerouslySetInnerHTML={{
                __html:
                  '<p class="body-sm mt-3" style="color:var(--muted)">热榜由浏览器现场向 GitHub 取回，需要执行 JavaScript；不执行时这里只会留着说明。</p>',
              }}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}
