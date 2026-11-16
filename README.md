# Baron_Zhang Blog

这是我的个人技术博客。我是一名 AI 探索者与 Agent 开发者，在这里记录大模型应用、AI Agent 架构与开发实践——从 LLM 到多 Agent 协作，从 Prompt Engineering 到 RAG、微调，还有一路上的学习与实战历程。

我相信写作是最好的思考方式：把复杂的技术概念写清楚，既是对自己的整理，也希望能帮到同样走在这条路上的朋友。

## 功能

- **文章系统**：分类 / 标签 / 系列 / 归档 / 相关文章 / 上一篇下一篇 / 系列内导航
- **全文搜索**：Pagefind 站内搜索 + `⌘K` 命令面板（跳转页面、切换主题、快速直达文章与课程）
- **课程体系**：`/learn` 下的 5 门入门课程、参考手册与可动手实验台
- **阅读体验**：段落文字始终完整可读、目录滚动高亮、窄屏常驻章节条、章节永久链接与落点提示、字号调节、页顶阅读进度线
- **视觉**：报纸式刊头（签名色带 / 编号入口 / 翻板数据栏）、装裱课程图版、带题图与编号的复合文章行、侧栏编号与标签云、单一强调色锚点
- **交互细节**：刊头轻视差、换页微升 + 顶部扫光、非文字块的轻量滚动入场、跟手柔光、行 hover 复合反馈（题图放大 / 箭头滑入 / 位移）、翻板数字、代码块复制、图片灯箱、主题切换圆形揭示；全部尊重「减少动态效果」偏好
- **订阅与氛围**：RSS 2.0 / Atom / JSON Feed、GitHub 评论（giscus）、亮 / 暗双主题、文末许可与源码修订入口

## 技术栈

Next.js 15（App Router，静态导出）· React 19 · TypeScript · Tailwind CSS 3 · 原生 CSS 变量 · Pagefind · GSAP

## 本地开发

```bash
npm install
npm run dev      # 本地开发
npm run build    # 静态导出（prebuild: RSS/sitemap → next build → postbuild: pagefind 索引 + 产物审计）
npm run check    # typecheck + lint + 禁 emoji + UI 纪律闸 + 代理测试 + env 审计
```

## 部署

构建产物静态导出到 `out/`，托管在 GitHub Pages：<https://LuVisage.github.io/blog>

## 设计

视觉语言为中文报纸 / 印刷杂志：标题黑体、正文宋体、纸白画布 + 单一强调色 + 1px 发丝线分组 + 实墨页脚。首页用全宽刊头 + 主栏 / 侧栏分栏，与文章页共用 1200px 中轴。完整的设计台账与令牌登记见 `DESIGN.md`、`SPEC_LEDGER.md` 与 `SPEC_LEDGER.tokens.json`。
