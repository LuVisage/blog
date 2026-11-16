'use client'

import { useCallback, useSyncExternalStore } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface TocSnapshot {
  headings: TocItem[]
  activeId: string
  /** 全文已读比例，量化到 1%（0–1）。 */
  progress: number
}

const EMPTY: TocSnapshot = { headings: [], activeId: '', progress: 0 }

/**
 * 判定线：标题顶边越过视口上方 120px 即视为「已进入阅读区」，
 * 最后越线的标题就是当前章节。阈值取在页头下方，避免被 sticky 头部遮挡。
 */
const ACTIVE_LINE = 120

/**
 * 全站唯一的目录扫描器。
 *
 * 文章页与课时页各有一份目录（侧栏 + 移动端），第 6 轮之前两份各自扫描标题、
 * 各挂一个 scroll/resize 监听、各跑一个 rAF 循环 —— 同一页四份列表、两套判定。
 * 这里换成模块级单例：状态一份、监听一份，两份视图只是订阅者。
 */
let snapshot: TocSnapshot = EMPTY
const listeners = new Set<() => void>()
let headingEls: HTMLElement[] = []
let subscriberCount = 0
let raf = 0
let scanTimer: ReturnType<typeof setInterval> | undefined

function commit(patch: Partial<TocSnapshot>) {
  const next = { ...snapshot, ...patch }
  if (
    next.headings === snapshot.headings &&
    next.activeId === snapshot.activeId &&
    next.progress === snapshot.progress
  ) {
    return
  }
  snapshot = next
  for (const notify of listeners) notify()
}

function measure() {
  raf = 0

  const doc = document.documentElement
  const scrollable = doc.scrollHeight - window.innerHeight
  // 量化到 1%：滚动链接的填充不过渡（挂过渡反而滞后于滚动），重渲染也因此封顶 100 次。
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0
  const progress = Math.round(Math.min(1, Math.max(0, ratio)) * 100) / 100

  if (headingEls.length === 0) {
    commit({ progress })
    return
  }

  let index = 0
  for (let i = 0; i < headingEls.length; i++) {
    if (headingEls[i].getBoundingClientRect().top <= ACTIVE_LINE) index = i
    else break
  }

  // 结尾短章节常常够不到判定线，滚到底时强制点亮最后一项。
  if (window.innerHeight + window.scrollY >= doc.scrollHeight - 4) index = headingEls.length - 1

  commit({ activeId: headingEls[index].id, progress })
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(measure)
}

function scan() {
  const body = document.querySelector('.prose') ?? document.querySelector('article')
  if (!body) return false

  const found = Array.from(body.querySelectorAll<HTMLElement>('h2[id], h3[id]'))
  if (found.length === 0) return false

  headingEls = found
  commit({
    headings: found.map((el) => ({
      id: el.id,
      text: (el.textContent ?? '').trim(),
      level: el.tagName === 'H3' ? 3 : 2,
    })),
  })
  measure()
  return true
}

function start() {
  // rehype-slug 在构建期就把 id 写进 SSR 的 HTML，正常首帧即可扫到；
  // 兜底轮询是给 MDX 客户端补渲染留的，扫到或超时即停。
  if (!scan()) {
    let tries = 0
    scanTimer = setInterval(() => {
      if (scan() || ++tries >= 20) {
        clearInterval(scanTimer)
        scanTimer = undefined
      }
    }, 100)
  }
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
}

function stop() {
  if (scanTimer) {
    clearInterval(scanTimer)
    scanTimer = undefined
  }
  if (raf) {
    cancelAnimationFrame(raf)
    raf = 0
  }
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  headingEls = []
  snapshot = EMPTY
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  subscriberCount += 1
  if (subscriberCount === 1) start()

  return () => {
    listeners.delete(notify)
    subscriberCount -= 1
    if (subscriberCount === 0) stop()
  }
}

export function useTocSpy(): TocSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => EMPTY)
}

/** 当前章节序号（从 1 起）；无目录时为 0。 */
export function useTocIndex(): { current: number; total: number } {
  const { headings, activeId } = useTocSpy()
  const index = activeId ? headings.findIndex((h) => h.id === activeId) : -1
  return { current: index + 1, total: headings.length }
}

/**
 * 目录跳转走原生平滑滚动（html 的 scroll-behavior 已是 smooth）。
 * 让位 sticky 头部不在这里算——html 的 scroll-padding-top 已负责，
 * scrollIntoView 会读它；再叠一个 offset 就会多空出一截。
 */
export function useTocJump() {
  return useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // 第 19 轮：目录原来是 preventDefault + scrollIntoView，跳完地址栏一动不动，
    // 读者既没法把「读到哪一节」复制给别人，刷新也会回到页首。replaceState 只改
    // fragment、不新增历史项，连点十次目录也不会把返回键堵死；保留 history.state
    // 是为了不抹掉 App Router 存在那里的路由记录。
    try {
      window.history.replaceState(window.history.state, '', `#${id}`)
    } catch {
      // 少数内嵌环境禁止改 history：跳转本身照常生效。
    }
    // 点完目录，窄屏面板会整块卸载，焦点原本掉回 BODY：读屏不播报落点，
    // 键盘用户下一跳 Tab 又从页头翻起。把焦点交给目标标题，下一跳就从这一节继续。
    // tabindex=-1 只让它可以被程序聚焦，不进 Tab 序列；失焦即摘掉，不留痕。
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1')
      el.addEventListener('blur', () => el.removeAttribute('tabindex'), { once: true })
    }
    el.focus({ preventScroll: true })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [])
}
