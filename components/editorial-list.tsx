import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { TypographicCover } from '@/components/typographic-cover'
import { IconArrowUpRight } from '@tabler/icons-react'

/**
 * 编辑式文章行（第 20 轮复合版，ZI 换排字图版）。
 *
 * 第 19 轮之后这里是一串纯文字：日期 → 标题 → 摘要 → 标签，整页没有一张图、
 * 没有一个色块，读者第一眼找不到落点。这一版把「编号 + 题图 + 元信息 + 标题 +
 * 摘要 + 箭头」装进同一行。题图原是 lib/covers.ts 的 AI 封面池，ZI 起换成
 * 排字图版（标题首字 + 刊头语汇），整行仍是唯一一个 <Link>，标签行留在外面各自可点。
 *
 * `data-glow` 交给 GlowRows 做跟手柔光；所有 hover 反馈都在 CSS 里，
 * 只用 transform / opacity / color 系属性。
 */
export function EditorialList({ posts, compact = false }: { posts: PostMeta[]; compact?: boolean }) {
  if (!posts.length) return null

  return (
    <ol className="editorial__list">
      {posts.map((post, i) => {
        return (
          <li
            key={post.slug}
            className={`editorial__item feature-row${compact ? ' editorial__item--compact' : ''}`}
          >
            <Link
              href={`/posts/${post.slug}`}
              className="editorial__item-link feature-row__link"
              data-glow
            >
              <span className="feature-row__thumb" aria-hidden="true">
                <TypographicCover post={post} variant="thumb" />
                <span className="feature-row__no">{String(i + 1).padStart(2, '0')}</span>
              </span>

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

              <span className="feature-row__arrow" aria-hidden="true">
                <IconArrowUpRight size={18} strokeWidth={1.75} />
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
