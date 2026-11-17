import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'

/**
 * 编辑式文章行 · ZK 简洁风：日期 / 分类 / 时长 → 标题 → 摘要，整行一个 <Link>，
 * 标签行留在外面各自可点。题图、编号块、跟手柔光与箭头装饰全部下线，
 * hover 反馈只留标题换色（CSS）。
 */
export function EditorialList({ posts, compact = false }: { posts: PostMeta[]; compact?: boolean }) {
  if (!posts.length) return null

  return (
    <ol className="editorial__list">
      {posts.map((post) => {
        return (
          <li
            key={post.slug}
            className={`editorial__item feature-row${compact ? ' editorial__item--compact' : ''}`}
          >
            <Link href={`/posts/${post.slug}`} className="editorial__item-link feature-row__link">
              <span className="feature-row__body">
                <span className="editorial__meta">
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
                </span>

                <h3 className="editorial__item-title">{post.title}</h3>

                {!compact && post.description && (
                  <p className="editorial__item-desc">{post.description}</p>
                )}
              </span>
            </Link>

            {!compact && post.tags.length > 0 && (
              <div className="editorial__tags">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`}>#{tag}</Link>
                ))}
              </div>
            )}
          </li>
        )
      })}
    </ol>
  )
}