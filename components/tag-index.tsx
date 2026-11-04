import type { PostMeta } from '@/lib/posts'
import { PageMasthead } from '@/components/page-masthead'
import { IndexRail } from '@/components/index-rail'
import { EmptyState } from '@/components/ui/empty-state'
import { Ledger, LedgerRow } from '@/components/ledger-row'
import { IconTag } from '@tabler/icons-react'

interface Props {
  posts: PostMeta[]
  tags: { tag: string; count: number }[]
}

/**
 * 标签索引 = 一张按篇数排好的清单，不是一个在前端重算的筛选器。
 * 行直接链到 /tags/[tag]（服务端已渲染、可收藏），
 * 计数比例尺复用 §11.11 的 .read-rule —— 同一个「位置映射」语汇，一处用在滚动、一处用在数量。
 */
export function TagIndex({ posts, tags }: Props) {
  const sorted = [...tags].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-Hans-CN'))
  const max = sorted[0]?.count ?? 1

  return (
    <div>
      <PageMasthead
        eyebrow="标签 — Tags"
        title="标签"
        lead="按主题归档的全部线索。篇数多的排在前面。"
        counter={`${tags.length} 个标签 · ${posts.length} 篇文章`}
      />

      {tags.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-12 lg:gap-16 items-start">
          <div className="min-w-0">
            <div className="eyebrow mb-5">清单 · 按篇数</div>
            <Ledger>
              {sorted.map(({ tag, count }, i) => (
                <LedgerRow
                  key={tag}
                  ordinal={i + 1}
                  href={`/tags/${tag}`}
                  title={tag}
                  meta={`${count} 篇`}
                  ratio={count / max}
                />
              ))}
            </Ledger>
          </div>

          <IndexRail hide={['tags']} />
        </div>
      ) : (
        <EmptyState
          icon={<IconTag size={30} strokeWidth={1.25} />}
          title="还没有标签"
          description="在文章 frontmatter 的 tags 里写下第一个主题"
        />
      )}
    </div>
  )
}
