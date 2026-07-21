import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export interface PostMeta {
  slug: string
  title: string
  date: string
  updated?: string
  description: string
  tags: string[]
  category?: string
  series?: string
  seriesOrder?: number
  popular?: boolean
  draft: boolean
  readingTime: number
}

export interface Post extends PostMeta {
  content: string
}

export interface ArchiveMonth {
  month: number
  posts: PostMeta[]
}

export interface ArchiveYear {
  year: number
  months: ArchiveMonth[]
}

const postsDirectory = join(process.cwd(), 'content', 'posts')

/** Parse reading time from word count (Chinese: ~300 chars/min, English: ~200 words/min) */
function estimateReadingTime(text: string): number {
  const cleaned = text.replace(/```[\s\S]*?```/g, '').replace(/[#*\->`|~]/g, '')
  const chineseChars = (cleaned.match(/[一-鿿]/g) || []).length
  const englishWords = cleaned
    .replace(/[一-鿿]/g, '')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.ceil(chineseChars / 300 + englishWords / 200)
  return Math.max(1, minutes)
}

/** Get all posts sorted by date (newest first), excluding drafts */
export function getAllPosts(): PostMeta[] {
  try {
    const filenames = readdirSync(postsDirectory).filter((f) => f.endsWith('.mdx'))

    const posts = filenames.map((filename) => {
      const filePath = join(postsDirectory, filename)
      const raw = readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const slug = filename.replace(/\.mdx$/, '')

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        updated: data.updated ? new Date(data.updated).toISOString() : undefined,
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || undefined,
        series: data.series || undefined,
        seriesOrder: data.seriesOrder ?? undefined,
        popular: data.popular === true,
        draft: data.draft === true,
        readingTime: estimateReadingTime(content),
      } satisfies PostMeta
    })

    return posts
      .filter((p) => !p.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
}

/** Get a single post by slug */
export function getPostBySlug(slug: string): Post | null {
  try {
    const filePath = join(postsDirectory, `${slug}.mdx`)
    const raw = readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      updated: data.updated ? new Date(data.updated).toISOString() : undefined,
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || undefined,
      series: data.series || undefined,
      seriesOrder: data.seriesOrder ?? undefined,
      popular: data.popular === true,
      draft: data.draft === true,
      readingTime: estimateReadingTime(content),
      content,
    }
  } catch {
    return null
  }
}

// ─── Tags ───────────────────────────────────────────────

/** Get all unique tags with post counts */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts()
  const tagMap = new Map<string, number>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/** Get posts filtered by tag */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag))
}

// ─── Categories ─────────────────────────────────────────

/** Get all unique categories with post counts */
export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts()
  const catMap = new Map<string, number>()

  posts.forEach((post) => {
    if (post.category) {
      catMap.set(post.category, (catMap.get(post.category) || 0) + 1)
    }
  })

  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

/** Get posts filtered by category */
export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter((post) => post.category === category)
}

// ─── Series ──────────────────────────────────────────────

/** Get all unique series with post counts */
export function getAllSeries(): { series: string; count: number }[] {
  const posts = getAllPosts()
  const seriesMap = new Map<string, number>()

  posts.forEach((post) => {
    if (post.series) {
      seriesMap.set(post.series, (seriesMap.get(post.series) || 0) + 1)
    }
  })

  return Array.from(seriesMap.entries())
    .map(([series, count]) => ({ series, count }))
    .sort((a, b) => b.count - a.count)
}

/** Get posts in a series, ordered by seriesOrder then date */
export function getPostsBySeries(series: string): PostMeta[] {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort((a, b) => {
      if (a.seriesOrder !== undefined && b.seriesOrder !== undefined) {
        return a.seriesOrder - b.seriesOrder
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime()
    })
}

// ─── Archive ─────────────────────────────────────────────

/** Get posts grouped by year and month */
export function getArchiveTree(): ArchiveYear[] {
  const posts = getAllPosts()
  const yearMap = new Map<number, Map<number, PostMeta[]>>()

  posts.forEach((post) => {
    const d = new Date(post.date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1

    if (!yearMap.has(year)) yearMap.set(year, new Map())
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) monthMap.set(month, [])
    monthMap.get(month)!.push(post)
  })

  return Array.from(yearMap.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, monthMap]) => ({
      year,
      months: Array.from(monthMap.entries())
        .sort(([a], [b]) => b - a)
        .map(([month, posts]) => ({ month, posts })),
    }))
}

// ─── Related Posts ───────────────────────────────────────

/** Get related posts based on shared tags */
export function getRelatedPosts(slug: string, count: number = 3): PostMeta[] {
  const all = getAllPosts()
  const current = all.find((p) => p.slug === slug)
  if (!current || !current.tags.length) return all.filter((p) => p.slug !== slug).slice(0, count)

  const scored = all
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      post: p,
      score: p.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  // If we don't have enough tag-matching posts, fill with recent posts
  if (scored.length < count) {
    const existing = new Set(scored.map((s) => s.post.slug))
    const fillers = all
      .filter((p) => p.slug !== slug && !existing.has(p.slug))
      .slice(0, count - scored.length)
    return [...scored.map((s) => s.post), ...fillers]
  }

  return scored.slice(0, count).map((s) => s.post)
}

// ─── Pagination ──────────────────────────────────────────

/** Get paginated posts */
export function getPaginatedPosts(page: number, perPage: number = 10) {
  const all = getAllPosts()
  const totalPages = Math.ceil(all.length / perPage)
  const posts = all.slice((page - 1) * perPage, page * perPage)
  return { posts, totalPages, currentPage: page }
}

/** Get adjacent posts for prev/next navigation */
export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null
  next: PostMeta | null
} {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}

/** Get recent posts */
export function getRecentPosts(count: number = 5): PostMeta[] {
  return getAllPosts().slice(0, count)
}

/** Get popular posts (marked with `popular: true` in frontmatter). Falls back to recent posts if none are marked. */
export function getPopularPosts(count: number = 6): PostMeta[] {
  const all = getAllPosts()
  const popular = all.filter((p) => p.popular)
  if (popular.length >= count) return popular.slice(0, count)
  // Pad with recent posts not already in popular
  const existing = new Set(popular.map((p) => p.slug))
  const fillers = all.filter((p) => !existing.has(p.slug)).slice(0, count - popular.length)
  return [...popular, ...fillers]
}
