/**
 * Deterministic generated cover art.
 *
 * The blog has no per-post cover images, which left every card as a flat block
 * of text. A cover derived purely from the post metadata means zero authoring
 * cost and a stable result across builds.
 */

const PALETTES: ReadonlyArray<readonly [string, string]> = [
  ['#6D5BD0', '#2A9DB8'],
  ['#C9688F', '#6D5BD0'],
  ['#D89A4A', '#C9688F'],
  ['#3F9E7A', '#2A9DB8'],
  ['#4A6FD8', '#2A9DB8'],
  ['#8B6FEF', '#D89A4A'],
  ['#B7567E', '#4A6FD8'],
  ['#4F9D6B', '#8B6FEF'],
]

/** FNV-1a — small, stable, good enough to spread slugs across palettes. */
function hash(input: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '&' ? '&amp;' : c === "'" ? '&apos;' : '&quot;'
  )
}

export interface CoverInput {
  slug: string
  title: string
  tags?: string[]
  category?: string
}

export interface Cover {
  from: string
  to: string
  /** 0-3, picks the hairline texture variant */
  variant: number
  /** The wordmark drawn into the art — useful for OG alt text and tests */
  keyword: string
  /** Ready-to-use `data:` URI, valid as CSS background or <img src> */
  url: string
}

/** Longest wordmark we attempt; anything past this is cut at a word break. */
const MAX_KEYWORD = 12

function truncate(word: string): string {
  if (word.length <= MAX_KEYWORD) return word
  const clipped = word.slice(0, MAX_KEYWORD)
  return clipped.slice(0, Math.max(clipped.lastIndexOf(' ') + 1, 6))
}

/**
 * Tags are the finest-grained authored keywords, so they get first say — a
 * broad category like "AI Agent" would otherwise outrank the real subject.
 * Within tags take the longest: short ones like "AI" or "LLM" are buckets every
 * post shares, while the specific subject is almost always the wordy entry.
 * The category only steps in when a post has no tags at all.
 */
function pickKeyword(input: CoverInput): string {
  const clean = (t: string | undefined) => (t || '').replace(/^#+/, '').trim()

  for (const pool of [input.tags ?? [], [input.category]]) {
    const authored = pool.map(clean).filter(Boolean)
    if (authored.length) {
      return truncate(authored.reduce((best, t) => (t.length > best.length ? t : best)))
    }
  }

  const words = input.title.split(/[\s:：,，。.!！?？「」『』《》()（）[\]—\-/、]+/).filter(Boolean)
  const latin = words.find((w) => /^[A-Za-z][A-Za-z0-9+._-]{1,}$/.test(w))
  if (latin) return truncate(latin)

  const cjk = words.find((w) => /[\u4e00-\u9fff]/.test(w))
  return truncate(cjk ? cjk.slice(0, 4) : input.title.slice(0, 4))
}

/** CJK glyphs occupy a full em; Latin averages a bit over half. */
function advanceWidth(text: string): number {
  let w = 0
  for (const ch of text) w += /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/.test(ch) ? 1 : 0.6
  return Math.max(w, 1)
}

export function coverFor(input: CoverInput): Cover {
  const h = hash(input.slug)
  const [from, to] = PALETTES[h % PALETTES.length]
  const variant = (h >> 8) % 4
  const keyword = pickKeyword(input)

  // Diagonal hairlines, offset per variant so covers don't tile identically.
  const step = 46
  const shift = variant * 12
  let lines = ''
  for (let x = -630 + shift; x < 1400; x += step) {
    lines += `<path d="M${x} 630L${x + 630} 0"/>`
  }

  // Cards paint this 1200x630 frame with `bg-cover`, which crops it. The
  // worst case is a square-ish cover box, which keeps only about 630 units of
  // width and 196 of height, so the wordmark is budgeted to fit well inside
  // that window rather than the full canvas.
  const size = Math.max(40, Math.min(140, Math.floor(440 / advanceWidth(keyword))))

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">` +
    `<defs>` +
    `<linearGradient id="a" x1="0" y1="1" x2="1" y2="0">` +
    `<stop offset="0" stop-color="${from}" stop-opacity="0.62"/>` +
    `<stop offset="1" stop-color="${to}" stop-opacity="0.14"/>` +
    `</linearGradient>` +
    `<radialGradient id="b" cx="0.82" cy="0.16" r="0.78">` +
    `<stop offset="0" stop-color="${to}" stop-opacity="0.55"/>` +
    `<stop offset="1" stop-color="${to}" stop-opacity="0"/>` +
    `</radialGradient>` +
    `<linearGradient id="c" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0.58" stop-color="#08080D" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="#08080D" stop-opacity="0.66"/>` +
    `</linearGradient>` +
    `</defs>` +
    `<rect width="1200" height="630" fill="#0C0C13"/>` +
    `<rect width="1200" height="630" fill="url(#a)"/>` +
    `<rect width="1200" height="630" fill="url(#b)"/>` +
    `<g stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="1">${lines}</g>` +
    `<text x="600" y="315" font-family="Georgia, 'Noto Serif SC', serif" font-size="${size}" ` +
    `font-weight="700" text-anchor="middle" dominant-baseline="central" ` +
    `fill="#FFFFFF" fill-opacity="0.14">` +
    `${escapeXml(keyword)}</text>` +
    `<rect width="1200" height="630" fill="url(#c)"/>` +
    `</svg>`

  return { from, to, variant, keyword, url: `data:image/svg+xml,${encodeURIComponent(svg)}` }
}
