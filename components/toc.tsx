'use client'

import { useEffect, useRef, useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { useTocJump, useTocSpy, type TocItem } from '@/components/use-toc-spy'

/** 隐藏滚动条但保留滚动能力——目录自己滚，不动页面。 */
const SCROLLBAR_HIDDEN = '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'

interface TocListProps {
  /** 列表容器的最大高度；桌面侧栏由外层 flex 约束，浮层用视口单位。 */
  maxHeight?: string
  onNavigate?: () => void
}

/**
 * 目录列表本体。桌面侧栏、移动端折叠、常驻章节条浮层三处共用同一份标记，
 * 标题与高亮都来自 §11.11 的单例扫描器（use-toc-spy）。
 */
export function TocList({ maxHeight, onNavigate }: TocListProps) {
  const { headings, activeId } = useTocSpy()
  const jump = useTocJump()
  const listRef = useRef<HTMLUListElement>(null)

  // 跟随：当前章节变化时把目录内滚动调到高亮项居中，只滚目录自己，绝不牵动页面。
  useEffect(() => {
    if (!activeId) return
    const list = listRef.current
    if (!list) return
    const item = list.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`)
    if (!item) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2
    const max = Math.max(0, list.scrollHeight - list.clientHeight)
    list.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: reduce ? 'auto' : 'smooth' })
  }, [activeId, headings])

  return (
    <ul
      ref={listRef}
      data-lenis-prevent
      className={`relative flex-1 min-h-0 overflow-y-auto pr-1 ${SCROLLBAR_HIDDEN}`}
      style={maxHeight ? { maxHeight } : undefined}
    >
      {headings.map(({ id, text, level }: TocItem) => {
        const active = activeId === id
        return (
          <li key={id}>
            <a
              data-toc-id={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                jump(id)
                onNavigate?.()
              }}
              title={text}
              aria-current={active ? 'true' : undefined}
              className={`toc-link pressable relative block text-sm py-1.5 line-clamp-1 transition-colors${active ? ' is-active' : ''}`}
              style={{
                borderLeft: `1px solid ${active ? 'var(--line-strong)' : 'var(--line)'}`,
                paddingLeft: level === 3 ? 24 : 12,
                transitionDuration: 'var(--duration-fast)',
              }}
            >
              {/* 激活项由一条 2px 强调色短标滑动进入（SPEC_LEDGER §1.8.2 的 300ms 档） */}
              <span aria-hidden="true" className="indicator-bar indicator-bar--lead" />
              {text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** 阅读比例尺：1px 发丝线上盖一条 indigo scaleX 填充（§11.11，滚动链接不过渡）。 */
export function ReadRule() {
  const { progress } = useTocSpy()
  return (
    <>
      <span className="read-rule" aria-hidden="true">
        <span className="read-rule__fill" style={{ '--p': progress } as React.CSSProperties} />
      </span>
      <span className="meta tabular-nums flex-shrink-0">{Math.round(progress * 100)}%</span>
    </>
  )
}

type Variant = 'both' | 'desktop' | 'mobile-inline'

/**
 * 文章 / 课时目录。
 *
 * `desktop` 是 xl 侧栏（带阅读比例尺），`mobile-inline` 是页首折叠，
 * `both` 同时渲染两者并按断点隐藏——课时页仍用默认值。
 * 文章页改用 `desktop` + 常驻 ChapterBar（§11.11），避免同页两套扫描。
 */
export function TableOfContents({ variant = 'both' }: { variant?: Variant }) {
  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { headings } = useTocSpy()

  if (headings.length < 2) return null

  const showDesktop = variant === 'both' || variant === 'desktop'
  const showMobile = variant === 'both' || variant === 'mobile-inline'
  const panelId = 'toc-mobile-panel'

  // preventScroll：这一跳的目的是把焦点交还给触发器，不是把页面拽回目录处。
  const closePanel = () => {
    setIsOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <>
      {showDesktop && (
        <nav aria-label="文章目录" className="hidden xl:flex xl:flex-col flex-1 min-h-0">
          <div className="flex items-baseline gap-3 mb-4">
            <h4 className="eyebrow flex-shrink-0">目录</h4>
            <ReadRule />
          </div>
          {/* 高度由使用方的外层 flex 容器约束，列表自己滚 */}
          <div className="flex-1 min-h-0 flex flex-col">
            <TocList />
          </div>
        </nav>
      )}

      {showMobile && (
        <div className="xl:hidden">
          <button
            ref={triggerRef}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            className="surface surface-hover flex items-center gap-2 w-full px-4 py-3 cursor-pointer"
            style={{ borderRadius: 'var(--radius-xs)' }}
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
            <div
              id={panelId}
              className="mt-2 surface p-3 animate-scale-in"
              style={{ borderRadius: 'var(--radius-xs)' }}
              onKeyDown={(e) => {
                // 折叠面板的退出键：Esc 收起并把焦点交还触发器（APG disclosure）。
                if (e.key !== 'Escape') return
                e.preventDefault()
                e.stopPropagation()
                closePanel()
              }}
            >
              <TocList maxHeight="60vh" onNavigate={closePanel} />
            </div>
          )}
        </div>
      )}
    </>
  )
}
