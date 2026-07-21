/**
 * Sitemap.xml generation script
 * Run: node scripts/generate-sitemap.mjs
 */
import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsDir = join(__dirname, '..', 'content', 'posts')
const publicDir = join(__dirname, '..', 'public')

const siteUrl = 'https://LuVisage.github.io/blog'

// Static pages (without trailing dynamic segments)
const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/posts/', priority: '0.9', changefreq: 'daily' },
  { path: '/archive/', priority: '0.7', changefreq: 'weekly' },
  { path: '/categories/', priority: '0.6', changefreq: 'weekly' },
  { path: '/tags/', priority: '0.6', changefreq: 'weekly' },
  { path: '/series/', priority: '0.5', changefreq: 'weekly' },
  { path: '/search/', priority: '0.3', changefreq: 'monthly' },
  { path: '/about/', priority: '0.4', changefreq: 'monthly' },
  { path: '/projects/', priority: '0.4', changefreq: 'monthly' },
  { path: '/friends/', priority: '0.3', changefreq: 'monthly' },
  { path: '/privacy/', priority: '0.1', changefreq: 'yearly' },
]

function getPosts() {
  if (!existsSync(postsDir)) return []

  const filenames = readdirSync(postsDir).filter((f) => f.endsWith('.mdx'))

  return filenames
    .map((filename) => {
      const raw = readFileSync(join(postsDir, filename), 'utf-8')
      const { data } = matter(raw)
      const slug = filename.replace(/\.mdx$/, '')

      return {
        title: data.title || slug,
        date: data.date ? new Date(data.date) : new Date(),
        updated: data.updated ? new Date(data.updated) : undefined,
        slug,
        draft: data.draft === true,
        tags: Array.isArray(data.tags) ? data.tags : [],
        category: data.category || undefined,
        series: data.series || undefined,
      }
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function generateUrlEntry(url, lastmod, priority, changefreq) {
  const parts = [`  <url>`]
  parts.push(`    <loc>${escapeXml(url)}</loc>`)
  if (lastmod) parts.push(`    <lastmod>${formatDate(lastmod)}</lastmod>`)
  parts.push(`    <priority>${priority}</priority>`)
  if (changefreq) parts.push(`    <changefreq>${changefreq}</changefreq>`)
  parts.push(`  </url>`)
  return parts.join('\n')
}

function main() {
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  const posts = getPosts()
  console.log(`Found ${posts.length} published posts for sitemap`)

  const urls = []

  // Static pages
  staticPages.forEach(({ path, priority, changefreq }) => {
    urls.push(generateUrlEntry(`${siteUrl}${path}`, new Date(), priority, changefreq))
  })

  // Post pages (highest priority for recent content)
  posts.forEach((post, i) => {
    const priority = i < 5 ? '0.85' : i < 15 ? '0.75' : '0.6'
    urls.push(
      generateUrlEntry(
        `${siteUrl}/posts/${post.slug}/`,
        post.updated || post.date,
        priority,
        'monthly'
      )
    )
  })

  // Collect unique tag, category, and series pages
  const tags = new Set()
  const categories = new Set()
  const seriesSet = new Set()

  posts.forEach((post) => {
    post.tags.forEach((t) => tags.add(t))
    if (post.category) categories.add(post.category)
    if (post.series) seriesSet.add(post.series)
  })

  tags.forEach((tag) => {
    urls.push(
      generateUrlEntry(`${siteUrl}/tags/${encodeURIComponent(tag)}/`, new Date(), '0.4', 'monthly')
    )
  })

  categories.forEach((cat) => {
    urls.push(
      generateUrlEntry(
        `${siteUrl}/categories/${encodeURIComponent(cat)}/`,
        new Date(),
        '0.4',
        'monthly'
      )
    )
  })

  seriesSet.forEach((s) => {
    urls.push(
      generateUrlEntry(`${siteUrl}/series/${encodeURIComponent(s)}/`, new Date(), '0.5', 'monthly')
    )
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`

  writeFileSync(join(publicDir, 'sitemap.xml'), sitemap)
  console.log(`✓ Generated sitemap.xml with ${urls.length} URLs`)
}

main()
