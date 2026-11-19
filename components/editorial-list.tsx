import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'

// A 方向规则线文章行：编号 / 日期 / 标题摘要 / 分类标签 四栏。
// 标题是主 Link（整行 hover 由 .arow:hover 驱动），标签留在 a-tax 里各自可点，
// 避免行级 Link 嵌套标签 Link 的非法结构。compact 摘掉摘要与右栏。
export function EditorialList({ posts, compact = false }: { posts: PostMeta[]; compact?: boolean }) {
  if (!posts.length) return null

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {posts.map((post, i) => (
        <li key={post.slug} className="arow">
          <span className="a-idx" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>

          <p className="a-date">
            <b>
              <time dateTime={post.date}>{format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}</time>
            </b>
            <br />
            {post.readingTime} 分钟
          </p>

          <div className="a-main">
            <Link href={`/posts/${post.slug}`} className="a-title no-underline">
              {post.title}
            </Link>
            {!compact && post.description && <p className="a-desc">{post.description}</p>}
          </div>

          {!compact && (
            <div className="a-tax">
              <span className="a-cat">{post.category || '分类未标注'}</span>
              {post.series && (
                <Link href={`/series/${post.series}`} className="a-ser no-underline">
                  系列 · {post.series}
                </Link>
              )}
              {post.tags.length > 0 && (
                <span className="a-tags">
                  {post.tags.slice(0, 4).map((tag, j) => (
                    <span key={tag}>
                      {j > 0 && ' / '}
                      <Link href={`/tags/${tag}`} className="no-underline">{tag}</Link>
                    </span>
                  ))}
                </span>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
