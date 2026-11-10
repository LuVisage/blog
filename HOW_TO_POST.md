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

## 3D 模型（博客的知识图谱）

首页刊头是一件真正可交互的 3D 模型，不是通用摆件：**中心较大的球体是 LLM 核心，
外围 5 个节点对应本站的 5 门课程**（agent / backend / csp / devtool / ml），
金属连杆表示学习路径。图注里的门数与课次数都从 `COURSE_IDS` 和
`getCurriculumStats()` 现算，所以模型与博客内容是数据层绑定的，不是装饰文案。

由 `components/model-viewer-3d.tsx` 用 Three.js 渲染：可拖拽旋转、滚轮缩放、
自动缓慢旋转（`prefers-reduced-motion` 下关闭）；加载前显示 poster，
无 JS / 无 WebGL / 模型缺失时都保持 poster，不会出现空白。

| 文件 | 用途 |
|------|------|
| `public/models/agent-network-web.glb` | 网页加载的轻量版（减面 + WebP 纹理 + meshopt 编码） |
| `public/images/3d/agent-network-poster-alpha.webp` | 加载前 / 兜底用的海报图（舞台四周已抠成透明，暗色模式不再出现白边） |
| `public/images/3d/cover-*.webp` | 文章封面图池：同一件 LLM/Agent 模型的三个 WebGL 渲染角度，与首页可交互模型一致 |
| `public/images/3d/og-3d.jpg` | 社交分享图 |
| `assets/3d/agent-network-original.glb` | 原始高精度模型（**不在 public，不打进静态产物**） |
| `assets/3d/agent-network-original-obj.zip` | 原始 OBJ + 材质 + 贴图，供 Blender 二次编辑 |

换模型：把新 glb 放到 `public/models/`，改 `app/page.tsx` 里 `ModelViewer3D` 的 `src` 即可。
若要重新压缩，用 `npx @gltf-transform/cli@4 optimize in.glb out.glb --simplify true
--simplify-ratio 0.18 --texture-compress webp --texture-size 1024`；生成的产物带
`EXT_meshopt_compression`，查看器已挂 `MeshoptDecoder`，CSP 也放行了 `wasm-unsafe-eval`
与 `blob:` 纹理加载。

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

本轮移除：阅读成就 / Konami 彩蛋、自定义光标（Aura / Custom）、只写 localStorage 的
假「喜欢」按钮。**AI 热榜保留**；LLM Playground 与课程实验台属于课程正文，也保留。
