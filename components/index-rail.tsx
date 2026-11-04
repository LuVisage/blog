import Link from 'next/link'
import { getAllCategories, getAllTags, getAllSeries } from '@/lib/posts'

interface Props {
  /** 本页自己已经铺开的维度，不再在栏里重复一遍。 */
  hide?: GroupId[]
}

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

/**
 * 站内索引栏 —— 稀疏索引页（/posts、/tags、/categories、/series、/projects、/friends）
 * 共用的右栏：把「这一维度之外还有什么」常驻在页面右侧，
 * 单维度清单不再因为内容少而只剩半屏空白。
 * 只放数据组（分类/标签/系列），栏目导航交给每页都在的页脚站点目录，两件事不重复。
 * 标签取前 6：整栏高度刻意压到 ~500px。sticky 的可滑动余量 = 网格行高 − 栏高，
 * 栏比行只矮一点点时，吸顶会被行的下边界顶回去、栏头反而钻到页头底下（/friends 实测）。
 */
export function IndexRail({ hide = [] }: Props) {
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
            {group.rows.map((row) => (
              <Link
                key={row.key}
                href={row.href}
                className="row-line pressable group flex items-baseline gap-3 py-2 text-sm rule transition-colors"
                style={{ color: 'var(--body)' }}
              >
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
