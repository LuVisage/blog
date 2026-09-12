/**
 * RSS / Atom / JSON Feed generation script
 * Run: node scripts/generate-rss.mjs
 */

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { SITE, siteUrl } from '../lib/constants.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const postsDir = join(__dirname, '..', 'content', 'posts')
const publicDir = join(__dirname, '..', 'public')

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
        description: data.description || '',
        slug,
        draft: data.draft === true,
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

function generateRSS(posts) {
  const items = posts
    .map(
      (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl(`posts/${post.slug}`)}</link>
      <guid isPermaLink="true">${siteUrl(`posts/${post.slug}`)}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.updated ? `<atom:updated>${post.updated.toISOString()}</atom:updated>` : ''}
    </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl('rss.xsl')}"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${siteUrl()}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.locale}</language>
    <lastBuildDate>${posts[0]?.date?.toUTCString() || new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl('rss.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
}

function generateAtom(posts) {
  const entries = posts
    .map(
      (post) => `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${siteUrl(`posts/${post.slug}`)}"/>
    <id>${siteUrl(`posts/${post.slug}`)}</id>
    <published>${post.date.toISOString()}</published>
    ${post.updated ? `<updated>${post.updated.toISOString()}</updated>` : `<updated>${post.date.toISOString()}</updated>`}
    <summary>${escapeXml(post.description)}</summary>
    <author>
      <name>${escapeXml(SITE.author.name)}</name>
      <email>${escapeXml(SITE.author.email)}</email>
    </author>
  </entry>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="${siteUrl('rss.xsl')}"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.title)}</title>
  <subtitle>${escapeXml(SITE.description)}</subtitle>
  <link href="${siteUrl()}" rel="alternate"/>
  <link href="${siteUrl('atom.xml')}" rel="self"/>
  <id>${siteUrl()}</id>
  <updated>${posts[0]?.date?.toISOString() || new Date().toISOString()}</updated>
  <author>
    <name>${escapeXml(SITE.author.name)}</name>
    <email>${escapeXml(SITE.author.email)}</email>
  </author>
${entries}
</feed>`
}

function main() {
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  const posts = getPosts()
  console.log(`Found ${posts.length} published posts`)

  writeFileSync(join(publicDir, 'rss.xml'), generateRSS(posts))
  console.log('已生成 rss.xml')

  writeFileSync(join(publicDir, 'atom.xml'), generateAtom(posts))
  console.log('已生成 atom.xml')

  console.log('RSS feeds generated successfully!')
}

main()
