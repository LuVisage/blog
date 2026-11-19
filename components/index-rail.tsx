import Link from 'next/link'
import { getAllCategories, getAllTags, getAllSeries } from '@/lib/posts'

type GroupId = 'categories' | 'tags' | 'series'

interface RailGroup {
  id: GroupId
  label: string
  href: string
  rows: { key: string; href: string; name: string; count: number }[]
}

const toRows = (base: string, items: { name: string; count: number }[]) =>
  items.map(({ name, count }) => ({ key: name, href: `${base}/${name}`, name, count }))

const byWeight = (a: { name: string; count: number }, b: { name: string; count: number }) =>
  b.count - a.count || a.name.localeCompare(b.name, 'zh-Hans-CN')

// 稀疏索引页共用右栏：把「这一维度之外还有什么」常驻右侧。只放数据组，
// 栏目导航交给页脚站点目录。标签取前 6 把栏高压到 ~500px：栏比网格行只矮一点时，
// sticky 余量不足会被行下边界顶回去、栏头钻到页头底下。
export function IndexRail({ hide = [] }: { hide?: GroupId[] }) {
  const all: RailGroup[] = [
    {
      id: 'categories',
      label: '分类',
      href: '/categories',
      rows: toRows('/categories', getAllCategories().map(({ category, count }) => ({ name: category, count }))),
    },
    {
      id: 'tags',
      label: '标签',
      href: '/tags',
      rows: toRows('/tags', getAllTags().map(({ tag, count }) => ({ name: tag, count })).sort(byWeight).slice(0, 6)),
    },
    {
      id: 'series',
      label: '系列',
      href: '/series',
      rows: toRows('/series', getAllSeries().map(({ series, count }) => ({ name: series, count }))),
    },
  ]
  const groups = all.filter((group) => !hide.includes(group.id) && group.rows.length > 0)

  if (groups.length === 0) return null

  return (
    <aside className="index-rail lg:sticky lg:top-28">
      {groups.map((group, i) => (
        <div
          key={group.label}
          className={i === groups.length - 1 ? '' : 'pb-7 mb-7'}
          style={i === groups.length - 1 ? undefined : { borderBottom: '1px solid var(--line)' }}
        >
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <span className="eyebrow">{group.label}</span>
            <Link
              href={group.href}
              className="link-underline pressable meta inline-flex min-h-6 items-center transition-colors hover:text-[var(--accent-text)] tint-muted"
            >
              全部
            </Link>
          </div>
          <div className="flex flex-col">
            {group.rows.map((row, i) => (
              <Link
                key={row.key}
                href={row.href}
                className="row-line pressable group flex items-baseline gap-3 py-2 text-sm rule transition-colors"
                style={{ color: 'var(--body)' }}
              >
                <span
                  className="meta tabular-nums flex-shrink-0 transition-colors group-hover:text-[var(--accent-text)]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="truncate transition-colors group-hover:text-[var(--accent-text)]">{row.name}</span>
                <span className="meta tabular-nums ml-auto">{row.count}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}
