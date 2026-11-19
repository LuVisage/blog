import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { getRelatedPosts } from '@/lib/posts'
import { Ledger, LedgerRow } from '@/components/ledger-row'

// 文末「相关文章」用与全站索引同一种行语汇：三条可扫读的行，不是封面卡。
export function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedPosts(currentSlug, 3)
  if (related.length === 0) return null

  return (
    <section className="mb-12">
      <div className="eyebrow mb-2">接着读</div>
      <h2 className="section-title mb-2">相关文章</h2>
      <Ledger>
        {related.map((post, i) => (
          <LedgerRow
            key={post.slug}
            ordinal={i + 1}
            href={`/posts/${post.slug}`}
            title={post.title}
            desc={post.description}
            meta={format(parseISO(post.date), 'yyyy.MM.dd', { locale: zhCN })}
            note={`${post.readingTime} 分钟`}
          />
        ))}
      </Ledger>
    </section>
  )
}
