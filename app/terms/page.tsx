import type { Metadata } from 'next'
import { SITE, SOCIAL_LINKS } from '@/lib/constants'
import { PageMasthead } from '@/components/page-masthead'
import { AnimatedContent } from '@/components/ui/animated-content'

export const metadata: Metadata = {
  title: '君子协定 · 使用规范',
  description: `本站的访问与爬取规范：允许什么、禁止什么、违规怎么处理 - ${SITE.title}`,
}

export default function TermsPage() {
  return (
    <div>
      <PageMasthead
        eyebrow="条款 — Terms"
        title="君子协定 · 使用规范"
        lead="这个站点的访问与爬取规范：允许什么、禁止什么、违规怎么处理。机器可读版本见 robots.txt 与 /.well-known/security.txt。"
        counter="更新于 2026.09.16"
      />

      <AnimatedContent direction="up" delay={0.06}>
        <div className="prose">
          <h2>1. 允许的访问</h2>
          <p>本站全部内容（文章、课程、RSS/Atom）默认公开，欢迎以下访问方式：</p>
          <ul>
            <li>
              <strong>搜索引擎</strong>（Google、Bing、DuckDuckGo、百度、搜狗等）：正常抓取即可，无需另行申请。
            </li>
            <li>
              <strong>AI 搜索与实时引用</strong>（OAI-SearchBot、PerplexityBot、ClaudeBot
              等）：允许抓取，请保持慢速（建议 Crawl-delay 10 秒），并在回答中注明出处与链接。
            </li>
            <li>
              <strong>RSS / Atom 订阅</strong>：全文输出，订阅器按 Feed 更新频率拉取即可（通常 1–2 小时一次足矣）。
            </li>
            <li>
              <strong>个人学习</strong>：可以复制、转载代码与文字片段用于学习与笔记，公开转载请注明出处与本站链接。
            </li>
          </ul>

          <h2>2. 禁止的访问</h2>
          <p>以下行为一律视为不受欢迎，robots.txt 中已对已知爬虫明确声明：</p>
          <ul>
            <li>
              <strong>AI 训练与语料挖掘</strong>：GPTBot、CCBot、Google-Extended、Bytespider、Amazonbot、meta-externalagent
              等以「收集训练数据」为目的的爬虫，本站不允许抓取。这一条是站长的明确意愿，不是疏忽。
            </li>
            <li>
              <strong>高频与爆破式抓取</strong>：持续超过 1 请求/秒、突发超过 60 请求/分钟、多 IP
              分摊绕过限制，或对整站做递归镜像。
            </li>
            <li>
              <strong>伪装与规避</strong>：伪造 User-Agent、轮换代理绕过 robots.txt、伪造 Referer
              或来源，以及任何用于绕过频率限制的手段。
            </li>
            <li>
              <strong>攻击行为</strong>：漏洞扫描、目录爆破、注入尝试、DDoS，以及对本站 LLM
              代理（/v1/* 路径）的滥用——它按 IP 限速（默认 10 次/分钟、200 次/天），超过即封禁。
            </li>
            <li>
              <strong>商用与再分发</strong>：未经许可，不得将本站内容整合进付费产品、数据集或商用语料库。
            </li>
          </ul>

          <h2>3. 频率约定（君子协定核心）</h2>
          <table>
            <thead>
              <tr>
                <th>访问类型</th>
                <th>约定上限</th>
                <th>说明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>搜索引擎</td>
                <td>正常抓取频率</td>
                <td>无需申请，站点变更会通过 sitemap 同步</td>
              </tr>
              <tr>
                <td>AI 搜索 / 引用爬虫</td>
                <td>约 0.1 请求/秒</td>
                <td>robots.txt 已声明 Crawl-delay: 10</td>
              </tr>
              <tr>
                <td>一般爬虫</td>
                <td>1 请求/秒，突发 60 次/分钟</td>
                <td>超过即视为敌意流量</td>
              </tr>
              <tr>
                <td>LLM 代理（/v1/*）</td>
                <td>10 次/分钟，200 次/天</td>
                <td>按 IP 计，超限返回 429；请求体上限 64 KB</td>
              </tr>
            </tbody>
          </table>

          <h2>4. 违规处理</h2>
          <p>按情节递进，不做无预告的永久拉黑：</p>
          <ul>
            <li>
              <strong>第一次（轻度超频）</strong>：返回 429 / 403，附带 Retry-After；robots.txt
              中对对应爬虫收紧或禁止。
            </li>
            <li>
              <strong>持续违规</strong>：IP 段列入封禁名单；若站点迁移至 Cloudflare
              托管，将启用 WAF 自定义规则与速率限制规则在网络边缘拦截。
            </li>
            <li>
              <strong>攻击行为</strong>：保留访问日志证据，通报托管商（GitHub / Cloudflare）滥用渠道，必要时通过法律途径追责。
            </li>
          </ul>
          <p>
            被误伤的合规爬虫（例如换了 UA 的搜索引擎）请通过下方渠道联系，附上 UA 与 IP 段，核实后解除。
          </p>

          <h2>5. 豁免与联系</h2>
          <p>
            学术研究、公益项目或希望以更高频率同步本站内容的，欢迎邮件{' '}
            <a href={`mailto:${SOCIAL_LINKS.email}`}>{SOCIAL_LINKS.email}</a>{' '}
            说明用途与预期频率，通常会给到白名单待遇。安全漏洞请通过{' '}
            <a href="/.well-known/security.txt">security.txt</a> 中的渠道负责任地披露。
          </p>

          <h2>6. 附则</h2>
          <p>
            本协定即站长的使用意愿声明；机器可读部分（robots.txt、security.txt）与页面如有出入，以本页为准。协定更新后本页日期会同步。
          </p>
        </div>
      </AnimatedContent>
    </div>
  )
}
