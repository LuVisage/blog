# LuVisage Blog

这是我的个人技术博客。我关注 AI 算法与工程实践——计算机视觉、自然语言处理、大模型应用与 Agent 架构，在这里记录从算法到工程的跑通与验收过程。

我相信算法要跑通，工程要验收：跑通是底线，验收是标准；写作是为了把这两件事讲清楚，也希望能帮到同样走在这条路上的朋友。

## 功能

- **文章系统**：分类 / 标签 / 系列 / 归档 / 相关文章 / 上一篇下一篇 / 系列内导航
- **全文搜索**：Pagefind 站内搜索，页头「搜索」入口直达 `/search`（键盘可全程操作）
- **课程体系**：`/learn` 下的 5 门入门课程、参考手册与可动手实验台
- **阅读体验**：段落文字始终完整可读、目录滚动高亮、窄屏常驻章节条、章节永久链接与落点提示、页顶阅读进度线、文章收藏
- **视觉**：报纸式刊头（眉题 / 站名 / 简介 / 一行现算的站点事实）、序号 + 标题的文章索引行、1px 发丝线分组、侧栏标签云、单一强调色锚点
- **交互细节**：只保留状态反馈——阅读进度、主题切换、代码块与本文链接复制、章节落点提示、换页焦点交接；入场动画、视差、跟手柔光、翻板数字已全部下线；全部尊重「减少动态效果」偏好
- **订阅与氛围**：RSS 2.0 / Atom / JSON Feed、GitHub 评论（giscus）、亮 / 暗双主题、文末许可与源码修订入口

## 技术栈

Next.js 15（App Router，静态导出）· React 19 · TypeScript · Tailwind CSS 3 · 原生 CSS 变量 · Pagefind · 原生 CSS 动效

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
