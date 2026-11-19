import { IconFileText } from '@tabler/icons-react'
import type { PostMeta } from '@/lib/posts'
import { EditorialList } from '@/components/editorial-list'
import { EmptyState } from '@/components/ui/empty-state'

// 列表页与首页共用同一套 arow 规则线行语汇（编号 / 日期 / 标题摘要 / 分类标签），
// 直接委托 EditorialList，不再维护第二套行样式。空态仍是留白加规线，不是浮卡。
export function PostList({ posts }: { posts: PostMeta[] }) {
  if (!posts.length) {
    return (
      <EmptyState
        icon={<IconFileText size={36} strokeWidth={1.5} style={{ color: 'var(--accent-text)' }} />}
        title="还没有文章"
        description="文章发出后会按时间列在这里"
      />
    )
  }

  return <EditorialList posts={posts} />
}
