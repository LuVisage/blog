import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'

/**
 * 编辑式文章列表：日期 → 标题 → 一句话摘要 → 标签，靠发丝线分行。
 * 参照 Jim Nielsen / overreacted / Lee Robinson 的首页范式——没有卡片、缩略图、
 * 序号和悬停光效，标题 hover 变强调色是唯一的交互反馈。
 */
export function EditorialList({ posts, compact = false }: { posts: PostMeta[]; compact?: boolean }) {
  if (!posts.length) return null

  return (
    <ol className="editorial__list">
      {posts.map((post) => (
        <li key={post.slug} className={`editorial__item${compact ? ' editorial__item--compact' : ''}`}>
          <Link href={`/posts/${post.slug}`} className="editorial__item-link">
            <div className="editorial__meta">
              <time dateTime={post.date}>
                {format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}
              </time>
              <span aria-hidden="true">·</span>
              {post.category && (
                <>
                  <span>{post.category}</span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span>{post.readingTime} 分钟</span>
            </div>

            <h3 className="editorial__item-title">{post.title}</h3>

            {!compact && post.description && (
              <p className="editorial__item-desc">{post.description}</p>
            )}
          </Link>

          {!compact && post.tags.length > 0 && (
            <div className="editorial__tags">
              {post.tags.slice(0, 3).map((tag) => (
                <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
