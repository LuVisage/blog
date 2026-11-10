/**
 * 阅读清单只存在访客自己的浏览器里：没有账号、没有接口、没有跨站同步。
 *
 * 键名带站名前缀，避免和同域下的其他页面撞车；所有读写都包在 try/catch 里，
 * 因为 Safari 无痕模式和部分企业的浏览器策略会让 localStorage 直接抛异常 ——
 * 收藏按钮那时应该退化成「点了没反应」之外的东西（见 BookmarkButton 的禁用态），
 * 而不是让整篇文章白屏。
 */
const STORAGE_KEY = 'baron-bookmarks'
const CHANGE_EVENT = 'baron-bookmarks:change'

/** 收藏变更事件。同标签页写入后派发一次；跨标签页由原生 storage 事件补齐。 */
export const BOOKMARKS_EVENT = CHANGE_EVENT

export function readBookmarks(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

export function isBookmarked(slug: string): boolean {
  return readBookmarks().includes(slug)
}

export function writeBookmarks(slugs: string[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs))
    window.dispatchEvent(new Event(CHANGE_EVENT))
  } catch {
    /* 存储不可用时保持静默：按钮自己会给出禁用态。 */
  }
}

/** 返回写入后的状态。true = 已加入收藏。 */
export function toggleBookmark(slug: string): boolean {
  const current = readBookmarks()
  const exists = current.includes(slug)
  const next = exists ? current.filter((item) => item !== slug) : [slug, ...current]
  writeBookmarks(next)
  return !exists
}

export function removeBookmark(slug: string) {
  writeBookmarks(readBookmarks().filter((item) => item !== slug))
}

/** 同标签页事件 + 跨标签页 storage 事件，统一成一个退订函数。 */
export function subscribeBookmarks(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener()
  }
  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}
