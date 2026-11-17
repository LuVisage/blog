import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'

/**
 * 排字图版封面（Batch ZI）。
 *
 * 替代 lib/covers.ts 的三张 AI 渲染封面：那批图与文章内容无关，只是同一件
 * 3D 静物的三个角度，读者从图上读不到任何关于这篇文章的信息。现代编辑式
 * 博客（overreacted / Maggie Appleton 一系）的做法是把标题本身排成图版 ——
 * 封面即内容预告，零素材依赖。
 *
 * 这里沿用同一套确定性：FNV-1a 哈希 slug 选版式，标题首个汉字/字母作大字。
 * 服务端渲染、零 JS、零位图，颜色全走令牌。lib/covers.ts 被用户第 4 条决定
 * 锁在 lib/ 里不能删，三个消费点改调本组件后它不再被引用（台账 §11.44）。
 *
 * 图版与标题文字重复，整块 aria-hidden；文章页的 figcaption 说明它是排字生成。
 */

function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

export function coverGlyph(title: string): string {
  const m = title.match(/[一-鿿A-Za-z0-9]/)
  return m ? m[0].toUpperCase() : '文'
}

type CoverPost = Pick<PostMeta, 'slug' | 'title' | 'date' | 'category' | 'readingTime'>

export function TypographicCover({
  post,
  variant,
}: {
  post: CoverPost
  variant: 'plate' | 'thumb' | 'mini'
}) {
  const glyph = coverGlyph(post.title)

  if (variant === 'mini') {
    return (
      <span className="typo-cover typo-cover--mini row-cover" aria-hidden="true">
        {glyph}
      </span>
    )
  }

  if (variant === 'thumb') {
    return (
      <span className="typo-cover typo-cover--thumb" aria-hidden="true">
        <span className="typo-cover__glyph">{glyph}</span>
        <span className="typo-cover__tick" />
      </span>
    )
  }

  const layout = ['left', 'right', 'center'][hash(post.slug) % 3]
  const date = format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })
  return (
    <div className={`typo-cover typo-cover--plate typo-cover--${layout}`} aria-hidden="true">
      <span className="typo-cover__glyph">{glyph}</span>
      <span className="typo-cover__text">
        <span className="typo-cover__eyebrow">
          {post.category || '文章'} · {date}
        </span>
        <span className="typo-cover__title">{post.title}</span>
        <span className="typo-cover__rule" />
        <span className="typo-cover__foot">
          {post.readingTime} 分钟阅读 · {post.slug}
        </span>
      </span>
    </div>
  )
}