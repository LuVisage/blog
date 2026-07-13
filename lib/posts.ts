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
  draft: boolean
  readingTime: number
}

export interface Post extends PostMeta {
  content: string
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
      draft: data.draft === true,
      readingTime: estimateReadingTime(content),
      content,
    }
  } catch {
    return null
  }
}

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
