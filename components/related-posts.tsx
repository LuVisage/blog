import { getRelatedPosts } from '@/lib/posts'
import { Ledger, LedgerRow } from '@/components/ledger-row'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface RelatedPostsProps {
  currentSlug: string
}

/**
 * 文末「相关文章」用台账行，不用封面卡。
 * 文章尽头原来同时压着许可行、上下篇、系列块、三张封面卡、作者卡、评论卡，
 * 滚到底是四张卡片而不是下一篇；换成与全站索引同一种行语汇后，
 * 这一节只剩三条可扫读的行，封面卡那套跟手光斑与视差也随之整套下线。
 */
export function RelatedPosts({ currentSlug }: RelatedPostsProps) {
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