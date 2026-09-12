/** 网易云音乐 Meting API 封装 + 歌词解析 */

export interface Song {
  title: string
  author: string
  url: string
  pic: string
  lrc: string
}

export interface LyricLine {
  time: number // 秒
  text: string
}

const METING_API = 'https://api.i-meto.com/meting/api'

const STORAGE_KEY = 'music-playlist-id'
const VOLUME_KEY = 'music-volume'

export function getSavedPlaylistId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function savePlaylistId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, id)
  }
}

/** Saved volume, or null when nothing usable was stored. */
export function getSavedVolume(): number | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(VOLUME_KEY)
  if (raw === null) return null
  const v = Number(raw)
  if (!Number.isFinite(v) || v <= 0 || v > 1) return null
  return v
}

/** A muted player is not remembered — see getSavedVolume on why 0 is dropped. */
export function saveVolume(v: number): void {
  if (typeof window === 'undefined') return
  if (v <= 0) {
    localStorage.removeItem(VOLUME_KEY)
    return
  }
  localStorage.setItem(VOLUME_KEY, String(v))
}

/**
 * The playlist payload's `lrc` field is a URL to plain-text LRC, not the text
 * itself. Cached by URL — repeat and shuffle walk back over the same songs.
 */
const lyricCache = new Map<string, string>()

export async function fetchLyric(lrcUrl: string, signal?: AbortSignal): Promise<string> {
  if (!lrcUrl) return ''
  const cached = lyricCache.get(lrcUrl)
  if (cached !== undefined) return cached

  const res = await fetch(lrcUrl, { signal })
  if (!res.ok) throw new Error(`歌词加载失败 (${res.status})`)
  const text = await res.text()

  if (lyricCache.size > 200) lyricCache.clear()
  lyricCache.set(lrcUrl, text)
  return text
}

/** Accepts a bare ID, a share link, or share text with a link buried in it. */
export function extractPlaylistId(input: string): string {
  const t = input.trim()
  const m = t.match(/[?&]id=(\d+)/) || t.match(/playlist\/(\d+)/) || t.match(/\b(\d{6,})\b/)
  return m ? m[1] : t
}

/** 从 Meting API 拉取歌单 */
export async function fetchPlaylist(playlistId: string): Promise<Song[]> {
  const url = `${METING_API}?server=netease&type=playlist&id=${encodeURIComponent(playlistId)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`歌单加载失败 (${res.status})`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('歌单数据格式异常')
  if (data.length === 0) throw new Error('该歌单没有歌曲')
  // Validate each entry has required fields before casting
  const songs = (data as Song[]).filter(s => s.url && s.title)
  // Every entry can be unusable (no URL, or a region-locked track), and an
  // empty list here would leave the panel silently blank instead of telling
  // the visitor to pick another playlist.
  if (songs.length === 0) throw new Error('该歌单没有可播放的歌曲')
  return songs
}

/** 解析 LRC 歌词，按时间排序 */
export function parseLrc(lrc: string): LyricLine[] {
  const result: LyricLine[] = []
  // CRLF files would otherwise leave a trailing \r on the last tag of a line.
  const lines = lrc.split(/\r?\n/)
  const tagRe = /\[(\d{2}):(\d{2})(?:[.:](\d{2,3}))?\]/g

  for (const line of lines) {
    const text = line.replace(/\[.*?\]/g, '').trim()
    if (!text) continue
    const matches = line.matchAll(tagRe)
    for (const m of matches) {
      const min = parseInt(m[1], 10)
      const sec = parseInt(m[2], 10)
      const ms = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0
      result.push({ time: min * 60 + sec + ms / 1000, text })
    }
  }

  return result.sort((a, b) => a.time - b.time)
}
