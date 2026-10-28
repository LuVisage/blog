# Baron_Zhang Blog

这是我的个人技术博客。我是一名 AI 探索者与 Agent 开发者，在这里记录大模型应用、AI Agent 架构与开发实践——从 LLM 到多 Agent 协作，从 Prompt Engineering 到 RAG、微调，还有一路上的学习与实战历程。

我相信写作是最好的思考方式：把复杂的技术概念写清楚，既是对自己的整理，也希望能帮到同样走在这条路上的朋友。

## 功能

- **文章系统**：分类 / 标签 / 系列 / 归档 / 相关文章 / 上一篇下一篇
- **全文搜索**：Pagefind 站内搜索 + `⌘K` 命令面板（跳转页面、切换主题、快速直达文章与课程）
- **课程体系**：`/learn` 下的 5 门入门课程与参考手册
- **阅读体验**：阅读进度条、目录滚动高亮、正文随滚动渐入、字号调节
- **交互细节**：Lenis 平滑滚动、自定义光标、标题解密文字、卡片聚光、封面视差、统计翻板数字等十余项（桌面端生效，完整尊重「减少动态效果」偏好）
- **氛围**：背景音乐播放器、GitHub 评论（giscus）、RSS / Atom 订阅、亮 / 暗双主题

## 技术栈

Next.js 15（App Router，静态导出）· React 19 · TypeScript · Tailwind CSS 3 · 原生 CSS 变量 · Pagefind · GSAP · Lenis

## 本地开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 静态导出（prebuild: RSS/sitemap → next build → postbuild: pagefind 索引 + 产物审计）
npm run check    # typecheck + lint + 禁 emoji + 代理测试 + env 审计
```

## 部署

构建产物静态导出到 `out/`，托管在 GitHub Pages：<https://LuVisage.github.io/blog>

## 设计

视觉语言参考 are.na 的灰阶编辑感：白画布 + 灰阶令牌 + indigo 单强调色 + 3px 微圆角 + mono 大写胶囊 + 深蓝页脚。完整的设计台账与令牌登记见 `SPEC_LEDGER.md` 与 `SPEC_LEDGER.tokens.json`。
