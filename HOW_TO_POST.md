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

### 自定义分享图

页面上不再渲染封面：列表是「序号 + 标题 + 摘要」的索引行，文章页从标题直接进正文
（第 21 轮简洁风减法把题图、排字封面与图片灯箱一并删了）。frontmatter 里的 `cover`
现在只有一个用途——当这篇文章的社交分享图（OG / Twitter Card）：

```yaml
cover: /images/my-cover.jpg
```

- 图片放 `public/images/`，建议 1200×630 以上、JPG/WebP/PNG（SVG 在多数社交平台不被抓取）。
- 也可以写完整的 `https://` 外链。
- 不写 `cover` 时用全站排字分享图 `public/og-default.png`：站点同款字体栈与令牌渲染，
  不是 AI 素材，重新生成用 `node ../ui-concepts/verify/og-card.mjs`。
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

## 首页刊头与站点事实

首页是服务端渲染的纯文字版面（`app/page.tsx`）：刊头只有眉题、站名、导语，加一行
**现算的站点事实**——`N 篇文章 · N 课次 · N 标签 · 最近更新 yyyy.MM.dd`。文章数取
`getAllPosts()`，课次按 `COURSE_IDS` 累加 `getCurriculumStats(id).lessons`，标签数取
`getAllTags()`，最近更新日期取最新一篇的 `date`。改内容这些数字自己跟着变，不用碰组件。

主栏是「最新」5 条文章行（日期 / 分类 / 时长 → 标题 → 摘要 → 标签），侧栏五个功能块：
关于本站、精选、热门标签、书架、订阅。

- **精选**由 frontmatter 的 `popular: true` 决定，取前 3 篇；标了 `popular` 的不足 3 篇时
  用最新文章补齐（`getPopularPosts()`）。
- 第 18 轮那件 Three.js 模型（733KB GLB + 约 360KB 运行时）先换成服务端 SVG 课程图版，
  第 21 轮简洁风减法把图版也删了：课程编排在 `/learn` 有完整版，首页再画一遍是重复入口。
- 首页不再有任何入场动画、视差或跟手光效；`public/images/3d/` 的 AI 渲染图池已在第 20 轮
  清空，`public/images/` 现在只放你自己文章里引用的图。

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

第 20 轮曾回归一批「轻版」装饰（换页扫光、刊头视差、翻板数字、跟手柔光、
非文字块的滚动入场），第 21 轮简洁风减法把它们连同下列组件一并删掉，只走简洁风：
排字封面、图片灯箱、字号调节、作者卡、课程图版、`⌘K` 命令面板与它的触发钮、
GSAP 供应器、计数磁贴、滚动入场 / 模糊揭示包装层。删的理由是重复或装饰——
封面与标题说的是同一件事，图版与 `/learn` 重复，命令面板与页头导航重复，
字号调节与浏览器自身的缩放重复，入场动画让文字在 JS 到位前不可见。

**留下来的都是功能与状态反馈**：页顶阅读进度线、跨文档视图过渡、章节落点提示、
收藏、代码块复制、文首「复制链接」、章节目录与窄屏章节条、搜索页（页头有入口）、
归档日历、订阅卡、回到顶部、主题切换、文末许可与系列导航、giscus 评论，
以及换页时的焦点交接（读屏与键盘用户不会掉回页首）。全部尊重「减少动态效果」。
课程实验台与 LLM Playground 一直在。
