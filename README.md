# Baron_Zhang Blog

个人技术博客：文章、分类 / 标签 / 系列 / 归档、课程体系 `/learn`（5 门课）、Pagefind 站内搜索、命令面板、音乐播放器、评论、RSS 订阅。
技术栈：Next.js 15（App Router，静态导出）+ React 19 + TypeScript + Tailwind 3.4 + 原生 CSS 变量。

## 如何运行

```bash
npm install
npm run dev        # 本地开发
npm run build      # 静态导出（prebuild: RSS/sitemap → next build → postbuild: pagefind + 产物审计）
npm run check      # typecheck + lint + 禁 emoji + 代理测试 + env 审计
```

## 本次 UI 改造（2026-10-03）

以本地设计知识库 `UI_skill/design-dna/22-anthropic`（Anthropic 设计 DNA 逆向工程）为**唯一事实来源**，对全站做了一次重构：暖调纸感编辑风。

| 维度 | 改造前 | 改造后 |
| --- | --- | --- |
| 画布 | 近黑 `#0B0B11`（暗色优先） | 象牙白 `#faf9f5`（亮色为身份，默认跟随系统） |
| 强调色 | violet `#8B6FEF` + 6 色可换 | 陶土橙 `#cc785c`（唯一） |
| 背景 | 光晕 / 网格 / 暗角 / 噪点 4 套预设 + 粒子 | 单层画布，无装饰 |
| 标题字体 | 无衬线（标题与正文同一族） | 衬线 Newsreader + Noto Serif SC（展示）／Inter + Noto Sans SC（正文） |
| 形状 | 圆角 2–16px 混用，卡片有投影 | 3px / 24px / 50% 三档，**全站 0 阴影**，层级由 1px 发丝线表达 |
| 动效 | 120–1500ms 混用 | 200 / 300 / 400 / 500ms（循环类 800 / 1200ms） |
| 换肤功能 | 6 种强调色 + 4 种背景 | **已移除**（用户决策），保留亮 / 暗双模式 |

### 文档 → 代码追溯表

| 设计 DNA 章节 | 落地位置 |
| --- | --- |
| §2.1 Token 总表（色彩 / 字体 / 间距 / 圆角 / 动效 / 断点） | `app/globals.css` §1（`:root` DNA 原值 + `:root` 第二块兼容别名层 + `.dark` 暗色） |
| §3 色彩系统（含 `::selection`、`--color-focus-ring`） | `app/globals.css` §2（`::selection`、`:focus-visible`）、§1 |
| §3.4 / §12.1 正文近黑暖色 `#141413` | `--color-text-prose` → 别名 `--body` → `body` 与 `.prose` |
| §5 间距基准 4px 与微阶梯 4/8/24 | `--space-4/8/24`；组件内一律走变量 |
| §1 / §12.1 区块节奏 96–160px | `--space-96/128/160`；`app/layout.tsx` 主容器 `py-24`；首页与各页 `mb-24 sm:mb-32` |
| §6.1 断点 896px、§2.1 容器 1200px | `--bp-md`、`--container-max`；`app/layout.tsx` 的 `max-w-[1200px]` |
| §7 / §14 圆角 3/24/50%、0 阴影 | `--radius-xs` / `--radius-pill` / `--radius-full`；`--shadow-card/--shadow-pop: none`；`tailwind.config.ts` 的 `borderRadius` 整组映射 |
| §8.1 按钮（primary / secondary / ghost + 状态） | `app/globals.css` §5；`components/header.tsx`、`page-masthead.tsx` 等处的调用 |
| §8.2 导航 | `components/header.tsx`（吸顶 70px、滚动发丝底边、激活项 2px 强调色实线、抽屉菜单） |
| §8.3 卡片 hover `scale(1.05)` + 200ms | `.hover-zoom`；`components/post-card.tsx` |
| §8.4 / §8.5 输入框与链接 | `app/globals.css` §6（`.prose a`）、`components/search-page.tsx`、`components/command-palette.tsx` |
| §8.7 页脚 | `components/footer.tsx`（栏目分组 + 发丝分隔 + 版权行） |
| §9 页面模式（节奏照搬、板块按博客数据自由变化，§12.2） | `app/page.tsx`（刊头 → 统计台账 → 最新一篇 → 索引 + 热点 → 分区索引）、`app/posts/**`、索引页、`/learn` |
| §11 动效时长与缓动 | `--duration-fast/base/slow`、`--ease`、`--ease-out`；`components/page-transition.tsx`、`components/ui/animated-content.tsx` |
| §11.4 `prefers-reduced-motion`（文档未观察到） | `app/globals.css` §12 全局守卫（站点既有，保留） |
| §12.1 衬线展示标题 + 无衬线正文 | `--font-serif` / `--font-sans`；`tailwind.config.ts` 的 `fontFamily` |
| §12.1 中文行长 34–40 全角（由 65–75 拉丁字符折算） | `--measure: 38em` → `.prose` |
| §12.4 只动 transform / opacity / color | 全部 transition 与 keyframes（`app/globals.css` §8–§9d） |
| §13 合规（专有字体 / 品牌 / 插画 / 文案） | 字体替换见下；未引入任何 Anthropic 品牌资产或文案 |

### 涉及文件

- **新增**：`SPEC_LEDGER.md`、`SPEC_LEDGER.tokens.json`、`AUDIT.md`、`README.md`（本文件）、`lib/unlock.ts`
- **重写**：`app/globals.css`（1106 → 约 910 行，12 节全部重做）、`DESIGN.md`（Alchemy v4.1 → Paper v5.0）、`DESIGN-DNA-UPGRADE.md`（Linear 台账 → Anthropic 台账）、`components/header.tsx`
- **删除**：`components/appearance-provider.tsx`、`components/appearance-picker.tsx`、`components/background-decor.tsx`、`components/pointer-feedback.tsx`、`components/ui/particles.tsx`、`lib/accents.ts`
- **样式收敛**：`tailwind.config.ts`（字体族 + 圆角组）与约 40 个组件 / 页面（圆角、时长、字号、装饰类、`glass-liquid` 等旧材质名）

## 第 2 轮：交互与动效打磨（2026-10-05）

不动配色、字体、版式、圆角与零阴影纪律，只把「交互与动效」这一层补齐并对齐文档档位。

### 文档内：动效语汇（`app/globals.css` §9e + `SPEC_LEDGER.md` §1.8）

| 交互 | 时长 | 缓动 | 属性 |
| --- | --- | --- | --- |
| 悬停变色（文字 / 边框 / 底色） | 200ms | `ease` | `color` / `border-color` / `background-color` |
| 按下反馈 | 200ms | `ease` | `transform: scale(0.98)` |
| 下划线展开 | 200ms | `ease` | `transform: scaleX` |
| 指示条滑动 | 300ms | `ease` | `transform: translateX` / `scaleY` |
| 浮层与抽屉进入 | 300ms | `cubic-bezier(.16,1,.3,1)` | `transform` + `opacity` |
| 内容入场 | 400ms | `cubic-bezier(.16,1,.3,1)` | `transform: translateY` + `opacity` |
| 列表分级入场 | 单条 400ms / 步进 40ms | 同上 | `transform` + `opacity` |
| 提示条退场 | 200ms | `ease` | `opacity` + `transform` |

新增基元：`.pressable`、`.link-underline`、`.indicator-bar`（含 `.indicator-bar--lead`）、`.stagger`、`.media-zoom`、`.media-fade`、`.field-rule`，以及 `slideDown`、`fadeOut` 两个关键帧。

### 还原的越档值（原实现不在文档档位上）

| 位置 | 改造前 | 改造后 | 依据 |
| --- | --- | --- | --- |
| `components/ui/animated-content.tsx` | 默认 `0.6s`（600ms）、`ease: 'power2.out'` | `0.4s`（400ms）、`cubic-bezier(0.16, 1, 0.3, 1)`（GSAP 侧用 CustomEase 对齐同一曲线） | §11.1 时长档与缓动 |
| `components/ui/stats-tile.tsx` | 计数 `600ms` / `900ms` | `500ms` / `800ms` | §11.1 |
| `app/page.tsx` 入场 | `0.55s` / `0.5s` | `0.4s` | §11.1 |
| `app/archive/page.tsx` 年份组延迟 | `yearIdx * 0.05` | `yearIdx * 0.04`（40ms 步进） | 本文件 §上述语汇 |
| 归档年份标题字号 | `clamp(30px, 5vw, 46px)` | `clamp(--text-h2, 5vw, --text-h1)` | `SPEC_LEDGER` §1.3 阶梯 |
| 卡片悬停 | 整卡 `scale(1.05)`（文字会跟着缩放模糊） | 封面 `scale(1.05)`（§8.3 原值）+ 卡片本体 `scale(1.005)` | §8.3 实测选择器作用在图片上 |
| `.btn-secondary` / `.btn-ghost` / `.chip` | 只有 hover | 补 `:active` 按下态与 `:disabled` | §11.2 状态覆盖表 |

### 文档外签名动效（用户授权，逐条依据）

| 效果 | 约束 | 依据 |
| --- | --- | --- |
| 首页刊头滚动视差 | 位移封顶 `48px`（台账外推档）、只动 `transform`、`scrub` 驱动、减少动态效果下不注册 | §12.2 允许自由变化；文档未描述滚动编排，故不冒充文档事实 |
| 封面与头像加载渐显 | `opacity 0→1`、400ms | §10「图像处理」为文档缺口；实现严格落在 §12.4 的 `transform / opacity / color` 白名单内 |
| 列表分级入场 | 步进 40ms、单条 400ms、总窗口 ≤500ms、只播一次 | §9.1 只给区块顺序，未给入场编排 |

### 接入面（本轮改动文件）

导航（指示线 + 按下态 + 抽屉 300ms 滑入）、页脚链接（下划线展开）、卡片（封面缩放 + 渐显 + 极轻微内缩）、台账行 / 归档 / 搜索结果 / 相关文章（分级入场 + 按下态）、文章目录与命令面板（2px 强调色短标滑动）、提示条（退场动画）、音乐播放器与课程控件（统一按下态）、搜索输入行（聚焦转强调色）、头像（渐显）。

### 双模式视觉复核

对**真实构建产物**（`out/`，挂在 `/blog` 前缀下用本地 HTTP 服务）用系统自带 Chrome 的无头模式截图，零新增依赖：

```powershell
chrome --headless=new --disable-gpu --hide-scrollbars --blink-settings=preferredColorScheme=1 `
  --virtual-time-budget=6000 --window-size=1440,1500 --screenshot=home-light.png http://localhost:4321/blog/
```

结论：亮色为象牙白画布 + 陶土橙强调色 + 衬线标题 + 发丝线分层；暗色为暖黑画布、同一套语汇与强调色；截图中未出现阴影、渐变或第二强调色。**悬停 / 按下 / 聚焦三种状态未逐帧截图**（CLI 截图无法注入指针与键盘事件），改以 CSS 规范与状态覆盖表核对（`AUDIT.md`：`:hover` 13 / `:focus-visible` 5 / `:active` 3 / `disabled` 1）。

说明：本机 `browser-use` 需 Chrome 开启远程调试（`chrome://inspect/#remote-debugging`）才能驱动，故未用它做交互态截图。

## 缺口与假设清单

文档没有写、由本轮推断或默认的每一处（依据均记在 `SPEC_LEDGER.md`）：

| 维度 | 文档状态 | 本轮处理 | 标注 |
| --- | --- | --- | --- |
| 暗色模式配色 | §3.3 只确认「html 上有切换机制、默认亮色」 | 由 §3.2 已记载的暖黑 `#141413`、暖灰 `#87867f` 与画布色反用推导整套；新增 6 个同色相提亮值 | `[推断]` |
| 字号阶梯 | §4.2 明确「未观察到」 | 以 theme.css 基础层（40 / 28 / 20 / 16）为锚点外推 12 档；全站（含组件内联 `fontSize`）只用这些档 | `[推断]` |
| 正文容器宽 | §2.1 为 `—` | §12.1 的 65–75 拉丁字符按 CJK 双宽折算 34–40 全角 → `--measure: 38em` | `[推断]` |
| 间距中间档 | §5.1 实阶梯仅 4 / 8 / 24 | 拆成「微阶梯 4/8/24」与「区块节奏 96/128/160」，中间档 12/16/20/32/40/48/64 由 4px 基准外推 | `[推断]` |
| 圆角冲突 | §7/§14 正文为 3/24/50%，theme.css 基础层写 8px | 以正文为准（3 / 24 / 50%） | 冲突裁决 |
| `:focus-visible` 具体值 | 规则存在但值为空 | 取 §3.1 的 `--color-focus-ring` 与 `--color-primary` | `[推断]` |
| 按钮文字色 | theme.css 用白字配陶土橙（约 3.1:1） | 改取 §3.2 已记载的 `#141413`（约 5.9:1），不引入新色 | 可访问性取舍 |
| 控件尺寸 / 表单态 / 骨架屏 / 空态 | 未观察到 | 沿用 theme.css `.btn 40px` 与站点既有实现，只换视觉 | `[默认]` |
| 其余断点 | §6.1 仅 896px | 896px 为设计断点；640 / 768 / 1024 / 1280 沿用 Tailwind 既有断点（1280 为音乐播放器侧栏专用） | `[默认]` |
| 图标规范 | §10 只给了尺寸档 | 沿用站点 `@tabler/icons-react`，落 16 / 18 / 20 / 24 档 | `[默认]` |
| `prefers-reduced-motion` | §11.4 未观察到 | 保留站点既有全局守卫 | 既有实现 |
| 换色 / 换背景轴 | 文档体系里不存在 | 按用户决策整体移除（删除 4 个文件与内联脚本分支） | 产品取舍 |
| `--gold` 第二强调色 | §12.4 自检要求只有一个强调色 | 并入陶土橙（星标、火焰、成就图标） | `[推断]` |
| 滚动编排 / 视差 | §9.1 只给区块顺序，无滚动动效 | 仅首页刊头一处，位移封顶 48px，减少动态效果下关闭 | `[文档外]` |
| 图片加载呈现 | §10「图像处理：未观察到」 | 封面与头像改为 `opacity` 渐显（400ms），不触发布局 | `[文档外]` |
| 列表入场编排 | 文档未描述 | `.stagger` 分级入场，步进 40ms、总窗口 ≤500ms | `[文档外]` |

## 合规替换说明（DESIGN_DNA §13）

| 不可复制项 | 处理 |
| --- | --- |
| 专有字体 `Anthropic Serif` | 替换为 **Newsreader**（SIL OFL，Google Fonts）+ **Noto Serif SC**；正文保持 Inter + Noto Sans SC；等宽 JetBrains Mono。域名仍在 CSP 与 `audit-build.mjs` 白名单内（`fonts.googleapis.com` / `fonts.gstatic.com`），无需改策略 |
| Anthropic logo / 名称 / 域名 | 未使用；站点沿用自身词标 |
| 专有插画 / 摄影 / 产品截图 | 未使用；封面仍走 `lib/covers.ts` 的站点自有映射 |
| 品牌口号 / 专有术语 / 页面文案 | 未引入；界面文案全部为站点自有中文 |
| 特有布局组合 | 只复现通用做法（发丝线分层、大留白、单强调色、衬线标题），§12.2 允许自由变化的内容板块按博客自身数据组织 |

## 审计结果（`AUDIT.md`）

命令（范围＝站点自有样式源，基线＝规格台账）：

```bash
python "<skill>/scripts/audit_build.py" ./app \
  --baseline ./SPEC_LEDGER.tokens.json --out ./AUDIT.md
```

| 项 | 结果 |
| --- | --- |
| 自创颜色（代码里有、文档里没有） | **0** |
| 未落地颜色（文档里有、代码里没用上） | **0** |
| 越界字号（不在 12 档阶梯上） | **0** |
| 越界圆角（不在 3 / 24 / 50 上） | **0** |
| 越界动效时长（不在 200/300/400/500/800/1200） | **0** |
| 越界断点 | **0** |
| 阴影定义 | 0 条（与 §7 一致） |
| 状态覆盖 | `:hover` 13 · `:focus-visible` 5 · `:active` 3 · `disabled` 1 |
| 间距网格 | 仅 3 处例外：range 控件的 `padding-block: 3px` 与滑块 `margin-top: -5px`（WCAG 2.5.8 触控目标所需，注释已说明）、`.chip` 的 2px 行内代码内边距 |

审计脚本的输出含图形符号，与仓库的 `check:emoji` 守卫冲突，因此 `AUDIT.md` 落地时把这几个符号改写为纯文本；其余内容为脚本原样输出。

## 已知限制

1. **构建产物替换未在本机闭环**：`npm run build` 的编译、类型检查、lint 与静态页面生成全部通过（`Compiled successfully`、`Generating static pages (326/326)`），但收尾阶段 Next 需要删除**上一轮遗留**的 `out/`（1403 个文件）与陈旧 `.next` 缓存，被 IDE 的批量删除守卫（单轮上限 500）拦下。请在不受该守卫约束的终端里执行一次 `npm run build`（或先手动删掉 `.next` 与 `out`），即可完成产物替换与 pagefind 索引重建。
2. **视觉验收未在 IDE 内完成**：因上述守卫同样影响 `next dev` 的缓存清理，本轮未跑浏览器双模式截图；建议本地 `npm run dev` 后对照 `DESIGN_DNA.md` §12.4 的五条自检逐页复核（画布色、单强调色、圆角档位、行长与区块间距、状态齐全）。
3. **审计范围**：脚本只扫描站点自有 CSS（`app/globals.css`）。Tailwind 编译出的工具类（含 `gap-1.5`、`mt-2.5`、`text-3xl` 这类 6 / 10 / 24 / 30px 的框架默认档）与第三方 CSS（Pagefind UI、KaTeX、Shiki 主题）不在比对范围内；组件里的这些值属后续渐进收敛项。
4. **音乐播放器的唱片纹路与高光**是叠在封面图上的工艺，保留字面 rgba（归入已声明的 `#000000` / `#ffffff`），与主题无关；`components/learn/sim/*` 的 canvas 尺寸与算法状态一字未改。
5. **`out/` 与 `.next` 若保留旧内容**，本地 `npm run dev` 首次启动可能因同样的删除守卫失败，处理方式同第 1 条。
