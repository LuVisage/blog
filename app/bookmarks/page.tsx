import type { Metadata } from 'next'
import { PageMasthead } from '@/components/page-masthead'
import { BookmarksList } from '@/components/bookmarks-list'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: '收藏夹',
  description: '保存在当前浏览器里的文章阅读清单。',
  robots: { index: false, follow: true },
}

/**
 * /bookmarks —— 本机阅读清单。
 *
 * 没有一个字节离开浏览器：页面只把公开的文章元数据传进客户端组件，
 * 真正的收藏列表由客户端从 localStorage 读取。所以它不进 sitemap，
 * 也标了 noindex —— 同一份 URL 在不同访客那里本来就不是同一份内容。
 */
export default function BookmarksPage() {
  const posts = getAllPosts()

  return (
    <div className="slash-page">
      <PageMasthead
        eyebrow="BOOKMARKS · 本机"
        title="收藏夹"
        lead="把想再读一遍的文章留在这里。不需要账号，也不会同步到别的设备。"
        counter="仅保存在当前浏览器"
      />

      <BookmarksList posts={posts} />
    </div>
  )
}
