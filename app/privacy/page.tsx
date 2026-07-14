import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'

export const metadata: Metadata = {
  title: '隐私政策',
  description: `隐私政策 - ${SITE.title}`,
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 lg:mb-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          <span className="gradient-text">隐私政策</span>
        </h1>
        <p className="text-gray-400 dark:text-gray-500 text-sm">
          最后更新：2025年7月14日
        </p>
      </div>

      <div className="rounded-3xl glass-card p-6 sm:p-10 lg:p-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2>1. 数据收集</h2>
          <p>
            本博客为纯静态网站，本身不收集任何个人数据。我们使用以下第三方服务，它们可能有各自的数据收集政策：
          </p>
          <ul>
            <li><strong>Giscus</strong>：评论系统由 GitHub Discussions 驱动。使用评论功能需要登录 GitHub 账号，相关数据由 GitHub 处理。详见 GitHub 隐私政策。</li>
            <li><strong>GitHub Pages</strong>：托管服务由 GitHub 提供，可能收集基本的访问日志。详见 GitHub 隐私政策。</li>
          </ul>

          <h2>2. 评论</h2>
          <p>
            当你在本博客发表评论时，你的 GitHub 用户名、头像和评论内容将公开展示在文章页面。请勿在评论中分享敏感个人信息。
          </p>

          <h2>3. Cookies</h2>
          <p>
            本博客使用以下 Cookie：
          </p>
          <ul>
            <li><strong>主题偏好</strong>：存储你对亮色/暗色主题的选择（localStorage），不会发送到服务器。</li>
            <li><strong>Giscus</strong>：评论系统可能设置必要的 Cookie，用于 GitHub 身份验证。</li>
          </ul>

          <h2>4. 外部链接</h2>
          <p>
            文章内容中可能包含指向外部网站的链接。点击这些链接将跳转到第三方网站，其隐私政策与本博客无关。建议在访问任何外部链接时查看其隐私政策。
          </p>

          <h2>5. 免责声明</h2>
          <p>
            本博客所有文章均为个人观点，不代表任何组织的立场。技术文章中的代码和方案仅供参考，使用者需自行评估适用性和风险。作者不对因使用本博客内容而产生的任何直接或间接损失承担责任。
          </p>

          <h2>6. 联系</h2>
          <p>
            如有任何关于隐私的问题，请联系：
            {' '}
            <a href={`mailto:${SITE.author.email}`} className="text-pink-500 dark:text-pink-400 hover:underline">
              {SITE.author.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
