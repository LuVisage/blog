'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  IconArrowBigUpLine,
  IconAward,
  IconCornerDownLeft,
  IconSearch,
  IconSparkles,
  IconSun,
  IconMoon,
  IconLayoutGrid,
  IconFileText,
  IconHome,
  IconArchive,
  IconTags,
  IconFolder,
  IconUser,
  IconBook,
  IconSchool,
  IconLink,
} from '@tabler/icons-react'
import { NAV_LINKS, SITE } from '@/lib/constants'
import {
  visibleAccents,
  visibleBackgrounds,
  hasSecretUnlocked,
  type AccentId,
  type BackgroundId,
} from '@/lib/accents'
import { useAppearance } from '@/components/appearance-provider'
import { useToast } from '@/components/ui/toast'
import { ACHIEVEMENTS, readUnlockedAchievements } from '@/lib/achievements'

export interface PalettePost {
  slug: string
  title: string
  description: string
  tags: string[]
  category?: string
}

/** Only what a jump needs — this is the longest list in the palette. */
export interface PaletteLesson {
  course: string
  slug: string
  day: number
  kind: 'day' | 'reference'
  title: string
}

type Group = '操作' | '导航' | '文章' | '教程' | '主题色' | '背景'

const GROUP_ORDER: Group[] = ['操作', '导航', '文章', '教程', '主题色', '背景']

interface Item {
  id: string
  group: Group
  label: string
  hint?: string
  keywords: string
  icon: React.ReactNode
  /** Lessons are many; only the entry points show in the empty state. */
  preview?: boolean
  run: () => void
}

interface PaletteApi {
  setOpen: (open: boolean) => void
  toggle: () => void
}

const PaletteContext = createContext<PaletteApi | null>(null)

export function usePalette(): PaletteApi {
  const ctx = useContext(PaletteContext)
  if (!ctx) throw new Error('usePalette must be used inside <PaletteProvider>')
  return ctx
}

/**
 * Substring beats subsequence beats nothing. Earlier matches rank higher so
 * "pos" puts 文章列表 above a post that merely contains those letters.
 */
function score(query: string, haystack: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 1
  const h = haystack.toLowerCase()
  const at = h.indexOf(q)
  if (at !== -1) return 200 - Math.min(at, 100) - (h.length - q.length) / 100
  let i = 0
  for (const ch of h) {
    if (ch === q[i]) i++
    if (i === q.length) return 40 - Math.min(h.length, 30) / 10
  }
  return 0
}

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': <IconHome size={15} strokeWidth={1.75} />,
  '/posts': <IconBook size={15} strokeWidth={1.75} />,
  '/archive': <IconArchive size={15} strokeWidth={1.75} />,
  '/categories': <IconFolder size={15} strokeWidth={1.75} />,
  '/tags': <IconTags size={15} strokeWidth={1.75} />,
  '/learn': <IconSchool size={15} strokeWidth={1.75} />,
  '/about': <IconUser size={15} strokeWidth={1.75} />,
}

export function PaletteProvider({
  posts,
  lessons,
  children,
}: {
  posts: PalettePost[]
  lessons: PaletteLesson[]
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [unlocked, setUnlocked] = useState(false)

  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { accent, background, setAccent, setBackground } = useAppearance()
  const toast = useToast()

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (open) setUnlocked(hasSecretUnlocked())
  }, [open])

  useEffect(() => {
    const onUnlock = () => setUnlocked(true)
    window.addEventListener('site:unlock', onUnlock)
    return () => window.removeEventListener('site:unlock', onUnlock)
  }, [])

  const toggle = useCallback(() => {
    setOpen((current) => {
      if (!current) setQuery('')
      return !current
    })
  }, [])

  // Global chord. Guard against firing while the palette itself owns focus in a
  // text field elsewhere on the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggle()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [toggle])

  useEffect(() => {
    if (!open) return
    restoreFocus.current = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = previousOverflow
      restoreFocus.current?.focus?.()
    }
  }, [open])

  const go = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  const items = useMemo<Item[]>(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    const actions: Item[] = [
      {
        id: 'action-search',
        group: '操作',
        label: '全文搜索',
        hint: '检索正文内容',
        keywords: 'fulltext pagefind 检索 全文',
        icon: <IconSearch size={15} strokeWidth={1.75} />,
        run: () => go('/search'),
      },
      {
        id: 'action-theme',
        group: '操作',
        label: nextTheme === 'dark' ? '切换到暗色' : '切换到亮色',
        hint: '纸张 / 墨色',
        keywords: 'theme dark light 明暗 亮色 暗色 夜间',
        icon:
          nextTheme === 'dark'
            ? <IconMoon size={15} strokeWidth={1.75} />
            : <IconSun size={15} strokeWidth={1.75} />,
        run: () => {
          setTheme(nextTheme)
          setOpen(false)
        },
      },
      {
        id: 'action-achievements',
        group: '操作',
        label: '我的阅读成就',
        hint: '已解锁的徽章',
        keywords: 'achievement badge 成就 徽章',
        icon: <IconAward size={15} strokeWidth={1.75} />,
        run: () => {
          const earned = readUnlockedAchievements()
          setOpen(false)
          toast?.({
            label: '成就',
            title: earned.length ? `已解锁 ${earned.length} / ${Object.keys(ACHIEVEMENTS).length} 枚` : '还没有解锁任何徽章',
            description: earned.length
              ? earned.map((id) => ACHIEVEMENTS[id].title).join(' · ')
              : '把一篇文章读到底就会有了',
            tone: 'achievement',
          })
        },
      },
    ]

    const nav: Item[] = NAV_LINKS.map((link) => ({
      id: `nav${link.href}`,
      group: '导航',
      label: link.label,
      hint: link.href,
      keywords: `${link.label} ${link.href}`,
      icon: NAV_ICONS[link.href] ?? <IconLink size={15} strokeWidth={1.75} />,
      run: () => go(link.href),
    }))

    const articles: Item[] = posts.map((post) => ({
      id: `post${post.slug}`,
      group: '文章',
      label: post.title,
      hint: post.category || post.tags[0] || post.slug,
      keywords: `${post.title} ${post.description} ${post.tags.join(' ')} ${post.category ?? ''}`,
      icon: <IconFileText size={15} strokeWidth={1.75} />,
      run: () => go(`/posts/${post.slug}`),
    }))

    /** Each course's opening lesson plus its manuals — the rest only surface once you type. */
    const opening = new Set<string>()
    const previewKeys = new Set<string>()
    for (const l of lessons) {
      const key = `${l.course}/${l.slug}`
      if (l.kind === 'reference') previewKeys.add(key)
      else if (!opening.has(l.course)) {
        opening.add(l.course)
        previewKeys.add(key)
      }
    }

    const learn: Item[] = lessons.map((lesson) => ({
      id: `learn-${lesson.course}-${lesson.slug}`,
      group: '教程',
      label: lesson.kind === 'day' ? `Day ${lesson.day} · ${lesson.title}` : lesson.title,
      hint: `${lesson.course}/${lesson.slug}`,
      keywords:
        lesson.kind === 'day'
          ? `${lesson.course} 教程 lesson day ${lesson.day} ${lesson.title}`
          : `${lesson.course} 教程 手册 速查 ${lesson.title}`,
      icon: <IconSchool size={15} strokeWidth={1.75} />,
      preview: previewKeys.has(`${lesson.course}/${lesson.slug}`),
      run: () => go(`/learn/${lesson.course}/${lesson.slug}`),
    }))

    const accents: Item[] = visibleAccents(unlocked).map((option) => ({
      id: `accent${option.id}`,
      group: '主题色',
      label: option.label,
      hint: option.id === accent ? '当前' : undefined,
      keywords: `accent 主题色 颜色 ${option.label} ${option.id}`,
      icon: (
        <span
          className="w-3 h-3 rounded-full block"
          style={{ background: option.hsl, boxShadow: 'inset 0 0 0 1px var(--line-strong)' }}
        />
      ),
      run: () => {
        setAccent(option.id as AccentId)
        setOpen(false)
      },
    }))

    const backgrounds: Item[] = visibleBackgrounds(unlocked).map((option) => ({
      id: `bg${option.id}`,
      group: '背景',
      label: option.label,
      hint: option.id === background ? '当前' : option.hint,
      keywords: `background 背景 底纹 ${option.label} ${option.id} ${option.hint}`,
      icon: <IconLayoutGrid size={15} strokeWidth={1.75} />,
      run: () => {
        setBackground(option.id as BackgroundId)
        setOpen(false)
      },
    }))

    return [...actions, ...nav, ...articles, ...learn, ...accents, ...backgrounds]
  }, [accent, background, go, lessons, posts, setAccent, setBackground, setTheme, theme, toast, unlocked])

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return items.filter((item) => item.group !== '教程' || item.preview)
    return items
      .map((item) => ({ item, s: score(q, item.label) * 1.6 + score(q, item.keywords) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((r) => r.item)
  }, [items, query])

  /** Flat, group-ordered list the keyboard walks through. */
  const rows = useMemo(() => {
    const out: { item: Item; isFirst: boolean }[] = []
    for (const group of GROUP_ORDER) {
      const inGroup = results.filter((r) => r.group === group)
      inGroup.forEach((item, i) => out.push({ item, isFirst: i === 0 }))
    }
    return out
  }, [results])

  useEffect(() => setActive(0), [query])
  useEffect(() => {
    if (active >= rows.length) setActive(0)
  }, [active, rows.length])

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-row="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const runRow = useCallback(
    (index: number) => {
      rows[index]?.item.run()
    },
    [rows]
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || (e.key === 'n' && e.ctrlKey)) {
      e.preventDefault()
      setActive((i) => (rows.length ? (i + 1) % rows.length : 0))
    } else if (e.key === 'ArrowUp' || (e.key === 'p' && e.ctrlKey)) {
      e.preventDefault()
      setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      runRow(active)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  if (!mounted) {
    return <PaletteContext.Provider value={{ setOpen, toggle }}>{children}</PaletteContext.Provider>
  }

  return (
    <PaletteContext.Provider value={{ setOpen, toggle }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 sm:px-6"
          style={{ background: 'var(--overlay)' }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false)
          }}
        >
          <div
            className="surface w-full max-w-[560px] mt-[12vh] flex flex-col overflow-hidden animate-scale-in"
            style={{
              borderRadius: 14,
              borderColor: 'var(--line-strong)',
              boxShadow: 'var(--shadow-pop)',
              maxHeight: 'min(600px, 76vh)',
            }}
            role="dialog"
            aria-modal="true"
            aria-label="命令面板"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 px-4 h-14 flex-shrink-0" style={{ borderBottom: '1px solid var(--line)' }}>
              <IconSearch size={16} strokeWidth={1.75} style={{ color: 'var(--faint)' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章、教程、跳转页面、切换外观…"
                className="flex-1 bg-transparent border-0 outline-none text-[15px]"
                style={{ color: 'var(--ink)' }}
                aria-label="命令面板搜索"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="meta hidden sm:inline" style={{ color: 'var(--faint)' }}>esc</kbd>
            </div>

            <div ref={listRef} className="flex-1 overflow-y-auto py-2">
              {rows.length === 0 ? (
                <p className="body-sm px-4 py-10 text-center">没有匹配「{query}」的结果</p>
              ) : (
                rows.map((row, index) => (
                  <div key={row.item.id}>
                    {row.isFirst && (
                      <div className="eyebrow px-4 pt-3 pb-1.5">{row.item.group}</div>
                    )}
                    <button
                      type="button"
                      data-row={index}
                      onMouseMove={() => setActive(index)}
                      onClick={() => runRow(index)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors"
                      style={{
                        background: active === index ? 'var(--accent-soft)' : 'transparent',
                        color: active === index ? 'var(--ink)' : 'var(--body)',
                      }}
                    >
                      <span
                        className="flex-shrink-0 flex items-center justify-center w-5"
                        style={{ color: active === index ? 'var(--accent-text)' : 'var(--faint)' }}
                      >
                        {row.item.icon}
                      </span>
                      <span className="flex-1 min-w-0 truncate text-[14px]">{row.item.label}</span>
                      {row.item.hint && (
                        <span className="meta flex-shrink-0 truncate max-w-[40%]" style={{ color: 'var(--faint)' }}>
                          {row.item.hint}
                        </span>
                      )}
                      {active === index && (
                        <IconCornerDownLeft size={13} strokeWidth={2} style={{ color: 'var(--accent-text)' }} />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div
              className="flex items-center gap-4 px-4 h-10 flex-shrink-0 eyebrow"
              style={{ borderTop: '1px solid var(--line)', color: 'var(--faint)' }}
            >
              <span className="flex items-center gap-1.5">
                <IconArrowBigUpLine size={12} strokeWidth={2} />
                <IconSparkles size={12} strokeWidth={2} style={{ color: 'var(--accent-text)' }} />
                {SITE.title}
              </span>
              <span className="ml-auto hidden sm:flex items-center gap-3">
                <span>↑↓ 选择</span>
                <span>↵ 打开</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </PaletteContext.Provider>
  )
}

/* Achievement labels live in lib/achievements so the article-page tracker and
   this summary can never disagree about what is unlocked. */
