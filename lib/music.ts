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

export function getSavedPlaylistId(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function savePlaylistId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, id)
  }
}

/** 从 Meting API 拉取歌单 */
export async function fetchPlaylist(playlistId: string): Promise<Song[]> {
  const url = `${METING_API}?server=netease&type=playlist&id=${encodeURIComponent(playlistId)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`歌单加载失败 (${res.status})`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error('歌单数据格式异常')
  if (data.length === 0) throw new Error('该歌单没有歌曲')
  return data as Song[]
}

/** 解析 LRC 歌词，按时间排序 */
export function parseLrc(lrc: string): LyricLine[] {
  const result: LyricLine[] = []
  const lines = lrc.split('\n')
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
