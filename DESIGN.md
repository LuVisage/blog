---
name: Baron_Zhang Blog
version: 5.1.0
codename: Paper
updated: 2026-10-05
---

# Baron_Zhang Blog — Paper Design System v5.1

> 唯一事实来源：`C:\Users\lusha\Desktop\UI_skill\design-dna\22-anthropic\DESIGN_DNA.md`（Anthropic 设计 DNA 逆向工程，14 章）。
> 本文件是该 DNA 在本站的落地规范：值取自文档原文，文档未覆盖处全部标注 `[推断]`。
> 逐条来源、冲突裁决与缺口清单见 `SPEC_LEDGER.md`；机器比对结果见 `AUDIT.md`。

## Changelog v5.1 (2026-10-05)

**交互与动效打磨（不动配色 / 字体 / 版式）**：

- 动效语汇收敛到文档档位：`AnimatedContent` 默认 600ms 改 400ms、缓动 `power2.out` 改 §11.1 的 `cubic-bezier(0.16, 1, 0.3, 1)`（GSAP 侧用 CustomEase 对齐同一曲线）；`StatsTile` 计数 600/900ms 改 500/800ms
- 新增五个交互基元：`.pressable`（按下 scale .98）、`.link-underline`（下划线自左向右展开）、`.indicator-bar`（导航 / 目录 / 面板选中项的 2px 强调色指示条）、`.stagger`（列表分级入场，步进 40ms）、`.media-zoom` / `.media-fade`（封面缩放与渐显）
- 状态补齐：`.btn-secondary` / `.btn-ghost` 补 `:active` 与 `:disabled`；`.chip` 补按下态；导航、页脚、台账行、目录、命令面板、提示条、音乐播放器、课程控件接入统一语汇
- 卡片悬停改为「封面 `scale(1.05)`（§8.3 原值）+ 卡片本体 `scale(1.005)` + 边框变色」，避免整卡缩放导致文字模糊
- 三处 `[文档外]` 签名动效（用户授权，依据见 `SPEC_LEDGER` §1.8.4）：首页刊头滚动视差（位移封顶 48px）、封面与头像加载渐显、列表分级入场编排
- 提示条补退场动画（200ms），搜索输入行聚焦时下划线转强调色，正文链接 hover 抬升下划线偏移

## Changelog v5.0 (2026-10-03)

**设计语言整体替换**：v4.1 的 Alchemy（紫罗兰 + 毛玻璃 + 光晕）与随后的 Press v5（Linear 派）都已作废，本轮改为 **Anthropic 暖调纸感编辑风**。

- 色彩：画布改象牙白 `#faf9f5`，正文近黑暖色 `#141413`，唯一强调色陶土橙 `#cc785c`；暗色改为沿暖黑推导的 `[推断]` 变体
- 排版：衬线（Newsreader + Noto Serif SC）承担展示标题，无衬线（Inter + Noto Sans SC）承担正文
- 形状：圆角收敛到 `3px` / `24px` / `50%` 三档，**全站 0 阴影**，层级只由 1px 发丝线表达
- 装饰：删除光晕、网格、暗角、噪点、粒子、光标光斑、3D 倾斜、渐变边框与扫光渐变
- 功能：保留亮 / 暗双模式（默认跟随系统），**移除 6 种强调色与 4 种背景换肤**
- 动效：时长统一到 200 / 300 / 400 / 500ms（循环类 800 / 1200ms），只动 transform / opacity / color
- 组件：按钮、卡片、标签、目录、页脚、命令面板、音乐播放器、课程块全部对齐新 token

## 1. Philosophy

**"把长文放在纸上。"**

Anthropic 的界面近乎纯排版：层级不靠阴影与装饰，而靠 1px 发丝线、留白与字体分工。

**Three pillars**：

1. **纸感画布** —— 象牙白 `#faf9f5` 而非纯白；暗色用暖黑 `#141413` 而非纯黑
2. **一个强调色** —— 陶土橙 `#cc785c` 只出现在高权重动作与 `::selection`，绝不铺面
3. **发丝线分层** —— 0 阴影、0 毛玻璃、0 渐变，一切分隔由 1px 线与留白承担

## 2. Color Palette

### 2.1 亮色（DESIGN_DNA §2.1 原文值）

| Token | 值 | 角色 |
|---|---|---|
| `--color-canvas` | `#faf9f5` | 页面底色 |
| `--color-surface` | `#ffffff` | 卡片 / 浮层 / 代码块面 |
| `--color-surface-2` | `#faf9f0` | 浅底（hover、表头）— 取自 §3.2 灰阶 |
| `--color-surface-3` | `#ededea` | 更浅底（行内代码）— 同上 |
| `--color-text-primary` | `#000000` | 标题 |
| `--color-text-prose` | `#141413` | 正文（§3.4 / §12.1 要求的近黑暖色） |
| `--color-text-secondary` | `#666666` | 次要文字 |
| `--color-text-muted` | `#999999` | 弱化文字 |
| `--color-text-faint` | `#87867f` | 元信息 / 暖灰（§3.2） |
| `--color-border-subtle` | `#ededea` | 发丝分隔线 |
| `--color-border-default` | `#e4e3df` | 卡片 / 输入框边框 |
| `--color-border-strong` | `#a09f9c` | 强调边框 |
| `--color-primary` | `#cc785c` | 唯一强调色 |
| `--color-primary-hover` | `#d38b73` | 悬停 / 按压 |
| `--color-primary-subtle` | `#f9efeb` | 浅底（选中、标记） |
| `--color-success` | `#16a34a` | 成功 |
| `--color-danger` | `#d97757` | 危险 |
| `--color-focus-ring` | `rgba(204, 120, 92, 0.45)` | 聚焦环 |

### 2.2 暗色（`[推断]`，文档只确认存在切换机制且默认亮色）

画布取 §3.2 已记载的暖黑 `#141413`，文字取画布色反用 `#faf9f5`，辅助文字取 §3.2 的暖灰 `#87867f`，面层与边框沿暖黑同色相逐档提亮（`#1c1b18` / `#2a2925` / `#34332e` / `#6b6961`）；强调色不变。逐条依据见 `SPEC_LEDGER.md` §1.2。

### 2.3 兼容别名层

既有组件读的是语义名（`--canvas` / `--ink` / `--line` / `--accent` 等），它们在本轮全部改为指向 DNA token 的**别名**。改名而不是改值：`--color-*` 与 `--canvas` 系列回答的是同一个问题，后者只是旧 API。

## 3. Typography

- **展示标题**：`Newsreader`（替代专有字体 Anthropic Serif，§13 合规）+ `Noto Serif SC`，字重 700，字距 `-0.02em`
- **正文**：`Inter` + `Noto Sans SC`，16px / 1.6（长文阅读 1.8）
- **等宽**：`JetBrains Mono`，承担标签、元信息与代码（12 / 13px）

| 档 | 值 | 用途 |
|---|---|---|
| display | 56px / 1.08 / 700 | 首页刊头 |
| h1 | 40px / 1.15 / 700 | 页面主标题 |
| h2 | 28px / 1.2 / 700 | 区块标题、文章小节 |
| h3 | 20px / 1.3 / 600 | 行标题、子标题 |
| h4 | 17px / 1.4 / 600 | 正文内最小标题 |
| lg | 18px / 1.7 | 导语 |
| body | 16px / 1.6 | 正文基准 |
| reading-sm | 15px | 阅读字号「小」 |
| sm | 14px | 控件、次要文字 |
| code | 13px / 1.7 | 代码 |
| caption | 12px / 1.5 | 说明文字 |
| eyebrow | 11px / 0.16em / 500 | 等宽小标 |

`[推断]`：DESIGN_DNA §4.2 明确「未观察到字号阶梯」，上表由 theme.css 基础层（`h1 40 / h2 28 / h3 20 / body 16`）与站点既有档位外推。

**中文行长**：§12.1 的 65–75 拉丁字符按 CJK 双宽折算为 34–40 全角，实现为 `.prose { max-width: var(--measure) }`（38em）。

## 4. Spacing & Layout

- 基准单位 **4px**（§5.1）
- 微阶梯 **4 / 8 / 24**（§5.1 与 §12.4 自检）
- 区块节奏 **96 / 128 / 160px**（§1「区块间距目视 96–160px」与 §12.1「≥96px」）
- 外推中间档 `12 / 16 / 20 / 32 / 40 / 48 / 64`：`[推断]`，4px 基准等比外推
- 容器 **1200px**（§2.1）；断点 **896px**（§6.1），其余沿用 Tailwind 既有断点

## 5. Shape & Motion

- 圆角：`3px`（控件 / 卡片 / 图片 / 代码块）、`24px`（药丸 / 圆形容器）、`50%`（圆形）——§7 / §14
- 边框：`1px` 发丝线承担全部层级
- 阴影：**0 条**（§7 / §14 未观察到 box-shadow）
- 渐变：不作为设计元素（§3.4 / §7）
- 动效时长：`200ms`（交互反馈）/ `300ms` / `400ms`（入场）/ `500ms`（大位移）；循环类 `800ms` / `1200ms`（§11.1）
- 缓动：`ease`、`cubic-bezier(0.16, 1, 0.3, 1)`（§11.1）
- 过渡属性：只动 `opacity` / `transform` / `color`（§12.4）
- 卡片 hover：`transform: scale(1.05)` + `200ms ease`（§8.3 原文配方，作用在封面图上）
- `prefers-reduced-motion`：全局守卫（§11.4 未观察到，属站点既有加分项，保留），视差不注册 ScrollTrigger

### 5.1 交互语汇（v5.1 增补）

时长只用 `200 / 300 / 400 / 500 / 800 / 1200ms`，缓动只用 `ease` 与 `cubic-bezier(0.16, 1, 0.3, 1)`，属性只动 `transform / opacity / color`（含 `border-color`、`background-color`）。

| 交互 | 时长 | 缓动 | 属性 |
| --- | --- | --- | --- |
| 悬停变色（文字、边框、底色） | 200ms | `ease` | `color` / `border-color` / `background-color` |
| 按下反馈 | 200ms | `ease` | `transform: scale(0.98)` |
| 下划线展开 | 200ms | `ease` | `transform: scaleX`（`transform-origin: left`） |
| 指示条滑动 | 300ms | `ease` | `transform: translateX` / `scaleY` |
| 浮层与抽屉进入 | 300ms | `--ease-out` | `transform` + `opacity` |
| 内容入场 | 400ms | `--ease-out` | `transform: translateY` + `opacity` |
| 大位移与图片渐显 | 400–500ms | `--ease-out` | `transform` / `opacity` |

基元（`app/globals.css` §9e）：`.pressable`、`.link-underline`、`.indicator-bar`（含 `.indicator-bar--lead`）、`.stagger`、`.media-zoom`、`.media-fade`、`.field-rule`。

### 5.2 文档外签名动效（用户授权，逐条留档）

| 效果 | 约束 | 依据 |
| --- | --- | --- |
| 首页刊头滚动视差 | 位移封顶 `48px`（台账外推档）、只动 `transform`，`scrub` 驱动 | §12.2 允许自由变化；文档未描述滚动编排，故不冒充事实 |
| 封面与头像渐显 | `opacity 0→1`、400ms | §10「图像处理」为文档缺口；实现落在 §12.4 白名单内 |
| 列表分级入场 | 步进 40ms、单条 400ms、总窗口 ≤500ms | §9.1 只给区块顺序，未给入场编排 |

> 这三项在 `SPEC_LEDGER.md` §1.8.4 与 `README.md` 的假设清单里各有一条依据；审计脚本不会把它们报成「无解释的自创值」。

## 6. Components

| 组件 | 变体 | 状态 | 关键 token |
|---|---|---|---|
| `.btn-primary` | 实心 | hover 变 `--color-primary-hover`、active `scale(.98)`、disabled `opacity .45` | `--radius-xs`, `--duration-fast` |
| `.btn-secondary` | 描边 | hover 描边转强调色 + `--color-primary-subtle` 浅底、active `scale(.98)`、disabled `opacity .45` | `--line-strong` |
| `.btn-ghost` | 无框 | hover 转 `--ink` + `--surface-2`、active `scale(.98)`、disabled `opacity .45` | `--muted` |
| `.surface` / `.surface-hover` | 卡片 / 行 | hover 换 `--surface-2` 与 `--line-strong` | `--radius-xs` |
| `.overlay` | 吸顶条 / 浮层 | — | `--color-overlay` |
| `.chip` | 药丸 | hover 转强调色描边与文字、active `scale(.98)` | `--radius-pill` |
| `.pressable` | 通用按下态 | active `scale(.98)`（200ms） | `--duration-fast` |
| `.link-underline` | 单行链接 | hover / focus-visible 下划线 `scaleX(0→1)` | `--color-primary` |
| `.indicator-bar`（含 `--lead`） | 导航 / 目录 / 面板选中项 | 当前项 `scaleY(0→1)`（300ms） | `--color-primary` |
| `.stagger` | 列表容器 | 子项按 `nth-child` 步进 40ms 入场（单条 400ms） | `--duration-slow` |
| `.media-zoom` | 封面图 | 悬停 `scale(1.05)` + 进场淡入 | `--duration-fast` / `--duration-slow` |
| `.media-fade` | 头像等真实图片 | `.is-loaded` 时 `opacity 0→1` | `--duration-slow` |
| `.field-rule` | 下划线式输入行 | `:focus-within` 线色转强调色、光标同色 | `--color-primary` |
| `.hover-zoom` | 卡片本体 | hover `scale(1.005)` + 边框 `--line-strong` | `--duration-fast` |
| `[data-spotlight='row']` | 台账行提示 | hover 出现左侧 2px 强调色指示线 | `--color-primary` |
| `.prose` | 阅读面 | 链接下划线转实并抬升偏移、引用块 2px 强调色左线、表格发丝线 | `--measure` |

聚焦环：`2px solid var(--color-primary)` + `offset 2px`（§3.1 的 `--color-focus-ring` 用于按钮与滑块的柔化环）。

## 7. Do's and Don'ts

### Do

- 一切颜色走 CSS 变量；`--color-*` 是文档值，语义别名指向它
- 层级用 1px 发丝线与留白表达
- 强调色只出现在高权重动作、链接与 `::selection`
- 图标一律 `@tabler/icons-react`，全站禁 emoji（`npm run check:emoji` 守卫）
- 亮暗双模式保持一致的信息层级

### Don't

- 不用冷白或纯白画布，不用纯黑正文
- 不用蓝紫科技配色、不用渐变、不用毛玻璃、不用发光、不用投影
- 不用大圆角（只有 3 / 24 / 50 三档）
- 不引入第二个强调色（金色高光已并入陶土橙）
- 不再引入换色 / 换背景轴（v5.0 已移除该功能）

## 8. 出处与校验

| 内容 | 文件 |
|---|---|
| 规格台账（来源 + 置信度 + 缺口 + 冲突裁决） | `SPEC_LEDGER.md` |
| 审计基线（机器可读 token） | `SPEC_LEDGER.tokens.json` |
| 机器比对报告（自创值 / 未落地 token / 间距 / 状态） | `AUDIT.md` |
| 本轮改动台账（文档依据 → 缺口 → 落地） | `DESIGN-DNA-UPGRADE.md` |
| 交付与运行说明 | `README.md` |
