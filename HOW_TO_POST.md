# 如何发布新文章

这个博客是纯静态网站，文章通过在 `content/posts/` 目录下创建 `.mdx` 文件来发布。

---

## 快速开始

### 用脚本生成（推荐）

```bash
node scripts/new-post.mjs "你的文章标题"
```

这个命令会自动在 `content/posts/` 下生成一个带有完整 frontmatter 的 `.mdx` 模板文件。

### 手动创建

1. 在 `content/posts/` 下创建一个 `.mdx` 文件，文件名建议用英文（会被用作 URL），例如 `my-awesome-post.mdx`
2. 在文件顶部添加 frontmatter：

```yaml
---
title: '我的文章标题'
date: '2026-07-14'
description: '文章的简短描述，会显示在列表和 SEO 中'
tags:
  - AI
  - Agent
  - LLM
---
```

3. 在 frontmatter 下面写正文（Markdown 格式）：

```markdown
## 引言

这是文章的正文内容...

### 代码示例

​```python
print("Hello, World!")
​```
```

4. 本地预览：

```bash
npm run dev
```

打开 `http://localhost:3000/blog` 查看效果。

5. 提交发布：

```bash
git add content/posts/my-awesome-post.mdx
git commit -m "📝 新增文章：我的文章标题"
git push
```

推送后 GitHub Actions 会自动构建并部署，1-2 分钟后文章就会出现在你的博客上。

---

## Frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | 是 | 文章标题 |
| `date` | 是 | 发布日期（格式：`YYYY-MM-DD`） |
| `description` | 是 | 文章摘要，用于列表展示和 SEO |
| `tags` | 推荐 | 标签列表，每行一个 |
| `category` | 可选 | 单个分类名 |
| `series` / `seriesOrder` | 可选 | 系列名与系列内序号 |
| `popular` | 可选 | 设为 `true` 会优先进入首页「编辑精选」 |
| `cover` | 可选 | 自定义封面，见下方「图片使用」 |
| `updated` | 可选 | 最后更新日期 |
| `draft` | 可选 | 设为 `true` 则文章不会出现在网站上 |

---

## Markdown 支持

- 标题、列表、表格、链接、图片等标准 Markdown
- 代码高亮（支持 TypeScript、Python 等）
- LaTeX 数学公式（`$E=mc^2$`）
- GFM（GitHub Flavored Markdown）语法

---

## 图片使用

把图片放在 `public/images/` 目录下，然后在文章中引用：

```markdown
![图片描述](/images/my-image.png)
```

### 自定义封面与分享图

在 frontmatter 里写 `cover`，这张图会同时用于列表卡、文章页大图和社交分享 OG 图：

```yaml
cover: /images/my-cover.jpg
```

- 图片放 `public/images/`，建议 1200×630 以上、JPG/WebP/PNG，会被裁成 16:9。
- 也可以写完整的 `https://` 外链。
- 不写 `cover` 时会从 `public/images/3d/` 的 3D 渲染图池按 slug 稳定分配一张，同时用于列表缩略图与文章页顶部大图；全站默认分享图是 `public/images/3d/og-3d.jpg`。
- 路径会自动补上部署前缀（本地开发是 `/images/…`，GitHub Pages 是 `/blog/images/…`）。

---

## 站点配置（不用改源码）

在 `.env.local`（本地）或 GitHub Actions 变量（部署）里设置即可：

| 变量 | 用途 |
|------|------|
| `NEXT_PUBLIC_ANALYTICS_PROVIDER` | `google` 或 `umami`；不设或拼错都等于关闭统计 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 的 `G-XXXX` |
| `NEXT_PUBLIC_UMAMI_SRC` / `NEXT_PUBLIC_UMAMI_ID` | Umami 脚本地址与站点 ID |
| `NEXT_PUBLIC_GITHUB_URL` / `NEXT_PUBLIC_TWITTER_URL` | 覆盖首页与页脚的社交链接 |
| `NEXT_PUBLIC_LLM_PROXY_URL` | LLM Playground 的 Cloudflare Worker 地址 |

友链（`FRIENDS`）、项目（`PROJECTS`）、关于页时间线仍在 `lib/constants.ts` 里维护。
列表每页篇数由 `SITE.postsPerPage` 控制，分页路由 `/posts/page/N/` 在构建时自动生成。

---

## 课程图版（首页）

首页主栏的图版是一张**服务端渲染的 SVG**（`components/course-plate.tsx`）：
中心是 LLM 核心，外围 5 个节点对应本站的 5 门课程（agent / backend / csp /
devtool / ml），每个节点都是一条真正可点的课程链接。门数、课次数与参考页数都从
`COURSE_IDS`、`getCurriculumStats()`、`getReferencePages()` 现算，与内容绑定。

第 18 轮把原先那件 Three.js 可交互模型（733KB GLB + 约 360KB 运行时）换成了它：
零 JS、零额外请求、无 JS 与 reduced-motion 下表现一致。窄屏（<640px）不缩放 SVG，
改渲染同一份数据的 HTML 清单——缩到 360px 时 15px 字只剩 7px，那不是可读的图。

| 文件 | 用途 |
|------|------|
| `public/images/3d/cover-*.webp` | 文章封面图池：同一件 LLM/Agent 静物渲染的三个角度，纯静态文件 |
| `public/images/3d/og-3d.jpg` | 社交分享图（SVG 与 WebP 在部分平台不被抓取，故留一份 JPEG） |

改课程门数或课次统计不用碰这份组件：改 `content/curriculum/` 下的 MDX 即可，
图版与图注会跟着变。

---

## 站点标配页面与订阅源

参考 Maggie Appleton、Jim Nielsen、amanhimself.dev、Frank Chimero、Gwern 等
个人博客的导航与页脚实测，本站提供：

| 路径 | 用途 |
|------|------|
| `/now` | 近况页。文章数、课程数、最近更新都从本地 MDX 现算；个人近况在 `lib/constants.ts` 的 `NOW.personalNote` 补充（留空时只展示可核对的站点事实） |
| `/uses` | 本站技术栈，可在 `package.json` 逐项核对；个人设备清单在 `USES` 里补 |
| `/subscribe` | RSS / Atom / JSON Feed 三种源 + 阅读器引导 + 一键复制 |
| `rss.xml` / `atom.xml` / `feed.json` | RSS 2.0 / Atom 1.0 / JSON Feed 1.1，由 `npm run prebuild` 生成 |

另有 `<link rel="me">` 身份声明与全站 `@media print` 打印样式（打印时只留正文）。

已下线且不打算恢复：阅读成就 / Konami 彩蛋、磁吸按钮、跑马灯、AI 热榜、
Lenis 平滑滚动、Three.js 可交互模型、背景音乐播放器、整段正文的滚动淡入、
聚光卡片与封面视差（旧版会把文字压在光斑和阴影里）。

第 20 轮回归并重做的是这些「轻版」：页顶阅读进度线、换页扫光、刊头视差、
翻板数字、跟手柔光（只有一层令牌化渐变，不压文字）、非文字块的滚动入场。
收藏夹、命令面板、代码块复制、图片灯箱、章节目录、课程实验台与 LLM Playground
一直在。
