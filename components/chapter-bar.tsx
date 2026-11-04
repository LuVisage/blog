'use client'

import { useEffect, useState } from 'react'
import { IconChevronDown } from '@tabler/icons-react'
import { TocList } from '@/components/toc'
import { useTocIndex, useTocSpy } from '@/components/use-toc-spy'

/**
 * ChapterBar —— 窄屏（<xl）常驻的阅读定位条。
 *
 * 第 6 轮之前，移动端目录是页首一个折叠块，滚过第一段就再也回不去；
 * xl 侧栏又要到 1280px 才出现，中间整段阅读没有任何「我在第几节、还剩多少」的提示。
 * 这里把页首折叠换成吸顶常驻条（§11.6 当年否掉的是「再加一套抽屉」，
 * 本条是把已有的那份目录搬到看得见的位置，不新增第二份列表）：
 *   · 章节计数 mono `02/07`
 *   · 当前章节名翻牌进场（200ms ease，只动 opacity/transform，key 换元素重播）
 *   · 底边 1px 阅读比例尺（scaleX 填充，滚动链接不过渡）
 *   · 「目录」开合，面板复用同一个 TocList
 */
export function ChapterBar() {
  const { headings, activeId, progress } = useTocSpy()
  const { current, total } = useTocIndex()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // 判定线还没越过第一节时，显示第一节比留空更有指引；不冒充「已进入」。
  const active = headings.find((h) => h.id === activeId) ?? headings[0]

  if (headings.length < 2) return null

  return (
    <nav
      aria-label="阅读位置"
      className="chapter-bar xl:hidden"
      style={{ '--p': progress } as React.CSSProperties}
    >
      <div className="flex items-center gap-3 py-2.5">
        <span className="meta tabular-nums flex-shrink-0" style={{ color: 'var(--accent-text)' }}>
          {String(Math.max(1, current)).padStart(2, '0')}/{String(total).padStart(2, '0')}
        </span>

        <div className="chapter-flip min-w-0 flex-1">
          <span
            key={active?.id ?? 'none'}
            className="block truncate text-sm"
            style={{ color: 'var(--ink)', fontWeight: 600 }}
          >
            {active?.text}
          </span>
        </div>

        <span className="meta tabular-nums flex-shrink-0">{Math.round(progress * 100)}%</span>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="chapter-panel"
          className={`pressable chip flex-shrink-0 px-2.5 py-1 cursor-pointer ${isOpen ? 'tint-accent' : 'tint-muted'}`}
        >
          <span className="eyebrow" style={{ color: 'inherit' }}>
            目录
          </span>
          <IconChevronDown
            size={13}
            strokeWidth={1.5}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* 底边比例尺：压在 sticky 条自身的下发丝线上 */}
      <span className="absolute inset-x-0 -bottom-px flex" aria-hidden="true">
        <span className="read-rule">
          <span className="read-rule__fill" />
        </span>
      </span>

      {isOpen && (
        <div
          id="chapter-panel"
          className="chapter-panel absolute inset-x-0 top-full border-t-0 surface p-3 overflow-hidden"
          style={{ borderRadius: '0 0 var(--radius-xs) var(--radius-xs)', boxShadow: 'var(--shadow-pop)' }}
        >
          <TocList maxHeight="55vh" onNavigate={() => setIsOpen(false)} />
        </div>
      )}
    </nav>
  )
}
