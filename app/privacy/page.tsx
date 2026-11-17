import type { Metadata } from 'next'
import { SITE, EMAIL_OBFUSCATED } from '@/lib/constants'
import { ObfuscatedEmail } from '@/components/obfuscated-email'
import { PageMasthead } from '@/components/page-masthead'

export const metadata: Metadata = {
  title: '隐私政策',
  description: `隐私政策 - ${SITE.title}`,
}

export default function PrivacyPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="条款 — Privacy"
        title="隐私政策"
        lead="这个站点会记录什么、不会记录什么。"
        counter="更新于 2026.11.13"
      />

      <div>
        <div className="prose">
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

          <h2>3. 本机存储与 Cookie</h2>
          <p>
            本站自己不设置 Cookie，也没有加载访问统计。下面这些偏好写在浏览器的 localStorage 里，
            只留在你这台设备上，不会随请求发回服务器：
          </p>
          <ul>
            <li><strong>主题偏好</strong>（<code>theme</code>）：亮色 / 暗色的选择。</li>
            <li><strong>收藏夹</strong>（<code>baron-bookmarks</code>）：收藏文章的 slug 列表，换个浏览器就看不到。</li>
            <li><strong>课程进度</strong>（<code>learn.课程名.progress.v1</code>）：课次里勾掉的自测题与自查清单。</li>
            <li>
              <strong>接口设置</strong>（<code>learn.agent.llm.v1</code>）：实验台里你自己填的服务地址、模型与 API Key。
              Key 只存在本机；真正发起调用时，它随请求头发往你自己填的转发服务与模型厂商，本站不经手、不记录。
            </li>
          </ul>
          <p>
            在浏览器里清除本站的站点数据，就能一并抹掉以上偏好。第三方 Cookie 只可能来自评论区：
            <strong>Giscus</strong> 以 iframe 嵌入 giscus.app，登录 GitHub 时由它设置身份验证所需的 Cookie，
            详见 GitHub 隐私政策。
          </p>

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
            如有任何关于隐私的问题，请联系：{' '}
            <ObfuscatedEmail encoded={EMAIL_OBFUSCATED} className="underline underline-offset-2" />
          </p>
        </div>
      </div>
    </div>
  )
}
