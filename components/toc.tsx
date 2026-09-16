'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface TocItem {
  id: string
  text: string
  level: number
}

/**
 * 判定线：标题顶边越过视口上方 120px 即视为「已进入阅读区」，
 * 最后越线的标题就是当前章节。阈值取在页头下方，避免被 sticky 头部遮挡。
 */
const ACTIVE_LINE = 120

/** 隐藏滚动条但保留滚动能力——目录自己滚，不动页面。 */
const SCROLLBAR_HIDDEN = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  // 桌面与移动两份列表各自持有锚点引用，滚动跟随对两份同时生效。
  const desktopListRef = useRef<HTMLUListElement>(null)
  const mobileListRef = useRef<HTMLUListElement>(null)
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>())

  const setItemRef = useCallback((scope: 'd' | 'm', id: string) => (el: HTMLAnchorElement | null) => {
    if (el) itemRefs.current.set(`${scope}:${id}`, el)
    else itemRefs.current.delete(`${scope}:${id}`)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const body = document.querySelector('.prose') ?? document.querySelector('article')
      if (!body) return

      const items: TocItem[] = []
      body.querySelectorAll('h2, h3').forEach((el) => {
        const text = el.textContent?.trim()
        if (!el.id || !text) return
        items.push({ id: el.id, text, level: el.tagName === 'H2' ? 2 : 3 })
      })
      setHeadings(items)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Scroll-spy：以「最后一条越过判定线的标题」为当前章节。
  // 滚动到底时强制点亮最后一项——结尾短章节常常够不到判定线。
  useEffect(() => {
    if (headings.length === 0) return

    const els = headings
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    let raf = 0
    const compute = () => {
      raf = 0
      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top <= ACTIVE_LINE) current = el.id
        else break
      }
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (nearBottom) current = els[els.length - 1].id
      setActiveId((prev) => (prev === current ? prev : current))
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [headings])

  // 跟随：当前章节变化时，把目录内滚动调到高亮项居中。
  // 滚动的是目录自己的 scrollTop，绝不牵动页面。
  useEffect(() => {
    if (!activeId) return
    const anchor = itemRefs.current.get(`d:${activeId}`) ?? itemRefs.current.get(`m:${activeId}`)
    if (!anchor) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    for (const list of [desktopListRef.current, mobileListRef.current]) {
      if (!list) continue
      const target = anchor.offsetTop - list.clientHeight / 2 + anchor.offsetHeight / 2
      const max = Math.max(0, list.scrollHeight - list.clientHeight)
      list.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: reduce ? 'auto' : 'smooth' })
    }
  }, [activeId])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActiveId(id)
  }, [])

  if (headings.length < 2) return null

  const renderItem = (scope: 'd' | 'm') =>
    headings.map(({ id, text, level }) => {
      const active = activeId === id
      return (
        <li key={id}>
          <a
            ref={setItemRef(scope, id)}
            href={`#${id}`}
            onClick={(e) => {
              handleClick(e, id)
              if (scope === 'm') setIsOpen(false)
            }}
            title={text}
            aria-current={active ? 'true' : undefined}
            className="block text-sm py-1.5 line-clamp-1 border-l transition-colors duration-200"
            style={{
              color: active ? 'var(--ink)' : 'var(--muted)',
              borderColor: active ? 'var(--accent)' : 'var(--line)',
              fontWeight: active ? 600 : 400,
              paddingLeft: level === 3 ? 22 : 12,
            }}
          >
            {text}
          </a>
        </li>
      )
    })

  return (
    <>
      {/* Desktop: sticky sidebar；高度由使用方的外层 flex 容器约束，列表自己滚 */}
      <nav aria-label="文章目录" className="hidden xl:flex xl:flex-col flex-1 min-h-0">
        <div className="flex items-baseline justify-between mb-4">
          <h4 className="eyebrow">目录</h4>
          <span className="meta">{headings.length} 节</span>
        </div>
        <ul
          ref={desktopListRef}
          className={`relative flex-1 min-h-0 overflow-y-auto pr-1 ${SCROLLBAR_HIDDEN}`}
        >
          {renderItem('d')}
        </ul>
      </nav>

      {/* Mobile: collapsible toggle */}
      <div className="xl:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="surface surface-hover flex items-center gap-2 w-full px-4 py-3"
          style={{ borderRadius: 10 }}
        >
          <span className="eyebrow" style={{ color: 'var(--ink)' }}>
            文章目录 · {headings.length} 节
          </span>
          <IconChevronDown
            size={14}
            strokeWidth={1.5}
            className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--muted)' }}
          />
        </button>

        {isOpen && (
          <div className="mt-2 surface p-3 animate-scale-in" style={{ borderRadius: 10 }}>
            <ul
              ref={mobileListRef}
              className={`relative max-h-[60vh] overflow-y-auto ${SCROLLBAR_HIDDEN}`}
            >
              {renderItem('m')}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
