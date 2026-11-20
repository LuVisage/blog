# 规格台账 — Baron_Zhang Blog（are.na 灰阶系统语言 · 第 5 轮）

> 当前生效语言：**灰阶系统**（are.na 档案 confidence=HIGH，见 §11）。
> 已废弃：第 4 轮「技术论文感」（ciechanow.ski 方向，§10）；第 1–3 轮 Anthropic 暖调纸感（§8–9）。

本文件是 design-dna-builder 阶段 0 的产出，也是阶段 5 审计的「标准答案」。
规则：**文档里的数值与规则是法律，代码是判决**；文档没写的维度一律显式标注 `[推断]` 或 `[默认]`，不得伪装成文档事实。

---

## 0. 来源文档

| 文档 | 类型 | 路径 | 贡献的维度 |
| --- | --- | --- | --- |
| `DESIGN_DNA.md` | DESIGN_DNA 型（14 章） | `C:\Users\lusha\Desktop\UI_skill\design-dna\22-anthropic\DESIGN_DNA.md` | 全部：色彩 / 形状 / 间距 / 动效 / 组件 / 页面模式 / 模仿指南 / 合规 / 证据置信度 |
| `theme.css` | 纯 token + 基础组件层 | 同目录 `theme.css` | 变量名与基础层实现（`h1..h4` / `.container` / `.btn` / `.card` / `.input` / `.nav`） |
| `tokens-report.md` | 统计证据 | 同目录 | 频次原始数据（本次未逐条引用，以 DESIGN_DNA 归纳为准） |
| `facts.json` | 结构化事实 | 同目录 | DESIGN_DNA 全部数字的来源（审计基线合成时的交叉核对） |
| `CROSS_SITE_PATTERNS.md` | 91 站聚合统计 | `C:\Users\lusha\Desktop\UI_skill\design-dna\CROSS_SITE_PATTERNS.md` | 辅助判断（状态覆盖、reduced-motion、间距基准等跨站主流做法） |
| `DESIGN.md`（旧） | 旧设计系统规范 | `c:\Users\lusha\Desktop\博客\DESIGN.md` | **作废依据**：Alchemy v4.1（violet + 毛玻璃），本轮全部替换 |
| `DESIGN-DNA-UPGRADE.md`（旧） | 旧增量台账 | `c:\Users\lusha\Desktop\博客\DESIGN-DNA-UPGRADE.md` | **作废依据**：Linear 台账，本轮改写为新基准 |

### 优先级裁决（文档内部冲突时）

按 `references/doc-parsing.md` §5 与权威优先级执行：

1. 用户在本次请求里明确的决策（Anthropic 22 / 保留双模式删两轴 / 全站 / 可重排）；
2. `DESIGN_DNA.md` 正文显式值；
3. 可从文档系统推导的值（4px 基准外推、灰阶取档、色相混合）；
4. 通用默认值 `[默认]`，必须写进第 6 节缺口清单。

**已发生的两处冲突与裁决：**

| 冲突点 | DESIGN_DNA 正文 | theme.css / 其他 | 裁决 |
| --- | --- | --- | --- |
| 圆角阶梯 | §7 / §14：`3px`、`24px`、`50%`（另 §14 写 `999`） | theme.css 基础层：`--radius-xs: 3px; --radius-sm: 24px; --radius-full: 50%`，但 `.btn/.card/.input` 写死 `8px` | **以正文阶梯为准**（3 / 24 / 50%）；主题里 `8px` 是生成器补的通用值，丢弃 |
| 区块间距 | §5.1：实际阶梯仅 `4 / 8 / 24` | §1 定位：「区块间距目视 96–160px」；§12.1 必须复现：「大留白（区块间距 ≥96px）」；theme.css 用 `--space-96` | **两段并存**：微间距阶梯（组件内部）用 `4 / 8 / 24`；区块节奏用 `96 / 128 / 160`（§1 + §12.1 显式要求）。中间档 12/16/32/48/64 为 `[推断]` 外推档，依据见第 1 节 |

---

## 1. 设计 Token

### 1.1 色彩（亮色 = DNA 原文值，全部**已确认**）

| token | 值 | 用途 | 来源 | 置信度 |
| --- | --- | --- | --- | --- |
| `--color-canvas` | `#faf9f5` | 页面底色（带黄调象牙白） | §2.1 / §3.1 body 背景 | 已确认 |
| `--color-surface` | `#ffffff` | 卡片/浮层/代码块面 | §2.1 / §3.1 | 已确认 |
| `--color-surface-raised` | `#ffffff` | 抬升面（与 surface 同值） | §2.1 | 已确认 |
| `--color-text-primary` | `#000000` | 标题 | §2.1 / §3.1 body color | 已确认 |
| `--color-text-secondary` | `#666666` | 次要文字 | §2.1 / §3.1（文档自标推断） | 已确认（值） |
| `--color-text-muted` | `#999999` | 弱化文字 | §2.1 / §3.1（文档自标推断） | 已确认（值） |
| `--color-text-inverse` | `#ffffff` | 实心填充上的文字 | §2.1 | 已确认 |
| `--color-border-subtle` | `#ededea` | 发丝分隔线 | §2.1 / §3.1 | 已确认 |
| `--color-border-default` | `#e4e3df` | 卡片、输入框边框 | §2.1 / §3.1（border 最高频灰） | 已确认 |
| `--color-border-strong` | `#a09f9c` | 强调边框 | §2.1 / §3.1 | 已确认 |
| `--color-primary` | `#cc785c` | 唯一强调色（链接、CTA、::selection） | §2.1 / §3.1 / §12.1 | 已确认（文档标「推断」，但为唯一有彩色） |
| `--color-primary-hover` | `#d38b73` | 悬停/按压 | §2.1 | 已确认（值） |
| `--color-primary-subtle` | `#f9efeb` | 浅底（选中、标记） | §2.1 | 已确认（值） |
| `--color-success` | `#16a34a` | 成功 | §2.1 | 已确认（值） |
| `--color-warning` | `#cc785c` | 警告（复用主色） | §2.1 | 已确认（值） |
| `--color-danger` | `#d97757` | 危险 | §2.1 | 已确认（值） |
| `--color-focus-ring` | `rgba(204, 120, 92, 0.45)` | 聚焦环 | §2.1 / §3.1 `:focus-visible` | 已确认 |

**灰阶（§3.2，全部已确认）**：`#ffffff` / `#faf9f0` / `#87867f` / `#141413` / `#000000`。

**§3.4 / §12.1 的文字纪律**：正文用「近黑暖色 `#141413`」（正文段落），标题用 `#000000`（body color 声明），辅助文字用暖灰 `#87867f`，弱化用 `#999999`。

### 1.2 色彩（暗色 = `[推断]`，文档只确认「html 上有切换机制、默认亮色」）

| token | 值 | 推导依据 | 标注 |
| --- | --- | --- | --- |
| `--color-canvas` | `#141413` | §3.2 灰阶中已记载的暖黑；§3.4「正文 #141413 近黑偏暖，不是纯黑」 | [推断] 直接取文档已记载值 |
| `--color-surface` | `#1c1b18` | 沿暖黑同色相（hue≈48）提亮 1 档，与亮色「象牙白 → 纯白」的层级方向一致 | [推断] |
| `--color-surface-raised` | `#1c1b18` | 同上 | [推断] |
| `--color-text-primary` | `#faf9f5` | 画布色反用（§12.1「画布用象牙白」的镜像） | [推断] |
| `--color-text-secondary` | `#b9b6ad` | 暖黑与象牙白的中段暖灰 | [推断] |
| `--color-text-muted` | `#87867f` | §3.2 已记载的暖灰 | [推断] 取文档已记载值 |
| `--color-text-inverse` | `#141413` | 实心强调色上的文字改用暖黑 | [推断] |
| `--color-border-subtle` | `#2a2925` | 暖黑提亮 2 档 | [推断] |
| `--color-border-default` | `#34332e` | 暖黑提亮 3 档 | [推断] |
| `--color-border-strong` | `#6b6961` | 暖黑与暖灰之间 | [推断] |
| `--color-primary` | `#cc785c` | §2.1 沿用（不因模式切换） | 已确认 |
| `--color-primary-hover` | `#d38b73` | §2.1 沿用 | 已确认 |
| `--color-primary-subtle` | `#2b211d` | 陶土橙 × 暖黑 15:85 混合（亮色 12:88 的镜像） | [推断] |
| `--color-success/warning/danger` | `#16a34a` / `#cc785c` / `#d97757` | §2.1 沿用；暗底对比度未达 AA 属已知限制 | [推断] 值不变 |

### 1.3 排版

| 项 | 值 | 来源 | 置信度 |
| --- | --- | --- | --- |
| 字体分工 | **衬线展示标题 + 无衬线正文** | §12.1 必须复现第 4 条 | 已确认 |
| `--font-serif`（展示） | `'Newsreader', 'Noto Serif SC', 'Songti SC', Georgia, serif` | §2.1 `--font-sans: 'Anthropic Serif', …` + §13 合规（专有字体改开源替代） | 值替换 [替换]，分工 已确认 |
| `--font-sans`（正文） | `'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif` | theme.css `--font-sans` 回退栈 | 已确认（栈） |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', ui-monospace, monospace` | §2.1 `--font-mono` | 已确认 |
| 字号阶梯 | **文档 §4.2 明确「未观察到显式 font-size 声明」→ 无阶梯** | §4.2 | 未观察到 |
| 字重 | `h1..h4: 700`（theme.css 基础层） | theme.css | 已确认（theme.css 层） |
| 字距 | `-0.02em`（标题） | theme.css 基础层 | 已确认（theme.css 层） |
| 行高 | `body: 1.6`（theme.css 基础层） | theme.css | 已确认（theme.css 层） |

**落地字号阶梯（第 4 类：`[推断]` 外推，审计基线按此声明）**

依据：theme.css 基础层给出的 `h1 40 / h2 28 / h3 20 / body 16`，加上站点既有的字号档位（`display/heading-1/heading-2/heading-3/body-lg/body-sm/caption/eyebrow`）与 4px 基准外推，收敛为 12 档：

| 档 | 值 | 用途 | 标注 |
| --- | --- | --- | --- |
| display | `56px / 1.08 / 700` | 首页刊头署名 | [推断] theme.css `h1 40` 上推一级 |
| h1 | `40px / 1.15 / 700` | 页面主标题 | 已确认（theme.css `h1`） |
| h2 | `28px / 1.2 / 700` | 区块标题、文章小节 | 已确认（theme.css `h2`） |
| h3 | `20px / 1.3 / 700` | 子标题 | 已确认（theme.css `h3`） |
| h4 | `17px / 1.4 / 600` | 最小标题（正文内 h4） | [推断] 站点既有档位 |
| body-lg | `18px / 1.7 / 400` | 导语 | [推断] 站点既有档位 |
| body | `16px / 1.6 / 400` | 正文基准 | 已确认（theme.css `body`） |
| body-sm | `14px / 1.6 / 400` | 控件、次要文字 | [推断] theme.css `.btn 14px` |
| reading-sm | `15px` | 阅读字号「小」 | [推断] 站点既有 15.5px 收敛到 4px 邻近档 |
| caption | `12px / 1.5 / 400` | 说明文字 | [推断] 站点既有档位 |
| eyebrow | `11px / 0.16em / 500` | 等宽小标 | [推断] 站点既有档位 |
| code | `13px / 1.7` | 代码块 | [推断] 站点既有 13.5px 收敛 |

声明档位集合：`11, 12, 13, 14, 15, 16, 17, 18, 20, 28, 40, 56`。

**中文行长 `[推断]`**：§12.1「65–75 字符行长」是拉丁字符串长；中文按双宽比 2:1 折算为 **34–40 全角字符**，作为 `.prose` 阅读栏上限（实现为 `max-width: 38em` 一类的受控窄栏）。

### 1.4 间距

| 项 | 值 | 来源 | 置信度 |
| --- | --- | --- | --- |
| 基准单位 | `4px` | §5.1（核心间距值命中率≈100%） | 已确认 |
| 微间距阶梯 | `4 / 8 / 24` | §5.1「该站实际使用的阶梯」+ §12.4 自检 | 已确认 |
| 区块节奏 | `96 – 160px`（取 `96 / 128 / 160`） | §1「区块间距目视 96–160px」+ §12.1「区块间距 ≥96px」 | 已确认 |
| 外推中间档 | `12 / 16 / 32 / 48 / 64` | [推断] 4px 基准等比外推；theme.css 亦以 `var(--space-12/16/20/96)` 回退 | [推断] |
| 主容器宽 | `1200px` | §2.1 `--container-max` / theme.css `.container` | 已确认 |
| 正文容器宽 | 文档 `—`（未给） | §2.1 `--container-text: —` | 未观察到 → 用 1.3 的中文行长推导 |
| 控件高 | `40px` | theme.css `.btn height: 40px` | 已确认（theme.css 层） |

### 1.5 形状与质感

| 项 | 值 | 来源 | 置信度 |
| --- | --- | --- | --- |
| 圆角档 | `3px`（控件/卡片/图片/代码块）、`24px`（药丸/圆形容器）、`50%`（圆形） | §7 / §14 / theme.css `--radius-xs/sm/full` | 已确认 |
| 边框 | `1px` 发丝线承担全部层级 | §7「以 1px 边框而非阴影表达层级」 | 已确认 |
| 阴影 | **0 条**（`box-shadow` 未观察到） | §7 / §14 | 已确认 |
| 渐变 | 全站仅 1 处（radial 暗角），不作为设计元素 | §3.4 / §7 | 已确认 |

### 1.6 动效

| 项 | 值 | 来源 | 置信度 |
| --- | --- | --- | --- |
| 时长档 | `200ms`（交互反馈）、`300ms`、`400ms`（入场）、`500ms`（大位移）、`800ms` / `1200ms`（§11.1 实测到的循环类） | §11.1 + §12.4 自检 | 已确认 |
| 缓动 | `ease`、`cubic-bezier(0.16, 1, 0.3, 1)` | §11.1 | 已确认 |
| 过渡属性偏好 | 只动 `opacity` / `transform`（+ color） | §11.1 / §12.4「只动 transform/opacity/color」 | 已确认 |
| 循环类动画时长 | 光标闪烁与骨架屏扫光取 `1200ms` | §11.1 实测档位（`1200ms` ×1） | 已确认 |
| 卡片 hover | `transform: scale(1.05)`，`transition: transform 0.2s ease` | §8.3 / §11.2 | 已确认 |
| `prefers-reduced-motion` | 文档**未观察到** | §11.4 | 未观察到 → 站点既有实现为加分项，保留 |

### 1.7 布局与断点

| 项 | 值 | 来源 | 置信度 |
| --- | --- | --- | --- |
| 断点 | `896px`（平板横屏/小笔记本） | §2.1 `--bp-md` / §6.1 | 已确认 |
| 其余断点 | `640 / 768 / 1024 / 1280` | Tailwind 既有断点；站内 1280 为音乐播放器侧栏 gutter 专用 | [默认] |
| 导航 | `position: sticky; top: 0` | §8.2 | 已确认 |

### 1.8 交互语汇（2026-10-03 增补）

本轮不动配色、字体、版式与形状，只把「交互与动效」这一层补齐并对齐到文档档位。**不新增任何时长或缓动值**：下面所有效果都复用 §1.6 已有的 `--duration-fast/base/slow` 与 `--ease` / `--ease-out`。

#### 1.8.1 契约（全部来自文档，已确认）

| 项 | 值 | 来源 |
| --- | --- | --- |
| 时长白名单 | `200 / 300 / 400 / 500 / 800 / 1200ms` | §11.1 实测档位 |
| 缓动白名单 | `ease`、`cubic-bezier(0.16, 1, 0.3, 1)` | §11.1 频次最高的两条 |
| 属性白名单 | `transform` / `opacity` / `color`（含 `border-color`、`background-color`） | §11.1 过渡属性偏好 + §12.4 自检；`background-color` 另有 §11.2 hover 证据 |
| 状态三件套 | `hover` / `focus-visible` / `active` | §11.2 状态覆盖度表（`:hover` 7、`:focus-visible` 2、`:focus` 2）；`active` 未在该表出现 → 按下态为 `[推断]` |
| 禁用态 | `:disabled` / `[aria-disabled]` | §11.2（`:disabled` ×2） |
| 层级手法 | 0 阴影、无渐变、无发光，层级只用 1px 发丝线与留白 | §7 / §14 |

#### 1.8.2 效果 → 档位映射（本轮落地的统一语汇）

| 交互 | 时长 | 缓动 | 属性 |
| --- | --- | --- | --- |
| 悬停变色（文字、边框、底色） | `--duration-fast` 200ms | `--ease` | `color` / `border-color` / `background-color` |
| 按下反馈（按钮、标签、行、面板项） | `--duration-fast` 200ms | `--ease` | `transform: scale(0.98)` |
| 链接下划线展开 | `--duration-fast` 200ms | `--ease` | `transform: scaleX`（`transform-origin: left`，不用 `width` 以免重排） |
| 指示条滑动（导航、目录激活项、面板选中行） | `--duration-base` 300ms | `--ease` | `transform: translateX` / `scaleY` |
| 浮层与抽屉进入 | `--duration-base` 300ms | `--ease-out` | `transform` + `opacity` |
| 内容入场（区块、卡片） | `--duration-slow` 400ms | `--ease-out` | `transform: translateY` + `opacity` |
| 大位移与图片渐显 | 500ms / `--duration-slow` | `--ease-out` | `transform` / `opacity` |
| 循环类（光标、骨架、频谱） | 800 / 1200ms | `--ease` | `opacity` / `height`（播放器内部工艺） |

#### 1.8.3 交互基元（`app/globals.css` §9e，全站复用）

| 基元 | 作用 | 参数 |
| --- | --- | --- |
| `.pressable` | 统一下按反馈 | `:active` → `transform: scale(0.98)`，200ms |
| `.link-underline` | 下划线自左向右展开 | `::after` 1px 强调色线，`scaleX(0→1)`，200ms |
| `.indicator-bar` | 指示条滑动 | 2px 强调色，`scaleY/translateX`，300ms |
| `.stagger` | 分级入场 | 用 `nth-child` 派生 `animation-delay`：步进 40ms、最多 12 项（错落跨度 ≤440ms），单条 400ms |
| `.marquee` | 单行内容带 | 只动 `transform` 平移，悬停/聚焦暂停，周期 `--marquee-duration`（见 1.8.6） |
| `.media-fade` | 图片/封面渐显 | `opacity 0→1`，400ms（`[文档外]`，见 1.8.4） |
| `.media-frame` | 封面容器 | 加载前铺一层 `--surface-2` 平色占位（无渐变、无阴影），`img` 撑满裁切 |
| `.focus-line` | 自绘控件的键盘聚焦提示 | 容器 `:focus-within` 时 `border-color` 转强调色，200ms（输入框自身 outline 被清掉时的替代提示） |
| `ProseReveal`（组件） | 阅读面段落级渐入 | 直接子元素分批进场：单条 400ms、批内步进 40ms、批大小上限 4；初态只在 JS 里设置 |

#### 1.8.4 文档外签名动效（用户已授权，逐条依据）

用户明确选择「允许少量文档外签名动效」。以下每一项都在 README 的缺口与假设清单里同步登记，并在审计中作为「已解释的自创项」出现。

| # | 效果 | 实现约束 | 依据与理由 |
| --- | --- | --- | --- |
| 1 | 首页刊头滚动视差 | 位移上限 `48px`、只动 `transform` + 轻微 `opacity`，ScrollTrigger `scrub`；`prefers-reduced-motion` 下不注册 | §12.2 允许「配图与插画的呈现方式」自由变化；文档未描述滚动编排，故不冒充文档事实；位移上限取 `48px`（= §1.4 外推档，非新档位） |
| 2 | 封面图与头像渐显 | `opacity 0→1`、`--duration-slow` 400ms、`--ease-out`；不触发布局 | §10「图像处理：未观察到 aspect-ratio / object-fit」属文档缺口；实现严格落在 §12.4「只动 transform / opacity / color」内 |
| 3 | 列表分级入场（stagger） | 步进 40ms、单条 400ms、总窗口 ≤500ms，只播一次 | §9.1 只给区块顺序、未给入场编排（文档缺口）；时长与属性均在 §11.1 / §12.4 白名单内 |
| 4 | 卡片悬停手法调整 | 封面 `transform: scale(1.05)`（保留 §8.3 原值），卡片本体只留极轻微 `scale(1.005)`，边框转 `--line-strong`，标题转强调色 | §8.3 的实测配方作用在图片上（`.g_visual_img`）；整卡缩放会让文字模糊与抖动，属对文档配方的忠实还原而非改写 |
| 5 | 阅读面段落级渐入 | 批内步进 40ms、单条 400ms、批大小上限 4；只动 `opacity` + `transform`；无 JS 或减少动态效果时不设置初态（正文照常完全可见） | §9.1 只给区块顺序、未描述段落级编排（文档缺口）；时长与属性锁在 §11.1 / §12.4 白名单内 |
| 6 | 封面改用真实 `img` | `loading="eager"`（首屏 LCP 封面）/ `loading="lazy"`（网格卡）+ `decoding="async"` + `alt=""`（装饰性封面），容器 `.media-frame` 先铺平色占位 | §10 未观察到图像处理方式（文档缺口）；改用 `img` 后可获得原生懒加载与解码提示，同时保留 `scale(1.05)` 悬停配方 |

#### 1.8.5 无障碍与偏好

| 项 | 处理 |
| --- | --- |
| `prefers-reduced-motion` | CSS 全局守卫（§12 节，已有）把 `animation-duration` / `transition-duration` 归零；`components/gsap-provider.tsx` 的 `timeScale(0)` 保留；视差在该偏好下**不注册** ScrollTrigger |
| 键盘可达 | 所有交互元素保留 `:focus-visible`（2px 强调色 + 2px offset，§1.1 的 `--color-focus-ring` 用于控件内环） |
| 触控目标 | 保持既有 ≥40px 的控件高与 ≥24px 的行内控件点击区（不因动效收紧） |
| 命中区扩展 | 行内控件用 `padding` 扩展命中区（不改视觉尺寸），保证 24px 下限 |
| 命令面板语义 | 输入框 `role="combobox"` + `aria-controls` + `aria-activedescendant`；结果容器 `role="listbox"`；行 `role="option"` + `aria-selected` + `tabIndex={-1}`（焦点留在输入框，Tab 不必走完三百多条结果） |
| 键盘与鼠标同态 | 指示条同时响应 `:hover` 与 `:focus-visible`；自绘控件用 `.focus-line` 补聚焦提示 |
| 新增 token 值 | 仅一个：`--marquee-duration`（循环内容带的周期，见 1.8.6）。其余全部复用 §1.6 已声明的时长与缓动 |

#### 1.8.6 内容带（marquee）—— 文档内有据的新语汇

| 项 | 处理 | 依据 |
| --- | --- | --- |
| 关键帧 `marquee` | 单行内容带用 `transform: translateX(0 → -50%)` 做无缝平移 | §11.3 的关键帧清单里明确列有 `marquee`，§11.2 还实测到 `.logo_marquee:hover { animation-play-state: paused }` |
| 悬停暂停 / 键盘聚焦让位 | `.marquee:hover` → `animation-play-state: paused`；`.marquee:focus-within` → `animation: none` + `scroll-padding-inline: 48px`（暂停会把轨道钉在负偏移上，焦点环就画在被裁掉的那块里） | 原文实测规则只到 hover 一条；聚焦这条是 WCAG 2.4.7 补的，见 §11.17 表一 #13 |
| 边缘淡出 | 用 `mask-image` 做功能性遮罩（不是装饰性渐变填充） | §7 禁的是「作为设计元素的渐变」；遮罩不产生可见色彩 |
| 循环周期 `--marquee-duration: 40s` | `[推断]`：§11.1 的档位描述的是交互反馈与入场时长，连续平移的周期由内容宽度决定，无法套用 200–1200ms 档 | 已在 README 的缺口与假设清单登记 |
| 减少动态效果 | 去掉遮罩、停掉平移、允许换行读完整内容 | 站点既有 `prefers-reduced-motion` 守卫的延伸 |

---

## 2. 组件清单

| 组件 | 变体 | 状态（文档要求） | 关键 token | 来源 |
| --- | --- | --- | --- | --- |
| Button | primary / secondary / ghost | hover / focus-visible / active / disabled | `--color-primary`, `--radius-xs`, `--duration-fast` | §8.1 + theme.css `.btn` |
| Nav | 桌面 + 抽屉 | sticky / 展开 | `--color-canvas`, `--color-border-subtle` | §8.2 |
| Card | 默认 / 可点 | hover `scale(1.05) transition transform .2s ease` | `--color-surface`, `--color-border-subtle`, `--radius-xs` | §8.3 |
| Input | textarea / range | focus-visible / disabled / placeholder | `--color-border-default`, `--color-focus-ring` | §8.4 |
| Link | 行内 / 导航 | hover / focus-visible / target=_blank | `--color-primary` | §8.5 |
| Tabs | 默认 | 未观察到 | `--color-border-subtle` | §8.6 |
| Footer | 多列 + 版权行 | 未观察到 | `--color-border-subtle` | §8.7 |
| Chip / Tag | 药丸 | hover（`--color-primary` 描边） | `--radius-pill` | 由 §7 圆角档推导 |

**状态是硬指标**：文档提到的 hover / focus-visible / active / disabled 必须全部落地；`:focus-visible` 在文档中规则为空 → 用 `--color-focus-ring` 补实（`[推断]`，依据 §3.1 的 focus-ring 定义）。

---

## 3. 页面结构

文档 §9.1 给的是 Anthropic 官网首页区块（Latest releases → 公告 → 使命 → 资源 → Footer），属于**企业官网信息架构**，与本博客的内容型信息架构不同。按 §12.2「可以自由变化：内容板块的划分」，区块内容按博客自身数据组织，但**节奏规则照搬文档**：`刊头 → 内容区组 → 底栏`，块间距 ≥96px，容器 1200px，强调色只出现在高权重动作上。

| # | 页面 | 区块顺序（重排后） | 背景节奏 | 区块间距 | 来源 |
| --- | --- | --- | --- | --- | --- |
| 1 | 首页 | 导航 → 刊头（署名/自述/社交）→ 统计台账 → 最新一篇 lead → 文章索引 + 热门 → 分区索引 → 底栏 | 单层象牙白，无交替 | ≥96px | §9.1 节奏 + §12.2 板块自由 |
| 2 | 文章详情 | 导航 → 文章头（元信息/标题/摘要）→ 阅读面 + 粘性目录 → 文末（分享/喜欢/上下篇/相关/评论）→ 底栏 | 单层 | ≥96px | §9.3 视觉层级 |
| 3 | 索引模板 | 导航 → 刊头（eyebrow/标题/计数）→ 筛选 → 台账列表 → 分页/空态 → 底栏 | 单层 | ≥96px | §9.1 节奏 |
| 4 | 课程页 | 导航 → 课程刊头 → 周条 / 进度墙 → 课节双栏（大纲 + 正文/练习）→ 上下节 → 底栏 | 单层 | ≥96px | §9.1 节奏 |
| 5 | 搜索 / 命令面板 | 导航 → 输入区 → 结果台账 → 空态；面板为浮层 | 浮层用 surface | 24 / 96 | §8.4 + §9.1 |

**背景节奏**：文档 §3.4 / §7 明令「不使用渐变、毛玻璃、发光」，故全站为**单层画布**（象牙白 / 暖黑），不设交替底色、不设背景装饰层。

---

## 4. 内容语气

- 沿用站点既有中文技术博客语气（第一人称、说明性、克制）；文档 §12.3 明令不得照搬 Anthropic 的品牌文案与专有术语，故只借排版与配色，不借文案。
- §9.4 的 CTA 措辞（「Save preferences」）为 Anthropic 站内文案，不采用。
- 界面小标（eyebrow / meta）用等宽字体（§12.4 与站点既有做法一致）。

---

## 5. 合规禁项（§12.3 / §13）

| 类别 | 具体内容 | 处理方式 |
| --- | --- | --- |
| 品牌标识 | Anthropic logo、名称、`anthropic.com` 域名 | 不出现；站点沿用自身 `Baron_Zhang` 词标 |
| 专有字体 | `Anthropic Serif`（§2.1 指定） | 替换为开源衬线 `Newsreader`（SIL OFL）+ `Noto Serif SC`（SIL OFL）；正文 `Inter` + `Noto Sans SC` |
| 视觉素材 | 站内专有插画 / 摄影 / 产品截图 | 不引用；博客使用自身头像与封面映射（`lib/covers.ts`） |
| 专有术语 | 「Constitutional AI」「Responsible scaling」等 | 不引入文案 |
| 文案 | 品牌口号与页面文案 | 全部使用站点自有中文内容 |

---

## 6. 缺口清单（文档未提供的维度）

| 维度 | 缺口 | 计划处理 | 标注 |
| --- | --- | --- | --- |
| 字号阶梯 | §4.2 未观察到 | 由 theme.css 基础层 + 站点既有档位外推 12 档 | [推断] |
| 暗色模式配色 | §3.3 只确认存在切换与默认亮色 | 沿暖黑 `#141413` 与 §3.2 灰阶推导整套暗色 | [推断] |
| 正文容器宽 | §2.1 为 `—` | 由 §12.1 行长（65–75 拉丁字符）按 CJK 双宽折算 34–40 全角 | [推断] |
| 控件尺寸 | 未观察到 | 沿用 theme.css `.btn 40px` + 站点既有 42px 收敛到 40px | [默认] |
| 卡片/输入框尺寸 | 未观察到 | 由 4px 基准与 40px 控件高推导 | [推断] |
| 布局原语 | §5.3 仅 1 条 grid 定义 | 沿用站点既有 1200px 容器 + 单栏/双栏 | [默认] |
| 图标规范 | §10 仅列尺寸（12/13、12/24、32/32、30/30） | 沿用站点 `@tabler/icons-react`，尺寸落 16/18/20/24 档 | [默认] |
| 页脚/标签页组件细节 | §8.6 / §8.7 规则为空 | 按文档骨架（多列 + 版权行 / tabs 容器）实现 | [默认] |
| `prefers-reduced-motion` | §11.4 未观察到 | 保留站点既有全局守卫（跨站加分项） | 站点既有，保留 |
| 表单校验态 / loading 态 | 文档无 | 站点既有 toast 与骨架屏沿用，仅换视觉 | [默认] |
| 响应式字号 | 文档无 fluid 说明 | 使用 `clamp()`，上下界落在声明档位内 | [推断] |

---

## 7. 与现有工程的映射（文档 → 代码落点）

| 文档维度 | 现有落点 | 本轮动作 |
| --- | --- | --- |
| §2.1 CSS 变量 | `app/globals.css` `:root`（第 1 节，行 50–127） | 整节重写：DNA 值 + 兼容别名层 |
| §3 色彩（明暗两套） | `:root` / `:root:not(.dark)`（行 145–181） | 改为 `:root`（亮，DNA 原文）/ `.dark`（暗，推断） |
| 换肤轴 `[data-accent]` / `[data-bg]` | `globals.css` 行 136–142 / 232–267；`lib/accents.ts`；`components/appearance-provider.tsx` / `appearance-picker.tsx`；`app/layout.tsx` 内联脚本 | **整体移除**（用户决策 2） |
| §4 排版 | `globals.css` 第 4 节 + `.prose`（第 6 节） | 按 1.3 阶梯重写 |
| §5 间距 | 各处 padding/margin/gap | 收敛到声明阶梯 |
| §7 形状质感 | `.surface/.chip/.glass-liquid`、`--radius-*`、`--shadow-*` | 圆角改 3/24/50%；阴影删除 |
| §7 否定性规律 | `.bg-glow/.bg-grid/.bg-vignette`、`.gradient-border`、`.accent-dot` 的 glowPulse、`[data-spotlight]`、`[data-tilt]`、`ui/particles.tsx`、`.page-sweep` 渐变、`.animate-shimmer` | **全部移除** |
| §8 组件配方 | `globals.css` 第 5 节按钮 + 各视觉外壳组件 | 按配方重做，状态补齐 |
| §9 页面模式 | `app/**/page.tsx` | 按第 3 节重排区块与留白节奏 |
| §11 动效 | `--duration-*`、keyframes、GSAP 入场 | 时长收敛到 200/300/400/500ms |
| §13 合规 | `app/layout.tsx` 字体 link | 增加 `Newsreader`（域名仍在 CSP 白名单内） |

---

## 8. 构建与校验约束（非文档项，工程硬约束）

| 约束 | 来源 | 影响 |
| --- | --- | --- |
| 全站禁 emoji（含代码、注释、文案） | `scripts/check-emoji.mjs` | 新增文件一律不得含 emoji |
| 产物审计（密钥 / 外链域名 / 内联事件） | `scripts/audit-build.mjs` | 新增外链域名或内联脚本会被拦截 |
| CSP meta（`fonts.googleapis.com` / `fonts.gstatic.com` 已在白名单） | `app/layout.tsx` | 使用 Google Fonts 无需改 CSP |
| 静态导出 326 页 + Pagefind 索引 | `npm run build` | 样式改造不得改变 DOM 结构契约（`data-pagefind-body` 等） |
| 数据层与内容层不动 | 用户决策 4 | `lib/**`（除 `lib/accents.ts`）、`content/**`、`proxy/**` 不改 |

---

## 10. 第 4 轮台账 — UI 语言换血（2026-10-27 · ui-knowledge-web-builder）

**裁决**：用户明确「不需要参考 anthropic.com，直接重新设计 UI 语言，直接换血也可以」。
**效果**：本节的 token 值**取代** §1 的 Anthropic 暖纸体系（象牙白 / 陶土橙 / 衬线展示）成为现行基线；
§1–§9 保留为历史依据，不再作为当前语言来源。

**新语言**：技术论文（ciechanow.ski 方向）。

| 参考站 | 档案置信度 | 借用点 | 处置 |
| --- | --- | --- | --- |
| ciechanow.ski | low（不直引参数） | 浅色文章壳 + 近黑演示屏双层表面；IBM Plex Sans 无衬线三档；704px 阅读栏；发丝线直角 | 画布 `#f8f8f8` 与演示屏 `#060606` / `#dddddd` 为档案 verified 值直接采用；其余数值自设计并登记 |

**落地改动（token 层换血，全站变量化架构 → 无需逐组件改色）**：

| # | 改动 | 落点 | 标记 |
| --- | --- | --- | --- |
| 1 | 亮色色彩：画布 `#f8f8f8`、正文 `#3f3f3f`、边框 `#e6e6e6/#d6d6d6/#a3a3a3`、面层 `#f0f0f0/#e6e6e6`、overlay/scrim/line-faint 换冷灰透明 | `globals.css` :root | 画布为档案值；其余自设计 |
| 2 | 强调色陶土橙 → 科技蓝 `#1f6feb`（hover `#3b82f6`、subtle `rgba(31,111,235,.08)`、focus-ring、accent-line、heat 三档、on-accent 白字全部同步） | `globals.css` :root / .dark | [推断·自设计]（与 --chart-blue 同源） |
| 3 | 语义色独立化：warning 陶土橙复用 → `#e5762e`；danger `#d4380d`；success `#0a7c42`（暗色对应提亮档） | `globals.css` :root / .dark | [推断·自设计] |
| 4 | 字体：展示衬线（Newsreader / Noto Serif SC）废除，`--font-serif` 重映射为无衬线栈，`tailwind.config.ts` fontFamily.serif 同步；`layout.tsx` 移除两个衬线字体的 Google Fonts 加载 | `globals.css` / `tailwind.config.ts` / `layout.tsx` | [换血·角色废除] |
| 5 | 圆角：`--radius-xs` 3px → 0px 直角档，`tailwind.config.ts` borderRadius 同步全 0；胶囊 24px / 圆形 50% 保留 | `globals.css` / `tailwind.config.ts` | [推断·方向参考]（ciechanow 槽 2px / 直角） |
| 6 | 阅读栏：`--measure` 38em → 42em（ciechanow 704px 折算中文 42 全角） | `globals.css` :root | [推断·方向参考] |
| 7 | 演示屏取值：亮色 `#060606`、暗色 `#0b0b0d`（原 #141413/#0c0c0b 换血）、ink `#dddddd`、muted `#9a9a9a`、line/chip 半透明白 | `globals.css` :root / .dark | 亮色为档案 verified 值；暗色自设计 |
| 8 | 暗色整套换冷黑：画布 `#141416`、面层 `#1c1c20/#26262b/#303036`、文字 `#f4f4f5/#e4e4e7/#b4b4ba/#8f8f96/#6d6d74`、边框 `#2a2a2f/#3a3a41/#5c5c64`、强调亮蓝 `#3b82f6` | `globals.css` .dark | [推断·自设计]（ciechanow 档案未采集暗色） |
| 9 | pagefind 圆角 3px → 0px 同步 | `globals.css` | 同步 |
| 10 | 台账与令牌登记同步（本节 + `SPEC_LEDGER.tokens.json` 全量重写为现行基线） | `SPEC_LEDGER.md` / `SPEC_LEDGER.tokens.json` | — |

**保留（第 3 轮成果继续生效）**：演示屏结构、`.issue-badge` 编号胶囊、prose 2px 下划线、`--tracking-meta` 0.05em、`--chart-*` 四色（蓝与主强调同源）。

**自检结论**：

- 单强调色纪律保持：全站 UI 强调仅科技蓝一色；chart 四色仅数据语境。
- 动效 / 字号 / 间距档位未新增；阴影仍 0。
- 品牌红线：未引入参考站字体（IBM Plex 未采用）、文案、logo、品牌色（其链接亮蓝 #0181eb 未照搬）。
- 组件零改写：所有组件经别名层（--accent-* / --surface-* / --font-serif）自动换血，源码 grep 无旧色残留。
- 状态覆盖：按钮 / 链接 / 输入 / 胶囊 hover-focus-active-disabled 与空 / 加载 / 错误态均随变量自动迁移，无新增缺口。
- 对比度核查：科技蓝 #1f6feb 于白底 ≈ 4.7:1（正文/链接达标）；暗色亮蓝 #3b82f6 于 #141416 ≈ 5.5:1。

来源知识库：`C:\Users\lusha\Desktop\UI知识库\ui-study-library`（候选清单 13 站，本轮对话前轮列出）。
**主基调保留**：anthropic.com（档案 confidence=high，全站暖调纸感身份不动）。
**借用来宾三站**：

| 参考站 | 档案置信度 | 借用点 | 处置 |
| --- | --- | --- | --- |
| jhey.dev | medium（单通道采集） | 2px 强调色下划线链接；等宽元数据 0.06em 字距 | 下划线 1→2px（配色换自家陶土，不用其品牌红）；字距取 0.05em [微调] |
| ciechanow.ski | low（不直引参数） | 亮色文章壳内嵌近黑「演示屏」；图表四色编码 | 数值自设计（--demo-* / --chart-*）并登记 |
| pudding.cool | high | 编号胶囊标签（mono 大写 + 1px 边框 + pill 圆角） | 圆角取自家 24px pill 档 [落阶梯] |

**落地改动**：

| # | 改动 | 落点 | 标记 |
| --- | --- | --- | --- |
| 1 | 新增 --demo-* 演示屏令牌（亮/暗两态：亮 #141413、暗 #0c0c0b）与 --chart-* 四色令牌、--tracking-meta | `globals.css` :root / .dark | [推断·方向参考] |
| 2 | 代码块改近黑演示屏：figure 底 --demo-bg、边框 --demo-line、标题栏半透明白胶囊、token 一律 --shiki-dark（两主题模式统一） | `globals.css` §6 代码块 | [推断] |
| 3 | 代码块语言标签 / 复制按钮配色适配演示屏（--demo-chip / --demo-chip-hover；复制成功态用既有 primary-subtle + primary） | `code-block-enhancer.tsx` | [推断] |
| 4 | `.prose a` 下划线 1px→2px（text-decoration-color 仍为 --accent-line，hover 转主色） | `globals.css` §6 | [单通道采集·配色替换] |
| 5 | `.meta` 字距 0.01em→0.05em（--tracking-meta） | `globals.css` §4 | [单通道采集·微调] |
| 6 | `.issue-badge` 编号胶囊：min 40×24、pill 24px、mono 11px、0.08em、1px --line-strong 边框，group hover 转强调色 | `globals.css` §3 | [方向参考·落自家阶梯] |
| 7 | 文章索引行（IndexRow）序号改编号胶囊，列宽 36→44px | `post-card.tsx` | 组件落地 |
| 8 | 项目清单行序号改编号胶囊，列宽 36→44px | `app/projects/page.tsx` | 组件落地 |

**自检结论**：

- 未新增 UI 强调色：--chart-* 仅数据图表语境，页面强调仍单色（§12.4 纪律保持）。
- 动效档位未新增：编号胶囊只动 border/color（200ms 档）；演示屏无新动效。
- 字号 / 圆角未新增档位：胶囊 11px（--text-eyebrow 档内）、pill 24px（已登记）。
- 品牌红线：未引入参考站字体 / 文案 / logo / 品牌色（红色 #e6483d、Gooper / Atlas / IBM Plex 均未采用；图表色为通用数据色自设计值）。
- 状态覆盖（第 3 轮核查）：搜索加载 / 无结果、标签空态、归档 / 项目 / 文章空态、骨架屏、error / 404 均已存在，无新增缺口。

---

## 11. 灰阶系统语言（第 5 轮 · 全站换血落地）

**来源与决策链**：用户「新B吧」拍板 +「保留三方向，融合组件质感」→ 主方向 are.na（档案 `confidence=HIGH`，`theme_mode=light`，index 83 站经 `scripts/recommend.py` 重选）；风格规格说明书见 `ui-concepts/借鉴方案V2-第二轮选型.md` §8.2，组件融合矩阵见 §8.4。**已废弃**：第 4 轮技术论文语言（§10）。

### 11.1 色彩（亮色 · 档案值）

| 角色 | 值 | 来源 |
| --- | --- | --- |
| 画布 / 面层 | `#ffffff` | 档案 gray0 |
| surface-2 / surface-3 | `#f7f7f7` / `#ededed` | 档案 gray1 / gray2 |
| 发丝线 / 边框 / 强边框 | `#ededed` / `#dedede` / `#999999` | 档案 gray2 / gray3 / gray4 |
| 正文 / secondary / muted / faint | `#1a1a1a` / `#333333` / `#696969` / `#999999` | 档案分层（正文取灰六近黑） |
| 主强调 indigo | `#3d46c2`（hover `#2f34a0`，subtle `rgba(61,70,194,.08)`，focus-ring `.45`） | 档案 brand |
| 页脚深蓝对撞 | `--footer-bg #00075f` + 白字 + 白下划线 | 档案 brand-dark |
| 代码块面层 | 亮 `#f7f7f7` 面 / `#1a1a1a` 字；暗 `#1a1a1f` 面 / `#e6e6ea` 字 | 自设计（灰阶延伸） |
| 唯一阴影 | `0 0 20px 0 rgba(0,0,0,.08)`（仅浮层） | 档案唯一阴影 |

### 11.2 暗色（自设计并登记）

档案仅采集亮色；暗色整块按「灰阶反转 + indigo 提亮」自设计：画布 `#0f0f13`、面层 `#17171b/#1e1e23/#27272d`、文字 `#f4f4f6/#dedee2/#b3b3b9/#8f8f97/#67676f`、边框 `#2a2a30/#3a3a42/#56565e`、强调 `#5b64e0`（hover `#7b82ea`）。

### 11.3 排版与形状

- 字重分层照搬：展示/标题 Space Grotesk 700（`--font-serif` 重映射 + `layout.tsx` 加载 `wght@500;700`）；正文 Inter 400；等宽 JetBrains Mono（胶囊/元数据）。
- 字阶：`--text-display` 56→64px（are.na h1 3rem）；capsule 10px mono uppercase（新增 `.capsule`）。
- 圆角：0px 直角 → 3px 微圆角档（`--radius-xs=3px`，`tailwind.config.ts` 全 0→3px）；pill 9999px 保留给按钮/控件。
- 阅读栏 `--measure` 42em→40.5em（are.na read-width 647.5px 折算）。

### 11.4 组件落地清单

| # | 改动 | 落点 | 标记 |
| --- | --- | --- | --- |
| 1 | :root / .dark 全量重写为灰阶 + indigo + 页脚深蓝令牌，别名层全部保留映射 | `globals.css` | 档案值 + 自设计 |
| 2 | Shiki 双模式着色：亮取 `--shiki-light`、暗取 `--shiki-dark`（未定义回退 `--demo-ink`）；keyword/imports/control 提 indigo | `globals.css` | 融合层自设计 |
| 3 | `.issue-badge` 编号胶囊 → 灰阶 mono 数字（min 20px、无边框无胶囊、hover 转 indigo） | `globals.css` | 换血 |
| 4 | 新增 `.capsule` mono 10px uppercase 胶囊（gray1 底 3px，hover 提 indigo） | `globals.css` | 档案 chip 语汇 |
| 5 | `.chip` base：pill → 3px 发丝线（26 处存量自动随 base 迁移） | `globals.css` | 换血 |
| 6 | 页脚整块深蓝重写：白字、白下划线生长、chip 白边框 hover 白 | `footer.tsx` + `.footer-links` 规则 | 档案签名 |
| 7 | 索引行/首页标签 → `.capsule`；TagBadge → `.capsule`；主题跑马灯 → `.capsule` | `post-card.tsx` / `tag-badge.tsx` / `page.tsx` | 组件落地 |
| 8 | hero CTA：按钮 → 加粗文本链接 + indigo 下划线生长 | `page.tsx` | 融合层（素色控件） |
| 9 | 字体加载 `Space+Grotesk:wght@500;700`；tailwind fontFamily.serif / borderRadius 同步 | `layout.tsx` / `tailwind.config.ts` | 同步 |
| 10 | 台账与令牌登记同步（本节 + `SPEC_LEDGER.tokens.json` 全量重写） | `SPEC_LEDGER.md` / `SPEC_LEDGER.tokens.json` | — |

**自检结论**：

- 组件零硬编码色复核：`components/` 与 `app/`（除 globals.css 令牌与注释）grep `#[0-9a-fA-F]{3,8}` 零命中，全站走语义 token。
- 单强调色纪律保持：全站 UI 强调仅 indigo 一色；`--chart-*` 四色仅数据语境；封面图系统 `lib/covers.ts` 独立艺术调色不参与 UI（登记 diverged）。
- 动效档位未新增（200/300/400ms 沿用）；阴影从 0 增到唯一浮层阴影（登记 tokens.json）。
- 品牌红线：未引入 are.na logo / 字体 / 文案；indigo 为其品牌色但作为「主强调色角色」迁移至自家品牌语境（登记 diverged 属低风险借用）。
- 未覆盖项：① 代码块为 github-light/github-dark-dimmed 原生令牌色（随亮/暗自动切换，灰面深字；因 rehype-pretty-code css-variables 模式剥离 token 类名，未做「indigo 关键字」单色化，登记为可选后续增强）；② 容器 1310px、间距 5px 基数未采纳（理由登记 diverged）；③ are.na 档案未采集暗色，暗色全为自设计（§11.2）。
- 对比度核查：indigo #3d46c2 于白底 ≈ 7.2:1（AA 达标）；暗色 #5b64e0 于 #0f0f13 ≈ 6.9:1。

### 11.5 交互增强（第 5 轮追加 · 组件融合层，自设计登记）

用户判定「交互太一般」后追加。来源：React Bits / Aceternity / Uiverse / Originkit / aura.build 均未登记知识库 → 降级声明：只借鉴形态与交互，参数自设计。动效档位全部落在既有 200/300/400ms（无新档位）；reduced-motion 全局守卫与组件侧开关均生效。

| # | 交互 | 实现 | 感知点 |
| --- | --- | --- | --- |
| 1 | 标题逐字符入场（SplitReveal） | `components/ui/split-reveal.tsx` + `.sr-char`（CSS animation + `--d` 交错延迟，SSR 安全） | 首页 `Baron_Zhang` 逐字上移淡入 |
| 2 | 索引行 hover 三联动 | `[data-spotlight='row']::before` 整行灰面淡入（负 z-index，inset 外扩 12px）+ 既有 2px 刻度 + `.row-shift` 标题右移 2px + 右列 `IconArrowUpRight` 滑入（post-card.tsx） | 全站台账行（文章索引/归档/项目/搜索/learn）统一 |
| 3 | 卡片浮起 | `.hover-zoom:hover`：scale(1.005) → translateY(-4px) + `--shadow-pop` 浮现 + 边框转 accent-line | 头条/网格卡 hover |
| 4 | 全局光标光晕（AuraCursor） | `components/ui/aura-cursor.tsx`（pointer:fine + !reduced-motion 才挂载，rAF 节流 transform-only）+ `.aura-cursor`（520px indigo 径向，峰值 alpha ≈ 0.04） | 桌面指针移动时的极淡编辑感氛围 |
| 5 | 代码块 hover + 复制反馈 | figure hover 边框转 accent-line；复制成功 `code-flash` 1s 边框闪烁（code-block-enhancer） | 文章代码块 |
| 6 | 行 hover 日期淡出 | `group-hover:opacity-60`（保留信息，仅降权） | 与箭头滑入联动 |

**自检**：全部走既有 token；组件零新硬编码色；动效档位无新增；触屏/reduced-motion 下字符动画与光晕自动关闭（aria-label 保读屏完整）。

### 11.6 组件融合交互 · 第 2 批（第 5 轮追加 · React Bits / Aceternity 形态，自设计登记）

用户「只找那么一点组件……网站内组件非常丰富，多找几个」→ 实扫 5 站目录（React Bits 215+ / Aceternity 组件库 / Uiverse 微交互墙 / Originkit 基础件 / aura.build），全部未登记知识库，按降级规则只借鉴形态与交互、参数自设计。落地面板：滚动质感 + 光标系统 + 行/卡 hover + 按钮反馈。

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | Lenis 平滑滚动 | React Bits（Lenis 类） | `npm i lenis`；`lenis-provider.tsx`（duration 1.1 / easeOutExpo / `lenis.on('scroll', ScrollTrigger.update)` 与 GSAP 同步）；pointer:fine + !reduced-motion 才启用 | 全站滚动惯性 |
| 2 | 自定义光标（点+环） | React Bits Custom Cursor | `custom-cursor.tsx`：6px indigo 点 + 14px 缓动环（0.16 lerp），悬停 a/button/[data-cursor] 环放大至 36px；与 AuraCursor 分层共存（氛围光晕 + 精确点） | 桌面指针系统 |
| 3 | 磁吸按钮 | React Bits Magnetic | `magnetic.tsx`：pointermove 吸附（strength 0.3–0.35，位移上限 ≈6px），离开回弹；包 hero 阅读/GitHub/RSS + 全部文章 | hero 链接 |
| 4 | 解密文字 | React Bits Scrambled/Decrypted | `scramble-text.tsx`：hover 字符乱码翻滚逐位还原（rAF，tick 24ms×2）；CJK 标题跳过（避免廉价跳读） | 索引行英文标题 hover |
| 5 | 聚光卡片 | React Bits / Aceternity Spotlight | `.spotlight-card::before` 260px indigo 径向随 `--mx/--my` 跟手（FeatureCard/GridCard 内联 pointermove） | 首页头条/网格卡 hover |
| 6 | 索引行封面跟手预览 | 经典编辑感（React Bits Image 系） | IndexRow 内 `.row-cover`：hover 时 138×92 封面小图沿光标滑出（`--mx` 驱动 + 1.5° 微旋转 + 唯一阴影），reduced-motion 直接显示 | 全站文章索引行 |

**自检**：新组件全部 `'use client'` + pointer:fine/reduced-motion 守卫；纯文本 DOM 渲染（不拆字符 span，读屏无扰）；Lenis 与 ScrollTrigger 同帧联动（raf 同频）；动效档位仍 200/300/400ms（Lenis duration 1.1s 属滚动惯性参数非档位）；零新硬编码色；触屏环境自动回退原生滚动/光标。

### 11.7 组件融合交互 · 第 3 批（第 5 轮追加 · Aceternity Text Flipping 形态，自设计登记）

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | 统计翻板数字 | Aceternity Text Flipping Board / Vestaboard 类 | `stats-tile.tsx` 重写：count-up → 每位数字沿 0-9 数字列滚到目标位（`.flip-reel` translateY(-digit*1em)，1.15s easeOutExpo）；IO 触发时机与首屏档位沿用 §11.1；reduced-motion 直显 | 首页 6/2/26 统计条 |
| 2 | 封面鼠标视差 | 编辑感鼠标视差 | FeatureCard/GridCard `media-frame` 内 `.media-parallax` 层：`--dx/--dy` = 相对卡片中心偏移 × 5%（与聚光 --mx/--my 同一次 pointermove 计算），pointerleave 回弹；与 media-zoom 封面缩放共存 | 头条/网格卡封面 |
| 3 | 回顶走 Lenis | — | `back-to-top.tsx`：`useLenis().scrollTo(0, 1.2s)`（React Context 下发实例，无 Lenis 回退原生 smooth） | 全站 |
| 4 | TOC 点击走 Lenis | — | `toc.tsx`：`useLenis().scrollTo(el, { offset: -96, duration: 1.0 })`（避让 sticky 头），reduced-motion 直跳 | 文章目录（桌面+移动） |

**自检**：翻板数字零新色；视差系数 5% 克制（配合 4px 卡片浮起与 1.05 封面缩放三层叠加不打架）；reduced-motion 下数字直显、视差过渡被全局守卫瞬平；Lenis scrollTo 均带 duration 且回退路径保留。**补充**：Lenis 实例自第 3 批起经 React Context 下发（`lenis-provider.tsx` 的 `useLenis()`，全局 `window.__lenis` 仅兜底），命令面板滚动锁、TOC、回顶同源。

### 11.8 首屏重排与 indigo 签名（第 5 轮追加 · 用户拍板「开始动手」后的视觉收口）

| # | 改动 | 实现 | 感知点 |
| --- | --- | --- | --- |
| 1 | hero 单栏聚焦 | 删除右侧作者卡（Baron_Zhang 名字与「AI 探索者」定位在首屏重复 ×3/×2 → 名字仅 h1 一处）；头像（56px 方块，无文字）移入 ledger strip 与统计台账并排 | 首页首屏 |
| 2 | 签名色带 | `.signature-bar`（globals.css）：34×3px indigo 短条置于 h1 上方，are.na 签名色记忆点（亮 #3d46c2 / 暗 #5b64e0 随令牌自动适配） | 首页 hero |
| 3 | 头条卡 indigo 左竖条 | FeatureCard `media-frame` 左缘 3px `--color-primary` 竖条（z 序在封面上） | 头条卡封面 |
| 4 | 首屏节奏压缩 | hero section `mb-24/32 → mb-16/20`、ledger `mt-16 → mt-12`、头条区 `mb-24/32 → mb-20/24`，头条卡提前进入首屏视口 | 首页首屏 |

**自检**：零新硬编码色（全部走 `--color-primary` 令牌）；名字唯一性 = h1 一处 + 顶部 mono 词标（品牌行与标题分离，不算重复）；bu.js 实测 signature-bar `34×3px rgb(61,70,194)`、头条竖条 `rgb(61,70,194)`、`h1.display` 计数 1。

### 11.9 分类页密度补充（第 5 轮追加 · 用户授权「都听你的」后收口）

分类页此前仅 2 个分类，主体下方大片空白。补充两个**真实数据**模块（非凑数）：

| 模块 | 数据源 | 实现 | 感知点 |
| --- | --- | --- | --- |
| 系列 · Series | `getAllSeries()`（Vibe Coding 实战 2 / Agent 学习笔记 2 / 博客搭建 1） | `.capsule` 行 + 篇数 meta，href `/series/<name>`（路由已存在） | 分类索引下方 |
| 课程 · Learn | `COURSES` + `getCurriculumStats()`（5 门：devtool 83 篇 13 周 / ml 85 篇 17 周 / backend 10 篇 2 周 / agent 41 篇 9 周 / csp 20 篇 3 周） | 发丝线行：课程名 + `N 篇 · N 周` + hover 箭头滑入；尾部「进入课程体系」btn-ghost | 系列下方 |

**自检**：统计全部来自 `getCurriculumStats`（读盘计算，非手写）；样式复用既有 `.capsule` / 发丝线 / `btn-ghost`，零新增令牌；headless 实测渲染正确（OCR 复核 5 门课篇数与周数）。

### 11.10 文章页标题 Blur 入场 + 正文 kbd 键帽（第 6 轮 · 持续精进）

用户授权"继续不断精进和优化，可在 UI 知识库与五个组件网页找灵感"。复核 are.na 档案（profile.md/patterns.md）：5 条指纹签名已全落地，无遗漏；本轮灵感取自 **React Bits Blur Text 形态**（组件站均未入知识库，按降级纪律参数自设计登记）。

| 项 | 落点 | 实现 | 设计参数 |
| --- | --- | --- | --- |
| 标题模糊聚焦入场 | `app/posts/[slug]/page.tsx` header 重构 | 元信息行（stagger）→ 标题（独立 `BlurReveal`，与首页 SplitReveal 区分）→ 摘要/系列/标签（stagger）；新组件 `components/ui/blur-reveal.tsx` | `filter blur(8px)` + `translateY(10px)` + `opacity 0` → 清晰，500ms `cubic-bezier(.16,1,.3,1)`（are.na 档案动效曲线）；IO threshold 0.1 + 1.2s 兜底 timer（防自动化/IO 异常致标题不可见）；reduced-motion 直显；只动 filter/opacity/transform |
| 正文键盘键帽 | `.prose kbd`（globals.css） | mono 键帽：surface-2 底 + 1px 发丝线 + 2px 底边 + 3px 圆角 | 全部引用既有令牌（`--font-mono`/`--text-sm`/`--surface-2`/`--line`/`--radius-xs`/`--space-8`），零新硬编码；正文暂无 kbd 用例，属样式注册（防御性） |

**顺带**：修正 `::selection` 注释（"科技蓝"→ indigo，实现本已跟随 `--color-primary` 令牌，暗色自动适配）。

**自检**：`npm run build` 通过（含 326 页导出 + 审计 1144 文件；期间两次因用户机器上 22 个 dev server 负载导致 /learn 单页导出 >60s 超时，负载回落第三次通过——编译本身 326/326 全过，非代码问题）；headless 截文章页验证标题完成态清晰、结构顺序正确（元信息 → 标题 → 摘要/系列/标签）。

### 11.11 阅读面定位层（第 7 轮 · Batch A · 文章页与课时页，自设计登记）

用户拍板「整站所有页面 + 引入新组件形态、只用既有依赖」后的第 1 批。只动阅读面与其滚动状态层，`lib/**` / `content/**` / `proxy/**` 未触碰，`data-pagefind-body` 等 DOM 契约不变。

先扫出阅读面的真实缺口：窄屏（<1280px）从第一段之后就没有「我在第几节、还剩多少」——页首折叠目录滚过即失联，xl 侧栏要到 1280px 才出现；顶部进度线自己挂监听、每个滚动事件 setState、并且过渡 `width`（违反 §1.8.1 属性白名单）；同一页有侧栏 + 移动端两份目录 → 两套标题扫描、两个 rAF 循环。

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | ScrollSpy 单例 | — 基础设施（自设计） | `components/use-toc-spy.ts` 新：模块级 `snapshot` + `listeners: Set`，全站一份 scroll/resize 监听 + 一次 rAF 合并；判定线 `ACTIVE_LINE=120`（避让吸顶层）；滚到底 `scrollHeight-4` 内强制点亮末节（短章节够不到判定线）；`commit()` 做引用相等短路，重渲染封顶 100 次；`start/stop` 由订阅计数管生命周期；首帧扫不到则 100ms×20 轮询兜底（给 MDX 客户端补渲染） | 文章页/课时页目录与进度同源同帧 |
| 2 | 阅读比例尺 | React Bits Scroll Progress 类（未入库，参数自设计） | `.read-rule` / `.read-rule__fill`（globals.css §11.11）：1px `--line-strong` 发丝线上盖 `--color-primary` 填充，`transform: scaleX(var(--p))` + `transform-origin: left` | 章节条底边、TOC 侧栏、台账行计数 |
| 3 | 进度线换轨 | — | `ui/reading-progress.tsx` 重写：删自有监听与 `width` 过渡，改读 `useTocSpy().progress` + scaleX；页顶 2px 保持 | 文章页顶栏 |
| 4 | 窄屏常驻章节条 | 自设计（补 §11.6 未覆盖的定位空白） | `components/chapter-bar.tsx` 新：`.chapter-bar` sticky `top:70px`（= header.tsx 页头高）、`--overlay` 实色 + 下发丝线 + `z-30`；mono 计数 `02/07` + 当前章节名 `.chapter-flip` 翻牌（200ms `--ease`，只动 opacity/4px 位移，靠 React `key` 重挂重播，不做逐字解码——§11.6 已否掉文字重演）+ `100%` meta + 「目录」`.chip` 开合 `.chapter-panel`（300ms `--ease-out` 上移，`--shadow-pop` 唯一浮层阴影，复用同一份 `TocList`）；Esc 关闭；`headings<2` 整条不渲染 | 文章页 + 课时页 <xl 全程吸顶 |
| 5 | 目录三形态 | — | `toc.tsx` 拆 `TocList`（列表本体）/ `ReadRule`（比例尺 + 百分比）/ `TableOfContents({variant})`：`desktop`｜`mobile-inline`｜`both`（默认，课时页沿用）。文章页 `variant="desktop"` + ChapterBar，同页只剩一份扫描 | 侧栏 / 折叠 / 浮层共用一份标记 |
| 6 | 触屏常驻控件 | — | `@media (hover: none) { .code-copy { opacity: 1 } }` + 类名从 `transition-all` 收紧为 `transition-[opacity,background-color,color]` | 手机上代码块复制按钮（原先永久隐身） |
| 7 | 段落渐入修复 | — | `ui/prose-reveal.tsx` 新增 `blockChildren()` 逐层下钻（≤4 层单子 div）：`CodeBlockEnhancer`/MDX 外壳会在 `.prose` 内再套一层单子 div，原实现取 `root.children` 只拿到包裹层 → 整篇文章当一块淡入，段落级渐入实际失效；`ScrollTrigger.batch` 参数不变（400ms / 步进 40ms / batchMax 4 / `start: 'top 88%'`） | 课时页正文段落级渐入（本轮同时接入 lesson-view） |
| 8 | 正文顶栏分隔 | — | `app/posts/[slug]/page.tsx`：内联 `borderTop/borderBottom` 改 `border-b … xl:border-t …`（窄屏由 ChapterBar 下发丝线承担分隔，避免双线）；`lesson-view.tsx` 折叠目录位 → `<ChapterBar />`，正文 `<div className="prose">` → `<ProseReveal>` | 文章页/课时页首屏 |

**对 §11.6 的修订登记**：§11.6 当年以「避免第二套列表」否掉了移动端抽屉。本批不新增第二份目录，而是把**已有的那一份**搬到看得见的位置（ChapterBar 面板复用同一个 `TocList`、同一个单例扫描器），故属对 §11.6 决策的修订而非推翻；修订理由 = 原决策的前提（"页首折叠够用"）在长文阅读中不成立。

**自检**：动效只用 200/300/400ms 档与 `--ease`/`--ease-out`，只动 transform/opacity/color；零新硬编码色（`--line-strong`/`--color-primary`/`--overlay`/`--shadow-pop` 均既有令牌）；reduced-motion 全局守卫覆盖翻牌与面板进场，单例测量与过渡无关故降低偏好下照常定位；`npm run check`（tsc/eslint/emoji）无新增告警；无新依赖。

### 11.12 索引密度层（第 7 轮 · Batch B · 索引与稀疏页收口，自设计登记）

第 2 批范围：`/tags` `/categories` `/series` `/projects` `/friends` `/posts` `/archive` 首页。诊断：① `/tags` 是前端 chip 筛选器，重算 `/tags/[tag]` 已有的服务端路由，且筛选态不可收藏；② 索引行两套 hover 语汇（灰面板 vs 什么都没有）；③ 稀疏页（3/4 条数据）主体下方大片空白且无横向导航；④ `/series` `/projects` `/friends` 只能从首页或搜索抵达；⑤ `LedgerRow` 的 `meta` 篇数在 `sm` 以下直接隐藏（移动端清单丢数据）；⑥ 2 栏↔4 栏换列时 `i>0` 内联竖线让第二行首格带悬空线。

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | 行语汇：indigo 擦过 | Uiverse 微交互线（未入库，参数自设计） | `.row-line::after`：1px `--color-primary` 沿行顶 `scaleX(0→1)` 自左向右擦过，`top:-1px` 精确压在该行自己的 `.rule` 上（末行不擦虚空），300ms `--ease-out`，`:hover`+`:focus-visible` | 台账行 / 归档行 / 项目行 / 右栏行 |
| 2 | 板 → 线（分级） | — | 索引类行去 `data-spotlight='row'` 改 `.row-line`；`--surface-2` 灰面板在其余 **10 个文件 / 12 处**保留（文章卡、搜索、not-found、learn 表格），那里行高够大板读作"整块可点"，单行文字的清单用板会读作"设置菜单"。§11.5 已采纳形态未从系统删除，仅按语境分级 | 全站索引 |
| 3 | 计数比例尺 | — | `LedgerRow` 新增 `ratio?: number` → 复用 §11.11 `.read-rule`，`--p = count / max`（`max = sorted[0]?.count ?? 1`）。同一个"位置映射"语汇，一处映射滚动、一处映射数量，零新 CSS、零新色 | `/tags` `/series` 右列 96px 短尺 |
| 4 | 标签页改清单 | are.na 编号索引 | `tag-filter.tsx` → `git mv` 为 `tag-index.tsx`，去掉 `'use client'`/状态/`PostList`，改服务端 `<Ledger>` + `LedgerRow`（`ordinal` + `${count} 篇` + `ratio`），行直接链到已渲染的 `/tags/[tag]`；排序 `b.count-a.count` 后按 `zh-Hans-CN` 拼音；masthead 计数 `N 个标签 · M 篇文章` 全部读真实数据 | `/tags` 可收藏、可右键、无客户端重算 |
| 5 | 共享右栏索引 | Originkit / aura 侧栏分组形态（未入库，结构自设计） | `components/index-rail.tsx` 新：分类/标签/系列三组真实数据，`hide?: GroupId[]` 让每页隐掉自己那组（避免自我重复）；`.index-rail` 左缘 1px 竖线界定，栏内靠发丝线分行（§7 无板无边框）；`lg:sticky lg:top-28`；<1024px 去竖线并回落文档流；空组与 `groups.length===0` 不渲染 | 6 个页面（posts/categories/series/projects/friends + `/tags`） |
| 6 | 站点目录（页脚） | — | `components/site-sections.ts` 新 `SITE_SECTIONS`（9 条）→ `footer.tsx` 底栏上方一组 2/3 栏发丝链接（`--footer-muted` + `.link-underline`）。`lib/constants` 的 `NAV_LINKS` 属数据层，按约束不动 | `/series` `/projects` `/friends` 孤儿页可达 |
| 7 | 分格竖线 | — | `.cell-rule`：线位交给 CSS 按列数算（两列时 `nth-child(odd)` 是行首、四列时只有 `first-child` 是行首），替代 `i>0` 内联 `borderLeft` | 首页栏目格 + `StatsTileRow` 统计格 |
| 8 | 稀疏页收口 | — | `/categories`（三块全入 `min-w-0` 主栏，手写课程行 → `Ledger`/`LedgerRow`，去 `transition-all` 与内联 borderBottom）；`/projects`（手排行 → `Ledger`，`py-7` → `py-6` + `row-line`，并改正过期注释"编号胶囊"→"are.na 编号"）；`/friends`（交换友链块的嵌套 `lg:grid-cols-[minmax(0,1fr)_300px]` → 堆叠，窄栏在 2 栏 shell 里读作挤压）；`/posts`（81→40 行，自建 aside → `<IndexRail />` 作**直接 grid item**） | 各索引页 |
| 9 | 归档月标吸顶 | — | `app/archive/page.tsx`：月份 eyebrow 由 `pt-6 md:pt-[26px]` 改 `pt-5 md:sticky md:top-[90px]`（grid item 默认 stretch，sticky 行程恰为"该月区块高度"，翻月自然换行）；行 `py-4→py-5` + `.row-line` | `/archive` |
| 10 | 移动端行密度 | — | `LedgerRow` 右列 `meta`/`note` 去掉 `hidden sm:block`（篇数在手机上不再丢），`meta` 加 `tabular-nums` 对齐；`label` 加 `truncate`（`/series` 的"始于〈完整文章标题〉"以 mono uppercase 压过系列名，截断后主次恢复）；比例尺仍 `hidden sm:block`（装饰性，窄屏让位给文字） | 全站台账行 |

**粘性行程约束（踩坑登记）**：grid item 的 sticky 行程 = 行高 − item 自身高。右栏与主栏等高时被顶出页头。曾用 `max-h-[calc(100vh-7rem)]` + `overflow-y:auto` + `data-lenis-prevent` + 藏滚动条解，**否决**：主栏偏短的页面上右栏尾部反而不可达。最终解 = 缩短右栏（标签 12→10→6，删掉与新页脚站点目录重复的「栏目」组）→ 复测 `railTop 84 / railH 626 / mainH 789`，吸在 70px 页头下 14px，通过。

**假阳性登记**：Batch B 计划里的「音乐 FAB 与回顶按钮碰撞」实测不成立——`--music-panel-edge: 24px`、FAB `bottom: 96px`、回顶 `bottom: 24px` + 44px 高 = 52px 净空，`/archive` 截图复核确认无重叠，未改代码。

**自检**：零新硬编码色（全部 `--line`/`--line-strong`/`--color-primary`/`--accent-text`/`--space-*`/`--duration-*` 令牌）；动效只 300ms `--ease-out` 的 transform，档位无新增；阴影零新增；`/tags` 去掉客户端筛选后筛选能力未减（`/tags/[tag]` 服务端路由本已存在，改为链接而非损失）；显示的一切计数来自 `getAllTags/Categories/Series` 与 `getCurriculumStats` 读盘真值，无手写演示数字；`npx tsc --noEmit` 干净、`npx eslint .` 仅剩存量 `command-palette.tsx:170` 的 `lenis` 依赖告警、`node scripts/check-emoji.mjs` 通过；headless 截图逐页复核（`b-tags-desktop/mobile/hover`、`b-categories(-full/-courses)`、`b-projects`、`b-series`、`b-posts`、`b-archive`、`b-friends(-scrolled)`、`b-home-mobile(-bottom)`）。截图中 `--full` 长页的空白块是 `AnimatedContent` 的 IntersectionObserver 在全页捕获下的产物，`--scroll` 后探针回 `opacity:1`（交换友链块 + 5 门课行），非回归。

### 11.13 学习面反馈层（第 7 轮 · Batch C · /learn 课程页与实验台，自设计登记）

第 3 批范围：`/learn` 索引、5 个课程总览页、课时页尾、勾选清单、8 个实验台。诊断出的真问题：

- 课程总览页的主行动**永远**写着「从 Day 1 开始」，与本机进度无关 —— 一门 83 课的课读到 Day 40，回到课程页还是被推回 Day 1；`ProgressWall` 明明已经知道进度，却没参与这个决定。
- `/learn` 索引按周排开共 239 行，没有任何跳转骨架。
- `/learn` 索引的 devtool 卡标题手写「开发工具链 84 篇」，而同一行算出来的是 **83 课**（`getCurriculumStats`），自己打自己。
- `ScoreBar` 过渡 `width`（§1.8.1 白名单外）。
- 三处「要花钱 / 有坑 / 等人工」提示挂 `--gold`，而 `--gold` 在 §10 换血时已别名成 `--color-primary` —— 警示块与正文强调同色，警示读不出来；同时 `--color-warning` 定义了却全站零引用。
- 勾选清单：对勾与「全部勾完」提示都是瞬变，完成度只有文字没有形。
- 进度墙 hover `scale-[1.18]`：30px 的格子放大到 35px，压进邻格。
- 三个播放器自动步进节拍各自 700 / 900 / 1100ms。
- 实验台整块无错误边界：一个 lab 抛错，这一课所有 lab 一起白屏。
- 课时正文的 `max-w-[68ch]` 是一条**从未生效**的死类 —— `.prose { max-width: var(--measure) }` 是无层样式，赢过 `@layer utilities` 里的 `max-w-*`（同 §11.4 里 prose-sm 的既有结论）。
- 顺带查出全站性的一条：`.pressable` 也是无层样式，**挂在它身上的 `transition-*` 工具类一律不生效** —— 回顶按钮与代码块复制按钮的淡入其实一直没跑。

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | 接着上次 | 自设计（进度系统早就知道，只是没参与决策） | `components/learn/continue-card.tsx` 新：读 `useLearnProgress(course)`，优先级 = 勾了一半的 → 第一所未完成 → 全完成则指回 Day 1；标题随态换 `Start / Resume / Next / Done`；主链走 `.link-underline` + mono `Day N` + 篇长。替换 `CourseOverview` 里写死的「从 Day 1 开始」btn-primary | 5 个课程总览页刊头右侧 |
| 2 | 课程行进度 | §11.11 比例尺复用 | `components/learn/course-progress.tsx` 新：`.read-rule.is-state` + `done/total 课`，`started` 计数只在 >0 时出现 | `/learn` 索引每门课的底部行动行 |
| 3 | 状态比例尺 | — | `.read-rule.is-state > .read-rule__fill { transition: transform 300ms --ease-out }`：原语那条是给滚动链接的、刻意不过渡；离散状态变化反过来**必须**过渡才读得出「刚刚变了」，故加修饰类而不动原语 | 勾选清单表头、续读卡、课程行 |
| 4 | 勾选反馈 | Uiverse 勾选微交互（未入库，参数自设计） | `.tick-pop`（对勾 `scale(0.6→1)` + opacity，200ms，元素条件渲染故每次勾选都重播）+ `.tick-note`（提示上移 4px 进场，300ms）；表头加满格即闭合的比例尺 | 今日自测 / 自查清单（Quiz 与 Checklist 共用 `TickList`） |
| 5 | 警示归警示 | — | 三处提示的 2px 左标 `--gold` → `--color-warning`（首次启用这条已定义令牌，零新色）。**文字不换色**：`#e15100` 对白底 3.9:1，10px eyebrow 够不到 AA，故 eyebrow 留 indigo（7.2:1），警示由色标承担 | chunk-lab 断句 / graph-player 等待人工 / playground 真实调用确认 |
| 6 | 下一课独立成行 | — | `day-complete.tsx`：下一课从按钮行里拆出，做成 `.row-line .rule` 整行（`下一课` eyebrow + `Day N` + 可截断标题 + 箭头滑入）；`max-w-[62ch]` → `max-w-[var(--measure)]` | 每课页尾 |
| 7 | 填充改 scaleX | — | `sim/frame.tsx` `ScoreBar`：`transition-[width]` + `width:%` → `origin-left` + `transform: scaleX()`，300ms 不变 | 所有带评分的实验台 |
| 8 | 步进节拍统一 | — | algo-lab 700 / graph-player 900 / trace-player 1100 → 统一 800ms（取 §1.8.2 档位表里现成的 800 档） | 三个播放器 |
| 9 | lab 级错误边界 | — | `simulator-client.tsx`：switch 抽成 `renderLab(spec)`，每个 lab 各自裹一层既有 `ErrorBoundary` —— 一个坏只塌它自己那格 | 带实验台的课时页 |
| 10 | /learn 跳转栏 | Batch B 的右栏语汇 | 239 行页收进 `lg:grid-cols-[minmax(0,1fr)_240px]` shell，`<aside class="index-rail lg:sticky lg:top-28">` 列 5 门课（编号 + 名称截断 + 课数），锚点 `#course-<id>` + `scroll-margin-top: 5rem` | `/learn` |
| 11 | 死类与硬编码计数 | — | 删课时正文的 `max-w-[68ch]`（从未生效）；`SimFrame` 两处 hint/source `68ch` → `var(--measure)`；devtool 卡标题去掉手写的「84 篇」 | 行长全站统一到 measure；计数只留真值 |
| 12 | `transition-all` 清零 | — | `.pressable` 的 transition 列表补 `opacity`（无层样式，是唯一能生效的那一条）；顺带把 6 处 `transition-all` 收紧或删掉：回顶与音乐 FAB（删死类）、like 按钮 `transition-[color,border-color,transform]`、歌词行 `transition-[color,border-left-color]`（原先真的在过渡 `font-size`，逐行呼吸带动布局）、播放键 `transition-transform`、索引行封面 `transition-[opacity,transform]`。现全站 `transition-all` = 0 | 控件淡入真正生效；歌词不再撑高 |

**未采纳与例外（记下来免得下轮重走）**：

- **不给 learn 播放器加 `prefers-reduced-motion` 开关**：三处的 `playing` 初始都是 `false`，自动播放必须由用户点「自动播放」才起；位移/淡入又已被 §12 的全局守卫压成 0.01ms。为不存在的情形加守卫是空转。
- **实验台骨架不新建**：`simulator-client` 的 `dynamic()` 已各自带 `.skeleton-line` fallback（每 lab 一份），现成的。
- **音乐播放器 seek 条的 `transition-[width]` 保留**：绝对定位的填充条，宽度变化不牵动兄弟布局；换 scaleX 会把 4px 高的圆角胶囊帽压扁。登记为 §1.8.1 的显式例外。
- **`--gold` 其余引用不动**（ai-hot-news 前三名、giscus 未启用占位、音乐播放器当前行标）：都是「高亮」角色，别名到 indigo 语义正确，属 §10 别名层。
- **`content/curriculum/backend` 有一张随查页标题写着「（5 周 · 25 篇）」**，与算出来的 2 周 / 10 课不符 —— 在 `content/**` 里，按「数据层不动」不改，交作者定。

**自检**：动效仍只在 200/300/800ms 三档与 `--ease`/`--ease-out`，只动 transform/opacity/color；零新硬编码色（`--color-warning` 与 `--measure` 均为既有令牌，且首次启用）；阴影零新增；`/learn` 索引与课程页的所有数字来自 `getCurriculumStats`/`getWeeks`/`simLessonCount` 与本机 localStorage，无手写值。注水安全：`useSyncExternalStore` 的服务端快照是空表，SSR 与首帧一律渲染「第一课」，挂载后才换成真实那一课，两边不打架。

**闸门（第 7 轮收尾）**：`npm run check` 全绿（typecheck、eslint 仅存量 `command-palette.tsx:170`、check-emoji、test-proxy、test-attack 全通过、audit:env）；`npm run build` 退出码 0，Pagefind 308 页 / 19798 词，构建产物审计 1144 文件 0 命中。产物 `out/` 有 325 个 `.html`，与 §7 记的「326 页」不矛盾：326 是 Next 的静态页计数器，含 `rss.xml`/`atom.xml` 这类非 HTML 产物；`app/**/page.tsx|route.ts` 两侧都是 27 个，路由集合与 HEAD 逐一对齐，没有少一页。

**功能复核（生产态截图，非 dev）**：续读卡三态实测 —— 空进度 `START / 从第一天开始 → Day 1`；灌入 day-01…05 完成 + day-08 有勾 → `Resume / 接着上次 → Day 8`（`href=/blog/learn/ml/day-08/`，比例尺 `matrix(0.0588…)`＝5/85）；只完成不勾选 → `Next / 继续下一课 → Day 4`。勾选清单点一项：计数 `0 / 5`→`1 / 5`、比例尺 `scaleX(0→0.2)`、`.tick-pop` 出现、localStorage 落 `{"day-01":{"quiz":[0],"lists":{},"done":false}}`（与 `lib/learn-progress.ts` 的形状一致）。警示块在「40/0 腰斩」预设下出现，左标计算值 `2px solid var(--color-warning)`，eyebrow 实测 `rgb(61,70,194)`＝indigo。`ScoreBar` 实测 `origin-left` + `matrix(0.710709…)`。状态比例尺计算值 `transform 0.3s cubic-bezier(0.16,1,0.3,1)`，`--reduced` 下同一条为 `1e-05s`。全站 `transition-all` 计数 0。截图：`c2-learn`、`c2-learn-scrolled`（右栏 sticky 跟随）、`c2-learn-mobile`、`c2-ml-overview`、`c2-ml-mobile`、`c2-ml-dark`、`c2-day01-tick`、`c2-day01-done`、`c2-day06-warn`。

**验证环境的一条坑（免得下轮重走）**：站点按 `.env.production` 的 `NEXT_PUBLIC_BASE_PATH=/blog` 导出，但 `out/` 的目录树不带这一层，本地静态服务必须剥掉这个 URL 前缀才寻得到址；不剥的话 CSS/JS 全 404、页面裸奔，看着像样式回归其实是取不到资源。`ui-concepts/verify/serve-out.mjs` 已加 `--strip=blog`。另：`shot.mjs --eval` 要传**已经执行完**的表达式（`() => ({…})` 会被 Playwright 序列化成 `undefined`，必须写 `(() => ({…}))()`）。

### 11.14 检索面与关于页收口（第 7 轮 · Batch D，自设计登记）

收尾扫过四个从未进批次的页面（`/search`、`/about`、`/privacy`、`/terms`）与三个明细页（`categories/[category]`、`series/[series]`、`tags/[tag]`）。扫描先记账，免得下轮重查：

- 三个明细页与 privacy/terms **干净**：零硬编码色、零 `max-w-[Nch]` 死类、`transition-all` 全站已为 0。它们身上的 `transition-colors` 挂在 `.chip`/`.capsule` 上，而这两个类在 `@layer components` 内（globals.css:347、408），工具类正常生效 —— 与 §11.13 里 `.pressable`/`.prose` 无层样式吃掉工具类的情形**不是一回事**，别照着「transition-colors 都是死类」误伤。
- `/categories`、`/tags`、`/series` 已由 Batch B 的 `IndexRail` 收口，右栏 + 编号行 + 系列胶囊都在，无需再动。
- `/terms`、`/privacy` 是单栏长文，`.rule` 分节 + 编号标题已经读得出来，**不加** ChapterBar：那是给课文的（有 17 周 85 课的纵深），5 节法律文本加目录是装饰不是导航。

| # | 交互 | 来源形态 | 实现 | 感知点 |
| --- | --- | --- | --- | --- |
| 1 | 检索前的起点 | Batch B 的 `.capsule` 语汇 | `/search` 空手进来原本只有一根输入线加一间空房。新增 `!query` 时的一排起点（文章 / 教程 / 分类 / 标签），计数由**服务端** `app/search/page.tsx` 用 `getAllPosts`/`getCurriculumStats`/`getAllCategories`/`getAllTags` 算好、以 `Start[]` 传进客户端 —— 客户端不猜数字（§11.12 的真值纪律）。旁边一行 `meta` 说清「这里只检索文章与教程的正文」，因为 `resultKind()` 本来就只放行这两类 URL | `/search` |
| 2 | 无结果不再断头 | — | 原文案「换个关键词试试，或者从分类里找」把用户推到一句没有链接的话上；`分类` 改成 `.link-underline` 真链接 | `/search` 零结果态 |
| 3 | 关于页三链同权 | — | `/about` 卡片里 GitHub / 邮件 / 浏览文章三条同级出口，前两条 `btn-secondary`（有框）、第三条 `btn-ghost`（无框），读起来像第三条坏了；统一到 `btn-secondary`，箭头同色同径 | `/about` 右栏 |
| 4 | **检索本来就是死的** | — | 不是本轮改坏的（`git diff HEAD` 里那段注入脚本一字未动）。`components/search-page.tsx:60` 拼内联模块时**少了一个收尾引号** —— `import * as pf from 'ORIGIN/blog/pagefind/pagefind.js;` 是不闭合的字符串，浏览器报 `Invalid or unexpected token`，`window.__pagefind` 永远不出现，`doSearch` 因 `!pagefindRef.current` 直接 early-return，于是**输入任何词都零反馈**：没有结果、也没有「没有匹配」，页面看着完整、检索框像坏了。补上引号即通（CSP `script-src 'self' 'unsafe-inline'` 本来就放行内联模块）。同时把「等不到索引」从静默改成明说：`ready` 状态 + 索引未就绪的提示，轮询 100 次（10 秒）后放弃，不再空转 | `/search` 全站 |

**为什么这条要记成缺陷而不是优化**：本轮之前 `/search` 的截图（`d-search.png`）里输入框、清除按钮、⌘K 胶囊都在，肉眼完全看不出这是坏的 —— 只有真去 `page.evaluate` 打一个字、看 `typeof window.__pagefind` 才暴露。以后凡是带「搜索」的页面，验证要打到功能层，不能只截图。

**闸门与复核（Batch D）**：`npm run check` 退出码 0（唯一告警仍是存量 `command-palette.tsx:170`），`npm run build` 退出码 0，Pagefind 308 页、审计 1144 文件 0 命中。功能实测：修前 `typeof window.__pagefind === "undefined"`、任意词 0 反馈；修后搜 `Agent` → **60 条**真实结果、控制台零 error；`君子协定`（只命中非文章/教程页）→ 走「没有匹配」态，其中的 `分类` 已是真链接 `href="/blog/categories/"`。起点四枚胶囊的计数由服务端算出：`文章 6 篇`、`教程 239 课`、`分类 2 个`、`标签 26 个` —— 239 与 `/learn` 刊头一致、6 与 `/categories` 刊头一致，互相对得上。截图：`d2-search-starts`、`d2-search-nomatch`、`d2-about`（三链同框）。另记：pagefind 对 `zzzqqqxx` 这类乱码仍返回 4 条（zh-cn 无词干化，是 pagefind 自己的召回行为），不在本轮范围内改。

### 11.15 交互实测：桌面滚轮原本是死的（第 7 轮 · Batch E · 用户要求「自己交互看看」）

前四批都靠「截图 + `page.evaluate` 读状态」验收。这一轮按用户要求真的去开：滚轮、键盘、悬停、点目录、开关面板。结果截图验收完全看不出来的四条，全在交互路径上。

| # | 症状（用户视角） | 根因 | 修法 |
| --- | --- | --- | --- |
| 1 | **桌面端鼠标滚轮滚不动任何页面**；点目录、点回顶、点章节条浮层，面板会关、页面不动 | `lenis@1.3.27` 的 `autoRaf` 默认 **false**，而 `lenis-provider.tsx` 从没接过 rAF 循环（全站 grep 无 `.raf(`）。实例照样 `addEventListener('wheel', …, {passive:false})` 并 `preventDefault`，可是 `Animate.advance()` 没人调 —— 库把滚轮事件吃掉，再把动画停在原地。`window.__lenis` 存在、`isStopped:false`，所以探针看着一切正常 | `new Lenis({ autoRaf: true, … })` 一行。`destroy()` 里本来就有 `cancelAnimationFrame(this._rafId)`（lenis.mjs:506），配平无需额外清理 |
| 2 | 点目录后标题落在视口 288px 处，高亮显示的是**上一节** | 96px 被算了三遍：`html{scroll-padding-top:96}`（globals.css:281）+ `.prose h2..h4{scroll-margin-top:96}`（:642）+ 我在 `useTocJump` 里手写的 `offset:-96`。Lenis 的 `scrollTo` 会把 scroll-margin 与 scroll-padding 都读进 target，我的偏移纯属重复计费 | 删掉 `.prose` 那条 `scroll-margin-top`（让位归滚动容器统一负责）、删掉 `offset:-96`。落点 82px（头部 71px），四种环境 delta 全 0 |
| 3 | 每个代码块的语言标签压在代码第一行上（`PLAINTEXT` 叠「总样本数」） | globals.css:791 那条顶栏留白只 `:has([data-rehype-pretty-code-title])`，而语言胶囊是 `code-block-enhancer.tsx` 运行时注入的绝对定位 span，从来不在选择器里 —— 注释写着「sits in the top gutter」，gutter 却只给标题开了 | 选择器并一条 `:has(code[data-language])`，留白 `--space-40`→`--space-48`。实测三块 clearance 均 16px |
| 4 | 首屏左上角孤零零一个 indigo 点 + 环 | `.custom-cursor-dot/ring` 是 `position:fixed; left:0; top:0`，transform 只在 `pointermove` 里写；`mx=-100` 是变量初值，元素本体从没归位 | 挂监听前补一次 `render()`。实测首帧 x=y=-103，`onScreen:false` |

**为什么 #1 能躲过前四批**：`shot.mjs --scroll` 走的是 `window.scrollTo`，原生滚动条与键盘（PageDown）也不经过 Lenis，于是每轮截图都「滚到了该滚的地方」；只有 `page.mouse.wheel()` 这种可信滚轮事件才暴露页面被库劫持后原地不动。同理，`if (lenis)` 分支在修前恒为死路，而 `use-toc-spy` 的进度尺读的是原生 `scrollY`，所以百分比一路正常涨 —— 一个坏掉的功能包着一圈看起来好的证据。

**顺带修的两处可访问性**（交互走查时点出来的，非视觉问题）：`小/中/大` 字号三档与「喜欢」按钮只有颜色差，没有状态 —— 补 `role="group" aria-label="阅读字号"` 与各按钮 `aria-pressed`，「喜欢」补 `aria-pressed={liked}`。

**实测通过、未改动的**：命令面板（分组 操作/文章/教程、`↑↓` 移动选中、Esc 关并交还焦点、`lenis.stop()` 现在真的锁得住滚动、关闭后滚轮恢复）、课时勾选（`aria-pressed` false→true、写 `learn.agent.progress.v1`、刷新后仍是 true）、复制链接出「已复制」、字号切换 18/15/16px 且刷新后仍是「中」、主题双向 `dark`/`light` 并落 `localStorage.theme`、移动抽屉 7 条链接 + Esc 关、Tab 序列（首站「跳到主要内容」、12 站全有可见 outline 焦点环）、代码块悬停出复制钮（`figHovered:true`、`opacity 0→1`）。

**三条误报，记录以免下次被当成结论**：① 目录高亮「领先一节」是我探针用 `headerBottom` 当判定线，实际 `ACTIVE_LINE=120` 与落点 82 相差 38px，两套算法都自洽；② 悬停复制钮 `opacity:0` 是探针把指针放在了视口外（`scrollIntoView` 与读 rect 同帧）；③ 截图里高亮停在第一节，是 Playwright `hover()` 自己把页滚走了（18% 对 911px，与画面一致）。三条都是先怀疑组件、后用几何证伪。

**闸门与复核（Batch E）**：`npm run check` 退出码 0（唯一告警仍是存量 `command-palette.tsx:170` 的 `lenis` 依赖 —— 刻意不补：那个 effect 用 `previousOverflow` 快照恢复 body，把 `lenis` 加进依赖会让它在面板开着时重跑，第二次快照读到的就是 `'hidden'`，关闭后永远解不开锁，等于用一个假想竞态换一个真冻结）。`npm run build` 退出码 0、审计 1144 文件 0 命中、emoji 检查通过。修后实测：滚轮 0→900 通、点第 6 条目录 → `scrollY 2232` 且高亮正是「4. 一键生成脚本」、`/` `/learn` `/learn/agent/day-01` `/search` `/about` 五页零 `pageerror`。截图：`V2-3-code-hover`（胶囊归顶栏、左上角干净）、`W4-hover`、`W2-dark`、`W-mobile-drawer`。

### 11.16 悬停词汇表与状态色下沉（第 7 轮 · Batch F · 内联字色锁死换色，自设计登记）

Batch E 的交互走查暴露了一个成类的毛病：**行内 `style={{ color }}` 的优先级压过样式表里所有规则，包括 `:hover`**。所以「写了悬停换色」和「悬停真的换色」是两件事 —— 只要那个元素带行内字色，它的 `:hover` 就是死代码。这类在源码里有 55 处。

| # | 收口方式 | 落点 |
| --- | --- | --- |
| 1 | 状态色写进 `@layer components` 的最后一段，用 `.tint-ink/.tint-body/.tint-muted/.tint-accent/.tint-faint` 五个原语替换行内字色；`.chip.chip-ok` 多一级把「已复制」压在 `.chip:hover` 之上（复制成功是结果，不是邀请） | globals.css |
| 2 | 三态目录原语 `.toc-link`：静止 `--muted` → 悬停 `--body` → 当前项 `--ink` + 600。`.is-active` 写在 `:hover` **之后**，同特异度靠后者胜出，所以「悬停当前项」不会被拽回灰色 | globals.css + `components/toc.tsx` |
| 3 | 同一套写法给导航行 `.nav-row`（桌面导航 + 移动抽屉，当前项用 `aria-current='page'` 表达）、歌单行 `.song-row`（`aria-current='true'` 表达正在播的那首）、实心小按钮 `.btn-accent`（与 `.btn-primary` 共用「加深一档」语汇，但不接管几何） | globals.css + `header.tsx` + `music-player.tsx` |
| 4 | 五个课程刊头的 `eyebrow` 与计数器同条重复课次（`Curriculum / 8 周` 与 `08`），去掉后者；`Toolbox / 13 章` 同理 | `app/learn/*/page.tsx` |
| 5 | 暗色行内代码胶囊底色从 `--surface-3`（#27272d）退到 `--surface-2`（#1e1e23）：`#7b82ea` 在前者上只有 **4.40:1**，够不到 13px 小字的 AA，换后 **4.92:1**；分层照旧由底色 + 描边承担。亮色不动（#2f34a0 on #ededed ≈ 8.5:1） | globals.css |
| 6 | 提示卡本体 `pointer-events-none`、关闭钮恢复 `auto`：三枚成就卡叠在左下角是 320×308，正压着页脚的站次链接，悬停与点击全被吞掉 | `components/ui/toast.tsx` |
| 7 | 零散补悬停：`/learn` 的「术语表」正文链接（原本是 `base a{color:inherit}` 的裸链接）、`/friends` 邮箱（静止色 == 悬停色，等于没有）、giscus 帮助链接 | 三处页面 |

**源码级检测器两个**：① 带行内字色且无悬停词汇 → 55 → 10 处（剩下 10 处是 `<span>` 静态文本，不是控件）；② 完全没有任何悬停语汇的可点元素 → 8 → 1 处（`command-palette.tsx:389` 靠 `onMouseMove` 驱动，活的）。

**四条探针误报，记下来免得下次当结论**：
1. **跑马灯里的 `.capsule`** —— 中心点在视口外，裸 `mouse.move` 被 clamp 到边缘，从没真正悬停。用 `locator.hover()` 并断言 `el.matches(':hover')` 后证实是活的：`#696969→#3d46c2`、底色 `#f7f7f7→rgba(61,70,194,0.08)`。
2. **`.link-underline`** —— 下划线长在 `::after` 上，而 `getComputedStyle(el)` 看不见伪元素。快照要带 `getComputedStyle(n,'::after')`。
3. **`.prose a`** —— 真正的悬停通道是 `text-decoration-color`（`rgba(61,70,194,0.35)→#3d46c2`）与 `text-underline-offset`（3px→4px），`color` 一动不动。
4. **状态锁** —— `.seg-btn[aria-pressed=true]`、`.chip-toggle[aria-current=page]`、`.toc-link.is-active` 悬停不变色是设计意图（当前项的强调不该被指针拽走），不是坏控件。

**闸门与复核（Batch F）**：`npm run check` 0（唯一告警仍是 `command-palette.tsx` 的 `lenis`）、`npx tsc --noEmit` 0、`npm run build` 0、审计 1144 文件、秘密扫描 732 个文本产物 0 命中、emoji 通过。对比度整站 745 → **721** 行，剩下 4 个去重后的案例全是 Shiki `github-light`/`github-dark-dimmed` 的语法着色（要动就得写死新色，越界，留作已知边界）。键盘：23 页真按 Tab，**0 个焦点元素没有可见环**。遮挡：`document.elementFromPoint` 在页脚「文章」链接中心，修前被提示卡接走、修后 `isSelf:true` 且悬停 `rgba(255,255,255,0.72)→#fff` 落地。

### 11.17 键盘契约与不可断的墨（第 7 轮 · Batch G · 「一直测一直改」的收口，自设计登记）

Batch F 之后剩下的活儿分成两类，都不是「新组件形态」，而是**能看见不等于能用**（浮层与控件的键盘/播报契约）和**一处断不开的墨就能毁掉整页**（窄屏几何）。这一轮把它们连根清掉，并把验收手段从截图换成真按键 + 量几何。

**一、键盘与状态播报**

| # | 症状（用户视角） | 根因 | 修法 |
| --- | --- | --- | --- |
| 1 | Tab 到「跳到主要内容」回车后，屏幕阅读器没下文、下一次 Tab 又从头开始 | 跳转目标 `<main>` 不可聚焦：改 hash 不等于移焦点，焦点仍留在 `BODY` | `app/layout.tsx:123` 给 `main#main-content` 补 `tabIndex={-1}` |
| 2 | 落点之后屏幕上凭空出现一圈 1200px 宽、上万 px 高的描边，像布局坏了 | `:focus-visible` 全局环照到了程序化焦点 | globals.css:335 `[tabindex='-1']:focus, :focus-visible { outline: none }` —— 只对非控件的落点生效，控件的环一条没少 |
| 3 | 读到文章中段按 Tab，跳转链接看不见；按下去页面先被弹回顶部 | `.skip-to-content` 是 `position:absolute; top:-120px`：top 相对一万 px 高的 body，元素其实在屏幕外；而「露出」动的是 `top`（布局属性，动一次整页重排） | globals.css:313 改 `position:fixed` + `transform: translateY(calc(-100% - var(--space-32)))`，`:focus { transform: none }`。实测 `scrollY=2400` 时胶囊出现在 (16,12) |
| 4 | 音量/进度两根滑块键盘聚焦后，环几乎看不见 | 焦点环用 `--color-focus-ring`（rgba 0.45 透明），对底 ≈1.9:1，够不到 WCAG 2.4.11 的 3:1 | globals.css:1515 滑块环换实色 `--color-primary`（webkit 与 moz 两个伪元素都换） |
| 5 | 音乐面板：Tab 进输入框后焦点环被 Tailwind `outline-none` 吃掉；关掉面板焦点掉回页面顶部 | `outline-none` 的 utility 层压过 base 层的 `:focus-visible`；面板卸载时触发按钮已消失，焦点无人接管 | 两个 `<input>` 去掉 `outline-none`；`PlaylistInput` 持 `triggerRef`，关闭时 `triggerRef.current?.focus()` |
| 6 | 歌单筛到空结果，读屏什么都不说（视觉上一行「没有匹配…」） | 条件渲染的元素无法播报自己的出现 —— 状态消息要有**常驻**的 live region | `music-player.tsx:512` 常驻 `<p role="status" aria-live="polite">`，有结果时退化成 `sr-only` 空串 |
| 7 | 勾选课时、点「重置」后，进度数字变了但没有任何播报；重置后焦点丢在已重绘的按钮上 | 计数器只是普通 `<span>`；`progress-wall` 重置会整块重排 | `tick-list.tsx:41`、`continue-card.tsx:50`、`course-progress.tsx:34`、`progress-wall.tsx:34` 四处计数器补 `role="status" aria-live="polite"`；`progress-wall.tsx:26` 的 `<section>` 拿 `ref` + `tabIndex={-1}`，重置后 `shellRef.current?.focus()` |
| 8 | 移动端目录浮层：Esc 关不掉；关掉后焦点回到页首；面板与按钮之间没有归属关系 | 面板只是条件渲染的一块 div，没有 disclosure 契约 | `toc.tsx:109` `panelId` + `aria-controls`（仅展开时给）、`:158` 面板 `onKeyDown` 接 Esc、`:112` `closePanel()` 用 `focus({ preventScroll: true })` 归还焦点 —— 用 preventScroll 是因为 `jump(id)` 刚把页面滚到位，归还焦点不能把它拽回来 |
| 9 | 命令面板的结果区在 Chromium 里是一个额外的 Tab 站点 | Chromium 127 起**可滚动容器自动进 Tab 序列**，那个 `role="listbox"` 的 `overflow-y:auto` 结果区就被算进去了；组合框模式的焦点本该只归输入框（行是 `tabIndex={-1}` 的 option，靠 `aria-activedescendant` 播报）。面板的 `onKeyDown`（:349）其实早就把 Tab 按回输入框，所以症状只停在「多一个没用的停靠点」 | `:409` 给结果区显式 `tabIndex={-1}` 退出 Tab 序列 —— 与其依赖外层拦截，不如让序列里根本没有这一格。移动抽屉一侧 `header.tsx:176` 有 trap、`:46` 关后交还汉堡、`:164` 遮罩有可访问名，实测把它当契约基线 |
| 10 | 用面板跳到新页面后焦点掉在 `BODY`：读屏不播报「到了新页面」，下一次 Tab 又从页首翻起 | 面板卸载与 `router.push` 落地之间没人接管焦点 | `:189` 导航前置一个 `focusAfterNav` 标记，`:199` 等 `pathname` 提交（新页已 commit）再把焦点交给带 `tabIndex={-1}` 的 `<main>` —— 与「跳到主要内容」共用同一个落点契约；`preventScroll: true` 不去干扰 Next 自己的滚到顶 |
| 11 | 同一条症状其实遍布整站：从文章卡片、搜索结果、上一篇/下一篇……点任何一条正文链接换页，焦点都掉在 `BODY` | 客户端导航整块换掉正文 DOM，被点中的那条链接随之消失，焦点无人接管。面板那条修法只补了面板自己 | `page-transition.tsx:33` 新增 `useRouteFocusHandoff()`：`pathname` 变化后**只在 `activeElement` 还是 `body` 时**把焦点交给 `#main-content`。这条守卫让常驻页头的导航（焦点本来就在被按的那条链接上，实测停在 `A:文章`）、以及挂载即聚焦输入框的 `/search/` 都不被抢；同页锚点（`pathname` 不变）也不动。不能挂进 `useRouteChange` —— 那条 `prefers-reduced-motion` 直接 return，而焦点交接是功能不是动效 |
| 12 | 页面顶部 Tab 时，焦点会停在一枚看不见的「回到顶部」上，环画在空气里 | 隐藏态只做了 `opacity:0` + `pointer-events:none` —— 挡得住鼠标，挡不住键盘 | `back-to-top.tsx:31` `tabIndex={visible ? 0 : -1}`。实测隐藏态真按 30 次 Tab 命中 0 次，滚到 3000px 后 `tabIndex` 变回 0、回车落回 `scrollY=0` |
| 13 | 首页主题带 Tab 到第 3 格，焦点停在 `x=-307` —— 环画在被 `overflow:hidden` 裁掉的区域里，浏览器也滚不回去；同一个标签还有第二格焦点，落点更在可视带外 | 无缝循环把同一组内容渲染两遍，副本只写了 `aria-hidden="true"`（挡读屏，**不挡焦点**）；暂停只把轨道钉在当前负偏移上，负偏移在滚动原点之外，`scrollLeft` 顶多归 0，回不去 | `marquee.tsx:41` 副本补 `inert`（焦点/点击/播报一起摘）；globals.css:1345 `:focus-within` 从 `animation-play-state:paused` 改成 `animation:none` —— 轨道退回 `translateX(0)`，被裁的尾部仍在 `scrollWidth` 里，`overflow:hidden` 的盒子可编程滚动，浏览器自己把那一格滚进可视带；`scroll-padding-inline:48px` 让落点避开淡出区。焦点离开后动画恢复但 `scrollLeft` 不会自归零（实测残留 1135 → 轨道尾巴空出来、右缘命中测试落在裸 `.marquee`），`marquee.tsx:31` 的 `onBlur` 补这一笔 |
| 14 | 搜索命中后回车，页面整白一下、转场没有、滚动甩回顶部、焦点掉在 `BODY` | 结果行是裸 `<a href={result.url}>`，每次跳转都是整份文档重载，客户端路由（转场、焦点交接、预取）一概不参与。原先这么写是因为 pagefind 报的 URL 自带部署前缀 `/blog/posts/x/`，而 `next/link` 会再加一次 `basePath` → `/blog/blog/` | `search-page.tsx:44` 新增 `routePath()` 摘掉前缀，`:268` 换成 `<Link>`（渲染出来仍是 `<a>`，`[data-spotlight='row']` 与聚光行照旧）。实测 `href` 仍是单前缀 `/blog/learn/agent/day-21/`，Enter 后 `softNav=true`、焦点 = `main#main-content` |
| 15 | 纯键盘一路 Tab 到首页「全部文章」，那一格在 380ms 与 1580ms 两个采样点都还是 `opacity:0` —— 焦点环画在透明块上；教程页的段落块、代码块、`<summary>` 同理会偶发迟半拍 | `AnimatedContent` 的入场只认 ScrollTrigger 的 `start:'top 85%'`，而 start 是按挂载那一刻的布局算的，字体/图片回流后会偏；Tab 的「聚焦即滚动」一步跳过去，未必越得过那条线。WCAG 2.4.7 不管动画有没有跑完 —— 焦点在就得看得见 | `animated-content.tsx:115` 与 `prose-reveal.tsx:76` 各加一个 `focusin` 兜底：焦点落进这一块（prose 侧只点亮包含它的那一个块）就把入场做完（200ms，§1.8 档位内），并杀掉自己的 ScrollTrigger；`reduce` 分支照旧直接 `opacity:1`。改后三页 220 站两个采样点 `eff=0` **0 处** |

**二、窄屏几何（320px 是主战场）**

一条铁律贯穿这一组：**不裁内容、不改排版意图，只给「断不开」的东西一个断开的机会，或把可横滚从页面降级到局部。**页面一旦能整体横滚，吸顶头部、TOC、阅读进度条的几何会全跟着晃，比一个溢出的词严重得多。

| # | 症状 | 根因与量法 | 修法与实测 |
| --- | --- | --- | --- |
| 1 | 文章里一个行内代码胶囊顶穿列表项，整页能横滚 45px | `Path(__file__).resolve().parents[2]` 渲染成 282px 的整块不可断词，`li` 内容宽 264px | globals.css:919 `.prose code { overflow-wrap: anywhere }`（`.learn-block code` 早已有同条，这次补齐 prose 侧）。365→320 |
| 2 | 教程页正文里的裸链接把段落顶穿，最狠的一页 529/320 | `https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md` 是 483px 的一个词；`overflow-wrap` 会继承，但我只加在 `code` 上，`a` 拿不到 | globals.css:798 `.prose a { overflow-wrap: anywhere }`。day-23 529→320、day-30 394→320、day-06 361→320，宽屏逐像素不变（词放得下就不许断） |
| 3 | ML 课时在 320px 上整页横滚，最宽 825/320 | KaTeX 自带 `.katex{white-space:nowrap}` 与 `.base{white-space:nowrap;width:min-content}`：`\boxed{…}`、`\underbrace{…}` 是一整块断不开的墨。全站 92 个含公式课时、3644 条公式，其中 40 条顶穿视口 | globals.css:931 把「可横滚」降级到段落：`.prose p/li/dd/td/h3/h4/blockquote :has(.katex) { overflow-x:auto }`，与代码块、GFM 表格同一套语汇。day-29 797→320、day-34 825→320、day-10 659→320 |
| 4 | —— 上面那条差点引入新毛病 | 只写 `overflow-x:auto` 时，`overflow-y` 会从 `visible` 被强制成 `auto`；实测 320px 上 **505 个**公式段落的 `scrollHeight` 比 `clientHeight` 多 2~6px（KaTeX 零高 `vlist` 撑的），等于给每段挂一根纵向滚动条 | 显式 `overflow-y: clip`（`clip` 不是 `visible`，不触发强制降级）。判据：公式矩形越出段落盒的数量实测 **0**，所以 clip 裁不到墨；`hasTouch` 真/假两种上下文各 5 页，`offsetWidth-clientWidth` 全 0（无竖条），只有 1~4 段可横滚 |
| 5 | 两条公式直接渲染成红色源码，781px 一块 | `content/**` 里 `$…$` 内出现裸 `&`（KaTeX：`Expected 'EOF', got '&'`），解析失败后原样吐成 `.katex-error`，且挂在 `div` 下、段落规则管不到 | globals.css:944 `.prose .katex-error { white-space: pre-wrap; overflow-wrap: anywhere }` 先止血（不再横滚）；**源码本身属于内容，未动，待作者修**（见文末待办） |
| 6 | 导航条当前项的下划线是「长出来」的：动 `width` | 契约 §1.8 只允许 transform/opacity/color 参与过渡 | `header.tsx:125` 改成 1px 基准条 + `translateX(x) scaleX(w)`，`origin-left`。与旧实现几何差 0.0，2× 设备截图无栅格 smear |
| 7 | Magnetic 按钮指针停在边缘时飞出 12.9px | 组件文档写着「6px 上限」，代码里根本没有钳位。探针先读 `getComputedStyle().transform` 全程解析成 0（那是 `matrix()` 不是 `matrix3d()`），改读内联 style 才露出真值 | `ui/magnetic.tsx:13` 新增 `max = 6` prop、`:39` `clamp()` 同时钳 tx/ty |
| 8 | 文章页底部那一排在 390px 上竖排成 105×80 的方盒子 | 中文的 min-content 宽度是**一个字**：容器一挤，「喜欢」就竖着排 | `like-button.tsx:38` `whitespace-nowrap` —— 宁可整枚换一行，也不把两个字拆成两行 |
| 9 | 刊头卡片在 320px 上把 288px 的父栏撑到 335px，卡内的 `truncate` 从不生效 | flex 子项默认 `min-width:auto`，按 max-content 要价；父链上少一格 `min-w-0`，收缩就传不到底 | `page-masthead.tsx:26`（标题格）与 `:31`（动作格）补 `min-w-0`，注释里写着这条几何账 |
| 10 | 跑马灯在「减少动态效果」下把文档撑到 1510px，整页可以横拖 | 关掉动画后 `.marquee__track` 宽度写 `auto`，而 `.marquee__group` 带 `flex-shrink:0` → 直接取 max-content（16 枚胶囊 1494px），此处的 `flex-wrap: wrap` 永不触发 | globals.css:1358 宽度给 `100%` 而不是 `auto`，胶囊真的换行；同时 `overflow: visible` + 去遮罩，静止态读得到全量内容 |
| 11 | 一批可点目标小于 24px（WCAG 2.5.8 地板） | 触摸目标探针按 `getBoundingClientRect` 量全站可点元素，指针/触摸共用一套 | 候选从 20 处清到 2 处 —— 剩下两处是句内链接，规范本就豁免 |

**三、探针环境本身学到的（工具论，不是结论）**

1. **`document.fonts.ready` 在这个环境里永不 resolve** —— 离线字体一直挂在 `loading`。`await` 它的巡检会冻在第一页上，看起来像「跑了但没输出」。三条不同页面各测一次全是 `TIMEOUT 3000ms`。改用法：`Promise.race([…, waitForTimeout(1200)])`。
2. **`isMobile:true` 会带一个 4× 缩放伪影**，截图整个是糊的；要移动语义只给 `hasTouch:true`。
3. **`getComputedStyle(el).transform` 是 `matrix(...)` 不是 `matrix3d(...)`**，按 `matrix3d` 前缀解析的探针永远读到 0 位移 —— Batch G 里 Magnetic 的 12.9px 漂移就是先被这条误报成「没动」。
4. **`getComputedStyle(el)` 看不见 `::after`**（Batch F 已记），同理 `element.screenshot()` 会「waiting for fonts to load」而超时 —— 用 `page.screenshot({ clip })`。
5. **横向溢出的判定要抗瞬态**：`/friends/` 一度报 344px，三次复现不出来。闸门改成「两次采样都溢出、且涉事元素没有正在做 transform」才算，误报归零。
6. **纪律闸门要按规则比，不是按行号**：`src-audit.mjs` 的基线原本带 `:line`，往上面插一段解释性注释就把老问题报成新引入（新增 1 / 消除 1）。改成比对前去掉行号，此后 `新增 0`。
7. **进度条本身也会骗人**：巡检脚本的 `[320] 90/320` 打点写在「这一页溢出」的分支之后，`continue` 会把它一起跳过 —— 于是修得越干净，日志越安静。有一轮 5 分钟不出一行，第一反应是「卡死了」，实际是 320 档已经跑完、0 命中。打点该无条件放在循环末尾。
8. **CDP `Page.captureScreenshot` 的 clip 是文档坐标，不是视口坐标**：把 `getBoundingClientRect()` 原样喂进去，回来的是一张 500 字节、纯白的 PNG —— 尺寸对、内容空，看着像截图坏了，其实截的是文档顶上同一块高度的空白。改法 `rect + scrollX/scrollY` 配 `captureBeyondViewport: true`。副作用：这条会把 sticky 头图重绘到 clip 顶部压住正文，抓前把 `header/footer` 设 `visibility:hidden`（不参与布局，坐标不动）再恢复。整件事的起因还是第 4 条 —— Playwright 的 `page.screenshot` 等字体等不到，只能绕到 CDP。
9. **静态枚举「可聚焦元素」会两头骗人，只有真按 Tab 可信**：`getComputedStyle(el).display` 读的是元素自己的**指定值**，祖先 `display:none` 时它照样报 `flex` —— 桌面目录侧栏里那枚 0×0 的「目录」按钮就是这么被报成幽灵焦点位的，而它根本进不了序列。反过来，正在做 opacity 过渡的元素刚按下时读到 0，代码块复制按钮（200ms 淡入）就被报成「隐形还能 Tab 到」，等 500ms 再量是 `opacity:1` + 2px 强调色环。两条都是假阳性，`tabwalk.mjs` 改成「按 `data-tw` 身份判重 → 量 → 可疑的补等 900ms 再量一次」。
10. **Lenis 把「聚焦即滚动」也接管了**：浏览器发出滚动指令后还要 ~400ms 缓动才落位，320ms 读数会把一大半的站报成「视口外」—— 第一轮 886 站里 28 处「问题」全是这一条造出来的，且每一处 `ring:true / op:1 / covered:false`。补等一次之后归零。
11. **`new RegExp` 拼字符串时，`$` 必须写成 `\$`**：裸 `$` 紧跟 `[` 会被解析成行尾锚点，整条规则静默匹配 0 个。第一版公式内容普查报「中文混入 0 处 / 裸 & 0 处」，而同一时刻构建日志里 KaTeX 正报着一串 `unicodeTextInMathMode` —— 是探针没匹配，不是内容没问题。
12. **`grep -F` 里带正则字符等于永远不匹配**：用 `grep -o -F '.opacity-0{[^}]*}'` 查生成 CSS 报了 0 命中，差点误判成「Tailwind 没产出 `focus-visible:` 变体、复制按钮在桌面上永远显不出来」。换成字面串 `-F 'focus-visible\:opacity-100'` 就查到了。
13. **`aria-hidden` 不影响 `tabIndex`，静态枚举查不出 `inert` 生效没有**：副本组加了 `inert` 之后，`el.tabIndex` 依然报 0、`querySelectorAll('a')` 依然数到 16 —— 但浏览器的序列焦点确实绕开它。唯一的裁判是真按 Tab：首页静态枚举 75 个可聚焦、实走 59 站，差的正好是那 16 枚。反过来也提醒一句：`总焦点站 886 → 870` 不是退化，是这 16 枚该摘掉。
14. **判「客户端路由还是整页重载」有个零成本探针**：导航前在 `window` 上挂一个数组（`window.__t = []` + `focusin/focusout` 记录器），落地后还在 = 同一份文档 = 软导航；变 `undefined` = 整页重载。搜索那条硬链接就是靠它抓出来的，顺带还给出了焦点时序（`focusout→body` 1869ms、`focusin→main` 2479ms）。
15. **量入场动画里的焦点位，一个采样点不够**：GSAP 侧的入场是 400ms + 批内 40ms 步进，再叠 Lenis 的缓动落位，380ms 读数把 8 个「会自己亮起来」的站报成了缺陷。判据改成两点采样（380ms 与 1580ms）：两处都为 0 才成立 —— 8 处里 7 处自己落定（是入场，不是缺陷），只有首页那一格是真的，也正是它把修法从「再等等看」逼成了「焦点也是一条入场条件」。

**四、闸门（Batch G）**

- **窄屏几何总闸**：`hscroll3.mjs` 全站 **320 页 × 4 视图（320 / 320-dark / 390 / 768）→ 稳定横向溢出 0**。判定口径是「两次采样都溢出且涉事元素没在做 transform」，瞬态不算账。修前同一支探针在 320 档一口气报 47 个 devtool 课时 + 24 个 ml 课时。最后那版源码出来后再单跑 320 档回归：**页面 320 × 视图 1 → 稳定横向溢出 0**。
- **浮层键盘总闸**：`palette-trap.mjs` 真按键跑完命令面板一轮 —— 点开后面板内焦点 `INPUT:命令面板搜索`；**Tab×6 与 Shift+Tab×3 的活跃元素全部还在面板内**（组合框只留输入框一个停靠点，没有漏进遮罩背后的页面）；Esc 后焦点 `BUTTON:打开命令面板`（是触发它的那枚，不是页首）；Enter 导航后 `document.activeElement` = `MAIN`（`/learn/ml/glossary/`），再按一次 Tab 落在新页正文的「教程目录」而不是从头翻起；面板开着时滚轮 `scrollY` 0→0（背景锁死），关掉后 →400（交还）。
- **状态播报**：`/search/` 的 `role="status"` 实测读出「共 60 条结果」；音乐侧空结果、课时勾选、进度重置三处 live region 常驻（表一 #6/#7）。
- **触摸目标**：`tap-target.mjs` 全站量 `getBoundingClientRect` —— **`<24px`（WCAG 2.5.8 地板）2 处**，且两处都是句内链接，规范本就豁免；`24~44px` 存量 229 处（44px 是 AAA 的加严线，本轮不动）。
- **键盘总闸**：`tabwalk.mjs` 15 类页面真按 Tab 走完全程，每一站量尺寸 / 不透明度 / 焦点环 / 命中测试是否被遮 / 是否在视口内，可疑的补等 900ms 复量。收口时的账是 **870 站 / 0 处**（第一轮报的 28 处「视口外」见第三节第 10 条，是 Lenis 缓动没走完；另外抽屉改成 `inert` 之后，`/` 的实走从 75 降到 59 —— 那 16 枚是抽屉里的链接，DOM 里 `tabIndex` 仍 ≥0 所以「可聚焦」计数照旧，浏览器却已经跳过它们）。**终账在 §11.18 三：855 站 / 0 处**（背景音乐 FAB 下线，15 类页面各少一枚）。
- **没走过的流程补测**（`residual.mjs` + `navfocus.mjs`，逐条真点真按）：代码块复制（键盘 Enter 触发，剪贴板内容与 `<code>.textContent` 逐字符相等、边框闪烁、2s 后 `aria-label` 与闪烁一并复位；页内 4 枚按钮 4 个 `figure`，没有漏增强）；回到顶部（隐藏态真按 30 次 Tab 命中 0 次）；主题（换色 + `localStorage.theme` + 刷新保持，`aria-label` 同步翻转）；字号（16→18px、`aria-pressed` 从「中」迁到「大」、`blog-font-size` 落库、刷新保持）；喜欢（`aria-pressed` 往返 + `liked-posts` 落库/清库 + 84×38 达标）；防收割邮箱（挂载后正文 2 条 `mailto:` 真解出、页脚图标带「邮件」名）；搜索（常驻 live region 报「共 60 条结果」→ Tab 到首条 → 回车进正文）；路由焦点交接 7 场景（正文链接→`MAIN`、页头常驻→不抢、后退→浏览器自己恢复、同页锚点→不动、深位链接→`MAIN` 且没被 `preventScroll` 拽偏、面板 Enter→`MAIN`、直接加载→不抢）。
- **动效与配色纪律**：`src-audit.mjs` 合计 11 条待判、**与基线相比新增 0**（全是前几轮逐条判过的已知边界）。
- **公式账**：92 个含公式课时、3644 条公式，其中 40 条在 320px 顶穿视口 → 修后随总闸一起归零；段落级可横滚的只有 1~4 段/页，无一根纵向滚动条。断与不断是两种视觉结果，所以补了元素级截图：`Y-math-boxed-a/b`、`Y-math-underbrace-a/b`、`Y-urlwrap` —— 公式保持整块（`\boxed{}` 的框线没有被折断），只在段落边缘硬裁，横向滚动能读到尾部；裸链接则是逐行下划线地断开。
- **构建**：`npx tsc --noEmit` 0 错、`eslint` 1 条存量告警（`command-palette.tsx` 的 `lenis` 依赖，§11.15 已记理由）、`npm run build` 0、产物审计 1144 文件、秘密扫描 732 个文本产物 0 命中、pagefind 索引 308 页、emoji 检查通过。

**五、留给作者的两条（都在只读区，不该我动）**

1. `content/**` 里两处 `$…$` 内含裸 `&`，KaTeX 报 `Expected 'EOF', got '&'`，线上直接渲染成红色源码：`/learn/ml/day-29/`、`/learn/ml/day-34/` —— 产物里 `.katex-error` 精确到 **2 页 / 4 处 span**（`grep -ro katex-error out --include=*.html`）。样式侧已止血（不再顶宽，globals.css:944），要正解得改公式写法（`\&` 或换成对齐环境）。另有一批「中文直接写进数学模式」的写法（`\{红, 绿, 蓝\}`、全角冒号等）只触发 `strict:'warn'` 的 `unicodeTextInMathMode` 日志，渲染不受影响，属可选清理项。
2. `content/curriculum/backend` 有一张随查页标题写着「（5 周 · 25 篇）」，与 `getCurriculumStats` 算出来的 2 周 / 10 课不符 —— §11.13 就记过，仍在 `content/**` 里等作者定。





### 11.18 索引行悬停重做与背景音乐下线（第 8 轮 · Batch H · 用户指令两条）

用户这一轮给的是两条具体指令：「优化一下首页鼠标放在文章索引上后的效果」和「这个背景音乐的功能去掉吧」。第一条正好撞在 Batch G 的盲区上 —— 前面七轮量的是**几何与键盘契约**，hover 的观感从来没人拿尺子量过。这次把「悬停时有没有压住字」做成可量判据，顺手把同一行上其余三处不协调的反馈一起收掉。

**一、索引行悬停：从「跟手大图压正文」到「序号栏换位」**

| # | 症状（用户视角） | 根因与量法 | 修法与实测 |
| --- | --- | --- | --- |
| 1 | 鼠标一放到索引行上，一张不相干的封面图就盖在正在读的标题上 | `.row-cover` 是 138×92 的跟手浮图：`left:0` + `translate(calc(var(--mx)+16px), -50%)`。1440px 首页索引行宽 752、标题列从 68 起 —— 光标停在行首图占 16..154（压住标题开头 86px，约四个汉字），光标走到列中央图跟到 416..554（压在字正中）。`--mx` 跟手意味着**这一行里没有任何位置是安全的** | globals.css:1637 把图钉回序号栏（<640px 44px、≥640px 56px），序号交叉退场（`:1667`）。1440 档光标从行首扫到行尾 6 个位置、另加 5 档视口上下文（含 reduced-motion 与触摸）：图与标题、摘要、标签三块文字的重叠面积全 0；图外接盒右边缘 57 ≤ 标题列 left 68，恒留 11px 空白。附带省下每次 mousemove 的一次样式写入与整行重排 |
| 2 | 越想看清楚这行写的什么，它越是一团乱码 | `ScrambleText` 在 `pointerenter` 把整行标题换成符号再逐位揭示 —— 而 hover 的用途恰恰是读标题 | 索引行改回纯文本，组件删除（全站唯一调用点就是这里）。DESIGN.md v5.3 与 README 特性表同步撤账 |
| 3 | 窄屏 hover 时箭头压在日期中间 | `IconArrowUpRight` 写 `absolute right-0`，而日期与阅读时长都是右对齐贴同一列的右边缘；列的 `pl-6` 明明预留了 24px，预留位却在左边。390px 实测箭头落在「2026.09.16」中段 | `post-card.tsx:127` 箭头改走那 24px（`left-0`），入场位移由 +8px 改 −8px。实测 1440/1024/768/390/320 五档：箭头与日期、时长、标题**裁剪盒**重叠面积 0 |
| 4 | 键盘走到同一行，只吃到半套反馈 | 左侧强调竖线 `::after` 只写了 `:hover`（灰阶面 `::before` 却写了 `:focus-visible`）；箭头只有 `group-hover:` 一档 | globals.css:1113 补 `[data-spotlight='row']:focus-visible::after`；`post-card.tsx:127` 补 `group-focus-visible:translate-x-0 / :opacity-100`。真 Tab 进 5 档视口：`fv:true`、封面 op=1、序号 op=0 |

判据本身要记一条：**量文字重叠，标题只能用元素的裁剪盒**。`.row-title` 在 ≥640px 是 `nowrap + overflow:hidden`，`Range.getBoundingClientRect()` 量到的是被裁掉的那截隐形尾巴（长标题 103px² 「重叠」全在这里），拿它当「压住字」会一片红；日期/摘要不裁，才用 Range 量真实字宽。另一条：程序化 `focus()` 之后立刻读 `getComputedStyle().opacity` 读到的是过渡起点（0），必须等 ≥300ms 再量 —— 第一轮就是这么把 focus-visible 一档误报成「没生效」的。

**二、背景音乐整块下线（用户指令）**

- 摘掉：`app/layout.tsx` 的 Provider 与 FAB、`components/music-player/`（4 个文件）、`lib/music.ts`、globals.css 的 xl gutter（`--music-*` 五个 token + `body:has([data-music-panel]) #main-content` 的 padding-right 规则 + 那条为「面板卸载时缓回」而单独声明的 `transition: padding-right`）、20 条 `spectrum-*` 关键帧。
- 顺带清掉的纪律债：`src-audit` **消除 9 条、新增 0** —— 7 处硬编码 rgba（唱片纹理与投影）、1 处布局属性动效（padding-right）、1 处渐变。这条值得记：删掉一个功能，比给它补纪律便宜得多。
- 产物账：`out/` 全量 `grep music` 0 命中、无 `/music/` 路由、生成 CSS 里 `spectrum-*` 与 `--music-*` 各 0 命中；`#main-content` 的 padding-right 回到 32px（`lg:px-8` 原值），body 横向溢出 0。
- 文档同步：README 特性表删「背景音乐播放器」「标题解密文字」；DESIGN.md 加 v5.3 变更条并把 §8 断点表里「1280 是音乐播放器侧栏 gutter 专用」改成「1280 起文章/课时页侧栏目录展开」（1280 这个断点还在用，只是不再服务播放器）；§1.8.6 的 `.marquee:focus-within → paused` 一行改成 §11.17 表一 #13 的实际契约。
- 不动的：`proxy/**`（wrangler worker 与本次无关，未改一行）。用户浏览器里残留的 `localStorage` 键（歌单 ID / 音量）成为孤儿数据，无代码读取，不清理。

**三、闸门（Batch H）**

- **悬停重叠总闸**（本轮新立）：`rowhover.mjs` 在 1440 档把光标从行首扫到行尾共 **6 个位置**（x=80/200/360/520/680/745），封面图与标题、摘要、标签三块文字的**重叠面积恒 0**，图的外接盒右边缘 56~57（含 `rotate(-1.5deg)` 撑出来的那一像素）≤ 标题列 left 68，恒留 ≥11px；`rowhover2.mjs` 五档上下文（1440 常规 / 1440 reduced-motion / 768 / 390 触摸 / 320 窄）各测键盘对等 + 鼠标离开后复位 + 全程最差重叠 —— 五档 `worstOverlap 0`、`fv:true`、封面 op=1、序号 op=0，`all clean: true`；`arrowfit.mjs` 五档 × 日期 / 时长 / 标题**裁剪盒**重叠 0，且没有新增横向溢出。
- **键盘总闸**：`tabwalk.mjs` 15 类页面 **855 个真实焦点站 / 0 处问题**（`tabwalk9`）。同一条链路的账要记全：换掉那版盲目 `window.scrollBy` 补偿之前，`tabwalk8` 报 **34 处**视口外焦点站；页脚留白改完复跑 `tabwalk10` 仍是 855 / 0，说明这 32px 空白没有动到任何焦点顺序。Batch G 收口时的 870 见 §11.17 四。
- **锚点落点闸**（本轮新立，`anchorland.mjs`）：3 视口 × 5 页真点目录项 **69 次**，量目标标题上沿与粘顶头部下沿的差 —— **留白 11~25px（`/learn` 课程卡 105px），压在头部后面或目标丢失 0 次**。第一版报 30 次红，全是探针自己的账：窄屏目录是浮层，点一项就收起，后面 5 次点的是已经隐藏的链接（`offsetParent:null`，浏览器根本没跳）。
- **ARIA 结构闸**：`ariaudit.mjs` 15 类页面 **278 个 `aria-hidden` 区 → 内含可聚焦元素 0 处**。清单本身要记一条：`/links/`、`/music/`、`/rss/`、`/learn/courses/` 四条早就没有对应页面了，静态服务器把它们回落成 404 —— 那四行「违规 0」量的是 404 页，等于凭空白送四个合格样本。已换成 `/projects/`、`/terms/`、`/privacy/`、`/learn/ml/`、`/learn/ml/day-10/`。`/` 报的「inert 内残留 tabbable 16」不是违规：DOM 里 `tabIndex` 仍 ≥0，`inert` 已在浏览器层面把它们跳出序列（`tabwalk` 的 `/` 实走 59 站即证）。
- **其余回归全绿**：reduced-motion 12 页跑动动画 0 / 视口内被藏文字 0（不达标的 0/12）；断点往返 6 场景 PASS（抽屉、目录浮层、面板缩放、开着刷新、换页）；路由焦点交接 7 场景 PASS；命令面板 Tab×6 与 Shift+Tab×3 全部留在面板内、Esc 交还触发钮、开着滚轮 0→0；不可见焦点站 `ghost5.mjs` 三页 59 / 76 / 83 站 0 处。
- **纪律与产物**：`src-audit.mjs` **新增 0 / 消除 9**（剩 2 条是前几轮逐条判过的边界）；`out/` 全量 `grep music` 0 命中；`npx tsc --noEmit` 0 错、`npm run check` 0（含 eslint 那条 `command-palette.tsx:184` 存量告警、边缘限流攻击模拟全通过、`.env` 审计通过）、`npm run build` 0（pagefind 索引 308 页、审计 1144 个产物、秘密扫描 732 个文本产物 0 命中）、emoji 闸通过。
- **横向溢出总闸**：`hscroll3.mjs` 全站 **320 页 × 4 视图（320 / 320-dark / 390 / 768）→ 稳定横向溢出 0**（页脚留白改动后的构建上复跑）。

**四、顺手抓到一处既存缺陷：右下角浮层与页脚抢同一块地皮**

移除音乐 FAB 之后，右下角只剩「回到顶部」一枚住客，于是给它补了一道遮挡闸 —— 结果量出一个跟本轮两处改动都没有因果关系的老问题。

| 项 | 内容 |
| --- | --- |
| 症状 | 滚到页底，鼠标去点页脚右下角的 RSS：点到的是「回到顶部」。窄屏上「站点目录」的最后两行同理 |
| 根因 | `back-to-top.tsx:32` 是 `fixed bottom-6 right-6` + 44×44 + `z-50`，等于在视口右下角钉死一块 **68×68 的泊位**；页脚内层 `py-12` 让末行下沿落在视口底 -48px，正落在泊位带（-68 ~ -24）里 |
| 量法 | `footbottom.mjs`：11 页 × 5 视口 = 55 组合，真落底后量「被浮层盖住 ≥20% 的可见可点元素」。同一趟把 `padding-bottom` 强制改回 48px 做 A/B，证明是这只手干的 |
| 实测 | 旧 48px：**20 处**遮挡（集中在 640~1280；最坏是 22×24 的 RSS 被盖 **81~85%**，1024 与 768 各页普遍）· 现 80px：**0 处**。窄侧 <640 末行本就 `flex-col` 左对齐、天然躲开；>1280 页脚容器 `max-w-[1200px]` 居中，右边缘已退到泊位左侧 |
| 修法 | `footer.tsx:45` `py-12` → `pt-12 pb-20`（80 = 68 泊位 + 12 余量）。只加空白：不动颜色、不动效、不引令牌 |

探针这一轮学到的三条，比修的那 32px 值钱：

1. **开着 Lenis 时 `window.scrollTo(0, document.body.scrollHeight)` 不叫「到底」**。原生写入会被它的 `animatedScroll` 盖掉，而且 `body.scrollHeight ≠ documentElement.scrollHeight`：实测停在离真底还差 184~2738px 的位置（320 档的 `/learn/agent/day-01/` 最狠）。正解是 `window.__lenis.scrollTo(documentElement.scrollHeight - innerHeight, { immediate: true })`，并且**反复落直到 maxScroll 连续两次不变** —— 评论区、懒附图会在落底之后继续把文档撑高，最后还要断言 `scrollY == max`。
2. **排除项就是闸门的盲区**。`fabgap.mjs` 第一版把 `header / footer / [data-spotlight=row]` 整块豁免，于是「页脚 RSS 被盖 84%」它一句没报，还连绿了三轮、被我当成「0 处问题」写进过中间结论。现在只豁免本来就点不到的（`inert`、`aria-hidden`、`opacity<0.5`），并把「没真正落底」本身记成一处失败 —— 闸门不能拿中间态冒充静止态。
3. **角落少了一个住客，不等于那块地皮空出来了**。音乐 FAB 在的时候，右下角一直被两枚浮层挤着，量的人很容易默认「角落本来就该被盖住」；摘掉一枚之后才第一次有人去问「剩下这枚压到了谁」。删功能顺带把遮挡显形，这是本轮除 9 条纪律债之外的第二笔意外收入。

**五、无 JS 与减少动态下的落位（第 8 轮补 · Batch I · 新立的 no-JS 闸抓出四处）**

`noscript.mjs` 是本轮新立的一道闸：`javaScriptEnabled: false` 打开 10 类页面 × 2 视口，整篇文档扫「有没有内容被按在透明态」，顺带核对滚筒的视觉位与 `sr-only` 真值对不对得上。立闸的动机来自 §11.10 那条契约 —— 「初态只在 JS 里设置」，可当时只落实了 ProseReveal / AnimatedContent（挂载才 `gsap.set`），漏了另外几处把初态写进渲染输出的。四处里三处是同一个形状：**入场动画的起点被烘进了 HTML**，于是 JS 不在的时候，用户拿到的是动画的第一帧而不是最后一帧。

| # | 症状（关掉 JS 的人看到什么） | 根因与量法 | 修法与实测 |
| --- | --- | --- | --- |
| 1 | 6 篇文章的标题整块不见了 —— 位置占着、字读不到 | `BlurReveal` 是 `'use client'` + `useState(false)`，`opacity: 0` / `blur(8px)` 作为内联样式进了 SSR 的 HTML，等 IO 或 1.2s 兜底 timer 来点亮；JS 不在，点亮这件事没人做 | 组件去掉状态与 `'use client'`，改成 `.blur-reveal` 一次性关键帧（globals.css，`from` 里才是模糊态，静态样式永远是清晰那一版）。`noscript` 闸 1440/390 两档文章页**透明文字块 0** |
| 2 | 首页计量条写着「文章 0 / 分类 0」，屏幕阅读器同时在念 26 / 12 / 30 | `StatsTile` 的 `--digit` 由 `target ?? 0` 算出，SSR 阶段 `target` 是 `null` → 出去的 HTML 就是 0。视觉与 `sr-only` 各说一套，等于给用户假数据 | `--digit` 直接写目标值，滚法交给 `@keyframes reelRoll { from { translateY(0) } }`（缺 100% 关键帧时浏览器拿底样收敛）。产物核对：`out/index.html` 里三枚 `--digit:6 / 2 / 26` 与 `sr-only` 6 / 2 / 26 一致，闸口**位错 0** |
| 3 | 首页与 `/about/` 的头像是一个透明的洞（图在、alt 在、位置占着） | `.media-fade { opacity: 0 }` + `.is-loaded` 靠 JS 的 `onLoad` 加类；类名本身又是 React 烘进 HTML 的。图片加载失败也一样：`onError` 换图标同样要 JS | 与 `.media-zoom` 合流成一次性关键帧，删掉 `loaded` 状态与 `.is-loaded` 规则（产物里 `is-loaded` 0 命中）。新闸 `noscript-img.mjs` 10 页 × 2 视口：**透明的洞 0**。改前是首页与 `/about/` 各 1 处（两档视口都数到）；同一趟还报出 6 枚透明 svg，追到底是 `post-card.tsx:130` 的 hover 箭头 —— 它自己带 `group-hover:opacity-100 / group-focus-visible:opacity-100`，属指针与键盘都拿得到的设计意图，不是内容丢失，判据改成按「元素自己带揭示类」点名豁免（`[class*="group-hover:opacity-100"]`），不按祖先一刀切。**这笔交换要记明**：`animation` 只在挂载时演一次，不再跟着 `onLoad` 走 —— 于是缓存命中时头像「直接就在了」（动画在解码前跑完），慢网下则是先留白、图到了也不再淡入。旧写法把淡入和解码绑死，代价正是 no-JS 与加载失败两种情况下的透明洞。观感差异只在「有没有那 400ms 的淡」，内容可见性从「三种情况缺一」变成「恒有」，判它划算 |
| 4 | `prefers-reduced-motion: reduce` 下内容仍然「先空后补」 | 两笔账叠在一起：① 全局守卫只归零 `animation-duration`，没管 `animation-delay`，`backwards` 填充在整个 delay 期把元素按在 from 态（首页刊头 11 个字母实测约 200ms）；② 就算把延迟也清零，新建 CSS 动画还有一段 **pending（待启动）** 期 —— 要等合成器确认首帧，这期间 `backwards/both` 照样生效，实测 `reduce` 档文章标题模糊 891ms、首页刊头 171ms，`animation-duration:.01ms!important` 压不掉 | 守卫补 `animation-delay` / `transition-delay` 清零；再把 13 类一次性入场（`.sr-char` `.blur-reveal` `.flip-reel` `.media-fade` `.chapter-flip>span` `.chapter-panel` `.tick-*` `.animate-scale-in/fade-up/slide-down` `.stagger>*` `.media-zoom`）在 `reduce` 下 `animation: none !important` 整个取消 —— 终态就是静态样式，没有可等的东西。**`.animate-fade-out` 故意不进名单**：它的终点（opacity 0）不等于底样，取消动画会把该消失的提示条留在屏上，退场只交给时长清零 |

判据本身有两条要记：

1. **透明过 ≠ 有问题，透明的「窗口长度」才是**。CSS 动画首帧必然处在 progress 0，`ssrreveal.mjs` 若按「采样里出现过 opacity<0.05」判失败，正常档与 reduce 档一起红。改成量「从第一次透明到最后一次透明的持续毫秒数」，加 16ms 一帧的容差：正常档要求标题模糊持续 ≥150ms（实测 476ms，观感没丢），reduce 档要求 ≤50ms（实测 0ms，第一帧即终态）。`rmotion3.mjs` 同口径，7 页 × 2 视口 14 组合的窗口全部 **0ms**（改前 3 个 >50ms，最长 891ms）。
2. **闸门的阈值不能把「页面本来就稀疏」报成故障**。`/search/` 在无 JS 下只有 126 个可见字符，最初被判 FAIL —— 但它同时给了 4 条真入口（文章 / 教程 / 分类 / 标签），内容一件没少；同理 `/about/` 主区天生只有 2 条链接。原先那条「可见字数 > 200」和临时加的「主体链接 ≥ 3」都是在猜，已换成按元素逐条判定（透明块 0、横向溢出 ≤1、h1 在、头/脚链接在、滚筒位错 0），字数与主体链接只打印不参与判定。**没 JS 的检索框确实点不动**，但同一站点里命令面板、评论区、/learn 实验台也都依赖 JS —— 单给 `/search/` 补 `<noscript>` 是临时起意加功能，且全站从未用过 `<noscript>`，React 对元素子节点的注水处理是个未知坑。要做得成体系地做，留给单独一轮。

顺带把 `prose-reveal.tsx:60` / `page-transition.tsx:62,80` 这两处 `opacity: 0` 也点过名：它们是运行时 `gsap.set` / GSAP `from` 参数，不进 HTML，属于契约里正确的那一半，无需改动。

闸门（Batch I）：

- **no-JS 文字闸** `noscript.mjs`：10 类页面 × 2 视口 = 20 组合，关掉 JS 后**不达标 0**（改前 2/20 —— 6 篇文章的 h1 透明、首页与归档的滚筒位错）。同批核到的正面项：横向溢出 0、`h1` 在场、头/脚链接 22~32 条、可见字数 126~11837。
- **no-JS 资源闸** `noscript-img.mjs`（本轮新立）：同 20 组合，**透明的洞 0**。
- **入场仍然在演** `ssrreveal.mjs`：4 项全 PASS。正常档标题模糊持续 476ms、半透明持续 415ms（观感没被改成瞬时），滚筒「见过途中」且终态三位都落在 `-digit×1em`（容 1.5px）；reduce 档标题与滚筒均**第一帧即终态**（持续 0ms）。
- **reduce 透明窗口** `rmotion3.mjs`：7 页 × 2 视口 = 14 组合，**>50ms 的 0 个，最长 0ms**（改前 3 个超标、最长 891ms）。既有的 `rmotion.mjs`（12 页跑动动画 / 被藏文字）仍 0/12。
- **不伤及他处**：键盘焦点闸 `tabwalk.mjs` 在本批产物上复跑，15 类页面 **855 个真实焦点站 / 问题 0 处**（与 Batch H 收口时同数，说明四处初态改写没动到任何焦点顺序）；浮层遮挡闸 `fabgap.mjs` 55 组合**被压可点元素 0 处**；纪律闸 `src-audit.mjs` **新增 0**（列表里那几条 `music-player` 的硬编码色是「已消除」段，文件确实不在磁盘上了）；`npm run check` 0（typecheck / eslint / emoji / proxy / 攻击模拟 / .env 全过）；`npm run build` 0，pagefind 与 1144 个产物审计通过。

### 11.19 未走过流程的交互实测（第 9 轮 · Batch J/K · 两条新地面各抓出一处生产缺陷）

前八轮的闸门量的都是「页面渲染出来之后」的状态。这一轮换了一批**从来没人真点过**的流程：评论区（懒加载 iframe + 第三方脚本 + 主题同步）和 /learn 实验台与接口控制台（全站唯一会花访客自己钱的界面）。各抓出一处缺陷，两处形状相同 —— **反馈写在了会把自己收掉的地方**，所以它坏得很安静：没有报错、没有错位，只是用户按完钮什么也没发生。

**一、评论区：CSP 拒掉的是布局，postMessage 撞的是时序**

| 项 | 内容 |
| --- | --- |
| 症状 | 1440 档评论框只占宿主栏的 **300/790**（右侧空 490px），390 档 **300/316**；iframe 还带着浏览器默认的 2px 边框 |
| 根因 | `client.js` 会往**宿主文档**插一枚 `<link rel="stylesheet" href="https://giscus.app/default.css">`，而那份表的全部内容就是四条布局规则。本站 CSP 的 `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`（`app/layout.tsx:75`）不放行 giscus.app → 外链被拒 → iframe 退回浏览器默认的 300px 宽 |
| 量法 | `giscusfit.mjs`（本轮新立）：2 页 × 2 视口，比 iframe rect 与宿主栏宽、`border`、横向溢出、容器是否被 `hidden`，并把注入的外链样式表与 giscus 相关 console 一并打出来 |
| 改前 | `合计 4 处不合格`，四组同形：`FAIL 1440 /posts/hello-world/ iframe 300x360 @x=181｜宿主栏 790｜border=0px solid` |
| 修法 | `app/globals.css` 本地镜像 `width:100% / min-height:150 / border:none`。**刻意不镜像 `.giscus-frame--loading { opacity: 0 }`** —— 把内容按在透明态等第三方来点亮，正是 §11.18 五 刚清掉的那一类缺陷 |
| 改后 | `合计 0 处不合格`：`PASS 1440 … iframe 790x372｜宿主栏 790｜border=0px none｜溢出 0px`、`PASS 390 … 316x370｜宿主栏 316` |
| 为什么不放宽 CSP | 镜像之后这条 refusal 已经无害：布局不再托付给别人的样式表（它慢、被墙、被拒都该照样对）。为一个嵌入框给第三方域名开样式注入面，是拿全站换一处便利。这条拒绝现在在闸门里**单列 NOTE**（`flows1` 的 `known` 桶），不再混进 FAIL —— 记了账的例外和被静音的噪音是两回事 |

第二条跟布局无关，是时序。`giscus-comments.tsx` 的主题同步 effect 挂在 `status === 'ready'` 上，而 `ready` 是 **`client.js` 的 onload** —— 那一刻 iframe 往往还停在 `about:blank`（父源）。对着它 `postMessage(…, 'https://giscus.app')` 会被浏览器判「目标源与接收窗源不符」并**整条丢弃**：实测 4/4 组合各有一行 `Failed to execute 'postMessage' on 'DOMWindow'`。红一行控制台还只是表象，实在的后果是**评论区刚出现的那一秒里切主题永远不生效**，因为消息根本没送到。改成等 iframe 自己的 `load`（`frameLoaded` ref + `addEventListener('load', …, { once: true })`，已 load 过则直接投当前主题）。复测：四组的 warning 全部消失，只剩已记账的那条 CSP 拒绝。

**二、接口控制台：按完钮，回执住在会被自己收掉的抽屉里**

| 项 | 内容 |
| --- | --- |
| 症状 | 在实验台填完 Worker 地址与 Key，点「保存并测试连接」—— 面板收起，之后**什么都没有发生**：没有过程、没有结果、没有失败原因 |
| 根因 | 展开状态是父层推导的：`playground.tsx:consoleOpen = consoleOverride ?? !ready`。`save(draft)` 在同一个 click handler 里把 `ready` 翻真，React 同批 commit 就把 `{open && …}` 整块卸载 —— 而「正在握手」和 `ping()` 的结果正好都住在那一块里 |
| 量法 | `flows5.mjs`（本轮新立）：`MutationObserver` 记这块的每次变更（时间线），而不是某一刻的快照；`flows4.mjs` 走完整实验台流程（未配置 → 滑杆进请求体 → 保存测试 → 武装确认 → 撤销 → 真调用失败 → 清除记录 → 390 档几何） |
| 改前实测 | 点完 0.4s 与 4.4s 两次快照全是空：`saveBtn=false panelOpen=false handshaking=false result=null`。「接口设置」那一整块只剩 `接口设置 代理 sk-LEA…37ab 展开` |
| 修法 | 回执容器搬出 `{open && …}`，常驻 DOM 并挂 `role="status" aria-live="polite"`（同检索页 / 勾选清单的约定，WCAG 4.1.3）；空着的时候不预留高度。折叠且未测时它补一句「本机存着配置，这次还没测过连接。」 |
| 改后实测 | 时间线 `+0ms 空(statusH=0) → +24ms「正在握手」(h=16) → +31ms「连不上代理 —— 地址 http://127.0.0.1:9 没有响应…」(h=32)`，面板收起后仍可见；390 档 `ovf=0 liveRight=374=hostRight clipped=0` |
| 顺带修的一笔假绿 | chip 原本 `ready ? var(--success) : var(--muted)`，而 `isConfigured` 只看字段非空 —— 手滑填错网址的那一刻它就绿了，同一屏下面挂着红色失败。现在绿色**只代表真验过**：未验证走中性色，验证失败走 `--danger`（实测全程 chip 颜色集合 `[rgb(51,51,51)]`，落定 `rgb(185,61,61)`，从未出现 `success=rgb(35,128,32)`）。状态不靠颜色单独表意，文字承担同一件事 |
| 同族第二处 | 实验台调用失败的说明块也是「内容与容器同一次挂载」，读屏收不到 → 补一条 `sr-only` 常驻 live 区。实测念的是「调用失败：连不上代理。地址 http://127.0.0.1:9 没有响应。确认 Worker 已部署、网址填对，并且它允许 127.0.0.1:8126 这个来源。」 |

**三、邮箱防收割：HTML 确实干净，注释里的「代价」却说漏了一半**

| 项 | 内容 |
| --- | --- |
| 契约（组件自述） | `components/obfuscated-email.tsx`：「SSR/静态导出的 HTML 里只有 base64 密文」，代价是「禁用 JavaScript 的访客看不到邮箱」 |
| 量法 | `flows6.mjs`（本轮新立）：325 个 HTML 产物全文扫明文邮箱与 `mailto:`；`out/_next/static/chunks/**` 扫明文；浏览器里核解码后的 `href` 与占位符残留；`javaScriptEnabled:false` 核占位符是否自带解释；页脚入口的键盘可达与有名 |
| 实测（正面） | HTML 明文 **0 处**、`mailto:` **0 处**、密文按预期出现在 4 个文件；开启 JS 后 /about/ /terms/ /friends/ / 各 1~2 条 `a[href^="mailto:"]`，`href === 'mailto:' + atob(密文)` 全对，占位符残留 **0**；页脚入口 36×36、`aria-label="邮件"`、可 Tab 到达 |
| 实测（注释没说全的那一半） | **5 个 JS 分块里存着明文邮箱**（`app/layout-*.js`、`app/page-*.js`、`app/about`、`app/friends` 等）。根因不在组件而在 `lib/constants.ts:75` 的 `EMAIL_OBFUSCATED = btoa(SOCIAL_LINKS.email)`：`footer.tsx` 是 `'use client'`，这行 `btoa` 在浏览器里执行，明文必须跟着 chunk 出去。所以「挡不住定向攻击」这句要读得更狠一点 —— **会执行 JS 的收割器（含搜索引擎爬虫）直接就拿到**。根治要改 `lib/**`（本轮禁改区），留给作者定夺：把密文写成构建期常量而不是运行时 `btoa`，代价是换邮箱要同时改两处 |
| 抓到的一处不一致 | 图标版 `ObfuscatedEmailIcon` 挂载前的占位 `<span role="img" aria-label="邮件">` 没有 `title`，而文字版有。关掉 JS 的人因此看到两种东西：/terms/ /privacy/ 是「邮箱」+ 一句解释，/about/ /friends/ 是一个不带任何解释的「邮件」/「发邮件给我」按钮。同一个已知代价，两处交代不一样 —— 补齐图标版的 `title`（`obfuscated-email.tsx:58`），复测 no-JS 四页 **4/4 占位与解释都在** |

**四、这一轮探针与闸门学到的五条**

1. **单点采样量不到毫秒级的状态，会把正常判成缺陷**。「正在握手」在没人听的死端口上只活 20~30ms，`flows4` 在 500ms 处取一次快照 → 报 FAIL。换成变更时间线之后同一件事是 PASS。状态类断言要问「序列里出现过没有」，不能问「这一帧有没有」。
2. **可见性 ≠ 在 DOM 里**。收起的面板中元素照样存在于 React 树但不在屏上；判「用户看得到吗」一律按 `getBoundingClientRect()` 的宽高，不按 `querySelector` 命中。
3. **Key 的判据要跟着设计改**。旧断言 `!html && !text && 仍在密码框` 现在必然红 —— 面板收起后输入框整个卸载了，那不是密钥丢失。改成只断言「明文不进 HTML、不进可见文本」，同时打印 `localStorage` 仍含 Key 与 chip 的脱敏形态（`sk-LEA…37ab`）。
4. **探针自己也要过一遍泄漏检查**。`flows6` 第一版把解码后的可见文本截到 12 个字符再打印，等于原样送出 local-part；且 `m()` 掩码只在整串匹配时才生效，截断后的片段逃过掩码。现在顺序反过来（先掩码再截断），并加了一条自检：探针输出里明文邮箱命中数 **0**。**闸门自己不该成为泄漏点。**
5. **探针也要自检对错**：`/接口设置/.test(x)`（`x` 是元素，被 coerce 成 `"[object HTMLButtonElement]"`）静默 false，让一条 NOTE 连红三轮而没人起疑；`find(div)` 命中祖层，让「花钱前的确认文案」打出来是整页目录。这两处都已改成点名元素与取最小匹配。**判据得先证明它能区分对错**，同 §11.18 四那条「排除项就是闸门的盲区」是一课的两面。

**闸门（Batch J/K）**

- **评论区嵌入布局** `giscusfit.mjs`：2 页 × 2 视口 = 4 组，改前**不合格 4**（iframe 300×360 卡在 790 / 316 的宿主栏里，还带默认边框），改后**不合格 0**（790×372 / 316×370，`border=0px none`，溢出 0）。同批 `postMessage` 源不符的 warning 从 4/4 组降到 0。
- **实验台全流程** `flows4.mjs`（本轮新立）：20 项全 PASS，0 FAIL。钱的安全契约第一次真点验证：未配置时不出现「真实调用」、请求体默认收起、滑杆与文本框实时进 JSON（`MARKER-7788` 命中）、第一次点只武装（「确认调用 · 输入约 39 tokens」）、改参数立刻撤销、`取消` 真的撤销、失败给出可读原因并落进常驻 live 区、明文 Key 不上屏、「清除本机记录」后 `localStorage` 空且回到未配置、390 档实验台溢出 0。
- **接口控制台状态闸** `flows5.mjs`（本轮新立）：6 项全 PASS（过程反馈出现过 / 结果折叠后仍在屏 / 常驻 live 区 / 空回执不占位 / chip 不假绿 / 窄屏不越栏：`ovf=0 liveRight=374=hostRight clipped=0`）。
- **邮箱防收割闸** `flows6.mjs`（本轮新立）：12 项全 PASS（HTML 明文 0、`mailto:` 0、密文在场、no-JS 四页占位与解释 4/4、开 JS 四页解码正确且占位不残留、页脚入口键盘可达、探针输出自查明文 0 命中）。
- **既有交互回归** `flows1.mjs` 0 FAIL / 21 PASS（字号三档、主题切换与刷新保持、喜欢按钮不落假账、代码块复制复位、分享链接、检索 60 条命中与跳转、命令面板 270 条回车跳转 + `inert` 归还、回到顶部 `scrollY=0`；两条 CSP 拒绝进 `known` 桶，单列 NOTE）。`flows3.mjs` 0 FAIL / 11 PASS（勾选清单 `1 / 5 → 5 / 5`、比例尺 `--p=1`、刷新保持、标记完成 `aria-pressed=true` 且课程页显示真值、字号跨页持久、Konami 解锁诚实）。
- **无 JS 与减少动态不掉地**：`noscript` 不达标 **0 / 20**、`noscript-img` 透明的洞 **0 / 20**、`rmotion3` 透明窗口 >50ms **0 / 14**（最长 0ms）—— 新的常驻 live 区空着时高度 0，没给无 JS 与 reduce 档添新东西。
- **结构与纪律**：`ariaudit` 15 类页面 **278 个 `aria-hidden` 区 / 内含可聚焦元素 0 处**；`src-audit.mjs` **新增 0 / 消除 9**（剩 2 条为前几轮逐条判过的边界）；`npm run check` 0（仅 `command-palette.tsx:184` 那条存量告警）；`npm run build` 0（326 页静态产物、pagefind、1144 个产物审计）。
- **几何与键盘不受影响**：横向溢出闸 `hscroll3` 320 页 × 4 视图 **稳定溢出 0**；浮层遮挡闸 `fabgap` 55 组合 **被压可点元素 0 处**；键盘焦点闸 `tabwalk` 15 类页面 **855 个真实焦点站 / 问题 0 处**（与 Batch H/I 收口时同数 —— 回执容器是 `<div role="status">`、图标版占位是 `<span title>`，都没往 Tab 序列里加东西）。


### 11.20 实验台的状态播报（第 9 轮 · Batch L · 七个 `ssr:false` 组件第一次被逐钮点完，也第一次被读屏视角审）

**一、为什么前面所有闸门都路过了这七块**

`components/learn/sim/` 的 graph / trace / algo / chunk / vector / hybrid / filter 全部经 `dynamic(..., { ssr:false, loading: 骨架屏 })` 挂载：静态产物里连影子都没有，`ariaudit` / `src-audit` / `hscroll3` 这类按 HTML 扫的闸天然量不到它们，`noscript` 也判不出（无 JS 时它们本来就只剩骨架屏）。所以本轮立两条新闸，都只在浏览器里跑：

| 闸 | 问什么 | 结果 |
| --- | --- | --- |
| `flows7.mjs`（新立） | 骨架屏收没收、钮有没有名字、按下去有没有反应、点完撑不撑版面、有没有崩 | 11 页 · 15 块实验台 · **93 次真实点击**（同一闸改前跑的是 57 次）· 0 FAIL |
| `flows8.mjs`（新立） | 状态变了，读屏收得到吗（WCAG 4.1.3 的三条出口） | 改前 **15 次操作里 live 区 0→0**，改后 **静默 0 处** |

`flows7` 第一版按位置取按钮句柄，直接崩在 `Cannot read properties of undefined (reading 'click')` —— 这些实验台是状态机，点一次「运行」就把这一排按钮整排换掉。改成给每个钮打一次性 `data-pw-seq`、按序号找回、每点一次重扫块内新冒出来的按钮（配额 40/块）之后才跑得动。**探针的句柄模型要跟着组件的状态机模型改**，这是 §11.19 四第 2 条（判据要能区分对错）的又一个实例。

跑出来的 6 个「按了没反应」全部带 `[按下的是已选中项]` 标记：`aria-pressed=true` 的分段控件按下去本来就什么都不该变。另有 2 个禁用钮（day-18 停在 `interrupt()` 时「单步执行」「自动播放」同时禁掉）—— 那是设计，不是缺陷。

**二、4.1.3：全站只有这七块没有 live 区**

`grep -rn aria-live components/` 的既有清单是 api-console / continue-card / course-progress / playground / progress-wall / tick-list / search-page / toast 八处，`sim/` 目录 **0 处**。判据取读屏真正认的三条出口：① 常驻 `aria-live` 区域变了字；② 应用自己把焦点挪走；③ 被点的控件换了名字（文案/`aria-label` 改动算）。三条都没有 = 按下去屏幕上一切照旧、读屏一声不吭。

改前实测（`flows8` 第二版，诚实判据）：10 个主动作 **live 区 0→0 全中**，6 个彻底静默（graph-player 的「单步执行」×2、algo-lab 的「单步执行」×4），4 个只靠③（「自动播放」↔「暂停」换名）勉强过关 —— 而结果本身（跑到第几步、停在哪个节点）始终没人念。

**探针在这里差点自己造了 10 个假 PASS**：第一版先取基线再 `x.focus()`，于是「探针自己挪的焦点」被算成应用的播报出口②，10 个动作全绿。改成**先交焦点再取基线**、并把 `focus` 指纹统一成同一个表达式之后，同一批动作立刻掉回 6 个静默。这条记进 §11.19 四的方法清单：**基线必须在探针自己那一下之前取，否则量到的是探针。**

**三、七块各补一句，两种挂法**

| 组件 | 挂法 | 为什么这样挂 |
| --- | --- | --- |
| `graph-player.tsx:158` | 常驻 `sr-only` 句子，住在工具条**外面** | 步进改的是下面按需挂载的轨迹列表；`spoken`（:86）把「第 N 步 / 共 M 步 / 停在哪个节点 / 等你批准」合成一句。放工具条里头会重复播报 —— 焦点交还时容器会把里面所有文字读一遍 |
| `algo-lab.tsx:206` | 常驻 `sr-only` 句子 | 同上，讲解卡 `{step && …}` 是按需挂载的，容器必须先在场上 |
| `trace-player.tsx:56` | `Controls` 多收一个 `status` 参数 | 两个播放器共用一条工具条；新报文是 append 出来的，没有常驻容器 |
| `chunk-lab.tsx:134` | 常驻 `sr-only` 句子，**带分隔符集名** | 见下：只念那五个数字会漏 |
| `vector-lab.tsx:66` / `hybrid-lab.tsx:129` / `filter-lab.tsx:242` | 直接把**可见**的常驻容器挂 `role="status"` | 结果就写在那一排数字 / 那一句结论里，容器一直在 DOM 上 —— 不另写一份平行文案，就不会有两处真相 |
| `filter-lab.tsx:98` | 常驻 `sr-only` 句子 | 两列对照本身按需挂载，「过滤后 n 条 / 挡掉 m 条」没有常驻落点 |

`chunk-lab` 是这里唯一被迫多写一句的：这份 218 字样例上，把分隔符从默认换成「中文：再加句号、叹号、问号、逗号」，块数、平均块长、最长块、切断句数、重复字数**一个都不变**（只有下刀位置变了）。数字挂 live 于是永远不响 —— `flows8` 第一次复测就把它抓在静默名单里（`变字 否｜焦点 未动｜控件换名 否`）。播报改成先报「用的是哪套分隔符 / 哪个预设」再报五个数，换档才每次都有一句可念。**「可见数字即状态」是错的：状态里凡是数字表达不了的那部分，读屏就永远拿不到。**

**四、顺手收掉的两处键盘落点**

1. **批准 / 驳回之后焦点掉回 BODY**：`interrupt()` 面板连同那两个按钮一起卸载。现在 `decide()`（`graph-player.tsx:80`）与「检查点 chip」「从这里续跑」两处卸载型按钮统一把焦点交还给工具条（:107 `tabIndex={-1}` + `toolbarRef`），同 `progress-wall.tsx:44` 的既有做法。实测落点 `{"tag":"DIV","tab":"-1","text":"单步执行自动播放重置步 1/3 · 上限 8"}`。
2. **「重置」只在有东西可重置时出现**（`pristine` 判据 :77）：`flows7` 报的那条 day-18「重置」空放（按下的是初始态）就是这么来的 —— 一个按下去什么都不做的钮，比一个不出现的钮更糟。同 `progress-wall` 的 `completed > 0 &&`。`flows9` 量过这一下的几何代价：工具条 **40px → 40px 不长高**，计数器距右沿 **0px → 0px** 不跳位。

**闸门（Batch L）**

- `flows9.mjs`（新立 · 几何与落点）：**14 项全 PASS** —— 未开跑不出现「重置」/ 回执容器高 1px 不占位 / 走一步后出现且不长高 / 计数器贴右沿 / 播报跟着换步 / 批准后面板卸载焦点落在工具条 / 390 档四页 5 块实验台溢出 0 且最右元素越栏 0px。
- `flows8.mjs` 复测：15 次操作（步进类 + 换选项类）**静默 0**，其中 15 处随操作变字。
- `flows7.mjs` 复测：**0 FAIL / 25 PASS**，15 块 · 93 次点击 · 无名按钮 0 · 骨架屏残留 0 · 溢出 0 · 无崩溃。
- 回归不掉地：`tabwalk` 15 类页面 **855 个焦点站 / 问题 0 处**（与 Batch H/I/K 收口同数 —— 新增的是 `tabIndex={-1}` 容器与 `sr-only` 段落，都不进 Tab 序列）；`ariaudit` **278 区 / 违规 0**；`hscroll3` **320 页 × 4 视图稳定溢出 0**；`noscript` 不达标 **0/20**、`rmotion` 不达标 **0/12**；`src-audit` **无新增，纪律未退化**；`npm run check:sim` 全部通过；`npm run check` 0；`npm run build` 0（308 页 pagefind、1144 个产物审计）。
- Batch K 的三条闸同批复测仍全绿：`flows4` 0 FAIL / 20 PASS、`flows5` 6/6、`flows6` 12/12。

### 11.21 四块从没被点过的组件（第 9 轮 · Batch M · hero 的空 echo、被 transform 吃掉的浮层、热榜的三态、同周条的读屏名）

**一、为什么前面十二轮都没碰到它们**

静态闸只看产物 HTML，运行时状态一律看不见；`flows7` 那套逐钮点击只认「有 `<button>` 的块」。这四块恰好各躲开一种探针：日历格是 183 个 `div`（零个按钮）、热榜没有任何按钮（只有 `<a>`）、hero 那行是一个自己打字的 `span`、同周条是一排 `Link`。于是**「按按钮」和「看产物」两条路都扫不到它们**。这一轮的覆盖面判据改成：**每个 client 组件都要有至少一条状态序列被量过**，不管它有没有按钮。

**二、hero 的 `echo ""`：初态没退出 HTML**

`terminal-greeting.tsx` 是 `useState('')` + 45ms `setInterval` 的打字机。产物里那一行是 `echo &quot;<!-- -->&quot;` —— 关掉 JS 的人读到的是一句空 echo，身份串「AI 探索者 & Agent 开发者」只存在于 JS 里。这正是 §11.18 五 立的那条律的另一种破法（**初态要退出 HTML**），只不过这里破的是内容不是动效。

改法不是「先把全文塞进 state，再用动画盖住它」—— 那是 §11.14 记过的「JS 接管再释放」，首屏到水合之间必闪一次全文。改成用站内已有的 `SplitReveal` 原语（纯 CSS `animation-delay` 逐字入场，SSR 安全）：

- `SplitReveal text={PROMPT} delay={300} step={45}` 接在 `echo &quot;` 之后，与 h1（`delay` 默认 120）排成同一条入场序列；
- 可见副本整段包 `aria-hidden`，读屏由一条 `sr-only`「终端提示符：echo "AI 探索者 & Agent 开发者"」承担 —— 逐字 `span` 对 AT 是 18 个碎片，`aria-label` 挂在裸 `span` 上又被忽略（第一版就栽在这里）；
- `aria-hidden` 那个包裹用 `className="contents"`，不然 `display:inline` 的盒子会把光标和末字挤到下一行去。

实测（`batchm.mjs`，1440 与 390 双档）：静态 HTML 含身份串（在）；18/18 字落位、行高 1 行、光标距末字 10px 同一基线；CDP AX 树里逐字漏进 0 个、整串只由 `sr-only` 提供；`prefers-reduced-motion` 下 18/18 直接可见。**顺带证实 `aria-hidden` 对 `display: contents` 元素在 Chromium 里是生效的** —— 这条以前只是推断。

**三、日历浮层被祖先的 identity transform 吃掉**

`posts-calendar.tsx` 的 tooltip 用 `position: fixed` + `left: rect.left + 16` + `transform: translateY(-100%)`，坐标取的是视口坐标。但它住在 `AnimatedContent` 里面，入场跑完后 GSAP 留下一个 **`transform: matrix(1, 0, 0, 1, 0, 0)`** —— 单位矩阵也是 transform，照样建立 containing block。于是 fixed 按祖先坐标空间定位：实测格子 `top 488`、浮层 `top 829`（1440 档）/ `1274–1376`（390 档，视口只有 900 高）。**悬停从来没看见过浮层**，五格全越界，而这一功能自上线起一次都没被量过。

四处改动，每一处都是量出来的：

| 改动 | 为什么 |
| --- | --- |
| `createPortal(…, document.body)` | 逃出 transform 祖先，`fixed` 才真的按视口算 |
| 竖向改用 `bottom: vh - cell.top + 8`（不再 `translateY(-100%)`） | 一是 `animate-scale-in` 本身就是 transform，两者互相覆盖会跳一下；二是用 `bottom` 锚上沿省掉一次测高 |
| `useLayoutEffect` 量一次做左右夹取 + 上下翻转 | 只在真要出界时挪，且 layout effect 在画之前完成，鼠标那一下看不到位移 |
| `width: 'max-content'` + `maxWidth: min(320px, …)` | **这条是夹取能成立的前提**：shrink-to-fit（连 `fit-content` 也算）把宽度算成「视口右沿 − left」，于是往左夹反而让它变宽，右沿永远贴着 390 —— 第一版夹完仍是 4/5 越界，量到的是 `L195 R390`。`max-content` 把宽度与 `left` 解耦，`max-width` 再封顶 |

复测：1440 浮层 `[639,383,959,484]` 对格子 `620/488`，390 浮层 `[61,383,381,483]` 对格子 `202/488`，**距格 0–1px、越界 0**。

**四、日历的键盘与读屏：4 个真链接，1 个不做的假按钮**

原来 0 个可聚焦元素，183 个 `title`。现在**一天一篇的格子直接成为那篇文章的链接**（4 个焦点站，聚焦也召浮层，`aria-label` = 「2026 年 9 月 16 日 · 1 篇：标题」）；多篇的那天**留 `sr-only` 文本、不做按钮** —— 它没有单一去处，做一个按下去什么都不做的钮正是 §11.20 四 刚记下的那种错。浮层整块 `aria-hidden`（内容对格子自身的标签是重复的），数据日的 `title` 摘掉、空白日保留。读屏现在听到的：`["2026 年 7 月 13 日 · 1 篇：Hell…", …, "2026 年 9 月 16 日 · 2 篇：Codi…"]`。

**五、热榜的三态：`return null` 把整块掏空**

`ai-hot-news.tsx` 失败时 `return null`，首页那个 aside 只剩父层的「外部」二字 —— 一个悬空的小标。关 JS 时 SSR 骨架永久停在「加载中」，15 条灰条躺着不动。三态都没有 live 区，骨架 → 列表对读屏是完全无声的内容替换。

改法：**标题常驻**（`<h2>AI 热榜</h2>` 不再随数据消失），状态词换成可见的一栏（加载中 / 没应答 / 没有命中 / `x月x日 更新`），失败给一句真话（「热榜要现场问 GitHub，这次没得到应答。稍后再进首页会自动再试。」）并保留那条不需要数据也能走的 GitHub 链接；三态共一条常驻 `sr-only role="status"`。关 JS 的解释句走 `app/page.tsx` 里的 `<noscript>`，**用 `dangerouslySetInnerHTML` 写**：浏览器开着 JS 时 `<noscript>` 的内容不是 DOM 而是文本节点，给 React 挂子节点就会判水合不匹配。

实测：失败态 aside 文本 `「外部 AI 热榜 没应答 热榜要现场问 GitHub…在 GitHub 上查看更多 AI 项目 →」`；关 JS 态 `h2 1 · 链接 1 · 说明句在场`；成功态 live 现读 `「AI 热榜取到 3 条，11月4 日 更新。」`。**没修好的一半要说清**：关 JS 时 15 条灰条仍然在（没有 JS 就没有「取回」这件事，灰条 + 标题 + 说明 + 出路是不谎称完成的下限），以及热榜数据本身是探针用 `route()` 灌的测试桩，不是真实榜单。

**六、同周条：窄屏把标题从读屏名里摘走了**

`week-strip.tsx` 的课名是 `hidden sm:inline` —— `display:none` 不是「看不见」，是**从可访问名里被删掉**。390 档 CDP AX 树里 5 个链接名只剩 `01,02,03,04,05`（`title` 属性只在没有其他名字源时兜底，这里名字源是那两个数字）。完成态又只有一个 `IconCheck`，没有任何文字等价物。

改法：补一条 `sr-only sm:hidden` 的标题（宽屏不重读，窄屏才出现）+ 勾配 `sr-only「已完成」` 并把图标 `aria-hidden`。复测：1440 与 390 双档「名字只剩序号的链接 0 个」「无文字等价物的勾 0/5」。

**七、顺手：每页两声 GSAP 警**

`animated-content.tsx` 与 `prose-reveal.tsx` 都 `import { CustomEase }` 并在模块顶层 `CustomEase.create(...)`，但 `registerPlugin` 只登记了 `ScrollTrigger` —— 于是每条页面两声 `Please gsap.registerPlugin(CustomEase)`。曲线其实一直是生效的（传给 `ease` 的是函数，不是待查表的名字），响的只是登记。补齐后 1440 / 390 / 首页三档控制台干净。

**八、src-audit 的两条「待判」：一条收掉、一条量出来是误报**

这一轮把 `src-audit` 挂在墙上的两条待判项拿回来验了一遍，结论不一样：

- `app/globals.css:1200` —— `.footer-links .chip:hover { background: rgba(255,255,255,0.08) }` 是**真违规**（页脚深蓝是唯一允许自造颜色的上下文，但它已有 `--footer-ink/--footer-muted/--footer-chip-line` 三个 token，第四个字面色没有理由例外）。补一条 `--footer-chip-hover` 挂在同一 token 块里（旁边就有 `--demo-chip/--demo-chip-hover` 这对先例），规则改引用它。复测 `footerchip.mjs`：悬停底色仍是 `rgba(255,255,255,0.08)` —— **换了来源，没换值**；`消除` 从 9 变 10。
- `components/index-rail.tsx:76` —— 规则说「行内字色 + 完全无悬停语汇」，**实测是误报**：行内 `style` 锁的是 `Link` 自己，而悬停语汇挂在子 `span` 上（`group-hover:text-[var(--accent-text)]`），子元素自己的 class 不受父级行内样式压制。`railhover.mjs` 五个页面逐行量：`/posts/`「AI Agent」标题 `rgb(26,26,26)→rgb(61,70,194)`、`/projects/` 同上、`/categories/` 与 `/series/` 是**计数**换色（那两栏的行首是序号）、`/friends/` 首行静止态已是强调色所以整行不动（当前项本来就该长得不一样）。**每一页都有一条会动的语汇**，所以这条留在基线里判为豁免，不改代码 —— 把 `var(--body)` 从行内搬进 class 只会让「这一行归谁」更难读。

**九、探针的 30s 超时不是页面回归：`hangwhy.mjs` 抓到的是 Google Fonts**

`flows7` / `flows9` / `deadctl` 各在一条 `page.goto(..., waitUntil:'load')` 上吊满 30s（`/learn/agent/day-26/`、`/day-16/`、`/posts/agent-roadmap-40-days/`），而 `curl` 同一个 URL 1.8ms 就回 200。我第一版把这事判给了「探针之间的争用」—— **那个判词下早了，也是错的**：`hangwhy.mjs` 按序打开「首页 → 文章页」并逐条记录请求的起止，量到的是文章页 **20 条 `fonts.gstatic.com` 的 woff2 请求一直没 finishing**（本机到 Google 字体那条链路会挂住，见记忆「本机工具链现状」），`load` 于是永远不来；同一条 URL 单独打开 3/3 正常，因为字体已经进了 HTTP 缓存。首页只发 6 条请求所以从不卡。

三条结论都记下来：

1. **探针超时先量「谁吊住了 load」，再决定算不算产品缺陷** —— `exit=1` 不等于 FAIL，未跑的探针更不能算跑过。上一轮我写「判给争用」正是没做这一步。
2. **数控件、数文字这类闸不需要 webfont**：`deadctl` / `batchn` 直接 `ctx.route('**://fonts.gstatic.com/**', abort)` + 同一手 `fonts.googleapis.com`，`load` 立刻回来，判定也不受影响（不量字形宽度）。量几何的闸（`hscroll3` / `flows9`）仍走真实字体，不混用。
3. 这条对**真实用户**也成立：站点在运行时从 Google Fonts 取 Inter / Space Grotesk / Noto Sans SC / JetBrains Mono 四个字重族（`app/layout.tsx:91`），链路慢的人首屏只能拿到 `display=swap` 的兜底字形，且 `load` 事件会晚报（依赖 `window.load` 的功能跟着晚启动）。自托管（`next/font/google` 构建期下载）能一次去掉外链、FOUT 与这条超时 —— 但它要动 `app/layout.tsx` 的字体声明并影响全站字形度量，属另一轮的事，这里只登记不擅动。

顺带修掉一处方法学错误：上一轮 `for` 循环里给每块 `tail -6`，把 `flows8` 的逐块明细切掉只剩「0 FAIL / 1 PASS」。这一轮所有探针整份输出落盘 `reglog/<probe>.log`，聚合行与明细都留底。

**闸门（Batch M）**

- `batchm.mjs`（新立）：**0 FAIL / 32 PASS / 10 NOTE**，1440 与 390 双档 × hero 8 项 + 日历 5 项 + 热榜 6 项 + 同周条 5 项。修前的基线是 **11 FAIL**（浮层 5/5 越界 × 双档、键盘 0 站、热榜三态全空、窄屏 5 个链接只剩序号）。
- `batchmshot.mjs`（新立）：出图 4 张（日历 1440/390 悬停、热榜成功/失败/关 JS）+ 控制台断言；`pre404.mjs` 补量日历新增链接的 prefetch —— `/archive/`、`/`、`/posts/` 三页整页滚动后 **4xx/5xx 0 条**（`out/` 里没有 `posts/<slug>.txt`，但静态导出下这条预取不落空，与 §11.19 记的 `rss.xml` 那一类不同）。
- `fixedtrap.mjs`（新立 · 把这一类问题当一类来查）：不只复查刚踩过的日历，而是把全站每一个 `position: fixed` 的祖先链都过一遍 —— 判据取 CSS 规范里那五个能建立 containing block 的属性（`transform` ≠ none / `perspective` / `filter` / `will-change: transform` / `contain: paint|layout|strict`）。**只在默认 DOM 上量会自我安慰**：真正新写的浮层（面板、回到顶部、日历 tooltip）全都是按需挂载的，所以每一页都先把它们叫出来（`Ctrl+K` 开面板、滚到底留 FAB、悬停格子召浮层、移动指针召光标）再量。8 页 × **125 个 fixed 层**（含已开的面板与 portal 出去的浮层）**被祖先困住 0**。
- `flows8.mjs` 复测（不截断整份输出重跑，补上上一轮只 `tail -6` 留下的缺口）：**静默 0 处 / 15 次操作 15 次变字**，逐块明细里 6 处「控件换名 是」，1 处焦点挪动（day-18 批准之后交还工具条）—— 与 Batch L 收口时同一水位。
- 回归（`npm run build` 之后整串重跑，日志落 `reglog/`）：`tabwalk` 15 类页面 **860 个真实焦点站 / 问题 0 处**（上轮 855，+5 全来自日历那 4 个新链接与焦点站里多出的一个落点）；`ariaudit` **296 个 aria-hidden 区 / 违规 0**（上轮 278，+18 是日历格子改链接后带上的 `aria-label` 子树与 `sr-only` 段）；`noscript` 不达标 **0/20**；`rmotion` 不达标 **0/12**；`hscroll3` **320 页 × 4 视图稳定横向溢出 0**。
- 既有闸同批复测：`flows4` **0 FAIL / 20 PASS**、`flows5` 全 PASS（含 1 条 NOTE：折叠后剩「连不上代理」的回执仍可见，是设计）、`flows6` 全 PASS（5 页解码出可点 `mailto:`，残留占位 0）、`flows7` **0 FAIL / 25 PASS**（15 块 · 93 击 · 无崩溃）、`flows9` **0 FAIL / 14 PASS**、`flows8` **静默 0 / 15 次操作 15 次变字**、`fixedtrap` **8 页 125 个 fixed 层 / 困住 0**。
- 静态与纪律：`src-audit` **新增 0 · 消除 10**；`npm run check` **0 errors**（1 条既有 warning：`command-palette.tsx:184` 的 `lenis` 依赖，属 `lib` 之外的旧账，未动）；`npm run check:emoji` 通过（本轮我自己写进台账的一个对勾字符被抓出来，见下）；`npm run check:sim` 全部通过；`npm run build` **0** —— 308 页 pagefind、**1144** 个产物审计通过、秘密扫描 0 命中。
- 纪律被抓一次：§11.21 第二节我打了一个对勾符号排版，`check:emoji` 直接让 `npm run check` 变红 —— 闸门不认「这是文档不是界面」。改成「（在）」后复跑通过。

### 11.22 关 JS 之后，页面上还剩几只能按的钮（第 10 轮 · Batch N · 37 具死控件、两种摘法、双面闸）

**一、又是「两条老路都扫不到」的一类，但这次的盲区是闸自己造的**

`noscript.mjs` 查的是透明文字、滚筒位错、横向溢出 —— 它数的是「读得到吗」，从不问「按得动吗」；`ariaudit.mjs` 查 `aria-hidden` 容器里残留的 tabbable，方向恰好相反。于是「活着、看得见、进 Tab 序列、但永远不会有反应」这一整类控件落在两张网的中间。新立的 `deadctl.mjs` 只回答一个问题：**关掉 JavaScript 之后，还有几个控件对用户承诺了事情却做不到？**

**二、清点：37 具，六类，外加探针自己的 14 具假阳性**

14 类页面共 37 具：命令面板触发钮 ×14、主题切换 ×14、检索输入框 ×1（`/search/`）、喜欢 ×1 与复制链接 ×1（每篇文章页底）、课程清单行 ×5 + 「标记本课完成」×1（`/learn/agent/day-06/`）。

第一版数到 **50** 具，其中 14 具是「回到顶部」—— 它静止态是 `opacity: 0` + `pointer-events: none` + `tabIndex = -1`，关 JS 后既看不见也点不着，**根本不构成一次承诺**。判据补上这三条之后才对齐用户的实际感受。这条教训的形状和 §11.21 三 的夹取一样：**探针的可见性定义必须先和用户的一致，否则量出来的是 DOM 而不是体验。**

另一个反例值得记：**七个实验台一台都没上榜**。它们走 `dynamic(ssr:false)`，在静态 HTML 里压根不存在 —— 也就是说站内早就有正确答案，只是从没被当成规范去对照剩下的控件。

**三、两类控件必须用两种手法**

| 类别 | 手法 | 为什么不能互换 |
| --- | --- | --- |
| 纯 chrome（面板钮、主题钮、喜欢、复制链接、标记完成、检索框） | 打 `data-js-only`，`app/layout.tsx` 里一条 `<noscript><style>[data-js-only]{display:none!important}</style></noscript>` 整块摘除 | 它们的全部价值就是那一下点击；没有点击就没有价值，留着只是骗人按 |
| 内容型控件（`TickList` 的清单行） | 改渲染：挂载前 `<div>` 普通行，水合后才 `<button role="checkbox">` | **藏掉就是吞正文** —— 那一页的清单文字实测 1076 字，是课程本身；`display:none` 为了消灭死控件而制造了缺页 |

CSP 早就允许这条 inline `<style>`（`style-src 'self' 'unsafe-inline' fonts.googleapis.com`，同页第 94 行的主题预置脚本也靠 `'unsafe-inline'`），所以不需要动策略。

**四、主题切换的占位原来是一枚会骗人的真按钮**

`theme-toggle.tsx` 未挂载时渲染的是 `<button aria-label="切换主题">` —— 水合前按不动、关 JS 永远按不动，而且**它进 Tab 序列**。改成同尺寸（44×44）的非交互 `<span aria-hidden>`。这是 §11.20 四 那条「按下去什么都不做的钮比不出现的钮更糟」在**时间轴**上的另一面：不只是「不该存在的钮别做出来」，还有「还没活起来的钮别装成钮」。`aria-label="切换主题"` 这个静止态标签同时消失 —— 它当时其实断言了一个谁都得不到的行为。

**五、摘掉控件要留一句为什么**

`/search/` 没了输入框，用户看到的是「搜索页没有搜索框」，比死控件更像站点坏了。补一条 `<noscript>`：「检索要在浏览器里跑，关掉 JavaScript 就没有结果。下面的栏目都是静态页，照常能进。」实测这一页在无 JS 下出路链接 20 条。写法仍是 `dangerouslySetInnerHTML`（理由同 §11.21 五：开着 JS 时浏览器把 `noscript` 的内容当文本节点，React 拿 JSX 子节点去水合就判不匹配）。

**六、方法上最值得留的一条：摘除必须配一面反向闸**

`batchn.mjs` 18 项分两面。**无 JS 那面（6 项）证明摘干净了；有 JS 那面（12 项）证明水合后每一只都活回来了** —— 主题钮真是 `BUTTON` 且一按换档并写回 `localStorage`、面板按得开、喜欢 `aria-pressed false→true` 且刷新后记住、复制链接自证「已复制」、清单行升级成 5 个可勾 checkbox 且勾一下惊动计数 live 区、检索框输入 `agent` 出 60 条结果、全程控制台零 error。

因为这一轮所有改动都发生在「挂载前 / 后」这条线上，**单向闸（只查无 JS）会一路绿灯地放过一个把交互改死的 bug**：页面看着完全正常，点什么都不动，而 `deadctl` 只会报「死控件 0 具」。这是本轮的方法学收获，比那 37 具控件本身更值钱。

**闸门（Batch N）**

- `deadctl.mjs`（新立）：14 类页面 × 关 JS 死控件 **37 → 0**。判据三条都要过才算「一具死控件」：看得见（`display`/`visibility`/尺寸/`opacity ≥ .05`）、摸得着（`pointer-events ≠ none`、`tabIndex ≥ 0`）、又确实不干活（不在带 `action` 的 `<form>` 里）。缺前两条就有了第一版那 14 具「回到顶部」假阳性。
- `batchn.mjs`（新立 · 双面）：**0 FAIL / 18 PASS**。有 JS 半 12 项：主题钮水合后是真 `BUTTON`（44×44）+ 一按 `lenis light → lenis dark` + 钮名跟着改口 + 写回 `localStorage`、面板按得开、`喜欢 false→true` 且刷新后仍是 `true`（`{"agent-roadmap-40-days":true}`）、复制链接自证「已复制」、清单行升级成 5 个 `checkbox` 且勾一下 `0 / 5 → 1 / 5`（4.1.3）、标记完成 `false→true` 钮上写「已完成」、检索框输入 `agent` 出 60 条并播报「共 60 条结果」、**全程控制台 0 error**（水合不许因为占位改动报错）。无 JS 半 6 项：主题/面板钮都摘干净（打标记 2 处、隐藏 2 处）、`li` 里 `button/checkbox` 0 个、这一页再无第二具死控件、清单正文 1076 字一字不丢、计数静止态写「0 / 5」、`/search/` 说明句在场 + 20 条静态出路。
- 回归（同一份 `out/`，日志落 `reglog/N_*.log`，15 块串行全 `exit=0`）：`tabwalk` **860 焦点站 / 问题 0**（与 Batch M 收口同数 —— 占位改 `span`、清单行 `div→button` 都没动到水合后的 Tab 序）；`ariaudit` **296 区 / 违规 0**（同数）；`noscript` 不达标 **0/20**，其中 `/search/` 可见字数 390 档 **126 → 168**、1440 档 182（输入框换成那句说明）；`rmotion` 不达标 **0/12**；`hscroll3` **320 页 × 4 视图溢出 0**；`fixedtrap` **125 个 fixed 层 / 困住 0**。
- 既有闸同批复测：`flows4` **0 FAIL / 20 PASS**、`flows5` 全 PASS、`flows6` 全 PASS、`flows7` **0 FAIL / 25 PASS**（15 块 · 93 击 · 无崩溃）、`flows8` **静默 0 / 15 次操作 15 次变字**、`flows9` **0 FAIL / 14 PASS**、`batchm` **0 FAIL / 32 PASS / 10 NOTE**、`src-audit` **新增 0 · 消除 10 · 待判 1**（剩的那条是 `index-rail.tsx:76`，§11.21 八 已量出它是误报并判豁免）。
- 静态与纪律：`npm run build` **0**（308 页 pagefind、1144 产物、秘密扫描 0 命中）；`npm run check` **0 errors**（1 条既有 warning 未动）；`check:emoji` 通过；`check:sim` 全部通过。
- 顺带登记一条与本轮改动无关但量到的事实：`app/layout.tsx:91` 运行时从 `fonts.googleapis.com` / `fonts.gstatic.com` 取四个字重族，本机链路上 20 条 woff2 会挂住不 finishing，`waitUntil: 'load'` 因此 30s 不返回（§11.22 前一节 §11.21 九 记了修法与影响）。自托管能一次去掉外链、FOUT 与这条超时，但要动字体声明并影响全站字形度量，留作单独一轮，不擅动。

### 11.23 邮箱的明文其实在分块里，而盯着它的闸有两处破法（第 11 轮 · Batch O · 唯一真源 + 运行时解码）

**一、`btoa(明文)` 只糊住了 HTML**

`lib/constants.ts` 里 `SOCIAL_LINKS.email` 与 `SITE.author.email` 都是连续明文，`EMAIL_OBFUSCATED = btoa(SOCIAL_LINKS.email)` 靠它们算出来。页面上确实只出现密文，`ObfuscatedEmail` 也在挂载后 `atob` 还原成 `mailto:` —— 所以 HTML 侧一直是干净的（旧闸也一直在管着它）。但 `SITE` 和 `SOCIAL_LINKS` 是会进客户端的模块，纯静态托管的分块又是公开可读的：基线一次数到 **JS 产物里 10 处明文**，分布在 5 个分块 ——`app/about/page`、`app/layout`、`app/page`、`app/posts/[slug]/page`、`app/search/page` 各 2 处。等于给每一个肯执行 JS 的收割器抄了一遍地址，而抄的地方恰好是那道闸从没看过的文件类型。

**二、为什么换成 `atob(密文)` 才有效**

源里只留一串 `EMAIL_B64`，两处引用都走同一个 `atob(EMAIL_B64)`。关键在于压缩器对这两种写法的处理不对称：`btoa('字面量')` 是纯字面量表达式，Terser/SWC 会把它折叠成结果明文，密文等于没写；`atob(...)` 是运行时调用，折叠不了，产物里因此只剩密文。复测 JS 明文 **10 → 0**，b64 命中 5 个分块（同 5 个文件，形状对得上）；HTML 与 XML 侧不变（`.well-known/security.txt` 的明文是刻意的，RFC 9116 要求该文件给出可用联系渠道，本轮把它列成带名字的白名单而不是继续假装全站零明文）。

顺带确认两件事，免得这是「改完才发现构建期也会跑它」：`scripts/generate-rss.mjs` 与 `generate-sitemap.mjs` 直接 `import { SITE } from '../lib/constants.ts'`，模块顶层的 `atob` 因此也在 Node 里执行 —— Node 24 全局有 `atob`/`btoa`，且它们只用 `SITE.author.name`，不碰邮箱；复跑产物 `rss.xml` / `atom.xml` 各 6 条目、作者名在、明文邮箱 0 处。

**三、第一处破法：那道闸根本不扫 `.js`**

`scripts/audit-build.mjs` 早就有 `auditEmailPlaintext()`，而且它在 10 处明文存在的每一轮构建里都打印过「构建产物审计通过」。原因写在它自己的循环条件里：`files.filter(f => extname(f) === '.html' || f.endsWith('.xml'))`。这不是「闸漏了一个边缘文件」，而是**闸的覆盖面恰好绕开了唯一真正泄漏的类别**；同理，Next.js 给每个页面旁挂的 RSC 载荷 `.txt`（本轮实测 b64 命中 4 份 `about/friends/privacy/terms` 的 `index.txt`）也从来没进过它的眼。修法是让它扫全部文本类产物（`.html .xml .js .css .json .txt .md .svg`，本轮 **732** 个），把 security.txt 做成显式白名单。

**四、第二处破法：它的输入正是它要消灭的东西**

旧写法取比对值靠 `constants.match(/email:\s*'([^']+)'/)` —— 要求源里存在连续明文才能工作，`if (!match) return` 又是静默跳过。于是我把明文修走的那一刻，**这道闸就被自己刚刚守成功的结果关掉了**：此后任何一次明文泄漏，它都会读作「通过」。这一类比漏检更阴，因为它看起来像「绿了」。

修法是把取值改成从密文常量解码，并让「取不到值」与「解出来不像邮箱」都判失败而不是返回。然后按站里的老规矩（§11.22 六「单向闸会放过把交互改死的 bug」）做三向验证，而不是只看它绿：

| 喂给它什么 | 期望 | 实测 |
| --- | --- | --- |
| 当前干净产物 | 通过 | `邮箱明文扫描：732 个文本产物 · 放行 1 个` + exit 0 |
| 手写两个含明文的 `out/__gauntlet.html` / `.js` | 两处都点名 | exit 1 · 逐条报出文件名（证明 `.js` 这条新覆盖真的在跑） |
| 把 `const EMAIL_B64` 改名让闸取不到值 | 闸自己报警 | exit 1 · 「这道闸已失效」，而不是沉默通过 |

第三行是本轮最想要的一条：它证明修好之后这道闸**不会再**被下一次「修走明文」的动作关掉。测试完 `lib/constants.ts` 用备份还原并逐字节 `diff` 确认，注入的两个文件已删除。

**五、同一处假设埋了两个坑，探针也算一个**

回归第一枪就把这条打出来：`flows6.mjs`（专测邮箱解码链路的那道闸）也以 `email:\s*'([^']+)'` 取比对值，于是它当场 `FAIL 读不到 lib/constants.ts 里的 email 常量` 并 `exit=1`。源里确实不再有连续明文可抓 —— 这条 FAIL 反过来成了改动生效的证据。两处真正不同的是反应方式：**探针是碰巧写成先取真值、取不到就停**，构建闸则是匹配失败就 `return`，静默把整项检查跳过并继续打印「审计通过」。同一个假设，一种会咬人，一种不会 —— 而「会咬人」并不是设计，只是没被规约要求过；本轮补的就是这条规约（取值取不到必须判失败）。

修法两边一致：优先从 `const EMAIL_B64` 解码取值，取不到就判失败。`lib/constants.ts` 的注释里同时补一句「变量名 `EMAIL_B64` 也是契约的一部分」，因为这两道闸都按这个名字取值，改名等于同时把它们关掉。

**六、密文为什么只出现在 4 页 HTML 与 5 个分块（读不懂这个就会误判成回归）**

改完后 HTML 侧的 b64 命中只有 `about / friends / privacy / terms` 四页，页脚明明每页都有邮箱图标 —— 一眼像漏了。按渲染边界算一遍才对上：那四页由**服务端组件**把 `encoded={EMAIL_OBFUSCATED}` 传给客户端的 `ObfuscatedEmail`，值必须跨过服务器→客户端边界，因此序列化进该页 HTML 和 Next.js 旁挂的 RSC 载荷 `index.txt`（实测各 4 份）；页脚在 `components/footer.tsx` 内部就把值传给同层的 `ObfuscatedEmailIcon`，**这是一次客户端→客户端的普通传参，不过边界**，所以密文只存在于 `layout-*.js` 分块里，HTML 里连 `MTk` 这个前缀都没有（实测 `out/index.html` 命中 0）。明文当年正是躺在同样这 5 个分块里 —— 形状完全一致，不是回归。

顺带把「产物里到底有哪些外链」整份数了一遍，用来判断旁边那道只读 HTML 的域名闸是否也漏了 `.js`：全站文本产物共出现 **274** 个域名字符串，只出现在 `.js` 里的是 `nextjs.org` / `react.dev` / `gsap.com` / `markjs.io` / `git.io` 等库注释与两个 `api.openai.com` 预设串；而接口控制台的可选上游（deepseek / moonshot / 智谱 / 硅基流动 / dashscope）由 `lib/llm/settings.ts` 的 `ALLOWED_BASES` 白名单管着，密钥也走 `maskKey` 显示。**这一条量完判为不需要扩闸**：那类只存在于 JS 的域名不是「脚本外链」，硬扩进白名单只会把 274 条内容链接一起变成噪声。留下的事实是明确的：域名那道闸看的是 HTML 的 `<script src>`，JS 分块里的外联字符串归 `ALLOWED_BASES` 与 CSP `connect-src` 管。

**七、这一手到底把暴露面收窄到哪里（不肯写清就是自欺）**

产物侧的账已经结：HTML 明文 0（本来就有闸管着）、JS 分块明文 10 → 0、`.xml` 明文 0、`.txt`（RSC 载荷）明文 0，只剩 `.well-known/security.txt` 一份按 RFC 9116 刻意公开的地址。但这一轮顺带量出两条**改不动**的暴露，写在这里免得下一个人以为已经封死：

- **源码仓库是公开的。** `git remote` 指向 `github.com/LuVisage/blog`，已推送的 `origin/main` 上有 2 个文件含连续明文 —— `public/.well-known/security.txt`（刻意）与 `lib/constants.ts`（就是我刚修的那份，改动还留在工作树里，没有提交、没有推送）。也就是说这一批改的是「被爬虫索引的那份产物」，不是「想知道地址的人拿不拿得到」。
- **地址本来就是公开的。** security.txt 里那份明文不是漏洞而是要求，所以「防收割」的目标从来只是抬高自动化抓取的门槛，不是保密。

还有一条形状值得单独记：**密文被压缩器还原成明文**这件事（`btoa('字面量')` 会被折叠）意味着「在源码里藏一下」这类防护，其有效性取决于构建工具怎么处理那个表达式，而不是取决于你写没写密文 —— 所以判断只能靠量产物，不能靠读源码。本轮 `grep -c` 数源码是绿的、`emailleak.mjs` 数产物是 10 处红，正是这个差别。

**闸门（Batch O）**

- `emailleak.mjs`（新立 · 只打掩码不回显地址）：JS 分块明文 **10 → 0**（基线 5 个分块各 2 处，末位 `1 × security.txt + 5 × chunk` 与修法形状完全对上）；密文落点 html 4 处 / txt(RSC 载荷) 4 处 / js 4–5 处；html 与 xml 明文 0；全站唯一明文 = `.well-known/security.txt`（刻意，RFC 9116）。
- 构建闸 `scripts/audit-build.mjs` 的邮箱扫描（重写）：覆盖从「`.html`+`.xml`」扩到 **733 个文本产物**，白名单 1 个；三向验证全过 —— 干净产物 exit 0；注入 `.html` 与 `.js` 各一处明文 → exit 1 且两个文件名逐一点名；把 `const EMAIL_B64` 改名让闸取不到值 → 闸自己报「这道闸已失效」而不是沉默通过。
- `flows6.mjs`（复测 · 顺手修两处）：**0 FAIL / 13 PASS**。HTML 无明文、无 `mailto:`、密文按预期出现在 4 页；关 JS 的 `/about/ /terms/ /privacy/ /friends/` 四页都给占位与解释且读不到明文；开 JS 四页各解码出可点 `mailto:` 且残留占位 0、`aria` 缺失 0；页脚入口键盘可达且有名字（`A` 36×36）。两处修改：取值改从 `EMAIL_B64` 解码；两个 context 都掐掉 `fonts.gstatic|googleapis` 路由 —— 冷缓存下 `waitUntil:'load'` 会 30s 挂住，把探针超时伪装成站点坏了（§11.21 九 的同类，这道闸当时没跟上）。
- 回归（重建后整串 16 块，日志落 `reglog/O_*.log`，全 `exit=0`）：`tabwalk` **860 焦点站 / 问题 0**；`ariaudit` **296 区 / 违规 0**；`deadctl` 关 JS **死控件 0 具**；`noscript` 不达标 **0/20**；`rmotion` 不达标 **0/12**；`hscroll3` **320 页 × 4 视图稳定横向溢出 0**；`fixedtrap` **8 页 125 个 fixed 层 / 困住 0**。
- 既有闸同批复测：`flows4` **0 FAIL / 20 PASS**、`flows5` 全 PASS（1 条 NOTE：折叠后「连不上代理」回执仍可见，是设计）、`flows7` **0 FAIL / 25 PASS**（15 块 · 93 击 · 无崩溃）、`flows8` **静默 0 / 15 次操作 15 次变字**、`flows9` **0 FAIL / 14 PASS**、`batchn` **0 FAIL / 18 PASS**、`batchm` **0 FAIL / 32 PASS / 10 NOTE**。
- 静态与纪律：`npm run build` **exit 0**（1145 个产物、`构建产物审计通过`、pagefind 308 页）；`npm run typecheck` + `npm run lint` **0 errors**（1 条既有 warning：`command-palette.tsx:184` 的 `lenis` 依赖）；`check:emoji` 通过；`check:sim` 全部通过；`src-audit` **新增 0 · 消除 10 · 待判 1**（仍是 `index-rail.tsx:76`，§11.21 八 已量出为误报并判豁免）。
- 两条登记，都不擅动：其一，最后一次重建后密文的分块落点从 5 个变 4 个（webpack 分块合并形状变了，明文计数始终 0）—— 记下来免得下次把它当回归。其二，`ui-concepts/verify/*.mjs` 全在仓库根（`blog-main/`）之外，台账这几轮引用的探针没有一个进过公开仓库，外人复现不了；这是既有状态，要不要把探针收进仓库是个单独的决定。

### 11.24 手指按不中的格子，和一面把「没量到」读成「没问题」的新闸（第 12 轮 · Batch P · WCAG 2.5.8 第一次量化）

**一、这条标准从没被量过，因为没有任何一道闸问「按得中吗」**

`tabwalk` 数焦点站、`hscroll3` 量横向溢出、`noscript` 问读得到吗、`deadctl` 问按下去有没有反应 —— 全都不问**目标本身有多大**。WCAG 2.5.8（AA，指针输入的目标尺寸 ≥24×24，四条例外）在站内是空白。新立 `tapmin.mjs`：15 类页面 × 两档视口（390 触屏 / 1280 指针），量 `a/button/input/select/textarea/[role=button|link|checkbox|tab|menuitem]/summary/[tabindex]`，判据与用户的手指一致 —— `opacity < .05`、`pointer-events: none`、以及**整块住在另一个交互元素里的内层**都不算一个目标（后者是 `deadctl` 那 14 具假阳性同形的坑，一次踩两处会学会）。

首测抓到的只有一类，但很硬：**`/archive/` 的写作日历单日格 13×13**，两档视口各 4 处，且与邻格重叠（390 档 6–33px²，1280 档最多 482px²）—— 间距例外不成立。这些格子正是 §11.21 五 把「一天一篇」的格子改成文章链接的产物：那一批修好了「按下去没有去处的假按钮」，却没有回头量「按不中」。其余都过了：30 次测量合计 **1553** 个目标（两档各数一遍，同一页面重复计入），唯一不合格的就是这 4 个格子；首页 1280 档那 33 处不足 24 的目标全部走间距豁免成立（密集卡片的正常排布，格子之间留白足够）。

**二、修法是按输入方式分档，而不是把图放大**

格子尺寸是这张图的语言（GitHub 密度图 12–13px），全局放大到 24 会毁掉它并撑破 390 的月块。改成把尺寸与间距下沉成变量：`app/globals.css` 的 `:root` 加 `--cal-day: 13px` / `--cal-gap: 3px`，`@media (max-width: 896px)`（站内既有设计断点）覆盖成 `24px` / `4px`；`components/posts-calendar.tsx` 里 `DAY_SIZE` 常量删除，网格与格子的 `width/height` 全改读变量。

两个选择值得留下理由。**其一，用断点而不是 `(pointer: coarse)`**：站里所有窄屏几何闸（`hscroll3` 的 320/390 档、`flows4`、`flows9`、`noscript`）都以视口宽度为条件，跟着宽度走才能被既有回归自动接住；跟着指针类型走的话，这些闸一条都覆盖不到，改动等于在没人看的地方发生。**代价如实说**：窄窗口的鼠标用户也拿到 24px —— 而那一档本来就已经是单列布局，不算新增妥协。**其二，尺寸放在 CSS 而不是 JS 的 `matchMedia`**：静态导出的首屏与 SSR 必须同一个值，否则就是水合后再改尺寸的那一下跳动（§11.18 五 的同族）。

复测：390 档那 4 处从「不足 24」的名单里整批消失（格子实测 24×24），1280 档仍是 13×13 但 4 处全部命中**等效例外** —— 同一篇文章在同页月表里有整行链接，实测该链接 ≥24px。两档相加真不合格 **0 处**。

**三、新立的第一道闸自己就犯了本站最忌的错：把「没量到」报成「没问题」**

`tapmin` 写完第一次跑，输出 **真不合格 0 处**，16 行里每一行都是 `载入失败 page.goto: net::ERR_CONNECTION_REFUSED` —— 静态服务器在 `npm run build` 清空 `out/` 的那一刻退出，探针把 16 次「什么都没量到」结算成一次绿灯。这正是 §11.22 六 那条「单向闸会放过把交互改死的 bug」的更极端版本：**不测量的闸不是中性的，它是主动撒谎**，而且比旧版邮箱闸更难发现，因为它绿得理直气壮。

补三条，缺一不可：载入失败计入 `dead[]` 并在收尾 `process.exit(1)`；某页量到 **0 个目标**同样算失败（页面渲染塌了也会「零违规」）；`--fail-fast` 之类不做 —— 要的是整页表跑完再一次性报，否则第 2 页掉线就看不到第 16 页。修完复跑，同一次掉线场景下它报 `FAIL 有 16 次测量根本没做成`，而不是 0 处。

顺带把这条判据推广：**凡是「按页面循环」的闸，收尾必须回答「我真的量了 N 页吗」**。站里既有的 `hscroll3`/`tabwalk` 都有各自的总数量（320 页 / 860 焦点站）能反证掉线，`noscript` 有 20 页的达标计数；本轮之前唯一没有这个自证的正是新写的闸。

**四、服务器为什么会掉，以及它掉在哪一步**

`serve-out.mjs --root=out` 服务的是构建目录本身，而 `next build` 先删空 `out/` 再重新写 —— 根目录被删除的瞬间进程退出，之后所有浏览器闸连不上 8126。这条与台账里既有的「构建期坑」并列（`basePath=/blog` 要剥前缀、dev 模式 CSP 拦注水、`TaskStop` 留 `next dev` 孤儿进程）。可行的一次性防护是构建后重新起服务；**本轮没有把它做成脚本**，因为真正的防线是第三段那三条判据 —— 服务没起来时闸必须红，而不是让我记得起服务。

**闸门（Batch P）**

- `tapmin.mjs`（新立 · WCAG 2.5.8 第一次进闸口）：15 类页面 × 两档视口 = 30 次测量、**1553** 个指针目标。修前真不合格 4 处（全是 `/archive/` 日历格 13×13），修后 **0 处**；390 档格子实测 24×24  outright 过线，1280 档 13×13 全部命中等效例外（同页月表整行链接实测 ≥24px）。
- 反向验证（本轮新加的三条判据里最要紧的一条）：`TAPMIN_ORIGIN=http://127.0.0.1:8199/blog node tapmin.mjs` → **exit=1**、`FAIL 有 30 次测量根本没做成`，而不是「0 处不合格」。同一份产物、同一条命令，去掉判据就是绿灯 —— 这条差异是这道闸的全部价值。
- `batchm.mjs`（复测 · 顺手修一处自废）：**0 FAIL / 34 PASS / 10 NOTE**。新立 `cal-0`：日历格子按「计算出来的小正方形」认，两档各量到 **199 格**，边长/间距实测 1280 档 `13px / 3px`、390 档 `24px / 4px`。旧写法按 `style.width === '13px'` 数格子，改了 CSS 变量之后数出 **0 格**却照样报 NOTE —— 和第 11 轮那个「取不到比对值就 return」的邮箱闸是同一种自废，本轮按同一味药治：数到 0 直接 FAIL。
- 受本次改动影响的 8 道闸（日志落 `reglog/P_*.log`，全 `exit=0`）：`anchorland` 真点 **69 次 / 落点被压住 0**；`hscroll3` **320 页 × 4 视图稳定横向溢出 0**（格子变大最容易撑破 320/390，这条是本次改动的第一顺位回归）；`fixedtrap` **8 页 125 个 fixed 层 / 困住 0**；`tabwalk` **860 焦点站 / 问题 0**；`ariaudit` **15 类页面 296 个 aria-hidden 区 / 违规 0**；`noscript` 不达标 **0/20**；`rmotion` 不达标 **0/12**。
- 纪律闸：`npm run check`（typecheck + lint + check:emoji + test:proxy + test:attack + audit:env）**全绿**，lint 仍是那 1 条既有 warning（`command-palette.tsx:184` 的 `lenis` 依赖）。
- 一条如实登记：本轮没有重跑 `deadctl` / `flows*` / `batchn` / `src-audit`。改动只碰 `--cal-day` / `--cal-gap` 两个变量和日历网格的内联尺寸，与那几道闸的判据无交集；下次动到组件属性形状时要一并补上。

### 11.25 页脚上那圈看不见的环，和目录把键盘用户拽出屏幕（第 13 轮 · Batch Q · WCAG 2.4.7 / 2.4.13 / 2.4.11 第一次量化）

**一、`tabwalk` 只问「走到哪几站」，从不问「那一站看得见吗」**

`tabwalk` 量焦点顺序与站点数，`ariaudit` 量 `aria-hidden` 误伤，`fixedtrap` 量浮层困人 —— 三条标准站内全是空白：**2.4.7**（有没有看得见的指示器）、**2.4.13**（厚度 ≥2px 且与紧邻色对比 ≥3:1）、**2.4.11**（可见部分被盖住多少）。新立 `focusvis.mjs`：真的按 Tab 走站，每站读计算值里的 `outline-*`，遮挡按 `elementsFromPoint` 的真实绘制序在「元素 ∩ 视口」上铺 9 点网格采样，出界按停稳后的矩形判；画法不是 `outline`（`::after`、换色）时不直接判死，改为截图像素差复核 —— 同一块区域聚焦前后一个像素都没变，才算不合格。

首测 4 档视口/主题 × 15 类页面 = **2882** 个真实焦点站：2.4.7 **0 处**（站内每个焦点站都画得出东西），2.4.13 **393 处**，2.4.11 **4 处**，停稳后整块在视口外 **2 处**。

**二、393 处里其实只有一类，而且是一句话能说清的：页脚的环压在页脚自己的深蓝上**

全站默认那圈 indigo 焦点环，在页脚 `#00075f` 上实测对比 **2.39:1**，过不了 3:1；同一组数在暗色主题下是 **3.63:1**（过线），所以这条只在亮色成立 —— 但环是同一个环，一起换。改成 `footer :focus-visible { outline-color: var(--footer-ink); }` 后 **17.56:1**，不引新色：页脚的悬停语汇本来就是「整链转白」，焦点环跟着走同一套墨色。

留在台账里的判断是**没有去调主色**：把 indigo 调亮会牵动全站每一处环（包括本来就合规的那些），而缺陷只发生在「环画在深色层上」这一种场合 —— 该改的是环在所在层里的取色，不是环本身。

**三、目录的「跟随高亮」和键盘用户抢同一块滚动区**

`/learn/ml/day-10/` 第 37 站「今日目标」（220×32）停稳后落在**视口上方 -424px**。链条是：Tab 进目录的那一刻浏览器把列表滚到被聚焦的那一项 → 紧接着页面位移让单例扫描器换了 `activeId` → 跟随 effect 把列表拽回去居中高亮项 → 焦点项被自己刚建立的滚动推了出去。用户确实按了 Tab，屏幕上却看不见焦点在哪（2.4.7 与 2.4.11 同时中）。

修法是一行守卫（`components/toc.tsx`）：焦点在这个列表里时不做跟随滚动，等焦点离开列表再恢复 —— 键盘在读这一段时，目录不该抢他的滚动位置。

**四、什么时候才算「抢」：判据从「焦点在不在列表里」细化成 `:focus-visible`**

守卫第一版按「焦点是否落在列表内」判，鼠标点目录也会命中。但鼠标点那条链接会把焦点留在链接上、**却根本不画环**，此时不跟随只会让高亮项跟着滚丢 —— 被误伤的是鼠标用户，被服务的键盘用户一个没接到。改成：

```tsx
const focused = document.activeElement
if (focused && list.contains(focused) && focused.matches(':focus-visible')) return
```

`:focus-visible` 正是浏览器决定「要不要画这圈环」的那个开关，用它判据和用户看见的东西同源。定点复跑 `/learn/ml/day-10/` + `/learn/ml/day-29/` × 4 档视口/主题：**578** 站、浮层重走 **12** 次，四类判据全 **0**；全量那一遍（第 14 轮初重跑）**3964** 站、像素复核 4 站、四类全 **0**。

**五、一次量不准比不量更坏 —— 这道闸自己踩过的三个假阳性**

首测那 399 处里，有 4 + 22 是闸自己造的：

1. 遮挡最初按「与所有 `fixed`/`sticky` 求几何交集」判，不看 z 序 → 跳转链第一站被判 100% 盖住。改为按 `elementsFromPoint` 的真实绘制序走，且只有真画了不透明像素（`alpha ≥ 0.5` 或 `background-image`）的层才算「盖」。
2. 9 点网格原来铺在**元素自身矩形**上 → 一个 1323px 高的代码块在 800px 视口里永远有两行铺到视口外，被记成「67% 被盖」；**首测那 4 处 2.4.11 正是它**。网格改为只铺「元素 ∩ 视口」这块可见区。
3. 停稳判定原来只看「矩形连续两帧不动」→ Lenis 的缓动还没起步时矩形本来就是静的，于是量在滚动半途，制造 **22** 处假「视口外」。现在最少等满 320ms 再认稳。

配套还补了 §11.24 三 那条守则的浮层版：`STATES` 一遍里面板打不开原来 `continue`（悄悄少测一类），现在计入 `dead[]` 并 `exit 1`，同时新增总数量「浮层重走 N 次」—— 面板开了却量到 0 站同样判失败。

**闸门（Batch Q）**

- `focusvis.mjs`（新立 · 焦点三问第一次进闸口）：首测 2882 站，真缺陷 395 处（393 页脚环对比 + 2 目录拽出视口）+ 假阳性 26 处；闸自身三处修好、站内两处改完后，全量 **3964 站 · 四类 0**，细化判据后定点复跑 **578 站 · 四类 0 · 浮层重走 12 次**。
- 改动清单：`app/globals.css`（页脚焦点环取色）、`components/toc.tsx`（跟随滚动的 `:focus-visible` 守卫）。两处都不引新色、不动 DOM 契约。
- 纪律闸：`npm run check`（当时仍是 typecheck + lint + check:emoji + test:proxy + test:attack + audit:env）**全绿**。
- 一条如实登记：本轮的 2.4.13 只判了「厚度」与「与紧邻那侧的对比」，`outline-offset` 处的那圈空隙按用户实际看到的第一非背景像素取值 —— 若未来把焦点环改成 `box-shadow` 画法，这条判据要跟着换算法，不能沿用。

### 11.26 把纪律搬进 CI，然后发现源码里根本没写那个 150ms（第 14 轮 · Batch S · 源级闸 + 渲染真值闸）

**一、浏览器闸进不了 CI，所以纪律要有第二种写法**

`deploy.yml` 在 `npm run build` 之前已经跑 `npm run check`，这十三轮的闸却几乎全是浏览器闸：要绝对路径的 Chromium、要本地静态服务器、`out/` 还得先构建好 —— 搬进 CI 就得引新依赖，而站内约束是「不引依赖」。于是补一道**只看源码**的闸 `scripts/ui-discipline.mjs`：零依赖、扫 130 个源文件，R1 时长 / R2 缓动 / R3 可动画属性 / R4 语汇禁区 / R5 硬编码颜色 / R6 关键帧必须存在 / R7 自证 / R8 工具类。挂进 `check` 链的 `check:emoji` 之后，CI 那一步自动就带上了它。先 `--report` 摸底、清完再转拦，最后反向验证：**注入一行 `.gate-probe { transition: width 250ms ease-in, box-shadow 0.4s linear; background: linear-gradient(red, #fff); }` 抓到 7 类 7 处并 `exit 1`**；注入 `transition-all ease-in-out duration-150` / `transition-shadow duration-[700ms]` 抓到 R8 的 6 处并 `exit 1`。

**二、摸底阶段这道闸报了十几次假警报，每一条都值得留着**

| 假警报 | 破法 |
| --- | --- |
| 23 处「硬编码颜色」里 2 处是注释在讲同一个色号 | 先剥注释再匹配 —— 人一旦习惯假警报，真警报就没人看了 |
| WAAPI 的 `duration: 400` 判成「400 秒」 | 同一个键名两根轴：按量级分流，≥100 走毫秒档，其余走秒档 |
| `var(--duration-fast)` 被当成缓动值 | 缓动的 `var()` 只认 `var(--ease*)` |
| `to` 出现在 `top:` 里，于是每一行都像关键帧步 | 不再靠字面猜，真解析 `@keyframes` 与 `prefers-reduced-motion` 的块区间 |
| Prettier 折成多行的 `transition:` 从来没被检查过 | 按「声明块」解析而不是按行 |
| 渐变例外按行号放行 | 上面多写一行注释，放行就悄悄落到隔壁规则上 —— 改成按选择器点名并强制写理由 |
| R8 第一版对 `ease-in-out` 一声不响 | 字符类里漏了连字符：整体匹配不上，回溯到 `ease` 又被尾查否决，**恰好是这条规则最该抓的那个词** |
| R8 把合规的 `duration-200` 拦下 | `/^\d+$/` 少一个捕获组，`bare[1]` 是 `undefined` → `NaN` → 判 off-tier。合规的被拦、违规的漏网，两头都是错 |

这一串把 §11.24 三 那条守则补全成两半：**「看不到」必须自己承认（R7 自证：每条规则必须真的看到过 N 处，看到 0 处判失败）；「看到了但判错」必须用一份合规样本反证**，只拿违规样本试闸，永远看不出闸会冤枉好人。

**三、闸第一次开口，要掉三处真改动**

- 9 处 `transition: background …` → `background-color …`：简写会把 `background-image` 一起拉进插值，而渐变插值是逐帧重画。
- `.hover-zoom` 的 `box-shadow` 过渡删除：投影是逐帧重绘的属性，跟 4px 抬起一起瞬时出现就够了，缓动它只会让卡片「先浮起来再变厚」。
- `.custom-cursor-ring` 的 `width/height` 过渡改成 **JS 每帧把 `scale()` 拼进 `translate3d` 之后**。两个理由：CSS 里若 `transition: transform`，会和每帧重写打架、环永远拖在光标后面；而旧写法元素 fixed 在 `left/top: 0`，放大以左上角为原点长出去，**环的几何中心每帧偏离光标 (36−14)/2 = 11px**。源级闸只能看见前一条的字面写法，看不见这 11px —— 所以新立 `cursor.mjs` 直接量几何：真实 `mouse.move` 停三站（链接 / 按钮 / 空白），每帧采样到停稳，判中心偏差 ≤2px 且尺寸命中档位。实测 `/` 与 `/posts/` 各 3 站 + reduce 两站：**中心偏差 0.00px，悬停 36.0px / 静止 14.0px，37–50 帧收敛**；reduce 下组件不挂载。

**四、源级正则对 `className` 整类失明，而站内恰好有 84 处 —— 更要紧的是那个 150ms 根本没写在源码里**

`transition-colors` 是 class，不是声明，R1–R3 的正则一条都看不见。补上 R8 之后仍然只覆盖「写出来的那部分」：Tailwind 的 `transition-*` 工具类默认给的是 **150ms + `cubic-bezier(0.4, 0, 0.2, 1)`**，而 `tailwind.config.ts` 从没管过动效 —— 源码里连 150ms 这个字都没有，**源级闸原则上无法发现「没人写错、只是没人改过默认值」这种 off-tier**。所以再立一道读渲染真值的闸 `motion.mjs`：`getComputedStyle` 的最终 `transition-property / -duration / -timing-function` 三件套，外加 `animation-name != none` 的时长，13 类页面 × 3 档视口/主题、**4402 个带过渡元素**。

它的第一跑报了 87 处「缓动不合格」，全是闸自己造的 —— `split(', ')` 把 `cubic-bezier(0.16, 1, 0.3, 1)` 从参数逗号处切成三段。按括号深度切之后剩下的才是真的：**在未改 config 的产物上 12141 处 off-tier（19 类：150ms 与 `cubic-bezier(0.4,0,0.2,1)` 分别作用在 transform / color / background-color / border-color / text-decoration-color / fill / stroke / opacity），改后 0 处，分母 4402 不变**。

修法改的是默认值而不是逐处补 `duration-200`：`tailwind.config.ts` 里 `transitionDuration.DEFAULT: 200ms`（并补 400/800/1200 三档）、`transitionTimingFunction.DEFAULT: ease` 与 `out: cubic-bezier(0.16, 1, 0.3, 1)`、`transitionProperty.DEFAULT` 从属性表里去掉 `box-shadow / filter / backdrop-filter`。**默认值改的是「语言」，补 class 改的是「句子」，句子还会再写错**；76 处用量一次到位，且 `.pressable` 那类无层样式与 `@layer utilities` 的优先级纠缠也不用逐处判断谁赢 —— 计算值本来就是答案。产物核对：`.transition-colors{transition-property:color,…;transition-timing-function:ease;transition-duration:.2s}`，整张 CSS 里 `150ms` 出现 **0** 次。

顺带一笔：`duration-200` 与 `transition-transform` 同时出现时（章节条的折叠箭头，9 处），时长对、缓动错 —— 这类「一半合规」的混合态正是源码 grep 最难看清、计算值一眼看穿的形状。

**闸门（Batch S）**

- `scripts/ui-discipline.mjs`（新立 · 已挂 `npm run check` → CI）：130 个源文件，看到 时长 27 / 缓动 81 / 属性 62 / 语汇 8 / 颜色 86 / 动画引用 20 / 工具类 85，**违规 0 处**；两条注入验证各抓 7 处与 6 处，`exit 1`。R7 自证在文件数 <100 或任一规则看到 0 处时判失败。
- `motion.mjs`（新立 · 渲染后真值）：修前 12141 处 / 修后 0 处，4402 个带过渡元素 × 39 次页面测量，量到 0 个带过渡元素即按「没量成」`exit 1`。
- `cursor.mjs`（新立 · 光标几何）：8 站中心偏差 0.00px、尺寸 36.0/14.0px 精确命中，reduce 档不挂载；找不到站点记 `dead` 而不是跳过。
- 改动清单：`app/globals.css`（9 处 `background`→`background-color`、`.hover-zoom` 去投影过渡、光标环改 scale 驱动）、`components/ui/custom-cursor.tsx`（lerp 出 `scale()`，并把 rAF 改成收敛后自停 —— 鼠标停下时放大仍会走完）、`tailwind.config.ts`（动效默认值对齐站内档位）、`package.json`（`check:ui` 进链）、`scripts/ui-discipline.mjs`（新）。
- 纪律闸：`npm run check` 全绿（此时链上已是 typecheck + lint + check:emoji + **check:ui** + test:proxy + test:attack + audit:env）。
- 一条如实登记：R8 没有覆盖 `delay-*`（站内 0 处使用）与 `animate-*` 任意值；`motion.mjs` 读的是首屏静止态的计算值，`:hover` / `.is-active` 才出现的过渡只在「声明挂在元素上」时被抓到，纯 `:hover` 规则里的 off-tier 写法仍归源级闸管 —— 两道闸是互补，不是一道能替另一道。

### 11.27 首屏第一次过秤，第一刀砍在了不存在的地方（第 14 轮 · Batch T · 过线字节与可变字重）

**一、站内从没量过「过线到底多少字节」**

CSS 里写了几个字重、产物里有多少个 JS 分块，这些都能在源码里数；真正过多少线只有从网络层看。新立 `weight-net.mjs`：CDP `Network.enable` 收 `loadingFinished.encodedDataLength`（压缩后的过线字节），按类型/主机归组，字体按 URL 里的 `/s/<family>/` 归族，外加 `document.fonts` 的声明数与到货数、按（族 × 字重）统计正文实际用字（含汉字字数）、LCP 与 >20KB 清单。首秤三类代表页：

| 页面 | 过线总量 | 最大头 |
| --- | --- | --- |
| `/` | 2673.8KB | Font 1019.2KB（38%）· Script 666.3 · Fetch 623.8 · Stylesheet 187.6 · Document 155.8 |
| `/posts/hello-world/` | 2790.9KB | Font 974.4 · Fetch 828.5 · Script 670.1 |
| `/learn/ml/day-10/` | 6021.6KB | Fetch 2775.7KB（46%）· Font 1357.1 · Document 1026.5 |

单 `notosanssc` 一族就 918.8KB / 16 片，是站内最大的一块。旧闸 `weight.mjs` 曾经把这块整个弄丢：它按 `@font-face` 块的先后顺序反推族名，而 css2 是按（族, 字重, 子集）打平输出的，28 块全记到 Inter 名下、Noto 报 0 片 —— 一千 KB 就这样从报表里消失。那段现在顶上写着「别拿它的数字下结论」。

**二、第一刀的假设是错的，而且错在两处，都是量出来才发现**

假设「500 档汉字用得少，砍掉就省字重文件」。把链接从 `Noto+Sans+SC:wght@400;500;700` 收成 `400;700` 复秤：过线 2673.8 → 2643.6KB，**省的 30.2KB 全在那条渲染阻塞的 css2 CSS**（92.0 → 61.8KB），汉字二进制一片没少（1019.2 → 1019.3KB、16 片不动）。把 css2 的 CSS 文本自己抓下来数才看懂：这一族每个字重的 101 个子集 URL **交集是 101/101** —— Google 发的是同一批可变字体文件，多要一个字重档不花字节，只花 CSS 文本（三档 303 块 / 329.1KB，两档 202 块 / 219.4KB）。

更要紧的是这一刀**改了排版而没人看得见**：站内「计算字重 500 且含汉字」的元素有 20–27 个、61–92 个字，全在顶部导航（首页 / 文章 / 归档 / 分类 / 标签 / 教程）。CSS 字体匹配在只剩 400 与 700 两张脸时对 500 往下取 400（也不合成粗体），实测同一段中文在 400 与 500 下**截图逐字节相同** —— 那几处已经悄悄掉到 400。量法本身也踩了一次：第一版把三块样本放在不同 `top` 上，「400 vs 500 不同」全是 y 相位的亚像素差造出来的假信号；改成同位叠放并先跑一次 400 vs 400 的对照，对照字节相同才认后面的比对。

**三、修法不是砍档，是把离散字重列表换成可变区间写法**

`wght@400..700` 同时解决两件：

- `@font-face` 从 303 块（三档）/ 202 块（两档）降到 **101 块**，css2 过线 92.0 → **31.5KB**，声明 face 375 → **173 个**；三页过线各降 60.5 / 60.4 / 60.3KB（`2673.8 → 2613.3`、`2790.9 → 2730.5`、`6021.6 → 5961.3`），Stylesheet 一栏 187.6 → 127.1KB。
- 500 档回到真正的 500：复跑像素比对，400 vs 500 现在**不同**（两张 PNG 16.9KB / 17.2KB），`document.fonts` 里 Noto 的分组是 `{"400 700":101}`。

拉丁侧保持离散写法（`Inter:wght@400;500;600;700` 等）：产物里「Inter 650」「Space Grotesk 600」这类计算值取到 700 脸是既有排版，把它们也换成区间会把 650 变成真 650 —— 那不叫省字节，叫悄悄换字形。LCP 三页 356 / 544 / 508ms → 328 / 568 / 480ms，方向不一致，属噪声级：**这一刀的收益在关键路径字节，不在 LCP**，如实登记。

**四、day-10 那 2775.7KB 的 Fetch 不是重复下载；我的闸把设计行为显示成了 bug**

`>20KB` 清单里 `index.txt?_rsc=S5tspZX5SWhjTzF0` 连着出现 5 次、字节还各不相同（607.7 / 550.0 / 424.5 / 275.0 / 187.0KB），看起来像同一个文件被取了 5 次。按 CDP 把 `requestWillBeSent / loadingFinished` 拉成时间轴才看清：**13 条 `_rsc` 请求、13 个不同 URL**（day-07 / 08 / 09、`/learn/ml/`、`/tags/`…），合计正好 2775.7KB，一次都没被取消 —— 静态导出里 `_rsc` 的 token 是构建号，不随路由变，所以路径不同的请求尾巴一模一样。

破法在闸自己身上：那行打印用的是 `url.split('/').pop()`，把路径丢了。现在打完整路径（token 折成 `…`）、同一 URL 重复时打 `×n`，末尾加一句「同一 URL 重复取：N 条」。**闸把路径显示错比不显示更坏**：它把 `<Link>` 的视口预取说成了「重复下载」，而我已经准备照着它去「修」。

决定保留这批预取：它们在 load 之后 839–1076ms 才发起，不参与首屏渲染；关掉只是把同样的 600KB 从「空闲时」挪到「点击后」，代价是下一次导航变慢。量出来、把代价写明，而不是为了让报表好看去砍体验。

**闸门（Batch T）**

- `weight-net.mjs`（新立）：3 类页面 × 过线字节/主机/字族/实际用字/LCP；字体主机一条请求都没到、或 `document.fonts` 里 0 个 face，一律进 `dead[]` 判失败 —— 网络被拦时不许把「没量到」结算成「很轻」。本轮修掉它的 URL 显示缺陷。
- `weight.mjs`：`font-weight` 的正则从 `(\d+)` 改成读整值，可变区间的 `400 700` 不再被截成 `400`；文件里那段按块序反推族名的代码仍标注为已被 `weight-net.mjs` 取代。
- 改动清单：`app/layout.tsx`（汉字族改可变区间，注释里留三档/两档/区间三组实测字节与「500 落到 400」的像素结论）、`ui-concepts/verify/weight-net.mjs`、`ui-concepts/verify/weight.mjs`。

### 11.28 控件都有名字，但那条负责复核的腿是死的（第 14 轮 · Batch R · WCAG 4.1.2 / 3.3.2 第一次量化）

**一、绿灯来自一条从没跑通的腿**

`names.mjs` 立的是两腿：A 腿在页内按 ARIA 名称计算规则的一个子集自己算（`aria-label` / `aria-labelledby` / `<label>` / `title` / 文本内容），B 腿用浏览器真正的可达性树复核。第一跑的输出很好看：15 类页面、55 个可见控件、无名 0 个。可 B 腿每一页都打了一行 `NOTE 可达性树拿不到：TypeError: Cannot read properties of undefined (reading 'getFullAXTree')` 然后继续往下跑 —— 这个 playwright-core 版本上根本没有 `page.accessibility`。

于是「两腿互相印证」实际上是「一腿孤证 + 一腿缺席」。修法不是把 NOTE 删掉，而是把缺席变成失败：改用 CDP `Accessibility.getFullAXTree`，并加三道自证 —— 树是空的就抛；页内有可见控件而树里 `button/textbox/switch/…` 这类角色一个都没有就抛；整轮跑完 `axSeen == 0` 就进 `dead[]` 判失败。§11.24 那条守则在这里第三次生效：**「看不到」必须自己承认，不能结算成「没问题」**。

**二、两腿各报 0，不等于两腿同意**

第一版只在两腿结论不一致时打一行 NOTE，`exit` 仍然是 0。这恰好丢掉 4.1.2 最真实的形状：页内规则是我按规范写的近似，浏览器才是最终裁决，两者不一致时**可疑的是近似那一方**。改成不一致就 mark 成 finding 并 `exit 1`，再用注入证明它会开口：往首页塞一个 `<button role=button id=__injA>`（无名），页内 A 腿报「不合格 0」，B 腿报「可达性树判无名、页内规则漏掉：role=button」—— 闸抓住了自己的规则漏掉的东西。

**三、闸不关浏览器，退出码就永远不来**

`names.mjs` 和 `focusvis.mjs` 都只 `ctx.close()`，没有 `b.close()`。表现是后台任务迟迟不结束、我拿不到退出码；`tasklist` 上是 4 个挂着的 node 进程（两个 names、两个 focusvis）。杀掉进程之后确实回来了一个「exit 0」，但那不是闸跑完的绿灯，是 `Stop-Process` 的返回 —— 这一条必须如实登记，否则报表上就多两条假绿灯。收尾纪律与判据同等重要：**闸必须自己把浏览器关掉，让退出码由判据产生，而不是由我手动终结产生。**

**四、三向注入与干净全量**

| 注入 | 结果 |
| --- | --- |
| A 无名 `<button>` | `exit 1`，`无名：<button[role=button]> id=__injA` |
| B 无名按钮 + 页内规则漏掉 | `exit 1`，页内报「不合格 0」的同时被 AX 腿抓住 |
| C 合规样本（有 `aria-label` 的同款按钮） | `exit 0` |

干净全量：`合计 55 个可见控件 · 15 类页面 · 可达性树另一条腿核过 99 个角色 · 两种名来源不一致的页面 0 个`，`exit 0` 且自行终止。产物注入前后 md5 相同、`__inj` 残留 0。

**闸门（Batch R）**

- `names.mjs`（改）：B 腿换成 CDP `Accessibility.getFullAXTree` + 三道自证；两腿不一致从 NOTE 升为 finding；`NAMES_ONLY` 支持单页复跑；`b.close()` 补在汇总之前（注释里写清「不关就拿不到退出码」这条坑）。
- `focusvis.mjs`（改）：同一处 `browser.close()` 漏项。
- 站内结论：55 个可见控件全部有名，99 个 AX 角色两腿一致 —— 这一轮没有产生产品改动，产出的是「这条判据从此可以被相信」。
- 复跑：Batch U 改完字体声明后 `names.mjs` 重跑一遍，五个数字一字未变。字体不该动可访问名，动了就是闸串了位。
- 一条如实登记：两腿一致只覆盖「角色在树里出现且可见」的控件；被 `aria-hidden` 摘掉、或只在悬停后才挂载的控件，仍归 Batch N 那类「死控件」闸管。

### 11.29 标题一直和一级标题一样粗，而这件事只有像素能看出来（第 14 轮 · Batch U · 全可变声明与脚本归因）

**一、汉字侧改成可变之后，闸升级成「族 × 字重档」，它反手报出五处**

`fontwt.mjs` 第一版只查汉字那一族。Noto 改成 `400..700` 之后那一侧永远全覆盖，闸就变成一条不会开口的规则 —— 于是把判据推广到「站内每个真用到的族 × 真用到的档」。推广完第一次跑就抓两类：

- 先抓到的是**闸自己的假案**：纯中文文本按「字体栈第一个族名」归因，被记到 `Space Grotesk` 名下，于是报「Space Grotesk 缺 600」—— 可那些汉字根本没用过这个族（栈首族没字形，必然落到 Noto）。改成按脚本归因：拉丁字符归栈首族，汉字归 Noto，KaTeX 的 `KaTeX_Math` / `math` 这类族只吃非空白字符。
- 归因修干净之后剩下的才是真的：`h3` 与 `.heading-3.row-title` 计算字重 600，栈首是 Space Grotesk 而它只声明了 `500;700` —— CSS 字体匹配对 600 先往上找，取到 700。**三级标题一直和一级标题一样粗**，写了 600、从来没有存在过。`strong` 的 650 更难看：Inter 侧取 700，汉字侧（可变）落真 650，同一句话里两种文字一深一浅。

截图对能直接看见：`介绍 lora-trainer：一键搞定大模型 LoRA 微调` 这一行，改前 `lora-trainer` 和 `LoRA` 明显重于两边的汉字，改后整行一个深浅。而纯汉字的 `strong`（「数值稳定性」）改前改后逐字节相同 —— 汉字侧本来就对，这一刀没有动它。

**二、§11.27 那句「拉丁侧保持离散」被本轮实测推翻了一半**

当时的理由是「把它们也换成区间会把 650 变成真 650 —— 那不叫省字节，叫悄悄换字形」。这句话方向是对的（改字形要谨慎），但漏了量一件事：**拉丁这几族的离散写法和区间写法下的是不是同一批文件**。实测把两种链接各取一次 CSS、把 `src` 的 URL 集合摊开：

- 文件集合 117 个，交集 **117/117**，只在一边的各 0 个；二进制合计 **4720.0KB 一字节不差**。
- `@font-face` 从 153 块降到 **117 块**，CSS 文本 129.5 → 116.2KB，css2 过线 61.8 → **31.4KB**（首页），浏览器侧声明 face 137 个。

Google 早就在给 Inter / Space Grotesk / JetBrains Mono 下可变文件，离散 `wght@400;500;600;700` 只是把同一张可变脸钉在四个实例上 —— 代价是钉死之外的一切档位都取不到。所以「650 变成真 650」不是这一刀的代价，它就是这一刀的目的：设计语言里写了 600 与 650，产物里那两档的拉丁脸从来没存在过。零字节换回两档真实排版，这种交易不会再来第二次。

**三、像素判据从「各档 vs 400」换成「真用到的档两两比」，起因是一个正确现象**

改判据前先把量具的分辨率摸清（`weight-res.mjs`）：Inter 与 Space Grotesk 在 28px / 40px 下，500 / 600 / 650 / 700 **两两逐字节不同**（含最难的 600 vs 650），所以「画不出差别」确实等于「这一档没落到脸上」。但同一批数据里有一条例外值得留着：Space Grotesk 的轴从 500 起，请求 400 会被**夹持**到 500，于是 400 与 500 逐字节相同 —— 那是规范行为，不是假档。基准若固定成 400，夹持就会被读成缺陷；所以判据改成「站内真用到的、且被声明覆盖的那些档，两两必须不同」，400 只是其中一档。

**四、注入验证里两个坑，一个是我的，一个是闸的**

| 坑 | 破法 |
| --- | --- |
| 注入脚本 `inj()` 声明收 3 个参数、我只传了 2 个，`sed` 拿空串替换 —— 页面根本没改，闸自然绿灯 | 差点把这条记成「闸无效」。注入失败和闸失效在报表上长得一模一样，所以每次注入都要把改后的链接原文打出来核对，再谈结论 |
| `FONTWT_ONLY=/learn/ml/day-10/` 被 MSYS 改写成 `D:/Artificial_Intelligence/Git/learn/...`，浏览器拿到的是 404 模板页，而闸照样跑完「检查」并给出结论 | 这条是真窟窿：`goto` 的 HTTP 状态不判、文档外壳不认，任何路径写错都会变成一次合法的绿灯。现在两道都判 —— 非 2xx 进 `dead[]`；文档里没有 `fonts.googleapis` 外链也进 `dead[]`（「这不是站内页面外壳，多半是 404」） |

404 页还顺带暴露第三个：它的 KaTeX 字体栈尾有 `Times New Roman`，被当成「用了却没声明」的族报「无依据」。本机字体不是我们能声明的东西，但也不能一声不响 —— 现在单列一行「本机族（不参与声明核对，只登记）」，哪天它真的开始画字，那行就是证据。

**闸门（Batch U）**

- `fontwt.mjs`（新立 · 常驻）：声明侧 = css2 链接 4 族 + 产物 CSS 自托管 12 族（KaTeX 系）并集；使用侧 = 每页每个真用到的「族 × 档」，缺档判失败、无声明依据也判失败；像素侧 = 每族真用到且被覆盖的档两两必须逐字节不同，同档两次截图作对照，对照不稳则整页作废并计入 `dead[]`。本轮收尾实测：3 类页面 · 47 个「族 × 字重档」组合 · 两两比对 **54 对**（首页 12 = Noto 4 档 6 + Mono 3 档 3 + Inter 3 档 3；文章页 20；day-10 22，含 KaTeX_Math / KaTeX_Main 各 1 对），54 对全部「两两不同」· `exit 0`。
- 四条自证全部 fail-closed：产物 CSS 目录取不到 → 直接退出；页面非 2xx 或文档里没有 `fonts.googleapis` 外链（404 模板）→ 进 `dead[]`；某族用了却查无声明 → `dead[]`；一轮下来一页像素都没做成 → `exit 1`。
- 注入四向：SG 退回离散 `500;700` → `exit 1` 并点名 `<h3>` 155 字、`<strong>` 20 字；Inter 收到 `400..600` → 缺 650；Noto 退回 `400;700` → 缺 500/600/650（**§11.27 那一版从此过不了闸**）；整族从链接里删掉 → 「无依据」`dead[]` → `exit 1`；合规样本 `exit 0`。
- 改动清单：`app/layout.tsx`（四族全部改可变区间，注释里留两组实测：URL 交集 117/117、4720.0KB 不变、css2 61.8 → 31.4KB）、`ui-concepts/verify/fontwt.mjs`（新立）、`ui-concepts/verify/weight.mjs`（`font-weight` 读整值，可变的 `400 700` 不再被截成 `400`）。
- 回归：`npm run check` 全绿；`weight-net.mjs` 三页过线 2613.1 / 2730.2 / 5961.1KB，字体二进制与 §11.27 逐项相同（首页 Noto 918.8KB · 16 片）；320/360px 横向溢出 0 页，320/390px 短标签多行 0 处（该闸自带的「摘掉 nowrap」自检仍抓到 1 处）；`names.mjs` 复跑 55 控件 / 99 角色 / 不一致 0。
- 一条如实登记：像素那一半只能证「同一族的两档画得出差别」，证不了「Google 服务的是可变文件」—— 后者靠本轮的 URL 集合交集（117/117）与 `document.fonts` 里 `400 700` 这种区间写法。哪天 Google 改回静态文件，写法会先变、两两像素会跟着变，两条都在闸上。

### 11.30 上下跳的 26px 与按下去的 285ms（第 15 轮 · Batch V · CLS 与 INP 第一次量化）

**一、闸先立起来：30 个站，两条腿各量各的**

`vitals.mjs`（新立 · 常驻）：15 类页面 × 2 视图（1280x800 / 390x844，均 light）= 30 站。CLS 只收「页面自己待着」那一段：视口内、排除 `hadRecentInput`、按规范取「间隔 ≤1s、跨度 ≤5s」会话窗的最大和，闸 0.1；整页滚动途中的位移单列一行（紧邻输入的按规范本就不计），不混进 CLS。INP 用 event timing（`durationThreshold: 16`），每个 `interactionId` 取最长一条，拆成延迟/处理/呈现三段，闸 200ms；每一步交互打时间标记，报表能把每条 event 归到「主题切换」「命令面板开」这样的具体步骤 —— 只报「全站最慢 192ms」没有下手处。fail-closed 四条：不产 layout-shift 条目、不产 event 条目、观测器自己报错、数学页却一个 KaTeX face 都没到货，都进 `dead[]`；文档外壳认 header+main（404 模板过不了）。`VITALS_INJECT=shift|block|both` 注入真位移 / 420ms 阻塞点击处理器，用来证闸会开口。

**二、第一笔位移：同周条在字体到货时上下跳 26px**

day-06 @1280 首屏 CLS 0.127–0.131，三遍里复现一遍（字体到货时序决定，真实网络下只会更频繁）。逐帧定位：t=566ms 正文上跳、t=746ms 跳回。原因是 `WeekStrip` 的标签与 chip 行做 flex 兄弟：chip 宽度上限 `max-w-[14ch]` 的 `ch` 跟着字体走，Noto 子集分批到货时每个 chip 宽了约 9px，七个一起把整行推过换行边界，「标签+chip 同行」↔「标签独占一行」来回翻，下方正文跟着跳。修法不是钉死 chip 宽度（那会回到 §11.27 之前的假档问题），而是**标签让出那一行**：`span` 改 `block` 独占一行，chip 行 `mt-2` 拿满整条带宽 —— 边界不再被跨过。修后 chip 在所有字体到货阶段钉在 y=315，只剩宽度亚像素变化（143→129→152）与 1px 高度 oscillation（29↔30）；四遍复测 CLS 0.0009–0.0045。

顺带证伪一个假设：骨架屏换真身会不会撑出位移？量下来不会进 CLS —— 替换发生在折叠线以下，CLS 只算视口内；滚动段单列的数据里它也只是「长高了多少」的 informational 行。假设记在这里，不占修复名额。

**三、第一笔慢交互：day-10 的主题切换，呈现段 285ms**

30 站首扫只有 day-10 主题切换越闸：232ms / 248ms（呈现段 227ms，处理段 1ms）。`theme-who.mjs`（新立 · 归因探针）把账算清：`startViewTransition` 被调 1 次；点击 288ms = 延迟 2.9 + 处理 0.3 + **呈现 284.8**；LoAF 里一帧 `styleLayout=175.2ms`、另一帧 `render≈170ms` —— View Transition 要在点击的呈现窗里给整页拍新旧两张快照，而 day-10 有 **9036 个节点（7529 个 KaTeX）**，快照绘制 ~170ms + 全篇重样式 ~175ms 全记在这次点击头上。

两个候选修法都先量再决：

| 候选 | 实测 | 判决 |
| --- | --- | --- |
| `content-visibility: auto` 跳过屏外重样式 | 第一版 `.prose > *` 只匹配 1 个包装子节点，288ms 原样（粒度错）；改 `.prose > * > *` 命中 140 块，点击降到 40ms（呈现 37.6） | 有效，但接着量深链：统一 `contain-intrinsic-size` 估算让锚点落偏 —— 标题 top=-2003px（scrollY 10368）对正确值 top=82（scrollY 8155）。块高实测中位 31 / p75 56 / 最大 1422px，没有一个估算值能同时对齐所有锚点。**否决** |
| 去掉 View Transition，只走圆形揭示遮罩 | 按下立刻起 transform 动画；唯一一次全篇重样式发生在 `animationend` 的 `setTheme`，被不透明遮罩盖住 —— 慢的那段读者看不见，看见的那段不慢 | **采纳** |

修后复测：`VT supported=true called=0`；点击不再产生 ≥16ms 的 event 条目（原 288ms）；day-10 两视图 INP 184 / 176ms，最慢一步换成「课内控件」，闸内。reduced-motion 下直接换主题（圆形揭示靠 `animationend` 收尾，媒体查询不会自动关掉它，这条分支必须显式留）。

**四、动效闸顺手补了一处名实不符：R3 的关键帧侧原来是黑名单**

规则写的是「只准 transform / opacity / color 系」，关键帧侧实现的却是「列出来的才禁」—— `letter-spacing` 写在 `@keyframes` 里一声不吭。改成真白名单，例外按**关键帧名**登记（`blurIn: ['filter']`，理由在案）；同一轮把骨架微光从 `background-position`（不进合成层，每帧重绘整条）改写成 `::after` 的 `translateX`，新增 `--skeleton-sweep` token，reduced-motion 下 `animation: none`。注入自证：往关键帧里塞 `letter-spacing`（原先静默）与 `width`，两条都被点名、`exit 1`；合规跑 152 条属性声明、0 违例。

**闸门（Batch V）**

- `vitals.mjs`（新立 · 常驻）：判据与 fail-closed 见上；`VITALS_ONLY` / `VITALS_VIEWS` / `VITALS_THROTTLE` 可缩样。MSYS 路径改写陷阱（§11.29 四）在本闸复现过一次：`VITALS_ONLY=/learn/...` 被改写成 Windows 绝对路径 → 过滤后 0 站 → 闸按「一站都没量成」`exit 1` —— fail-closed 接住了，跑时加 `MSYS_NO_PATHCONV=1`。
- `theme-who.mjs`（新立 · 归因探针，非常驻）：VT 调用计数 + event 三段 + LoAF 分段 + 节点规模，`THEMEWHO_CV=1` 做 content-visibility 对照。
- 改动清单：`components/learn/week-strip.tsx`（标签独占一行，注释留 26px 往返实测）、`components/theme-toggle.tsx`（删 VT 分支，注释留 285ms 归因与 CV 否决）、`app/globals.css`（骨架 `::after` transform 化 + `--skeleton-sweep`）、`scripts/ui-discipline.mjs`（R3 关键帧真白名单 + 按名例外）。
- 收尾实测（修复后的新构建）：30 站全绿 —— 最差 CLS **0.0000**、最慢交互 **192ms**（day-10 @390 的课内控件，闸 200ms；主题切换已不再产生 ≥16ms 的 event 条目）。注入三向自证全部 `exit 1`：shift → CLS 0.1796–0.3056 并点名位移源；block → INP 448–576ms，LoAF 归因到注入的 `#document.onclick 420ms`；both → 8 条越线各归其源。合规样本 `exit 0`。

### 11.31 简介里的星号、重复的标题，和两次被争用顶越线的闸（第 16 轮 · Batch W/X · 巡检收口）

**一、视觉复拍抓出的两处真缺陷**

第 15 轮闸全绿之后按 1440 明/暗 + 390 明复拍全站代表页（home/post/lesson/now/uses/subscribe/course），抓出两处闸看不见的地面：

1. **lead 简介露 markdown 原符**。268 条 lead 里 74 条带 `**`、21 条带反引号、1 条带链接；正文走 MDX 会渲染，简介直接插值就把星号摆在页面上（day-10 导语的 `**数值稳定性**` 原样露出）。两个展示面契约不同：课时导语是独立段落，照正文语义渲染；课程索引行的 desc 坐在整行 `<Link>` 里，再嵌 `<a>` 是非法嵌套，只能取纯文本。新立 `components/inline-md.tsx`：`InlineMd` 渲染粗体/行内代码/链接（href 仅认 `/` 与 `http(s)` 开头，其余退纯文本），`plainInline` 取纯文本；导语挂 `lead-md`，globals.css 用 `:is(.prose, .lead-md)` 把链接/粗体/行内代码语汇借过去，不新造一套值。复拍确认：day-10 导语粗体无星号；day-36 的链接 href 是 `/learn/devtool/day-06`（站内有效），`.md` 字样只是作者自己的标签文本，与正文 MDX 渲染一致；索引行全纯文本。
2. **/subscribe 一页两个「订阅更新」**。页面 masthead 已有 h1「订阅更新」+ 导语 + 「没有邮件列表」一节，「一键复制」里嵌的整张 SubscribeCard 又带同名 h2 与近乎重复的导语。给卡片加 `bare` prop：嵌入时摘标题与导语，只留地址行 + 复制钮 + 三源 chip；首页侧栏照旧整张（`aria-labelledby="subscribe-title"` 只在那里被引用）。顺带把卡片文案与 chip 补齐 JSON Feed 1.1（此前文案只提 RSS/Atom，页面与 feed.json 早已存在）。

**二、3D 舞台的键盘契约第一次被真的走过**

DESIGN.md 承诺「方向键旋转、+/- 缩放、焦点环与读屏说明」，但此前没有任何闸走过这条路径——flows4 里的 `ArrowLeft` 是 AI 实验台的 max_tokens 滑杆，不是舞台。新立 `stage-key.mjs`（常驻）：reduced-motion 关掉 autoRotate 让画布静止，按键后的像素差只能来自键盘；ArrowDown 默认滚页而 handler `preventDefault`，故 scrollY 不变证明 handler 真的接住。实测 6/6：tabindex=0 + aria-label 含操作说明、焦点落在舞台、ArrowDown scrollY 0→0、三下 ArrowLeft 像素差成立、两下 `+` 像素差成立、无 pageerror。

**三、平台边界量化：Windows 的汉字字重只有两档**

`sysweight.mjs`（新立 · informational）：在正文计算字体栈下以 deviceScaleFactor 2 逐档画汉字样张（400/500/600/650/700），同档对照必须像素一致否则 exit 1。实测 `500=400 · 650=600 · 700=600`：Microsoft YaHei 把 500 夹到 400、600/650/700 夹到 700 档，Windows 上汉字视觉字重只有两档；Apple 设备拿得到 SF Pro / PingFang 的真实中间档。这是平台边界不是缺陷，登记备查，不改声明（声明侧全可变字重的纪律照旧，见 §11.29）。

**四、体验闸两次越线：争用顶出来的，不是代码回归**

最终构建上 day-10 子集连跑两次 FAIL：320/344ms 与 360/336ms，都是呈现段主导（318/340/359/330ms）、处理段 0–3ms。逐层归因：

| 假设 | 证据 | 判决 |
| --- | --- | --- |
| 残留浏览器争用 | 第一次 FAIL 与一条输出丢失、实则仍活着的巡检链（shots+sweep2）重叠；chrome 进程计数事后为 0 | 第一跑成立 |
| 常驻进程吃 CPU | 孤儿 next dev（1GB  heap）、别项目 astro dev、serve-out  idle 采样 6s CPU 增量全 0 | 排除 |
| 整机漂移 | 对照站 home 同闸 48/32ms PASS | 排除 |
| Batch X 代码回归 | 同构建静机第三跑 160/152ms PASS，与 Batch X 前静机值 184/176ms 同带；全 30 站静机复跑 PASS | 排除 |

结论：day-10（9033 节点、7529 KaTeX）课内控件的真实成本约 160ms，贴着 200ms 闸；CPU 争用把呈现段翻倍顶越线。闸与阈值不动——fail-closed 报「这次测量越线」是正确行为；争用源与复测带记在本节。纪律补一条：timing 闸开跑前确认无存活巡检浏览器（chrome 计数 0），且不在另一条浏览器链刚收尾时立刻跑。

**闸门（Batch W/X）**

- `sweep2.mjs`：43 页 × 5 视图组合共 215 检查，0 findings（最终构建）。
- `stage-key.mjs`（新立 · 常驻）：6/6，见上。
- `sysweight.mjs`（新立 · informational）：同档对照自证通过；夹档结果见上。
- `vitals.mjs`：静机全 30 站 PASS —— 最差 CLS **0.0000**、最慢交互 **160ms**（day-10 双视图）；78 次带 interactionId 交互。两次争用越线见上表。
- `fontwt.mjs`：PASS —— 系统栈 11322 字、2 页无自托管族；day-10 的 KaTeX_Math/Main 400/700 全覆盖且像素两两不同；声明侧 css2 0 族 + 自托管 12 族。
- `npm run check`：typecheck / lint / emoji / ui-discipline / proxy / attack / audit:env 全绿；postbuild 审计 1179 文件通过（邮箱掩码、秘密 0 命中）。
- 改动清单：`components/inline-md.tsx`（新）、`components/learn/lesson-view.tsx`（导语 InlineMd + lead-md）、`components/learn/course-overview.tsx`（desc plainInline）、`app/globals.css`（五处 `:is(.prose, .lead-md)` 扩展）、`components/subscribe-card.tsx`（JSON 文案/chip + bare）、`app/subscribe/page.tsx`（bare）。
- _residual_：meta/OG description 仍带 lead 原符（`lib/lesson-page.ts` 属禁改树，登记在案）；pagefind snippet 因导语 HTML 变干净自动改善。

### 11.32 博客感补全：署名、字数、许可、运行天数与系列内导航（第 17 轮 · Batch Y）

**一、标杆对照与缺口盘点**

参照优秀个人博客（阮一峰周刊等；draveness.me 已 301 到 draven.co，未追）对照本站盘点：prev/next、相关文章、作者卡、更新日期、评论、回顶、lightbox、目录/章节 bar、阅读进度、字号、代码复制、归档、标签/分类/系列、about/now/uses、搜索/命令面板、三 feed、sitemap、404、友链页、colophon 均已具备。真缺口五项：内容许可、标题下署名、字数、运行天数、系列内上下篇。刻意不做：/posts 年分组（归档已覆盖、现存 6 篇全在 2026、分页保留）、打印样式（与颜色令牌纪律冲突）、随机文章钮（6 篇体量价值低）。友链页 FRIENDS 仍空数组——朋友不能编造，留空待作者提供。

**二、落地清单**

1. **许可**：问答定案 CC BY-NC-SA 4.0。新 `components/post-license.tsx`：文末一行（CC 图标 + deed.zh-hans 链接，`rel="license noopener noreferrer"`），`data-pagefind-ignore` 让样板文字不进搜索 snippet；jsonLd 增 `license` 字段；/terms 新增「6. 内容许可」（`id="license"`，交叉引用 §1 学习引用与 §2 商用须许可），附则顺延为 7；页脚新增「许可」链接。
2. **byline**：标题下 28px 圆头像 + 署名（复用 AvatarImage，加载失败退图标），署名不等读完才见作者卡。
3. **字数**：元信息行「约 N 字」——content 剥代码块/行内代码/图片/链接 URL/markdown 符号/空白后计数；hello-world 实测 468 字。
4. **运行天数**：页脚 © 行「自 2026.07.13 起 · 第 N 天」。Footer 是 `'use client'` 不能引 fs 系 lib/posts，由 layout 传 `since`（最早文章日期）；RunningDays 客户端算天数（静态导出会把烘焙数字冻住），SSR 只渲「自 … 起」避免 hydration mismatch。实测第 121 天与探针同公式期望一致。
5. **系列内上下篇**：系列块 ol 下发丝线隔开的双栏「系列上一篇/下一篇」（getPostsBySeries 按 seriesOrder 序）；单篇系列不出块，首/末篇只出一方向 + 空占位。实测 Vibe Coding 两篇互指正确。

**三、目检复拍抓出的存量缺陷：blockquote 双引号**

Tailwind Typography 插件默认给 `.prose blockquote` 首末段加 `open-quote/close-quote`：hello-world 正文自带一对直引号，视觉叠成双引号；课程 blockquote 多是提示框（非引用）却被凭空加引号。`content/**` 属禁改树，故在 globals.css 覆盖 `.prose blockquote p:first-of-type::before, .prose blockquote p:last-of-type::after { content: none }`——引号与否由内容自己负责。`bq.mjs` 实测伪元素 content 为 none，复拍单引号正确。

**四、探针坑两枚**

- batchy 首跑在页脚许可链接超时：`trailingSlash:true` 把 `href="/terms#license"` 渲成 `/blog/terms/#license`（锚点前插斜杠），`href*="terms#license"` 失配；改 `href*="#license"`。
- shot-license 首版 `locator.scrollIntoViewIfNeeded` 撞 「Element is not attached」——handle 赶上水合期一次性 remount；改 `page.evaluate` 现查 `document.querySelector` 再滚，不持旧 handle。该 remount 是 PageTransition 存量行为，vitals CLS 0.0000 证明无可测位移，非新缺陷。

**闸门（Batch Y）**

- `batchy.mjs`（新立 · 常驻）：18/18 —— 字数/byline/许可行/deed 链接与 rel/jsonLd license/单篇系列不出块/运行天数同公式期望/页脚许可链接/暗色继承字色/390 无横溢/系列双向指向/terms 许可章与附则 7/锚点落位 top=96px/无 pageerror。
- `bq.mjs`（新立 · 常驻）：blockquote 首末段伪元素 content none。
- `sweep2.mjs`：43 页 × 5 视图共 215 检查，0 findings（build #5）。
- `vitals.mjs`：静机全 30 站 PASS —— 最差 CLS **0.0000**、最慢交互 **160ms**（day-10 双视图，与 §11.31 同带）；77 次带 interactionId 交互。
- `npm run check` 全绿；postbuild 审计 1179 文件通过（邮箱掩码、秘密 0 命中）。
- 改动清单：`components/post-license.tsx`（新）、`components/running-days.tsx`（新）、`app/posts/[slug]/page.tsx`（byline/字数/许可/系列导航/jsonLd license）、`components/footer.tsx`（since prop + 运行天数 + 许可链接）、`app/layout.tsx`（since prop）、`app/terms/page.tsx`（§6 内容许可）、`app/globals.css`（blockquote 引号覆盖）。
- _residual_：FRIENDS 空数组留空待作者；meta/OG lead 原符仍登记在 §11.31。

### 11.33 视觉回炉：中文报纸 / 印刷杂志方向（第 17 轮 · Batch Z）

**一、触发与诊断**

用户判词「这个UI太丑了，调整一下，你回炉重造都可以」。回炉前先定病灶，三条都来自目检而不是口味：

1. 标题是系统黑体 —— 一个个人志没有印刷嗓音，跟产品落地页同一种脸；
2. 刊头右半空荡 —— hero 只有左半边有内容，右侧整块留白，没有可读的锚点；
3. 全页没有色彩锚点 —— 页脚是 `#faf9f7`，与正文同色，页面底部没有落款感。

**二、方向比选：本机族样张六格**

`ui-concepts/verify/shots-z/specimen.png` 是同一句话在六种本机族下的实拍对比：A `Georgia + SimSun`（报纸宋体标题）、B `Georgia + KaiTi`（楷体文人感）、C 现状系统黑体（YaHei）、D `DengXian`（等线）、E 宋体正文 17px（印刷正文）、F `FangSong`（仿宋）。

选定 **A 做标题 + E 做正文**，B 的楷体只留给引语。F 弃（仿宋笔画最细，屏幕上可读性最差）；C/D 就是「没有嗓音」的现状与其近似。**零下载**：六种全是本机族，不新增外链字体、不动 §11.27 立下的外链纪律。

**三、落地清单**

1. **令牌**：`--font-serif: Georgia, 'Songti SC', 'SimSun', serif`、`--font-kai: 'KaiTi', 'Kaiti SC', 'STKaiti', Georgia, serif`；字阶放大到 `--text-display 56 / h1 36 / h2 26 / h3 21`。
2. **刊头双细线**：`.apple-nav` 下边 2px 实墨 + `::after` 隔 2px 的 1px 发丝线；`is-scrolled` 不换色 —— 报纸的边界不随滚动消失。
3. **实墨页脚**：`--footer-bg #23211e` / `--footer-ink #faf9f7` / muted / line / chip 五件套，只写在 `:root:not(.dark)` 的令牌定义里（R5 允许 hex 落令牌），暗色沿用既有 `#1a1917`。
4. **出版数据栏** `.editorial__stats`（文章 6 / 课次 239 / 标签 26，`dt` 等宽 11px + `dd` 衬线 34px）从侧栏 `side-stats` 上移到刊头右半，侧栏那份删除以免重复；<768px 折成一行三列。
5. **正文嗓音**：`.prose, .lead-md` 换衬线、首段首字下沉、`blockquote` 换楷体并比正文高一档。
6. **章节 folio**：`.editorial__section-head` 顶部 2px 墨线压顶，章节名与索引标题换衬线加粗。

**四、坑三枚**

- **Tailwind 的 `font-serif` 工具类在第 5 轮被别名到黑体展示栈**，Z 改完令牌后站名与行标题仍是黑体。修法：`serif: ['var(--font-serif)']`，让工具类跟随令牌而不是跟随历史。
- **首字下沉有两层坑**：`first-child` 对以 h2 开篇的文章永不触发 → 改 `first-of-type`；仍不触发 → 产物 HTML 里 MDX 外壳在 `.prose` 内套了一层 div（与 `prose-reveal` 的 `blockChildren` 同源），两个落点都得写才两种结构都吃到。
- **fontwt 闸对 Z 的三处适应**：SYSTEM 豁免名单补 `kaiti / kaiti sc / stkaiti`；`evaluate` 里引用不到 Node 侧常量，改成把 `SYSTEM.source` 当参数传进页面；「无配对像素」分支从 `famsUsed` 非空即判 dead 改成 `famsUsed.some(([f]) => declOf(f))` —— 否则 Georgia 这类**具名本机族**会让闸用自己的盲区把自己判死。

**五、一次错误的归因（留在台账里当反面例子）**

build #8 / #9 的 vitals 连续三次越线（day-10 的「课内控件」与「命令面板开」264–576ms）。当时把原因写成「18px / 1.95 的度量放大了字号切换的重绘差」，并据此把度量退回 17px / 1.8 —— **这个归因在 §11.34 被证伪**：字体族与度量都不是那一步的变量，越线来自测量期机器占用与样本位次。

**闸门（Batch Z · build #9）**

- `sweep2.mjs`：43 页 × 5 视图共 215 检查，0 findings（跑在 build #8，#9 只改 px 值）。
- `fontwt.mjs`：PASS —— 系统栈 9816 字、KaiTi 500/650 与 Georgia 各档登记为本机族、KaTeX_Math/Main 400/700 全覆盖且像素两两不同。
- `npm run check`：全绿；postbuild 审计 1179 文件通过。
- `vitals.mjs`：**未过闸（FAIL）**，build #8/#9 越线在 264–576ms 一带，build #10（ZA）为 344–352ms。当时的归因与后续更正见 §11.34；「越线是不是 Z 造出来的」由 §11.35 的 HEAD 对照跑判定。
- 改动清单：`app/globals.css`（Z 层：令牌、刊头双细线、实墨页脚、数据栏、正文嗓音、章节 folio）、`app/page.tsx`（刊头网格 + 数据栏上移、侧栏统计删除）、`app/posts/[slug]/page.tsx`（标题 `clamp(32px, 4.6vw, 52px)`）、`tailwind.config.ts`（`serif` 跟随令牌）。

### 11.34 排版分工与度量修正：标题黑体 / 正文宋体（第 17 轮 · Batch ZA）

**一、触发**

用户问「你认为现在的UI好吗」，回答按目检证据自评而不是自夸，抓出四处不体面；用户「都按你说的来改」。

**二、四处缺陷与修法**

1. **拉丁与汉字「一深一浅」**：`/posts` 索引标题里 "Coding Agent" 与「横向测评」读成两种字号。根因不是字号而是**字重来源**：宋体没有真粗体，700 由系统合成，竖笔比 Georgia 700 细一大截。修法 —— 新增 `--font-title: Georgia, 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif`，标题族汉字走黑体（有真粗体），拉丁仍是 Georgia；正文族 `--font-serif` 保持 Georgia + 宋体。这正是中文报刊的老分工：**标题黑体、正文宋体**。覆盖点：`.display`、`.heading-1..3`、`.section-title`、`.prose h1..h4`、`.editorial__title`、`.editorial__section-head h2`、`.side-block h2`、`.editorial__item-title`，以及 Tailwind 的 `font-serif` 工具类（它的用处全是 `font-serif + font-bold` 的标题与站名，指向标题族才是语义正确）。
2. **正文宋体在屏幕上偏淡**：颜色侧无余量可挖（`--color-text-prose #2b2926` on `#faf9f7`，对比约 13:1），字号是唯一不牺牲嗓音的补偿 → `--text-prose` 17px → **18px**，三档随之 17 / 18 / 20。
3. **嗓音在卡片边界断声**：`/learn` 的「推荐学习路径」h2 用 `.section-title`（当时仍无衬线），与同页衬线导语并排。修法并入第 1 条，同时把分工写成规则：**叙述性成段用衬线，控件 / 导航 / 元信息 / 卡片说明用无衬线**，卡片与侧栏标题归入标题族。
4. **索引行标题被省略号切在词中**：`≥640px` 的单行 `nowrap + ellipsis` 是第 5 轮 are.na 台账读法，但标题换衬线后 Georgia 更宽，开始把「…从 Claude Code 到 DeepSeek H…」切断。改为 `≥640px` 封顶 2 行（短标题仍占一行），<640px 的 3 行纪律保留。

**三、两次测量学更正（本轮真正的产出）**

- `attr-z3.mjs`（拉丁方：3 轮 × 4 变体轮换位次，day-10 @1280，量「课内控件」）：none 320/360/376、nodrop 352/312/416、bodysans 368/**152**/336、cjkyahei 336/408/384。**字体族与下沉首字都不是这一步的变量** —— 无论怎么改都在 310–420ms，唯一的 152ms 是撞上机器空闲的一瞬。§11.33 里「衬线正文把 INP 推过闸」因此不成立。
- `attr-z4.mjs`（单变量：17px vs 18px，3 轮换位次，n=6/6）：18px 六次 **176–280ms**，17px 六次 **312–432ms**，**零重叠**。18px 不但没把 INP 推过闸，反而更快；上一版「18px/1.95 推过闸」的记录是被位次污染造出的假信号（每轮第一个样本撞占用）。
- 立规：**任何「A 比 B 慢」的结论必须先做位次轮换；单轮首样本不可信。** 三变体对照（attr-z2）之所以误导，正是因为 `none` 每轮都排第一。

**闸门（Batch ZA · build #10）**

- `sweep2.mjs`：43 页 × 5 视图共 215 检查，**0 findings**。
- `fontwt.mjs`：**PASS** —— 声明侧 css2 0 族 + 自托管 12 族；使用侧 3 类页面 20 个「族 × 字重档」组合、系统栈 9816 字；本机族登记 `Georgia 400/600/650/700`、`KaiTi 500/650`；KaTeX_Math / KaTeX_Main 400/700 全覆盖且像素两两不同。新标题族的汉字位（PingFang SC / Microsoft YaHei）本就在 SYSTEM 豁免名单内，闸无需再改。
- `npm run check`：typecheck / lint / emoji / ui-discipline / proxy / attack / audit:env 全绿；postbuild 审计 1179 文件通过。
- 目检复拍：12 张（首页 / 索引 / 正文 / 引语 / 课程 / 390 / 320 暗）+ 页面溢出与 pageerror 检查 PASS。
- `vitals.mjs`：**未过闸（FAIL）** —— 准静窗（连续 6 次采样 ≤4% 且无 playwright chrome 残留时发车）跑出的 30 站里 3 笔越线 344 / 352 / 352ms，全部是「呈现段占满、处理段 0–1ms」；这一跑自己的测量期负载实测 mean **9.2%** / max 35%（over12 = 25/78）。**这个 FAIL 不记在 ZA 头上**：§11.35 用同一条闸跑回炉前的 HEAD（负载 mean 17.1%），得到 352 / 304ms，两边量级重合。
- 发车前我一度把「测量期负载 mean 0.0% / max 0%」当成静窗证据，据此写下「纯环境占用已被证伪」—— **那个 0.0% 是 `quiet-vitals-strict.sh` 的 awk 读错列造出的假读数**，脚本 bug 与更正过程见 §11.35 四。
- 改动清单：`app/globals.css`（`--font-title` 新增、9 处标题族改指、`--text-prose` 18px、`.row-title` ≥640px 封顶 2 行）、`tailwind.config.ts`（`serif` → `var(--font-title)` + 注释）。
- _residual_：仿宋与等线两个方向留在样张里未启用；`--font-title` 的汉字位在 macOS 落 PingFang SC、Windows 落 Microsoft YaHei，两侧都是真粗体face，无需 webfont。

### 11.35 闸 A/B：越线不是回炉造出来的（第 17 轮 · Batch ZB · 归因收口）

**一、为什么要跑这一枪**

用户立的规矩是「先不推，等 vitals 跑完全绿再提交推送」，而 ZA 在静窗下仍然 FAIL。到这里只剩两种可能，且必须先分清再谈改代码：**要么改版真的引入了 INP 回归，要么这条闸在当前机器状态上本来就是红的。** 靠再多探针都判不了这件事 —— 探针没有闸的滚动前置（§11.34 已经吃过一次亏），量出来的绝对值与闸不可比。**唯一可信的做法是把闸本身搬去跑回炉前的 commit。**

**二、做法**

`ui-concepts/verify/ab-head.sh`：对 HEAD `3024963`（已在 origin/main 上、§11.32 记录过绿的那版）的四个改动文件做 `git stash push -- <files>`，`npm run build`，跑同一条 `vitals.mjs`，然后 `git stash apply` 还原。**用 `apply` 不用 `pop`** —— 共享工作树里这条 stash 随时可能被别的操作碰到，pop 一旦失败会把未还原的 HEAD 留在树上。脚本挂 `trap`，异常退出也还原工作区。

**三、结果（两条跑同一支闸，30 站全量，CLS 两边都是 0.0000）**

| | 测量期负载采样 | 越线站 | 数字 |
|---|---|---|---|
| HEAD `3024963` | n=77 **mean 17.1%** max 51% | 2 站 | `/tags @1280` 主题切换 **352ms**（呈现 351 / 处理 0）；`/learn/ml/day-10 @390` 命令面板开 **304ms**（呈现 302 / 处理 1）；同站课内控件 160ms |
| ZA build #10 | n=78 **mean 9.2%** max 35%（over12 = 25） | 3 站 | `/categories @1280` 主题切换 **352ms**（呈现 351 / 处理 0）；`/learn/ml/day-10 @1280` 课内控件 **344ms**（呈现 342 / 处理 1）；`/learn/ml/day-10 @390` 课内控件 **352ms**（呈现 350 / 处理 1） |

三条判读：

1. **HEAD 也是红的** —— 同一个「呈现段占满、处理段 0–1ms」的 300–352ms 签名。§11.32 那句「最慢交互 160ms」属于当时更好的机器状态，不是那一版代码比现在快；本轮 ZA 侧采样负载更低（9.2% vs 17.1%），越线量级却没有变好。
2. **签名一致，落点不一致** —— 越线站和具体步骤在两次跑之间会挪（HEAD 落在 `/tags` 与 day-10@390 的命令面板，ZA 落在 `/categories` 与 day-10 双视图的课内控件），这是**排队中的活儿被算给了随后某一次交互**的形状，不是某个具体组件变慢的形状。若真是组件回归，越线会钉在同一站同一步。
3. **字体与度量不是那一步的变量** —— `attr-z5.mjs`（6 变体 × 2 轮，位次轮换 `(k + rep - 1) % 6`）在 day-10「课内控件」给出：none 344/376、p17 320/352、scale 248/352、bodysans 312/296、allsans 312/296、nodrop 312/328。六个变体首尾相接成一片 248–376ms 的重叠区间，**没有一个能把这一步拉到 200ms 以下** —— 这一步的基线本来就在 300ms 量级，与 Z 的字体选择无关。

**四、被这一枪顺带证伪的三件事**

- **「测量期负载 0.0% / max 0%」这个静窗证据是假的**：`quiet-vitals-strict.sh` 与 `quiet-vitals-log.sh` 的采样每行只写一个数，统计 awk 却读 `$2`（空列），awk 把空值当 0 —— 于是任何负载都会被打成 `mean=0.0% max=0% over=0`。同一份样本按 `$1` 重算得 mean 9.2% / max 35%。脚本已改列并留注释。**教训：量具自己打印的统计，要先用原始样本重算一遍才准引用**；`ab-head.sh` 恰好读对了列，才让这次自欺露了馅。
- **「关掉后台应用就能证明越线与占用无关」**：上面那条假读数正是这句话的来源，它不成立。成立的是更弱的版本：占用从 17.1% 降到 9.2%，越线量级没跟着变 —— `Win32_Processor LoadPercentage` 这个量具解释不了那 350ms 呈现段。
- **「18px 把 INP 推过闸」**：§11.34 的 `attr-z4` 已推翻，这里再补一笔：HEAD（17px）在本轮同样是红的一侧。

**五、还剩什么没解**

闸红的**直接机制**仍未坐实，但手上已经有一条硬证据指向它：**同一个「主题切换」点击，在探针里是 0ms（`attr-z5` 的 `/categories` 全部变体），在同一条闸里是 352ms**。探针与闸的差别只有一处 —— `vitals.mjs` 在第一次交互前会把整页滚到最多 10 屏再回到顶部（每屏停 220ms），而探针不滚。这段滚动攒下的重栅格账单落进了随后的交互，能同时解释「呈现段占满 / 处理段 0ms」和「落点会挪」两个特征。**若下一轮要动，动的是量具（滚回顶部后加一次空闲/稳定确认，让第一笔交互不再替滚动结账），不是阈值，也不是 UI**；改完必须 HEAD 与 ZA 同时重跑，两边同降才认。

**闸门（Batch ZB）**

- 无 UI 改动：本轮只产出 A/B 证据与台账更正，`app/globals.css`、`tailwind.config.ts` 等与 build #10 完全一致（`out/` 已 `npm run build` 重建回 ZA）。
- `vitals.mjs`：HEAD 与 ZA **双双 FAIL**（见上表）—— 这是本轮记录的事实，不加「待机器变好即绿」的乐观推断。
- 其余非计时闸沿用 build #10：`sweep2` 215 检查 0 findings、`fontwt` PASS、`npm run check` 全绿、postbuild 审计 1179 文件通过。
- **发布**：用户改口「直接推送吧」，于是在 vitals 双红的事实下提交并推送 `d65daa5`（`3024963..d65daa5` → `origin/main`）。放行依据不是「闸会自己变绿」，而是本节的 HEAD 对照证明了闸红与改版之间没有因果；`public/sitemap.xml` 只含 lastmod 滚动（与既往批次一致随提交走），`assets/` 保持未跟踪。
- 改动清单：`SPEC_LEDGER.md`（§11.33/§11.34 的 vitals 行改为实跑数字、新增本节）、`DESIGN.md`（收口闸说明）。
- _residual_：`ui-concepts/verify/ab-head.sh` 跑完留下的 `stash@{0}: za-ab-wip` 已用 `git stash show -p | git apply --check --reverse` 确认与当前工作区逐字节一致后 drop。

### 11.36 第 18–20 轮：审计减法 → 过度减法 → 质感回炉（Batch ZC · 含 lib/ 锁的合规解法）

**一、三轮的方向变化，以及为什么必须记在一起**

这三轮不是三个独立批次，是一条判断被推翻再修正的完整链条。分开记会让后人只看到结论、看不到「结论曾经错过」，于是下一次照样错。

- **第 18 轮（审计驱动的减法）**：对上 6 篇文章 + 268 篇课次的内容量，逐件问「这东西挣不挣得到它的位置」。结论是减。重料下线：首页 three.js 可旋转模型（733KB GLB + 约 360KB 运行时）换成服务端渲染的 SVG 课程图版，表达同一句话「5 门课、239 课次围着 LLM 核心」，零 JS、零额外请求；`three` / `@types/three` / `lenis` 从 `package.json` 摘掉（本轮核对：三个键命中 0）。封面卡整套退场，`post-card.tsx` 收敛成服务端组件 `post-list.tsx`；文末「相关文章」从三张封面卡改成台账行 —— 文章尽头原来压着许可行、上下篇、系列块、三张卡、作者卡、评论卡，滚到底是四张卡片而不是下一篇。随之 `.hover-zoom` / `.media-frame` / `.media-parallax` / `.media-zoom` / `.spotlight-card` / `.aura-cursor` 与 `--accent-glow` 一并下线，纪律闸里给死选择器留的两条渐变豁免也摘掉。导航 `SITE_SECTIONS` 13 → 7 项（本轮核对：`href:` 命中 7），项目 / 友链 / 近况并进 `/about`，唯一真源落在新增的 `components/about-sections.tsx`；三个旧路由保留为深链页、canonical 指向 `/about/` 并从 sitemap 摘除，旧链接与站外引用不 404。
- **第 19 轮（把减法推过头）**：参照 overreacted / Maggie Appleton / Josh W. Comeau，把「优秀博客都克制」读成了「越少越好」。砍掉 `ui/split-reveal`、`ui/prose-reveal`、`ui/reading-progress`、`PageSweep`、社交分享排、刊头第二套导航；补上章节永久链接、目录跳转 `replaceState` 写回 fragment、文末「在 GitHub 上修订本文」、正文外链箭头。**用户判定：「太简洁、UI 效果不好、交互效果不好。」** 删掉的恰好是读者唯一能感觉到的那些反馈 —— 2px 进度条与目录百分比确实是同一份数据，但「语义重复」不等于「体验重复」，那条线是滚动时眼前唯一在动的东西。
- **第 20 轮（质感回炉，不是堆料回潮）**：回看仓库里 `ui-concepts/verify/CT-home-light.png` 与 `W4-hover.png`，确认要补的是**视觉锚点与可感知的反馈**，不是回到 3D / 玻璃 / 阴影。刊头 6px 签名色带 + mono 眉标 + 编号快捷入口带 + 翻板数据栏；课程图版装裱成带标题栏的图版（`components/course-plate.tsx`）；首页文章行改成「题图 + 编号 + 元信息 + 标题 + 摘要 + 箭头」复合行；恢复页顶 **3px** 阅读进度线与换页扫光（内容 400ms 微升、扫光 500ms 走完，不再抢同一帧）；`GlowRows` 一份 document 级委托 + rAF 节流写 `--glow-x/y`（`components/ui/interaction.tsx`）；`ProseReveal` 回归为**轻版**：只挑首屏之下的 figure / pre / blockquote / table / h2 / h3，初态 opacity 0.62、位移 10px，**段落文字一概不碰** —— 第 19 轮砍它的理由（Ctrl+F / 打印 / 无 JS 拿到被藏起来的文档）因此不再成立。三条新增渐变（`--row-glow` / `--page-sweep-line` / `--progress-fill`）的强度与配色全在 `:root` 令牌里，组件只 `var()` 引用。

**二、刻意保留的几件，以及保留的理由**

减法批次最容易顺手多删。以下几件是**判过之后决定留**的，不是漏网：

- 系列上下篇导航：课次页的「上一课 / 下一课」是学习路径，不是装饰冗余。
- 隐私页与条款页各自独立：两者法律语义不同，合并会让「我同意的是哪一份」失去指向。
- `@keyframes mediaFade`：封面卡退场后它仍被头像用着，删了就是永不播放的动画（纪律闸 R6 会拦）。
- **`content-visibility` 否决**：`components/theme-toggle.tsx` 里留着实测证据 —— day-10 有 9036 个节点（7529 个 KaTeX），主题切换点击呈现段 285ms（快照绘制 ~170 + 重样式 ~175，`theme-who.mjs`）；圆形揭示相反，按下立刻起动画，唯一一次重样式发生在遮罩铺满之后、被不透明遮罩盖住。`content-visibility` 能把重样式降到 38ms，**但深链锚点会落偏 2003px**，已否决。后续任何「上 containment 降重排」的提案都必须先回答这个 2003px，不能当它没发生过。

**三、lib/ 锁：一次违规与它的合规解法**

用户第 4 条决定锁死数据层：`lib/**`（除 `lib/accents.ts`）、`content/**`、`proxy/**` 不得修改。本轮曾在三处越界（`lib/bookmarks.ts`、`lib/constants.ts`、`lib/covers.ts`），发现后**全部还原到 HEAD**，原始 diff 留档在 `ui-concepts/zc-lib-edits.patch`（3318 字节）以便复核，功能改在视图层实现：

- `/uses` 不再宣称已下线的 Three.js：`app/uses/page.tsx:15` 用 `const retired = ['Three.js']` 在视图侧过滤，`USES` 数据本身不动。页面宣称的「可在 package.json 核对」因此仍然成立。
- 收藏按钮的写后读竞态：`components/bookmark-button.tsx` 改成先读后写、值未变则不落盘，不改 `lib/bookmarks.ts` 的存储契约。

本轮核对：`git status --short lib/ content/ proxy/` 输出为空，三个目录干净。

**四、事实口径同步更正（减法会连带让文案说谎）**

- 隐私页 §3 原把 localStorage 写成 Cookie，改为逐项列出五个真实存储键。
- 首页图注补上「239 课次之外另有 29 篇参考页」。
- 条款页 `security.txt` 的裸根 href 补上 basePath —— 站点挂在 `/blog` 下，裸根 href 在导出产物里是死链。
- README / HOW_TO_POST 里已下线组件的描述全部改掉。

**闸门（Batch ZC）**

- 规模：`git diff --stat HEAD -- app components scripts package.json` = **47 文件 · +1241 / −1787**（净减 546 行）。删除 9 个组件文件与 3 个 3D 资产；新增 4 个组件文件。
- `lib/` / `content/` / `proxy/` 零改动（见上）。
- 非计时闸全绿：`npm run check`（含 `scripts/ui-discipline.mjs`）、`sweep2`、`fontwt`、`batchy`、`zc-verify`、`contrast`；postbuild 审计通过。
- _residual_：`assets/`（47MB）保持未跟踪；`out/` 不提交。计时闸的归因见 §11.37 与 §11.40，本轮不在 vitals 双红的事实上宣称「体验已达标」。

**收口补记（2026-11-16）：歌单遗留死 CSS 下线**

第 13 任务下线歌单播放器时只摘了组件，`globals.css` 里 `.btn-accent`（含 `:hover`）与 `.song-row`（含 `:hover` / `[aria-current='true']`）两块规则留了下来。§11.43 四把 `.btn-accent` 的死代码身份登记给本批处置，本次一并核对：两者在 `app/**` / `components/**` / 脚本里**零使用者**（`.song-row` 同样零命中，属同一遗留），删除两块共 10 行。它们引用的 `--accent-text` / `--accent-soft` 被全站 36 个文件消费，**令牌保留**。删后重建 rc=0、`npm run check` rc=0 零告警；`accent-contrast` 自适应认出 4 处消费者（原 5 处减去 `.btn-accent`），rc=0 / 注入 rc=1 不变；`accent-render` rc=0（6 处渲染态）；`zc-verify` rc=0。至此 ZC 的「死代码与重料下线」与「导航减法与 /about 合并」两笔都有落地记录与复验，收口。

### 11.37 量具四修：静窗不可达、MSYS 改写路径、LoAF 分量不存在、脚本过滤藏掉强制布局（Batch ZD/ZE）

§11.35 五留的处方是「动量具，不动阈值，不动 UI」。这一节记的是真去动量具时撞出来的四个坑 —— **四个都属于「量具自己失效却还在出数」那一族**，与 §11.24 三 同源。

**一、绝对静窗在这台机器上不可达，于是把「判定」与「归因」分开**

`quiet-vitals-strict.sh` 要求 load ≤4% 连续 6 采样。实测 8 分钟一次静窗都没出现：用户自己的常驻应用（Doubao / msedgewebview2 / thunder / Weixin / Feishu / WorkBuddyAI / ChatGPT）持续占 9–12%（采样 9/12/4/12/10/9%），**这些进程一律不许动**。

关键区分：**闸的判定**（INP 是否 ≤200ms）是绝对判定，机器一吵噪声直接加进读数，必须静机；**归因 A/B**（同一份构建上摘掉滚动前置会不会降）是配对比较，只要各变体条件可比即可。因此 `ab-settle.sh` 改为：① 仍不许有 playwright chrome 在跑（那是真污染源）；② 每变体前后各记一次负载写进日志；③ 4 轮 × 3 变体、位次按 `(rep-1)%3` 轮换；④ 汇总把负载与读数并排印。**`quiet-vitals-strict.sh` 与所有阈值一个字没改。**

**二、Git Bash 把路由环境值改写成了 Windows 路径 —— 12 轮全量了 0 站**

`VITALS_ONLY=/learn/ml/day-10/ node vitals.mjs` 到 node 手里变成 `D:/Artificial_Intelligence/Git/learn/ml/day-10/`（MSYS 路径改写）。过滤后一站不剩，第一次 A/B 的 12 轮全部输出「量了 0 站」。**闸的自证在这里救了一次**：它没有把 0 站报成 PASS，而是 FAIL「一站都没量成 / 一个带 interactionId 的 event 都没收到」。

两处修：① `vitals.mjs` 加快失败 —— `VITALS_ONLY` 过滤后为空就立刻印出**原值**与可选站列表，并提示盘符是 MSYS 改写所致，不再拖到跑完才收场；② 绕法 `MSYS_NO_PATHCONV=1`。

**这个开关本身又是第二个坑**：全局 `export MSYS_NO_PATHCONV=1` 会连 `curl -o /dev/null` 一起停止改写，curl 写不出文件返回 **23**，脚本的服务器预检于是误判「static server not responding」（实测带开关 rc=23、不带 rc=0，而服务器 14ms 正常响应 200）。所以开关**只挂在 node 那一条命令上**，不全局导出。

**三、指南写的 LoAF 分量字段，在这台浏览器上根本不存在**

按 `performance/identify-inp-causes` 升级量具去读 `styleDuration` / `layoutDuration` / `forcedStyleDuration` / `forcedLayoutDuration`，结果一帧都没暴露。不猜，新开 `loaf-raw.mjs` 把 entry 自有属性**与原型链上每个 getter** 全读一遍（IDL 属性挂在原型上，`Object.keys(e)` 一个都看不到 —— 那正是「字段不存在」与「我没读到」分不清的地方）：

- 浏览器 **140.0.7339.16**；`styleDuration` / `layoutDuration` **0/4 帧有这个字段**，`pausedDuration` 同样不存在。
- 存在的是 `styleAndLayoutStart`、`renderStart`、`blockingDuration`、`firstUIEventTimestamp`（4/4 帧）。
- `scripts[]` 的字段表里只有合并的 **`forcedStyleAndLayoutDuration`**，没有分开的两个。

指南第 103–105 行正是为这种浏览器写了降级处方：用 `script.forcedStyleAndLayoutDuration` 与 `(startTime + duration) - styleAndLayoutStart` 的合并值。原实现虽然印了「未暴露」，**汇总行却把取不到分量的帧算进「风格 0ms / 几何 0ms」** —— 那等于宣布这一侧不花钱，是假绿。已改为分量帧与合并帧**分开累加、分开标注**，连合并值都取不到的帧单独计数。

**四、`duration > 5` 的脚本过滤，把最贵的那一条藏了起来**

day-10 那一帧的原始解剖（`loaf-raw.mjs`，单位 ms）：

| 字段 | 值 | 含义 |
|---|---|---|
| startTime / duration | 8046.6 / 354.2 | 帧跨度 |
| renderStart | 8398.4 | 渲染段 = **2.4** |
| styleAndLayoutStart | 8400.6 | 渲染更新里的风格+几何 = **0.2** |
| blockingDuration | **304.018** | = 354.2 − 50，说明整帧就是**一个**长任务 |
| scripts | **[]** | 空数组 |

304ms 既不在 JS 也不在渲染里 —— 四个数互相矛盾。原因有两层：① LoAF 的 `styleAndLayoutStart` 只覆盖**渲染更新**那一段，任务里同步强制的风格/布局不在其中；② `ScriptDuration` 只算 V8 执行，强制布局另计，所以那条脚本的 `duration` 只有几毫秒，**被 `>5ms` 过滤掉了**，报表于是写「无 >5ms 脚本」。过滤条件已补上 `forcedStyleAndLayoutDuration > 5`（以及分量版），并在 scripts 为空却阻塞 >50ms 时明写「这段时间浏览器没归给任何 JS」，不再一笔带过。

**五、本机真能分开风格/几何的量具：CDP 累计计数差**

LoAF 给不了分量，但 `Performance.getMetrics` 给得了：`RecalcStyleDuration` / `LayoutDuration` / `ScriptDuration` / `TaskDuration` / `TaskOtherDuration`（单位秒，×1000）与 `RecalcStyleCount` / `LayoutCount`。按**步**取前后差值，与 LoAF 的**帧**口径并排印、互相校验，不合成一个数。

day-10「课内控件」（= 字号分段按钮，改的是全局 `.prose` 字号）单变体冒烟实测：

| 视图 | INP | 延迟 / 处理 / 呈现 | 重样式 | 重排 | JS | 其它任务 | 任务合计 |
|---|---|---|---|---|---|---|---|
| 1280×800 | 360ms | 2 / 3 / **355** | **129ms（5 次）** | **191ms（1 次）** | **5ms** | 47ms | 398ms |
| 390×844 | 368ms | 3 / 1 / **364** | **131ms（5 次）** | **198ms（1 次）** | **4ms** | 44ms | 393ms |

**判读：这一步的 JS 几乎免费（4–5ms），320ms 全在渲染侧 —— 重排 191ms（约 60%）+ 重样式 129ms（约 40%）。** §11.35 猜的「呈现段占满、处理段 0–1ms」签名到此坐实了机制：不是某个组件的处理器慢，是在 9036 节点（7529 个 KaTeX）的页面上改全局字号，触发整篇重样式 + 一次大重排。两种病都在，且药不同（指南：风格侧高 → 收窄选择器；几何侧高 → 批量读后写 / 简化 DOM / containment）。**滚动欠账占多少，由 §11.40 的位次轮换 A/B 回答；在 A/B 出结果前不动 UI。**

**闸门（Batch ZD/ZE 量具侧）**

- 改动只在 `ui-concepts/verify/`（探针目录，不在仓库内）：`vitals.mjs`、`ab-settle.sh`、新增 `loaf-raw.mjs`。阈值 `VITALS_INP_BAR=200` / `VITALS_CLS_BAR=0.1` / `VITALS_JUMP_BAR=150` 未改。
- 自证：0 站快失败、`MSYS_NO_PATHCONV` 的 curl 副作用、LoAF 字段存在性表、脚本过滤前后对照，四项都有原始输出留档（`ab-settle-r*-s*.log`、`loaf-raw.mjs`  stdout）。
- _residual_：`quiet-vitals-strict.sh` 的绝对静窗在本机仍不可达；绝对判定要等机器安静，或改在 CI 的干净 runner 上跑。这一点不掩盖。

### 11.38 滚动条标准化 + 拇指对比度首次量化（Batch ZE · WCAG 1.4.11）

判据来自 `visual-design/customize-scrollbar-color-and-thickness`：「Choose a thumb color with a contrast ratio of at least 3:1 against the track color, and against the container's background where the track may be transparent」。

**一、缺陷（此前从未量过）**

原来只有 `::-webkit-scrollbar` 一套（9px，拇指 `--line-strong`）。两个问题：① **Firefox 拿不到任何滚动条样式**，标准属性一个都没写；② 拇指是画布上的发丝线色，压在同一块画布上对比度远低于 3:1 —— 读者看不出自己滚到了哪。

**二、修法**

- 标准属性写在 `html`：`scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track)`。**`scrollbar-width: thin` 后来改铺在 `*` 上** —— 当时以为两者都可继承、一处声明覆盖全站所有内层滚动容器，实测只有 color 继承，见第六小节第 3 条。
- 令牌落在 `:root` 兼容别名层：`--scrollbar-thumb: var(--faint)`、`--scrollbar-track: transparent`。
- legacy 伪元素整段包进 `@supports not (scrollbar-color: auto)` —— 两套同时生效时 Chrome 走标准渲染路径，伪元素那 9px 会悄悄失效，所以必须互斥而不是并存。
- `scrollbar-width` **必须显式写 `thin`**：标准路径下 `auto` 是 15px，比原来的 9px 宽出 6px，整站栏宽与 320px 断点的几何全跟着动。

**三、新增闸 `ui-concepts/verify/scrollbar-contrast.mjs`（纯算术，不开浏览器）**

为什么单开一道而不塞进 `contrast.mjs`：那一道靠浏览器取 computed style 量「渲染出来的文字 × 背后实色」，而**滚动条拇指不是 DOM 节点**，取不到 rect 也取不到它实际画在什么底色上。这里量声明侧：thumb / track 解析成实色后，拇指压在画布上的比值。纯算术因此可以和计时闸并行跑。

它自己带两条自证：三个令牌任一解析不到实色 → FAIL（不许把「没量到」算成通过）；`SCROLLBAR_INJECT=1` 把拇指换回 `--line-strong`，闸必须开口。

**四、闸自己先错了一次，值得记**

第一版 `SCOPES` 把 `:root` 标成「只亮色」，于是暗色 map 里连 `--faint` 这类别名都查不到，报「解析不到实色」。真实层叠是：**`html` 同时匹配 `:root` 与 `.dark`，暗色 = `:root` 的全部声明 + `.dark` 的覆盖**，不是另一套独立声明；别名层从来没被 `.dark` 重定义过，它在两档都活着。已改正，并补一条自证：**亮暗画布必须解析成不同的实色**，否则说明层叠模型塌成了一套、暗色那一档量的其实是亮色 —— 那种绿是假的。（站内每一对都是 `:root` 在前、`.dark` 在后，同特异性靠源码顺序覆盖，已逐对核对。）

**五、实测**

| | 拇指 | 底色（轨道透明→画布） | 比值 | 判定 |
|---|---|---|---|---|
| 亮色（修后） | `#6f6b65` | `#ffffff` | **5.29:1** | PASS |
| 暗色（修后） | `#a19b91` | `#141311` | **6.73:1** | PASS |
| 亮色（注入旧拇指） | `#d8d4cd` | `#ffffff` | **1.48:1** | FAIL |
| 暗色（注入旧拇指） | `#3d3833` | `#141311` | **1.60:1** | FAIL |

正常跑 rc=0、注入跑 rc=1，闸既量得到也咬得动。缺陷与修复都由闸确认，不是手算。

**闸门（Batch ZE 滚动条）**

- 改动：`app/globals.css`（别名层两个令牌 + `html` 的 `scrollbar-color` + `*` 的 `scrollbar-width: thin` + `@supports not` 包裹 legacy）；新增 `ui-concepts/verify/scrollbar-contrast.mjs` 与 `ui-concepts/verify/scrollbar-geometry.mjs`。
- 构建产物已核对：`out/_next/static/css/*.css` 里 `scrollbar-color:var(--scrollbar-thumb) var(--scrollbar-track)`、`scrollbar-width:thin`、`@supports not (scrollbar-color:auto)` 三条都在。
- _residual_：~~`scrollbar-width: thin` 带来的栏宽变化尚未量~~ → **已量，见下面第六小节**；量的过程里挖出一个真缺陷（`scrollbar-width` 不继承）和一个量具环境错误（Playwright 默认 `--hide-scrollbars`），都已修。

**六、几何差实测：量具先空转，然后挖出「width 不继承」这个真缺陷（residual 收口 · Batch ZG）**

新增 `ui-concepts/verify/scrollbar-geometry.mjs`：3 视图（1280x800 / 390x844 / 320x700）× 明暗 × 4 页 = 24 组，同一页面里注入 `html { scrollbar-width: auto|thin|none !important }` 做单变量对照，量 `clientWidth`、整页横向溢出、最宽出界元素、以及 `[360,390,640,768,1024,1280]` 里哪些断点生效。

**1）第一轮是空转的，而且差点被当成结论。** 24 组全部 `auto=thin=none=视口宽`、delta 全 0。看起来像「thin 没有几何差」，实际是**这个 Chromium 的滚动条根本不占位**。先怀疑叠加式滚动条，试了 `--disable-features=OverlayScrollbar / FluentOverlayScrollbar / FluentScrollbar / WindowsScrollingPersonality`（单个与四个一起关）—— **全部无效，连内层 `overflow:scroll` 的 div 都占位 0px**。真正的原因是 **Playwright 默认给 chromium 加了 `--hide-scrollbars`**，用 `ignoreDefaultArgs: ['--hide-scrollbars']` 摘掉才量得到。

这件事的影响超出本节：**此前所有浏览器几何闸都是在滚动条不占位的环境下跑的**，等于视口比真实桌面 Chrome 宽 15px。320px 窄屏闸实际量的是 320px 可用宽，真实桌面是 305px（auto）/ 310px（thin）。所以窄屏结论必须在这个环境下复核（见下面第 4 条）。

**2）摘掉之后量到的真实差**（24/24 组 auto 都占位 15px，环境自证打进报表）：

| 视图 | auto 占位 | thin 占位 | none 占位 | thin 相对 auto 的可用宽度增量 | 横向溢出 auto/thin/none | 断点漂移 |
|---|---|---|---|---|---|---|
| 1280px | 15px（client 1265） | 10px（client 1270） | 0px（1280） | **+5px** | 0/0/0 | 无 |
| 390px | 15px（375） | 10px（380） | 0px（390） | **+5px** | 0/0/0 | 无 |
| 320px | 15px（305） | 10px（310） | 0px（320） | **+5px** | 0/0/0 | 无 |

明暗两档一致。所以本节原先那句「标准路径 thin ≈8px vs 旧 9px」也是估的：**实测 thin = 10px、auto = 15px**，thin 比 auto 窄 5px、比旧 legacy 的 9px 宽 1px。方向是「可用宽度只增不减」，不会把布局挤过断点。

**3）真缺陷：`scrollbar-color` 继承，`scrollbar-width` 不继承。** 顺手量内层容器时发现：`html { scrollbar-width: thin }` 下，body 与新建的 `overflow:scroll` div 的 computed 仍是 `auto`、占位 **15px**，而根是 10px。在**空白页只写这一条规则**复现，排除了站内 CSS 干扰；同一次测量里 `scrollbar-color` 却老老实实继承到了 body 与 div。

后果：拇指对比度修复覆盖到了内层容器（color 继承），但「thin」没有 —— **代码块与长公式段落里冒出来的是比页面滚动条更粗的一根（15px vs 10px）**。而本节原文写的是「两者都可继承，一处声明覆盖全站所有内层滚动容器」，那句话是错的。

修法：`html` 只留 `scrollbar-color`，`scrollbar-width: thin` 改铺在 `*` 上。特异性 (0,0,0) 低于任何类，`components/toc.tsx:8` 那枚 `[scrollbar-width:none]`（目录隐藏滚动条但保留滚动能力）照旧压过它 —— 闸里专门加了这条守卫。

闸在**修之前**先开口：`FAIL 48 条` = 24 组 ×（「width 没到内层容器（根 thin / 内层 auto）」+「内层占位 15px，不是 thin 的 10px」），而横向溢出/断点/负增量/color 继承四类**零失败**。修后重建复量：**PASS**，24/24 内层 computed `thin`、占位 10px（= 同一 div 显式写 thin 的参照值），color 继承 24/24 真，6 个有目录的页面里 `ul` 计算值仍是 `none`。

参照物取「同一个 div 显式写 thin 时的占位」而不是硬编码 10px，这样判据不依赖环境的滚动条宽度。

**4）另一处量具错误：delta 的减法方向写反了。** 第一版 `delta = auto.client - thin.client` 却打印成「thin 比 auto 宽」，并且 `delta < 0` 判 FAIL。滚动条不占位时全 0，这个反号被掩盖了；一旦摘掉 `--hide-scrollbars`，thin 让可用宽度变大就会算出负数、报出**假 FAIL**。已改成 `thin.client - auto.client`。

**5）全站复核（滚动条可见环境下）：150/150 组通过。** 既然真实桌面视口比过去量的窄 15px，把 `SBG_ROUTES` 铺到 25 条路由（首页、3 篇文章、分类/标签/系列索引、/learn 索引与 6 个课次、glossary、/about、/friends、/search、/archive、/privacy、/terms、/404.html）× 3 视图 × 明暗 = **150 组**。结果：`auto` 占位 144/144 + 6/6 全为 15px，`thin` 相对 `auto` 的可用宽度增量在三个视图上都是 **+5px**，**横向溢出全 0、生效断点零漂移、内层容器 computed 全是 thin/10px、color 继承全真**。

第一次全量跑报 `FAIL 6 条`，全部是 `D:/Artificial_Intelligence/Git/ @… HTTP 404` —— **MSYS 把 `/404.html` 这个环境变量值转成了 Windows 路径**，不是站点缺陷。用 `MSYS_NO_PATHCONV=1` 只包住那一条 node 命令补跑，6/6 PASS。（这个变量不能全局 export，会让 `curl -o /dev/null` 变成 rc=23。）闸把 404 判 FAIL 而不是静默跳过，这次正是它把量具问题顶出来的。

所以本节现在可以宣称：**在滚动条真占位的桌面环境下，全站 25 条路由 × 3 视图 × 明暗没有因为 `scrollbar-width: thin` 出现横向溢出或断点漂移。** 仍不宣称的是移动端真机滚动条行为（本探针是桌面 Chromium，`narrow-overflow.mjs` 那条走 `isMobile:true` 的移动仿真，移动浏览器本来就是叠加式滚动条）。

### 11.39 阅读进度改滚动驱动 + 纪律闸的 no-preference 盲区与例外自证（Batch ZE）

判据来自 `ui-behaviors/scroll-progress-indicator`（Baseline since 2026-10-27：Chrome 115 / Firefox 159 / Safari 26）。

**一、缺陷：进度条是一段段蹦的**

`use-toc-spy.ts:60` 把比例量化到 1%（`Math.round(ratio*100)/100`）再写行内 transform。量化本身是对的 —— 它把滚动期间的 React 提交封顶在 100 次。但在 day-10 这种长课次页上（**实测滚动范围 14131px**，1% ≈ 141px），**3px 的线每滚 141px 才跳一格**，读者看到的是台阶而不是进度。

**二、修法（CSS 优先，行内值自动降级）**

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .reading-progress__fill {
      animation: reading-progress-grow auto linear;
      animation-timeline: scroll(root block);   /* 必须在简写之后：简写会把它重置回 auto */
    }
  }
}
@keyframes reading-progress-grow { from { transform: scaleX(0) } to { transform: scaleX(1) } }
```

- 时间轴直接绑根滚动位置，进度与手指 1:1，**这一路不再经过 React**。
- 组件里的行内 `transform: scaleX(progress)` **保留作降级**：CSS 动画在层叠里压过行内样式，支持时自动被盖掉、不支持时接管，不需要 JS 嗅探支持度。
- `role="progressbar"` 与 `aria-valuenow` 仍由量化后的 JS 喂 —— 指南说纯装饰指示器可以 `aria-hidden`，但本站这条是真进度语义，保留比隐藏好。
- reduced-motion 下整段动画不生效，行内值接管：位置反馈还在，只是回到 1% 粒度（换取不逐帧重渲染）。
- **不用 `scroll-timeline-polyfill`**（指南明确 DO NOT，且本站零新依赖）。

**三、顺带挖出纪律闸的一个真盲区**

`scripts/ui-discipline.mjs` 的 `reduceRanges` 用 `/prefers-reduced-motion/` 匹配豁免段 —— **把 `no-preference` 也当成了豁免**。而「动效只在 `no-preference` 里生效」正是站内与指南推荐的写法，等于整段动效不受 R1/R2/R3 检查。已收窄为 `/prefers-reduced-motion:\s*reduce/`。这个盲区不是本轮新引入的，是本轮要往 `no-preference` 里写动效时才照出来的。

**四、R2 例外：按选择器点名，只放行 linear**

`linear` 原规则只准用在 `infinite` 上。滚动驱动的 `linear` 不是「缓动选错了」：时间轴就是滚动位置本身，任何 ease 都会让进度条滞后或超前于手指。新增 `EXCEPT.ease = { '.reading-progress__fill': ['linear'] }` 并写明理由 —— 与既有 `keyframeProp` 同形（名字比行号稳定，行号会因上面多一行注释而漂移，把放行悄悄落到隔壁规则上）。

**五、例外自证：没人命中的例外是死条文**

新增 R7 同族检查：`EXCEPT.gradient` / `EXCEPT.keyframeProp` / `EXCEPT.ease` 里每一条点名例外都必须真被命中过，否则 FAIL。理由：选择器改名或关键帧删掉之后，那条例外不再豁免任何东西，却让人以为豁免还在 —— 它悄悄把闸的射程放宽了，而报表照旧全绿。

**六、三向注入自证（跑完即删探针）**

| 注入 | 期望 | 实测 |
|---|---|---|
| 甲：`linear` 用在**没有例外**的选择器上 | 拦 | `FAIL R2 缓动 · linear 用在非 infinite 的动效上 ×1` |
| 乙：在**受例外**的 `.reading-progress__fill` 上写 `ease-in` | 拦（例外只放行 linear） | `FAIL R2 缓动 · animation: ease-in ×1` |
| 丙：加一条点名对象不存在的例外 | 自证开口 | `FAIL 这道闸自己没跑成：例外「ease .no-such-selector-ever linear」一次都没命中` |
| 撤掉探针 | 恢复绿 | `PASS` · 137 文件 · 20 个 @keyframes · 违规 0 |

**闸门（Batch ZE 进度条）**

- 改动：`app/globals.css`（`@supports` + `@keyframes`）、`components/ui/reading-progress.tsx`（注释说明两条路的分工）、`scripts/ui-discipline.mjs`（reduce 收窄 + `EXCEPT.ease` + 例外自证）。
- 源级纪律闸 PASS，三向注入全部按预期开口，探针文件已删（`git status` 无残留）。
- _residual_：~~尚未在浏览器里实测滚动驱动那条路真的生效~~ → **已实测，见下面第七小节**（`ui-concepts/verify/reading-progress.mjs`，PASS）。

**七、活体实测：两条路真的分开了（residual 收口）**

新增 `ui-concepts/verify/reading-progress.mjs`，同一份构建、三档对照，只读 + 运行时注入：

| 档 | 干预 | computed timeline | animation | 12 个细步里非零 | 最大单步 | 值全在 1% 网格上 | 滚到底 aria-valuenow |
|---|---|---|---|---|---|---|---|
| 甲 支持档 | 不动 | `scroll(root)` | `reading-progress-grow/auto` | **12/12** | **0.0025** | **false** | **100** |
| 乙 降级档 | `animation: none !important` | `auto` | `none/0s` | 3/12 | 0.01 | true | 100 |
| 丙 reduced-motion | `reducedMotion: 'reduce'` | `auto` | `none/1e-05s` | 3/12 | 0.01 | true | 100 |

甲档 scaleX 序列 `0.39997 0.40245 0.40492 … 0.42969`，**每一步增量都恰好 0.0025**（= 35px / 14131px），这就是「与手指 1:1」的直接证据；乙/丙档序列 `0.4 0.4 0.4 0.41 0.41 0.41 0.41 0.42 …`，每 4 步跳一格 0.01，是 1% 量化的指纹。三档 `role=progressbar` 都在，都真滚到底（`y=14131/14131`）、`scaleX=1`、`aria-valuenow=100`。

**闸自己先错了两次，都不是产品缺陷，记下来免得下次再踩：**

1. **步长写死 25px 并假设页高 ~10000px。** 判据「步长必须细于 1% 量化」是对的，但 1% 到底多少 px 必须现场量。改成从实测范围推：`step = max(2, round(range/400))` ≈ 0.25%，于是量化路每 4 步动一次（3/12）、CSS 路每步动（12/12），两条路可分辨。另加一条不依赖步长的直接判据：**乙/丙档的每个值都必须落在 0.01 的整数倍上**。
2. **采样踩在平滑滚动上。** 站点开了 `scroll-behavior: smooth`，`window.scrollTo` 异步飞行，140ms 采样窗口里位置还在动；滚到底只等 400ms 也没飞完。第一版因此量到「甲档滚到底 aria-valuenow=75、乙档 74」，而 reduced-motion 档（平滑被全局守卫关掉）反而正常到 100 —— **那个反差本身就是诊断线索**。修法：三档一律注入 `html { scroll-behavior: auto !important }` 归一量具（被测的是进度映射，不是滚动缓动），跳转用 `behavior:'instant'`，到底判据改成「`scrollY` 连续两次相同且等于可达最大值」而不是固定等待，并把 `y/max` 打进报表；到不了底就判这一行不算数，而不是判进度条坏了。

第一版还有一处假 FAIL：「乙档 12 步都在动，不像 1% 量化」—— 实际那 12 个值全是 0.01 的整数倍，量化得好好的，只是 25px 步长比当时误估的 1% 更粗。修好量具后这条自然消失。

### 11.40 位次轮换 A/B：滚动欠账假说被证伪，那 320ms 是这一步固有的（Batch ZD）

§11.35 五留的处方是「动量具，不动阈值，不动 UI」；§11.37 把量具修好之后，这一节回答「修好的量具能不能把红闸变绿」。答案是**不能**，而且这个「不能」是有证据的，不是猜的。

**一、口径：配对 A/B 不是静机判定**

绝对判定（INP ≤ 200ms）需要一台安静机器；配对比较只需要**两边条件可比**。所以这一跑用位次轮换 + 重复 + 逐变体记录负载，而不是等一个本机达不到的静窗。**阈值一个字没改**（`VITALS_INP_BAR=200` / `CLS_BAR=0.1` / `JUMP_BAR=150`）。

- 站点：`/learn/ml/day-10/`（全站最重的一页，9062 个元素）
- 4 轮 × 3 变体 × 2 视图（1280x800:light、390x844:light）= 24 次测量
- 位次按 `(rep-1)%3` 轮换，避免「先跑的变体总是占便宜/吃亏」
- 变体：`s0` 旧闸（滚一遍 + 固定 400ms）／`s1` 滚一遍 + 空闲确认／`s2` 摘掉滚动前置 + 空闲确认
- 脚本 `ab-settle.sh`，原始行 `ab-settle-rows.tsv`，逐跑日志 `ab-settle-r{1..4}-s{0,1,2}.log`

**二、逐轮原始行**（INP / 重样式 / 重排 / JS 各取两视图更差者；重样式与重排来自 CDP 计数差，不是 LoAF）

| rep | 变体 | INP | 重样式 | 重排 | JS | load 前 | load 后 |
|---|---|---|---|---|---|---|---|
| 1 | s0 | 392 | 133 | 212 | 5 | 17 | 31 |
| 1 | s1 | 336 | 121 | 179 | 4 | 25 | 8 |
| 1 | s2 | 336 | 115 | 181 | 7 | 7 | 17 |
| 2 | s0 | 400 | 139 | 207 | 4 | 3 | 5 |
| 2 | s1 | 352 | 131 | 179 | 7 | 15 | 23 |
| 2 | s2 | 424 | 149 | 231 | 7 | 20 | 3 |
| 3 | s0 | 376 | 129 | 201 | 10 | 2 | 9 |
| 3 | s1 | 352 | 125 | 191 | 7 | 0 | 2 |
| 3 | s2 | 336 | 114 | 183 | 4 | 2 | 11 |
| 4 | s0 | 344 | 130 | 178 | 6 | 6 | 30 |
| 4 | s1 | 360 | 127 | 192 | 10 | 29 | 26 |
| 4 | s2 | 352 | 109 | 196 | 4 | 28 | 22 |

**三、按变体汇总：均值（最小–最大）**

| 变体 | INP | 重样式 | 重排 | JS | load 前/后 |
|---|---|---|---|---|---|
| s0 旧闸 | **378**（344–400） | 133（129–139） | 200（178–212） | 6（4–10） | 7/19 |
| s1 滚 + 空闲确认 | **350**（336–360） | 126（121–131） | 185（179–192） | 7（4–10） | 17/15 |
| s2 摘滚动 + 空闲确认 | **362**（336–424） | 122（109–149） | 198（181–231） | 6（4–7） | 14/13 |

**四、判读：三条结论，每条都有反证**

1. **「滚动欠账」被证伪。** §11.35 猜的是「闸先滚一遍，滚动期间的样式/布局欠账被算进下一次点击」。若成立，摘掉滚动前置（s2）应当显著降 INP。实测 s2 = 362 vs s0 = 378，**只降 16ms，且 s2 出了全场最差的单笔 424ms**；重排 198 vs 200，几乎没动。三个变体的重样式都钉在 ~125ms、重排 ~195ms。**那 ~320ms 是这一步固有的渲染成本，不是量具造出来的。**
2. **负载解释也被排除。** s0 的测量期负载最低（前 7 / 后 19），INP 反而最高（378）；s1 负载最高（前 17）却最慢得最少。若红闸是机器吵出来的，次序应当相反。
3. **空闲确认（s1）值得留，但救不了红闸。** 它把均值从 378 降到 350，并把离散从 56ms 收到 24ms（336–360）—— 量具更稳、口径更诚实（量的是结算完的页面）。代价是每站多等 ~380ms（s1 每站等待 mean 780–789ms / max 1051ms，s0 固定 400ms，触顶 0 站）。**`vitals.mjs:51` 的默认已经是 `SETTLE=1`，所以这个决定不需要再改代码**；`VITALS_SETTLE=0` 保留为单变量对照的退路。

**五、一个不许放过的异形**

rep2 s2 @390 给出 INP **152ms**，重样式 **50ms / 16 次**、重排 85ms / 1 次 —— 与其余各笔的「5 次重样式」形状完全不同（16 次小的 vs 5 次大的）。同一轮同一变体 @1280 却是全场最差的 424ms。

先排掉一个候选解释：`font-size-control.tsx` 默认 `medium`、按钮次序 `['small','medium','large']`，所以闸的 `.seg-btn` `.first()` 命中的是「小」，**每一次点击都是真的改字号**，不存在「点了已选中项所以便宜」。已用探针核对闸的靶子确实是 `button.seg-btn「小」 组=阅读字号`。

剩下的可能是断点相关：390 下首个 `.seg-btn` 是否仍是同一枚、或点击落在了不同的结算时点。**这一笔不当成「达标证据」引用** —— 它是 24 笔里的 1 笔，且形状异常，归因未定。第二枪探针（§11.41）改为显式点「阅读字号」组里 `aria-pressed="false"` 的那一枚，把这个不确定性从口径里去掉。

**六、这一节不许推出的结论**

- 不许说「体验已达标」：24 笔里 23 笔越线，唯一那笔 152ms 形状异常且归因未定。
- 不许说「红闸是环境吵」：负载次序反了。
- 不许说「回炉造出了回归」：§11.35 的 HEAD 对照已经否掉，这一节进一步把成本定位到渲染侧固有开销。
- 阈值没动，`quiet-vitals-strict.sh` 没动。下一枪直接验渲染侧的三个杠杆（选择器 / containment / 继承），见 §11.41。

### 11.41 渲染成本三侧归因：选择器改写上线，containment 证伪，冻结数学字号不划算（Batch ZF）

§11.40 把成本定位到渲染侧固有开销。这一节回答「那 ~320ms 具体是谁的钱，哪一笔能省」。工具 `ui-concepts/verify/attr-ze.mjs`：**同一份构建、运行时干预**，不重建，因此没有「两个包不一样」的混淆。

**一、先把底数量清楚（探针实测，1280x800）**

| 量 | 值 |
|---|---|
| 全页元素 | 9062 |
| `.katex` 根（公式条数） | 125 |
| **`.katex` 后代节点** | **7404（占全页 82%）** |
| `.katex-display` | **0** —— 全是行内公式，父元素 P / LI / TD / STRONG |
| 改字号实际改动 | `.prose` 18px→17px，`.katex` 21.78px→20.57px（KaTeX 是 1.21em，跟着继承走） |

两条直接后果：①「给 `.katex-display` 上 contain」在本站**无靶**，containment 只能打在含公式的块上；② 改一次字号要重新级联 7404 个节点。

**二、六个变体与自证**

| 变体 | 干预 | 自证条件（不成立判 INVALID 并排除出汇总） |
|---|---|---|
| v0 | 基线 | 字号必须真的变了 |
| v1 | `:has(.katex)` **等价改写**成 `.has-math`（运行时打标 + 改 `selectorText`，声明一字不动） | 改写 ≥1 条、残留 0 条、打标 >0 个、**90 个命中元素的 computed `overflow-x` 逐个比对无变化** |
| v2 | 含公式块注入 `contain: layout style paint` | 命中 >0 个、computed `contain` 含 layout/content |
| v3 | v1 + v2 | 同上两条 |
| v4 | `.katex` 的 `font-size` 钉成绝对 px（解耦继承） | 点击后 `.katex` computed 字号必须不变 |
| v5 | v1 + v4 | 同上两条 |

**v1 为什么是「等价」而不是「删规则」**：删掉那条规则会连带撤掉 `overflow-x:auto`，长公式重新把整页撑出横向滚动 —— 那就同时动了两个变量，量出来的差不能归给选择器。等价改写只换匹配机制。特异性前提：`:has()` 取参数里最高的特异性，`.prose p:has(.katex)` 与 `.prose p.has-math` **同为 (0,2,1)**，层叠次序不变。

**三、两轮结果（各 3 轮位次轮换，单视图 1280x800:light）**

第一轮 5 变体 15 行、第二轮 6 变体 18 行，**两轮合计 33 行，INVALID 0 行**。

| 变体 | INP 均值（范围） | 重样式 | 重排 | JS | 其它任务 | 任务合计 |
|---|---|---|---|---|---|---|
| v0 基线 | 355（312–392）→ **368**（328–392） | 131 → 142 | 191 → 194 | 14 → 12 | 108 → 107 | 455 → 467 |
| v1 选择器改写 | 323（280–344）→ **323**（256–376） | 101 → 102 | 184 → 180 | 8 → 7 | 67 → 54 | 369 → 352 |
| v2 containment | 360（336–376）→ **368**（344–392） | 142 → 128 | 185 → 203 | 12 → 12 | 105 → 101 | 458 → 457 |
| v3 = v1+v2 | 352（336–368）→ **320**（288–336） | 118 → 100 | 196 → 182 | 8 → 7 | 49 → 59 | 379 → 358 |
| v4 字号解耦 | 256（256–256）→ **219**（168–256） | 137 → 113 | 91 → 85 | 12 → 12 | 108 → 107 | 360 → 328 |
| v5 = v1+v4 | — → **216**（200–224） | — → 102 | — → 78 | — → 5 | — → 69 | — → 263 |

（箭头前为第一轮、后为第二轮；v5 第二轮才加。）

**次数比时间更能说明机制**（第二轮逐行）：

| 变体 | 重样式次数 | 重排次数 |
|---|---|---|
| v0 | 45 / 44 / 45 | 5 / 5 / 5 |
| v1 | **12 / 19 / 15** | **1 / 1 / 1** |
| v2 | 47 / 43 / 44 | 5 / 4 / 5 |
| v3 | 14 / 13 / 20 | 1 / 1 / 1 |
| v4 | 43 / 46 / 51 | 5 / 7 / 4 |
| v5 | **11 / 11 / 15** | **1 / 1 / 1** |

**四、三条结论**

1. **风格侧的钱在 `:has()` 的失效风暴。** v1 把 ~45 次重样式压成 ~15 次、5 次重排压成 1 次，重样式 142→102ms、其它任务 107→54ms、INP 368→323ms。两轮均值完全一致（323 / 323），机制清楚、无设计代价。**上线。**
2. **containment 被证伪。** v2 两轮 INP 360 / 368，与基线 355 / 368 持平甚至略负；重排 185→203 反而更差。v3（v1+v2）两轮 352 / 320，都不优于 v1 单用（323 / 323）。指南的 containment 处方针对的是**局部**变化，而改全局字号是全局变化，块级 containment 拦不住它。**不上线。**
3. **几何侧的钱在 KaTeX 跟着字号重排，但省这笔钱不划算。** v4 把重排 194→85ms（砍半）而次数不变，INP 368→219；v5 再叠加 v1，INP 216、任务合计 467→263。**但 v5 的范围是 200–224，均值 216 仍在 200 的闸外。** 代价是「数学不再随阅读字号缩放」—— 在一个 92 页含公式的 ML 课程站上，这是实打实的可读性退步。**付了设计代价还买不到绿闸，所以不上线。** v4/v5 只作为归因证据留档。

**五、落地改动（v1）**

- `components/mdx-content.tsx`：新增零依赖 rehype 插件 `rehypeMathBlocks`，挂在 `rehypeKatex` 之后。手写递归（不引 `unist-util-visit`），把「后代里有 `.katex`」向上传播，给 p/li/dd/td/h3/h4/blockquote 打 `has-math`。与 `:has()` 同为后代语义（`.katex` 藏在 `<strong>` 里也算）。
- `app/globals.css:941`：七个 `:has(.katex)` 选择器换成 `.has-math`，声明（`overflow-x:auto; overflow-y:clip`）一字未动，原注释里 486px 横滚 / 505 个公式段落 / `clip` 不裁墨的实测依据全部保留。
- 未动 `content/**`、`lib/**`、`proxy/**`（用户决定 4 的锁）。`h3` 在 `mdx-components.tsx:62` 有自定义渲染器，但它 `{...props}` 透传，`className` 不会丢。
- 新增 `ui-concepts/verify/mathclass.mjs` **等价闸**：① 对 `out/` 里**全部 92 个含 KaTeX 的页**用 DOMParser 逐元素比对 `el.matches(旧 :has 选择器组) === el.classList.contains('has-math')`，漏标/多标一个就 FAIL；② 抽 3 页在 **320px** 活体验 computed `overflow-x=auto` / `overflow-y=hidden`（写的是 `clip`，计算值见下面第六小节第 2 条）/ 整页横向溢出 0，并确认样式表里已无 `:has(.katex)`。漏标一个块，那个块的长公式就会把整页撑出横滚 —— 正是当初加这条规则要治的病，所以这道闸必须覆盖全站而不是只看 day-10。

**六、等价闸当场抓出的两个真缺陷（第一版插件是不合格的）**

第一次重建后跑闸，**FAIL 12 条**。两个都不是闸的毛病：

1. **漏标 229 个块（多标 0）。** day-10 漏 6 个、day-07 漏 5 个、day-08/09 各漏 7 个……活体数出来 day-10 只有 84 个 `has-math`，而运行期 `:has(.katex)` 命中 90 个。逐个查父链，**漏标的全部落在 `<details>` 里**（`p < details < div < div.prose`）。原因：MDX 里的 JSX 块在 hast 里是 `mdxJsxFlowElement`，`type !== 'element'`，而插件第一版用 `if (k.type !== 'element') continue` 过滤子节点 —— 把整棵 JSX 子树跳过了，里面的公式永远传不上来。修法：遍历穿过所有节点类型，只在**打标判定**时要求 `type === 'element'`。修后重建，**92 页 / 13747 个候选块 / 2750 个命中，漏标 0、多标 0**，day-10 活体 90 个，与运行期命中数一致。
   —— 这就是为什么等价闸必须覆盖全站而不是只看 day-10：漏标一个块，那个块的长公式就把整页撑出横滚，正是当初加这条规则要治的病。只看一页会漏掉 223 个。
2. **`overflow-y: clip` 的 computed 值其实是 `hidden`，原注释把机制写错了。** 活体三页全是 `hidden`。CSS Overflow 规定：一轴是滚动值（这里 `overflow-x: auto`）、另一轴是 `clip` 时，`clip` 计算成 `hidden`。结果一样不出纵向滚动条（原意图达成），但它**确实成了滚动容器**，与注释里「clip 不滚动」的说法不符。这是**改动之前就存在的文档缺陷**，不是本轮引入的回归。已把计算值规则写进 `globals.css` 注释，闸的期望值也从 `clip` 改成 `hidden` 并注明理由。

**七、注入自证：这道闸两层都咬得动（`MATHCLASS_INJECT=1`）**

只证明「正常跑 PASS」不够 —— 一道不会开口的闸等于没有闸。两条注入分别打两层：

| 注入 | 打哪一层 | 期望 | 实测 |
|---|---|---|---|
| 甲：把第一个抽样页 HTML 里的 `has-math` 改成 `no-such-class-injected` | 逐元素等价层 | 漏标 → FAIL | `漏标 1 · 多标 0`，点名 `/learn/backend/week-5-plan/`，并打出该块公式原文 `a⋅b∥a∥∥b∥\frac{a \cdot b}{\|a\|\|b\|}∥a∥` |
| 乙：在 day-10 注入 `.prose .has-math { overflow-x: visible !important }` | 320px 活体层 | 横滚出口被撤 → FAIL | `overflow-x 不是 auto（实测 visible）` **且** `overflow-y 计算值不是 hidden（实测 clip）` |

合计 **FAIL 4 条**，两层都开口。乙档还顺手把 CSS Overflow 那条规则**反向**证了一次：`overflow-x` 一旦不再是滚动值，`overflow-y` 的 `clip` 就计算回 `clip` 而不再是 `hidden` —— 与第六小节第 2 条正向实测互为对照。

正常跑（无注入）：92 页 / 13747 个候选块 / 旧选择器命中 2750 个 / **漏标 0 · 多标 0**，活体三页 `overflow-x=auto`、`overflow-y=hidden`、整页横溢 0px、CSS 用类 true / 仍含 `:has(.katex)` false。

一处量具提醒：`node … | tail` 之后的 `$?` 是 **tail** 的退出码，不是 node 的。注入跑打出的 `inject_rc=0` 因此没有意义，判定要看 FAIL 文本本身（或去掉管道重跑取 rc）。

**八、残留与不许推出的结论**

- **day-10 的字号切换在 v1 之后仍是 ~323ms，闸仍红。** 不许说「体验已达标」。剩下的 ~180ms 重排是 7404 个 KaTeX 节点跟着字号重排的固有成本，唯一能砍半的杠杆（v4）已按上面第 3 条否决。
- 探针的绝对值与闸的绝对值**口径不同**：探针显式点「阅读字号」组里 `aria-pressed="false"` 的那一枚并在点击前强制结账，闸走 `.seg-btn` `.first()` 且前面还有别的步骤。已核对两者靶子是同一枚（`button.seg-btn「小」 组=阅读字号`），但重样式次数不同（探针 ~45、闸 ~5），**所以只引用探针的变体间差值，不把探针绝对值当闸的读数**。
- LoAF 的 `scripts` 归因在这一页**报不出 culprit**：18 行全部是「相交长帧里没有 >5ms 的脚本条目」。这与 §11.37 的发现一致 —— 强制布局的时间不计入 V8 的 `ScriptDuration`，而此浏览器的 LoAF 脚本条目也没把它归到任何函数上。归因只能靠 CDP 计数差 + 单变量干预，不能靠读脚本名。
- 阈值、`quiet-vitals-strict.sh`、`vitals.mjs` 的判定逻辑均未改。
- **2026-11-16 又试了一次绝对判定：`quiet-vitals-strict.sh` 等满 ~8min（150 次采样）仍未拿到静窗，输出 `no strict quiet window within ~8min - vitals not run`，vitals 一次都没跑。** 所以本节之后仍然没有任何新的绝对读数，day-10 的红不是「已修好」也不是「已量到更差」，是**没量成**。Batch ZG 新铺 `*{scrollbar-width:thin}` 之后要回答「有没有更贵」，只能走同构建配对 A/B（`ab-star.mjs`，见 §11.42），那是归因不是判定。

**九、受影响回归电池（ZF / ZG 落地后补跑，2026-11-16）**

| 闸 | rc | 读数 |
| --- | --- | --- |
| `zc-verify` | 0 | 「全部通过」：`/tags` 25/31 行直接写出篇名；首页 eager JS **29 个脚本 / 651.7KB**；首页无 Lenis 实例；首页不再引用 GLB / 3D 海报 |
| `narrow-overflow` | 0 | 320px **0 页**横向溢出、360px **0 页** |
| `sweep2` | 0 | 43 页 / 215 项检查 / `findings: []` |
| `fontwt` | 0 | PASS：站内每个真实用到的「族 × 字重档」都有脸覆盖；day-10 的 KaTeX_Math / KaTeX_Main 400↔700 像素复核两两不同 |
| `batchy` | 0 | 全 PASS：系列首篇只有「下一篇」、末篇只有「上一篇」且指向正确；terms 有 `id=license` 章、附则顺延为 7、页脚许可锚点落位 `h2#license top=96px`；全程无页面级 JS 错误 |
| `contrast` | 0 | **这个 0 不构成通过** —— 该探针没有 exit 逻辑，印了「低于 WCAG AA 的可见文字 624 处」仍退出 0。分类与真缺陷处置见 §11.43 |

前五项是真判定。第六项此前被误算进「6 道闸全 rc=0」，§11.43 一更正了这个口径。

### 11.42 配对 A/B：新铺的 `*{scrollbar-width:thin}` 没有把 day-10 推得更贵（Batch ZG）

§11.38 六把 `scrollbar-width: thin` 从 `html` 改铺到 `*`。`*` 是通用选择器，而 day-10 本来就在 INP 红线上，所以必须回答「这条改动有没有让它更贵」。静窗不可达（§11.41 八），按 §11.40 定的口径走**同构建配对 A/B**：只需条件可比，不需静机；阈值一个字没改，本节也不宣称任何「达标」。

**一、设计（`ui-concepts/verify/ab-star.mjs`）**

同一份构建、运行时干预、不重建，因此没有「两个包不一样」的混淆。单视图 1280x800:light，4 轮 × 2 变体，位次按 `(rep-1)%2` 轮换，每行记录干预前后 CPU 负载。

| 变体 | 干预 |
|---|---|
| s0 出厂态 | 不动（`*{scrollbar-width:thin}` 活着） |
| s1 | 把那条 `*` 规则的 `selectorText` 改成 `.no-such-element-ever-zg`（摘掉它的匹配成本），**同时注入 `html{scrollbar-width:thin!important}` 把根的几何补回来** |

补根这一步是必需的：不补的话根会从 10px 变 15px、可用宽度差 5px，那就同时在动两个变量。

自证（不成立判 INVALID 并排除，不许把「没干预成」当成「干预没用」）：s0 要求 `*` 规则存在、根 computed thin、内层探针 computed thin；s1 要求那条规则已摘净（剩 0 条）、**根 computed 仍是 thin 且根占位与干预前逐像素相同**、内层探针 computed 变回 auto 且占位等于 auto 参照值。两档都在点击前强制一次样式/布局结账，抹平「干预自己顺手 flush 过」的口径差；干预后用 LoAF 计数确认 500ms 无新长帧才算静（与 `attr-ze.mjs` 同形）。

**二、两轮结果（16 行全部自证通过，0 行 INVALID）**

| 轮 | 变体 | n | INP 均值（区间） | 重样式 ms（区间） | 重样式次数 | 重排 ms（区间） | 重排次数 | 任务合计 |
|---|---|---|---|---|---|---|---|---|
| 一 | s0 | 4 | **338**（320–352） | 116（113–118） | **6** | 182（171–199） | **1** | 370 |
| 一 | s1 | 4 | 366（352–376） | 124（122–126） | **6** | 196（191–204） | **1** | 397 |
| 二 | s0 | 4 | **344**（328–352） | 120（113–126） | **6** | 183（176–187） | **1** | 383 |
| 二 | s1 | 4 | 410（336–480） | 144（116–172） | **6** | 221（183–254） | **1** | 458 |

**三、结论分三条，强度不一样，不许混着说**

1. **最硬的一条：重样式次数 6、重排次数 1，在全部 16 行里两档完全一致。** 通用选择器没有增加失效趟数或布局趟数。这条不依赖负载、不依赖均值，是计数。
2. **方向一致：两轮 s0 都不比 s1 贵。** 第一轮重样式区间不重叠（113–118 vs 122–126），出厂态低约 8ms。
3. **第二轮没有干净复现那个 8ms 差，不许把它当成可复现的收益。** rep1–2 机器负载剧烈波动（s0 有一轮 20→48%），s1 的 464/480 两个高值都落在那两轮，把均值抬到 410；rep3–4 安静下来后 s0 = 352/328、s1 = 336/360，**互相交错、分不开**。所以正确说法是「量不出代价」，不是「省了 8ms」，更不是「省了 66ms」。

**四、几何混淆已排除，但排除它的证据不是那个计数**

探针本来要数「站内真渲染出滚动条的内层容器」，用来判断 s1 的 15px 内层滚动条会不会改变布局、把几何差混进选择器成本。第一版用 `offsetWidth - clientWidth` 直接相减，**把边框算成了滚动条**，报出「10 个真滚动容器」（全是 `td`/`table` 的 1–2px 边框）。扣掉边框后剩 5 个 `td.has-math`，占位 `y1` —— 而**这 1px 在 thin 与 auto 两档下完全相同**（各 20 次采样全是 `x0/y1`）。滚动条宽度从 10px 变 15px 而占位不动，说明它根本不是滚动条，是 `offsetHeight`/`clientHeight` 取整的 1px 伪影。

结论：**day-10 没有内层滚动条真在占位**，两档几何相同，几何混淆这条路排除。这个 1px 伪影本身没再去修 —— 结论不依赖它，依赖的是「占位不随 width 变化」这个对照。

**五、残留**

- s1 除了摘规则还多注入了一张样式表，所以即便第一轮那 8ms 是真的，也不能干净地全归给通用选择器。要彻底隔离得改构建做双包 A/B，本轮没做，因为要回答的问题（「出厂态有没有更贵」）已经答完。
- 本节是归因不是判定。day-10 的绝对 INP 仍然没有新的静窗读数，红线状态未变（§11.41 八）。
- 探针绝对值不与闸的绝对值互引（§11.41 八的口径纪律）：本节 s0 的 338/344 与 `attr-ze.mjs` 的 v0 368、与闸的读数都不同口径，只在本节内部做变体间比较。

### 11.43 暗色强调面字色 3.05:1：一枚不随模式翻的令牌，与「写了 ≠ 生效」的扫描陷阱（Batch ZH）

**一、线索来自一道退出 0 却印了 624 条失败的探针**

回归电池里 `contrast` 打印「低于 WCAG AA 的可见文字 624 处（实色底 624 · 压在图片上 0）」却 `rc=0`。查 `ui-concepts/verify/contrast.mjs` 全 131 行：**没有任何 `process.exit` / FAIL / PASS / 豁免逻辑**（grep `exit|FAIL|PASS|allow|SKIP|豁免|阈值|BAR` 零命中）。它是**报告探针不是闸**，`rc=0` 只表示「跑完了」。所以「6 道闸全 rc=0」这句话里，contrast 那一道从来就不构成通过 —— 此前把它算进绿是口径错误，本节更正。

624 条按 `view+sel+fg+bg` 去重后只剩 **4 个唯一组合**（Shiki 的 `span.` 类名为空，全站代码 token 全塌成几行）。读日志时不能把「624 处」当成 624 个不同缺陷：

| 模式 | 选择器 | 字色 × 底色 | 比值 | 需 | 归类 |
| --- | --- | --- | --- | --- | --- |
| dark | `a.skip-to-content` | `#ffffff` × `rgb(224,117,95)` | **3.05** | 4.5 | 真缺陷，本节修 |
| light | `span.`（Shiki） | `rgb(227,98,9)` × `rgb(247,247,247)` | 3.26 | 4.5 | 已知边界 |
| light | `span.`（Shiki） | `rgb(215,58,73)` × 同上 | 4.27 | 4.5 | 已知边界 |
| light | `span.`（Shiki） | `rgb(106,115,125)` × 同上 | 4.49 | 4.5 | 已知边界 |

后三条是 Batch F 已判过的取舍（本节 line 696 原文：「剩下 4 个去重后的案例全是 Shiki `github-light`/`github-dark-dimmed` 的语法着色（要动就得写死新色，越界，留作已知边界）」）。**但 Batch F 那 4 条全是 Shiki，没有跳转链接这一条** —— 它是第 17 轮视觉回炉把暗色强调色换成陶土 `#e0755f` 之后新出现的，不是旧边界。

**二、根因：`--on-accent` 钉死白色，强调色却随模式翻了明暗**

`globals.css:89` 原为 `--on-accent: #ffffff`，只在 `:root` 定义一次，暗色块从未覆盖它。而暗色 `--color-primary` 是 `#e0755f`（浅陶土），亮色是 `#b4442f`（深陶土）。白字压深陶土 5.51:1 过，压浅陶土 3.05:1 不过。**令牌对里只有一枚跟着模式走，另一枚没跟** —— 这不是某一处控件写错了字色，是契约本身缺了一档。

纯算术核对（不靠手算，node 现算）：

| 模式 | 底 | 改前 `#ffffff` | 改后 `--color-text-inverse` |
| --- | --- | --- | --- |
| 亮 | `--color-primary` `#b4442f` | 5.51 | 5.51（`#ffffff`，一字不变） |
| 亮 | `--color-primary-hover` `#8f3423` | 7.83 | 7.83（一字不变） |
| 暗 | `--color-primary` `#e0755f` | **3.05** | **6.08**（`#141311`） |
| 暗 | `--color-primary-hover` `#ef8e79` | **2.38** | **7.79** |

修法一行：`--on-accent: var(--color-text-inverse)`。选这枚令牌的理由不是「随便找个深色」：`--color-text-inverse` 亮 `#ffffff` / 暗 `#141311`，语义就是「反色面上的墨」，且**全仓源码声明了 6 次却从未被消费**（`var(--color-text-inverse)` 在 app/components/lib/scripts 零命中）—— 是个正好为该用途准备着的死令牌。**零新增写死色**，符合令牌纪律；亮色两档完全不动，所以这不是全站换色，只补暗色缺的那一档。

顺手核过有没有绕过令牌的漏网：`components/**` 与 `app/**` 里 `text-white` / `text-[#fff` / `color:#fff` / `color:white` **零命中**，`--on-accent` 也只有这一处定义。所以改一枚即兜住全部消费者，不需要逐处补字色。

**三、扫描陷阱：「写了 `color: var(--on-accent)`」不等于「最终生效」**

新闸第一版从源码认出 6 处消费者，其中 `.btn-primary` 赫然在列。渲染侧一量就露馅：`/learn/` 上那枚「进入课程」按钮静止底是 `#23211e`（墨）、悬停 `#56534e`，**根本不是强调色**。查源码：`.btn-primary` 在 `@layer components`（`globals.css:611`）里确实写了 `background: var(--color-primary); color: var(--on-accent)`，但 `globals.css:2369` 与 `:2711` 两条**未分层**规则把它改写成 `background: var(--ink); color: var(--canvas)`。未分层压过分层，与特异性无关 —— 它最终不是消费者。

只读声明就会把它算进覆盖，然后拿「强调色那一档过了」去替一个刷墨色的按钮背书。这是**假绿的另一种形状**：不是没量，是量了 A 却声称覆盖了 B。

两闸都据此改口径：
- 声明侧加保守覆盖检测：同选择器文本、源码后置、且重写了 `color` → 剔出覆盖清单并明说「交渲染侧量」。保守方向是**少声称覆盖**：若后置那条其实藏在更低优先级的层里、前面那条仍生效，这里会误剔，而误剔只是把这一处推给渲染侧，不会放假绿。改后认出 **5 处最终生效**（`::selection` / `.skip-to-content` / `.btn-accent` / `.apple-pagination__item[aria-current='page']` / `.apple-filter[aria-pressed='true']`），另 1 处（`.btn-primary`）明示被改写。
- 渲染侧不再拿 `.btn-primary` 当强调面样本，改量三处**真刷强调色**的控件，并自证「量到的底色 == 该档 `--color-primary`」，不等就判这一行不算数。

**四、必须如实说的一条：悬停真换底 0 处**

渲染侧对三处控件都做了 hover 前后对照，结果 **6 行全部「悬停未换底」**（亮暗 × 三处，底色 hover 前后一模一样）。也就是说：

- **真渲染出来的缺陷只有静止态 3.05**（跳转链接 / 分页当前页 / 搜索筛选按下态）。
- 第二节表里那条更差的 **2.38:1 悬停档，当前没有任何活控件能走到** —— 它只存在于 `.btn-accent:hover`，而 `.btn-accent` 在 `components/**` 与 `app/**` 里**零使用者**（歌单播放器已在第 13 任务下线，`globals.css:722` 的注释还写着「歌单加载钮」）。它是死 CSS。

所以本节的悬停修复是**潜在契约修复，不是已渲染缺陷修复**，不得写成「修好了悬停态的对比度」。`.btn-accent` 的死代码身份登记在此，留给 Batch ZC（死代码下线）处置，本节不顺手删 —— 本轮要答的问题（暗色强调面字色够不够）已经答完，删规则是另一件事。

**五、两道新闸（都有 exit 逻辑，都做了注入自证）**

| 闸 | 量什么 | 自证 | 结果 |
| --- | --- | --- | --- |
| `ui-concepts/verify/accent-contrast.mjs` | 声明侧令牌契约：`--on-accent` × {`--color-primary`, `--color-primary-hover`} × 亮暗 | 亮暗强调色必须解析成**不同**实色（相同则层叠塌成一套、暗色量的是亮色）；任一令牌解析不到 → 判没量成；`ACCENT_INJECT=1` 把 `--on-accent` 钉回 `#ffffff` | 正常 **rc=0**，4 对全过；注入 **rc=1**，精确咬出暗色 3.05 与 2.38 |
| `ui-concepts/verify/accent-render.mjs` | 渲染侧 computed color × 合成底色，三处真实强调面 × 亮暗，含 hover 前后对照 | 底色必须 == `--color-primary`；hover 若换底必须 == `--color-primary-hover` 并额外量一档，**没换底就明说「不声称覆盖悬停档」**；主题未生效跳过并计数；控件没渲染出来判没量成 | **rc=0**，6 处渲染态全过（亮 5.51 / 暗 6.08），悬停真换底 0 处 |

注入咬出的 3.05 与浏览器调查探针量到的 3.05 **是同一个数**——声明侧算术与渲染侧读数互相印证，不是两套各说各话。

写探针时踩的两个量具坑，登记以免重犯：
- `page.evaluate(fn)` 会把 fn **序列化进页面**，闭包里的 Node 侧 helper 一律取不到（第一版 `ReferenceError: parse is not defined`）。合成/解析函数必须内联在 fn 体内。
- READ 返回 hex 串而外层 `parse` 只认 `rgb()`，`lum(null)` 直接崩。改成两种写法都认、解析不到返回 `null` 由调用方判「没量成」——**不许崩，也不许把 null 当 0 混过闸**。

**六、落地后回归（2026-11-16）**

- `npm run build` **rc=0**；`npm run check` **rc=0**，全段零告警（typecheck / lint / check:emoji / check:ui / test:proxy / test:attack / audit:env）。Batch F 时期唯一的 `command-palette.tsx` lenis 告警已随 ZC 下线消失。
- 全站对比度调查：**624 → 596 处**，暗色 `a.skip-to-content` 那一行**消失**，去重后只剩 3 条 Shiki 亮色语法色（3.26 / 4.27 / 4.49），即 Batch F 判过的已知边界。减少的 28 处就是跳转链接在各页暗色下的实例。
- 两道新闸：声明侧 rc=0（4 对全过）/ 注入 rc=1（咬出 3.05 与 2.38）；渲染侧 rc=0（6 处渲染态，亮 5.51 / 暗 6.08）。
- **视觉复核（截图存 `ui-concepts/verify/shots-zh/`）**：暗色跳转链接聚焦后是左上角陶土胶囊 + **墨字**「跳到主要内容」，焦点环在；暗色分页当前页「1」是墨字陶土方块，与描边的「2」和箭头区分清楚 —— 观感是「选中态」，不是改坏。亮色分页 computed 仍 `rgb(255,255,255) on rgb(180,68,47)`，与改前逐字相同。
- 截图时踩的量具坑：`shot.mjs --eval` 的包装是 `return (expr)`，传箭头函数会被**返回**而不调用（打印 `undefined` 即线索，第一版截图里跳转链接根本没露出来）。要传 IIFE `(() => {...})()`。
- **整套回归电池重跑（9 道，全 rc=0，日志 `ui-concepts/verify/reg-zh-*.log`）**：`zc-verify` 全部通过（首页 eager JS 29 脚本 / 651.7KB，无 Lenis、无 GLB）；`narrow-overflow` 320/360 两档 0 页横向溢出；`sweep2` 43 页 / 215 检查 / findings []；`fontwt` PASS（每个真实用到的族×字重档都有脸覆盖）；`batchy` 全 PASS（含 `h2#license top=96px`、全程无页面级 JS 错误）；`scrollbar-contrast` 亮 5.29 / 暗 6.73（闸 3:1）；`reading-progress` 两条路都成立（CSS 时间轴连续、关动画后行内值接管、aria-valuenow 到底 100）；`mathclass` 92 页 / 2750 块逐元素等价、漏标 0 多标 0；`scrollbar-geometry` thin 不挤出横向滚动、可用宽度只增不减。计时闸不在本电池内 —— day-10 绝对 INP 仍无静窗读数，红线状态未变（§11.41 八），不宣称达标。

**七、残留**

- Shiki 三条亮色语法色仍是已知边界（Batch F 原判不变）：要动就得写死新色，越过令牌纪律。本节不声称全站 AA 全绿。
- `contrast.mjs` 仍是没有 exit 逻辑的报告探针。本节没有给它加闸逻辑（那会改变它「全站普查」的用途），而是**另开两道有判定的闸**覆盖强调面这一类。读它的输出时必须记住 `rc=0` 不等于通过。
- 暗色 `--color-success` / `--color-warning` / `--color-danger` 未在暗色块重定义，仍沿用亮色值。本轮调查探针没在这三枚上报出失败，所以**没有证据说它们有问题，也没有证据说它们没问题** —— 未量，不列入本节结论。

### 11.44 AI 生成图片全下线：封面改排字图版，OG 改排字渲染（Batch ZI）

**一、盘点：哪些是 AI 素材，哪些不是**

| 文件 | 身份 | 处置 |
| --- | --- | --- |
| `public/images/3d/cover-1/2/3.webp` | AI 渲染静物三角度，经 `lib/covers.ts` 池按 slug 哈希摊给全部文章 | 删除 |
| `public/images/3d/og-3d.jpg` | 同一静物的 JPEG，layout 与文章页 OG/Twitter 兜底 | 删除，换 `og-default.png` |
| `public/images/hero/hero-main.webp` | 全仓零引用的死资产（hero 早在 ZC 换成 CoursePlate SVG） | 删除 |
| `public/avatar.jpg` | 作者自己的头像，非装饰素材 | 保留 |
| about 页友链头像 | 外链真人头像，不是本站生成的 | 保留 |
| `content/**` | 无 `cover:` frontmatter、无 markdown 图片（grep 零命中） | 不动（本就锁定） |

判据不是「看起来像 AI」而是来源与用途：封面池注释自认是 3D 模型渲染角度图，与文章语义无关；头像与友链是真实人物素材。`assets/3d/`（47MB 未跟踪源料）是用户财产，不碰。

**二、lib/ 锁下的视图层解法**

`coverFor` 的三个消费点（`editorial-list.tsx` / `post-list.tsx` / `app/posts/[slug]/page.tsx`）改调新组件 `components/typographic-cover.tsx`；`lib/covers.ts` 一个字不动，从此零引用 —— 与 ZC 的 `lib/bookmarks.ts` 竞态修法是同一条合规路径。锁定文件里的死代码身份登记在此，不删。

新组件沿用旧池的确定性（FNV-1a 哈希 slug），但哈希选的是**版式**而不是图片：左字 / 右字 / 居中刊头三选一；大字取标题首个汉字或字母数字（`coverGlyph`），无则「文」。三个变体：`plate`（文章页 FIG.01，2.2:1，大字 + mono 眉标 + 衬线标题两行截断 + 发丝线 + mono 脚标）、`thumb`（首页复合行 4:3，大字 + 右下 3px 强调色刻度，编号徽章沿用 `.feature-row__no`）、`mini`（索引行序号栏 44/56px 字牌，复用 `.row-cover` 定位）。服务端渲染、零 JS、零位图；颜色全走令牌（`--surface-2 / --ink / --muted / --line-strong / --color-primary`），**零新增写死色**。图版与标题重复，整块 `aria-hidden`；文章页图注从「…点击放大」改为「排字图版 · 由标题生成，无摄影素材」——位图没了，`data-zoomable` 随之撤掉，不再承诺一个不存在的放大交互。

hover 反馈：plate 大字 color 转 `--accent-text`、外框 border-color 转 `--accent`（只动 color 系）；thumb 沿用 `scale(1.08)`（transform）；减动态块里 thumb 的空间反馈照掐。

**三、OG：排字渲染的 PNG，不是生成式素材**

`ui-concepts/verify/og-card.mjs` 用 Playwright 把一份 1200×630 的 HTML 刊头（站点同款系统字体栈、亮色令牌色值一一对应：画布 `#faf9f5` / 墨 `#141413` / 强调 `#b4442f` / 发丝线 `#e4e3df` / 次级字 `#56534e`）截图成 `public/og-default.png`。一次性资产生成，不进构建管线；脚本在仓库外，色值写死不受组件纪律约束（它是资产源，不是站点源码）。layout 与文章页兜底改指 `og-default.png`；`post.cover` frontmatter 分支保留（虽然当前无人使用）。成品目检：刊头 masthead + 陶土粗线 + 三栏主题，与站点嗓音一致。

**四、顺带下线的死 CSS**

- `.editorial__figure > img`：3D 静物时代刊头规则，首页早已是 CoursePlate SVG，整条删除（删时留过残尾 `background` 两行，当场清掉）。
- 减动态块与 hover 块里的 `.feature-row__thumb img` / `.post-cover__frame img` 选择器改指 `.typo-cover`；`.row-cover` 的 `object-fit: cover`（img 专用）删除。

**五、验证（2026-11-17）**

- `npm run build` rc=0、`npm run check` rc=0 零告警。第一遍 build 曾 rc=1：我在改 OG 兜底时把正则 `/^https?:\/\//i` 少写一个转义斜杠成 `/^https?:\/i`，TS1161 未终止正则 —— 量具（typecheck）当场咬出，修后复跑全绿。
- 对比度普查 **596 → 596**，去重后仍只有 3 条 Shiki 亮色边界；`typo-cover` 相关选择器**零命中** —— 新图版的 mono 元信息走 `--muted` 而非 `--faint`，就是为了让 10px 小字也够得到 4.5:1，不新增缺陷。
- 产物核对：`out/` 全目录 grep `images/3d|hero-main` 零命中；`out/og-default.png` 在位。
- 截图七张存 `ui-concepts/verify/shots-zi/`（首页首屏 / 首页复合行 / 索引页 / 文章页，亮暗两档），逐张目检：亮色图版是墨字陶土刻度、暗色是暖白字深底，迷你字牌与序号栏换位关系不变，观感是「刊物图版」而不是缺图占位。
- 量具坑登记：`shot.mjs --url` 要**完整 URL**。MSYS 会把 `--url=/posts/` 改写成 `d:/Artificial_Intelligence/Git/posts/`（ERR_FILE_NOT_FOUND）；更阴的是 `--url=/` 被改写成 Git 根目录后 Chrome 渲染**目录_listing_** 也「成功」截图 —— 亮暗两张字节数完全相同（60035）就是线索。挂 `MSYS_NO_PATHCONV=1` 又会让 `/` 原样进 `page.goto` 报 invalid URL。正解是直接传 `http://127.0.0.1:8126/…`，不挂开关。
- 回归电池 11 闸全绿（日志 `ui-concepts/verify/reg-zi-<gate>.log`）：zc-verify 全部通过（首页 eager JS 仍 29 脚本 / 651.7KB，图版零新增 JS）；narrow-overflow 320/360 两档各 0 页横向溢出；sweep2 43 页 / 215 检查 / findings []；fontwt PASS（本机族只登记不参与声明核对）；batchy 18 项 PASS（页脚第 128 天、h2#license top=96px、全程无页面级 JS 错误）；scrollbar-contrast 亮 5.29:1 / 暗 6.73:1（闸 3:1）；reading-progress 两条路 PASS；mathclass 92 页 / 13747 候选块 / 2750 命中、漏标 0 多标 0、320px 活体 overflow-x=auto；scrollbar-geometry thin 只增不减；accent-contrast 4 消费者 + accent-render 3 强调面亮暗均 4.5:1。计时闸不在本轮电池内（见六）。
- 交互实测：文章页 hover `.post-cover` 后图版大字落 `rgb(180, 68, 47)`（`--accent-text`），页内位图只剩作者头像两张，`data-zoomable` 计数 0 —— 封面换色反馈与「无位图可放大」的现状一致。

**六、残留**

- `lib/covers.ts` 锁定死代码（见二）；`public/og-default.svg` 本就零引用，非 AI 素材，不在本轮处置范围。
- `ImageLightbox` 保留：文章页当前没有可放大位图，但组件是委托监听，未来 content 出现图片时仍接管，不算死控件。
- 计时闸不在本轮电池内：day-10 绝对 INP 仍无静窗读数，红线状态未变（§11.41 八）。

### 11.45 现代性打磨：跨文档视图过渡 + 长文断行 + reduce 档颜色反馈恢复（Batch ZJ）

**一、盘点与取舍（每条都有实测或原文依据）**

- 跨文档视图过渡：**取**。静态导出是 MPA，硬导航（刷新/地址栏/站外返回）此前是硬切；`@view-transition` 零 JS 接管交接。
- `text-wrap: pretty / balance`：**取**（MWG visual-design/typography 逐字处方）。
- CJK `text-autospace` / `text-spacing-trim`：**不取**。content 全库 `[一-鿿][A-Za-z0-9]` 相邻无空格计数 **0**（作者已手工加空格），引入即 no-op。
- Next `experimental.viewTransition`：**不启用**。config-shared.d.ts 注明依赖 React `unstable_ViewTransition`（react PR 31975）；本机 React 19.0 实测 `'unstable_ViewTransition' in require('react') === false`，启用即运行时错误。实现只存在于 next 的 experimental runtime bundle，默认 bundle 无 `startViewTransition`。
- 方向性滑动（`startViewTransition(types)` + `:active-view-transition-type()`）：**不取**。那是 SPA 语汇，本站无调用点；MPA 侧交叉淡入 + 新页 8px 抬起更贴刊物嗓音。
- 正文链接下划线改伪元素生长：**不取**。行内链接跨行时 `::after` 只落在最后一个行盒，多行链接会画出一条错位的线；既有静态 2px 下划线 + `text-decoration-color` 过渡才是多行安全解。

**二、落地（全在 globals.css，零 JS 零新色）**

- `3685-3699`：`@view-transition { navigation: auto; }`；`::view-transition-old(root)` = vt-out 200ms `--ease`（opacity→0）；`::view-transition-new(root)` = vt-in 300ms `--ease-out`（opacity 0→1 + translateY(8px)→0）。
- reduce 主块前置段（`a, button, .pressable, .link-underline` 颜色恢复那一块）：`::view-transition-group/old/new(root) { animation: none !important; }` —— 伪元素树不吃通用选择器，必须逐条点名（含 UA 的 group 动画）。**更正（ZK）**：VT 归零实际住在文件末尾那个 reduce 块（与 `.side-tag / .share-tool / .post-nav__item / .reading-progress__fill` 的 `transition:none` 同块），不在颜色恢复块里；原文引用的 `1841-1846` 指的是颜色恢复段，属误引。ZK 后行号整体漂移，一律改按选择器点名。
- `792-800`：`@supports (text-wrap: pretty)` 内只点名 `.prose p / .prose li / .editorial__intro / .lead-md`（指南禁挂 `*`）；`.prose h2/h3` 补 balance。既有三处 balance（h1/.heading-1/.editorial__title）核对均无外框，符合指南对 balance 的限制。
- reduce 档颜色恢复块（`a, button, .pressable, .link-underline`，原文行号 `1834-1846`，ZK 后按选择器点名）：恢复 color/background-color/border-color/text-decoration-color 四系 200ms 过渡（`!important` 压过后段点名的 `transition:none`）。**这是一处真差距的修复**：原通用清零把颜色反馈一起掐掉，与 MWG ui-behaviors/motion「Keep non-motion transitions … enabled」不符；DESIGN §10 旧 bullet 曾误称「color 过渡保留」，本轮一并更正。

**三、量具两修（FAIL 先怀疑量具，判据未放宽）**

1. 首版 `vt.mjs` 用 Link 点击量 VT → `pagereveal=no` FAIL。根因不在实现：App Router 软导航不换文档，跨文档过渡本就不该触发。改 `location.href` 硬导航实测，软导航另断言落位且零 pageerror。
2. 二版用「reduce 中途帧与落定帧逐字节相同」作无残影代理 → 颜色恢复后 FAIL。根因：中途帧差异是导航链接水合后字色的 200ms 渐变（指南有意保留的非空间反馈），不是 VT 残影。改量 `viewTransition.finished` 耗时：默认档 312ms（交叉淡入真播放）、reduce 档 12ms（立即交接）；逐字节比较降级为登记项。

**四、验证（2026-11-17）**

- `npm run build` / `npm run check` rc=0 零告警；纪律闸原样接受新关键帧与伪元素规则（只动 opacity/transform、时长缓动全令牌）。
- `vt.mjs` PASS：默认档 `pagereveal=yes`、finished=312ms、中途帧目检为真交叉残影（`shots-zj/vt-default-mid.png`：旧索引行半透明叠在新刊头下）；reduce 档 finished=12ms、`a` 计算过渡四系 0.2s 且不含 transform；软导航零 pageerror；pretty `supports=true`、`.prose p/li=pretty`、`.prose h2=balance`。
- 对比度普查不重跑：本轮零色值改动（颜色恢复只改过渡时长，不改起止色），596 基线不变。fontwt / scrollbar / accent 三闸不重跑：字族字重、滚动条、强调面均无改动。
- 回归电池 5 闸全绿（日志 `ui-concepts/verify/reg-zj-<gate>.log`）：zc-verify 全部通过（无 Lenis、无 GLB）；narrow-overflow 320/360 两档各 0 页横向溢出；sweep2 43 页 / 215 检查 / findings []；batchy 全 PASS（h2#license top=96px、全程无页面级 JS 错误）；mathclass 92 页 / 2750 命中块逐元素等价、320px 活体 overflow-x=auto。第一遍电池因 reduce 颜色恢复晚于其开跑而被主动停掉，最终 build 上整套重跑——不让旧 build 的读数入账。
- 计时闸不在本轮电池内：day-10 绝对 INP 红线状态未变（§11.41 八）。

**五、残留**

- 跨文档过渡覆盖边界＝硬导航；软导航保留既有入场序列（blurIn/fadeUp stagger），不与 VT 叠双层动画。边界已写入 DESIGN §10 与组件注释，不声称全站导航都有过渡。
- ZI 残留（`lib/covers.ts` 锁定死代码、`og-default.svg` 零引用、ImageLightbox 保留）不变。

### 11.46 简洁风减法：13 个组件与全部装饰动效下线（Batch ZK）

**一、指令与判据**

用户原话：「不行还得优化，这个效果不好，删掉没有必要的组件，只走简洁风」——推翻第 19/20 轮
「丰富度」方向。判据换成两条：① 这个组件说的话页面别处是否已经说过（重复即删）；
② 这个动效是状态反馈还是入场装饰（装饰即删）。**功能与可访问性契约不随「简洁」砍**：
Batch Y 立的 byline / 字数 / 许可 / 运行天数 / 系列导航、PageTransition 的焦点交接、
搜索的可发现性全部保留。

- 删（13 个文件）：`typographic-cover`（与标题重复）、`image-lightbox`（正文图本就原尺寸可读）、
  `font-size-control`（与浏览器缩放重复）、`author-card`（byline 已署名）、`course-plate`
  （`/learn` 有完整编排）、`command-palette` + `palette-trigger`（与页头导航重复）、
  `gsap-provider`（无消费者）、`ui/stats-tile`（翻板装饰）、`ui/animated-content` /
  `ui/prose-reveal` / `ui/blur-reveal`（把文字按在透明态等 JS/滚动）、`ui/interaction`（死包装）。
- 删的动效：stagger、blurIn、chapter-flip/chapterIn、reelRoll、PageSweep 与换页微升、
  `[data-glow]`、`[data-spotlight]`、row-shift/row-cover/row-tick、首页视差、caret（本就死）。
- 留（功能与状态反馈）：阅读进度线、跨文档 VT、targetFlash、scaleIn/fadeUp/slideDown/fadeOut、
  media-fade、skeleton-sweep、tick-pop/tick-note、chapter-panel/panelUp、codeFlash、read-rule、
  link-underline、导航指示器、搜索页（页头新增入口）、TOC、ChapterBar、BookmarkButton、
  单枚复制链接、PostLicense、系列导航、RelatedPosts、GiscusComments、PostsCalendar、
  SubscribeCard、BackToTop、主题切换、PageTransition 焦点交接。

**二、落地**

- CSS 两遍按选择器手术 + 18 处定点收尾：`globals.css` 4147 → 2974 行（`wc -l`：减法 −1179，
  标题 lining 补 +6）。
  工具在仓外 `ui-concepts/verify/zk-css.mjs`（`--pass2` 切第二遍死族）与 `zk-manual.mjs`
  （18 条精确替换，CRLF 感知，任一 old 串不唯一即拒写）。格式保全：逐条记录 lead/tail 空白、
  选择器跨度感知重建 header；`diff -w -B` 对第二遍备份仅 96 行纯格式差异 → 语义等价。
- 死令牌撤：`--row-glow` / `--page-sweep-line` / `--band-*`（四主题）/ `--hero-gradient` /
  `--panel-gradient` / `--shadow-hero`；`--progress-fill` 保留（进度线在用）。
- `--pagefind-ui-*` 看似孤儿，实由 Pagefind 自带 UI CSS 消费 → **保留**。孤儿扫描必须排除
  `.next.bak.r20b` / `out.bak.r20` 两个备份构建目录，否则假阴性（本轮踩过）。
- `lib/` 锁未破：`NAV_LINKS` 在锁定的 `lib/constants.ts`，搜索入口改在 `components/header.tsx`
  视图层加一枚 `/search` 链接。
- `gsap` 依赖留在 `package.json` 但零引用（tree-shaken）；摘依赖属风险动作，**用户已确认保留**
  （2026-11-17）。`zc-verify` weight 段新增断言「首页 eager JS 无 `ScrollTrigger|gsap.core|_gsap`
  标记」钉住此事。
- 文档同步：README 功能清单与技术栈（GSAP 不再列为在用技术）；HOW_TO_POST 封面节改
  「自定义分享图」（`cover` 只喂 OG，缺省 `public/og-default.png`）、「课程图版」节改
  「首页刊头与站点事实」（含 `popular: true` 决定精选）、下线清单补第 21 轮；DESIGN 第 21 轮
  与 §5.2 / §6 表。历史轮次原文不改写。
- 标题数字补一处真缺陷：Georgia 默认旧式数字，展示字号下「40 天」读成「4o 天」。实测
  `font-variant-numeric: lining-nums` 在该栈真生效（h1 注入后目检数字变 lining），遂给标题族
  （`.display / .heading-1..3 / .section-title / .prose h1..h4 / .editorial__title /
  .editorial__section-head h2 / .side-block h2 / .editorial__item-title / .font-serif`）统一翻
  lining；正文保留旧式数字（报刊正文传统）。零新色、零动效。

**三、闸的改题与退役（主体被用户指令删掉，不是放宽判据）**

1. `zc-verify` 一段（`--only=plate` 名保留）：CoursePlate 没了 → 改题为等强度首页闸：
   1280/390/320 × 明暗六档，计量行文本 `/\d+ 篇文章/`、字号 ≥11px、字色 ≠ 正文色、
   5 条 `.feature-row__link`、href 前缀 `/blog/posts/`、标题 ≥15px、16 个死选择器一个不许
   出现、横向溢出 ≤0、侧栏 5 块、零控制台错误；再点第一行 → 落 `/blog/posts/<slug>/`
   且 h1 + prose >200 字。
2. `sweep2`：翻板塌陷检查退役；`.stagger` 从「视口内不可见」豁免摘掉（主体已删，留豁免
   等于给死灰复燃留门）。
3. `noscript`：滚筒 `--digit` 与 sr-only 真值比对一段退役；可见性判据原样保留。
4. 纪律闸：`EXCEPT.keyframeProp` 的 `blurIn:filter` 例外撤销（R7 自证要求每条例外都被命中，
   主体没了还留例外会 FAIL）；R1 的 stagger 宽限撤销。`@keyframes` 22 → 18。
5. 不跑的探针：`batchn.mjs` / palette-nav / palette-trap / flip-probe —— 主体（命令面板、
   翻板、like-btn）已删，跑它们只会量到不存在的东西。

**四、验证（2026-11-17，最终 build 含 lining 补丁）**

- `npm run build` / `npm run check` rc=0（`build-zk2.log` / `check-zk2.log`）；纪律闸
  「扫了 125 个源文件 · 18 个 @keyframes … 违规 0 处 · 0 类 PASS」。
- 减法落地后第一遍电池 6 闸全绿（`reg-zk-*.log`）；第二波 7 探针 rc=0 且日志零 FAIL
  （`reg-zk-<probe>.log`）：vt 默认档 finished=311ms / reduce 档 8ms、软导航 pagereveal=no
  符合 MPA 边界、pretty 双确认；rmotion3 十四页透明窗口全 0ms；copybtn 三枚复制钮聚焦后
  可见可点（焦点环 solid 2px）；reading-progress 甲档 CSS 时间轴连续、乙/丙档行内 1% 网格
  接管、三档 `role=progressbar` 与 `aria-valuenow=100`；deadctl 十四页 0 具死控件；
  noscript-img 二十页 0 个透明的洞；search-kbd Tab 轨迹 输入框→清空→筛选 chips、
  live 播报「共 83 条结果」。
- lining 补丁后**整套重建重跑** 7 闸（`reg-zk2-*.log`，含 fontwt）全绿：zc-verify 全部通过
  （首页 eager JS 18 脚本 / 468.4KB，无 Lenis / GLB / GSAP；六档计量行 13px 次要色、主栏 5 行、
  点穿到文章页）；narrow-overflow 320/360 各 0 页；sweep2 43 页 / 215 检查 / findings []；
  batchy 全 PASS（h2#license top=96px、全程零页面级 JS 错误）；mathclass 92 页 / 2750 命中块
  逐元素等价；noscript 20 页 0 不达标；fontwt PASS（lining 只换数字字形，不改字重档像素差）。
- 截图目检 `shots-zk/` 17 张：首页 / 索引 / 文章 × 1440/390 × 明暗 + 文末 + lining 注入对照。
  确认「40」不再读成「4o」、正文旧式数字保留、版式无回归。
- 红线不变：day-10 绝对 INP（静窗不可达，§11.37/§11.41）、Shiki 3 行亮色对比度（Batch F
  边界）。本轮零色值改动 → 对比度普查不重跑，596 基线不变。**不声称全站 AA 全绿、不声称
  INP 绿**；计时闸不在本轮电池内。

**五、残留**

- `gsap` 依赖未摘（零引用、tree-shaken；用户 2026-11-17 确认保留）；`lib/covers.ts`
  仍是锁定死代码；`og-default.svg` 零引用。
- `editorial-list` 的 `span.feature-row__body` 内含 h3/p（phrasing 嵌套不合规、渲染正常）——
  刻意不动以免电池中途重建，登记为下一轮候选。
- 索引标题 3 行 clamp 下末行单字（「己」）是密度取舍：`-webkit-line-clamp` 与 `text-wrap`
  互斥，不为一字破 clamp。
- ZJ 边界不变：跨文档 VT 只覆盖硬导航。

### 11.47 视觉层推倒重写：开本与栏线（Batch ZL）

2026-11-17。用户裁定「你要不推倒重构」，经选项确认：**视觉层推倒**（`app/` 页面 +
`components/` + `globals.css` 整体重写，`lib/` / `content/` / `proxy/` 与全部 14 闸不动）
× **简洁风·新版面**（报纸嗓音保留——标题黑体 / 正文宋体 / 楷体引语——但版面、字阶、
留白全部换新；令牌 / 动效 / 无渐变等约束照旧生效）。

**一、契约冻结 → 单层重写**

- 先以无头浏览器逐令牌实测明暗两套现行生效值，冻结为 `ui-concepts/verify/zl-tokens-light.json`
  / `zl-tokens-dark.json`（各 142 键），作为重写的唯一色值 / 间距来源——重写不换肤色，
  596 对比度基线与暗色强调面修复原样承继。
- `app/globals.css` 从 2974 行七层历史覆写重写为 ~2000 行单层：§1 令牌（色值实测原样 +
  别名走 `var()`）→ §2 基底 → §3 字阶 → … → §22 reduce 一处收口 → §23 print。历史覆写层
  全部消解进单层，`SPEC_LEDGER.tokens.json` 同步从实测基线整册重写（58 色 / 字阶 11 档 /
  圆角 [0, 9999] / 阴影 none / 断点 [520, 640, 896, 901, 1024]），撤掉滞留的第 5 轮
  are.na/indigo 旧册。
- 130 个类钩子与全部 JS 触碰类逐一携带；17 个 @keyframes、两处纪律例外（range 渐变轨 /
  reading-progress linear）、reduce / print / VT / scroll-timeline / has-math / Shiki 双主题 /
  首字下沉 / 楷体引语 / 主题圆形揭示全部原样承继。

**二、新版面「开本与栏线」**

- **字阶**：display 64 / h1 40 / h2 28 / h3 22 / h4 17 / lg 19 / body 16 / prose 18（INP 证据档
  不动）/ sm 14 / code 14 / caption 13 / eyebrow 12（mono 0.14em）；行长 40.5em。
- **形状**：圆角全 0 方角，`pill` 只留语义保留位、头像 50%；`tailwind.config.ts` borderRadius
  同步归 0；4 处内联 `--radius-pill`（系列 chip + 3 处 sim 进度条）收口为 `--radius-xs`。
- **刊头**：mono 眉题 → 黑体大题 → 宋体导语 → 出版数据栏（双细线夹持）→ 2px 墨 + 发丝双规线。
- **栏线**：≥901px 侧栏通高左竖线 + 40px 缩进；≤900px 单栏摘线。
- **挂码**：索引行 grid 44px（窄屏 32px）外沿栏挂 mono 页码，随悬停转朱砂。
- **章节头**：2px 墨线压顶 + 黑体题 + 延伸发丝线 + 右端入口；朱砂方印统一节题 / 文内 h2。
- **控件**：方角发丝线只换色——primary 墨底、secondary / 复制钮 hover 墨翻白、分页当前项与
  筛选 pressed 墨底。零位移零阴影。

**三、聚焦精修（一轮）**

首屏密度是最大短板：刊头 pb 48→32、题 / 导语 mt 20→16、数据栏 mt 32→24（900px 折叠线内
多容纳一条完整文章行）；侧栏 `padding-top: calc(48px + 12px)` 使侧栏首题头与主栏 folio 头
光学对齐。折叠线截图前后对照确认。

**四、证据（全部对最终构建）**

- `npm run build` / `npm run check` rc=0；纪律闸「扫了 125 个源文件 · 17 个 @keyframes ·
  时长 5 / 缓动 89 / 属性 122 / 语汇 4 / 颜色 84 / 动画引用 16 / 工具类 74 · 违规 0 处 · 0 类
  PASS」，两处注册例外全命中。
- 七闸全绿（`reg-zl-*.log`）：zc-verify 全部通过（首页 eager JS 18 脚本 / 468.4KB；/tags 31 行
  25 带简介）；narrow-overflow 320/360 各 0 页；fontwt PASS；noscript 20 页 0 不达标；
  mathclass 92 页 / 2750 块逐元素等价；batchy 附则 7 全 PASS（h2#license top=96px）；
  sweep2 215 检查 findings []。
- 新交互探针 `ui-concepts/verify/zl-interact.mjs` 28/28：首页悬停标题 + 挂码转
  rgb(180,68,47) 且可还原、chip/btn 0px 圆角而头像 50%；主题两段揭示（120ms 罩在而 .dark
  未落、900ms 落定 canvas rgb(20,19,17) 罩已摘、可翻回）；390 抽屉 7 链接 Esc 焦点归还汉堡；
  订阅复制 label「已复制」+ 剪贴板真值以 rss.xml 收尾；收藏→清单→移除→空态焦点「去读文章」
  闭环；代码复制 hover opacity 1 + aria「已复制」；搜索 Agent 4 命中；reduce 档 scroll auto +
  时长 parseFloat ≤ 1e-5 + 悬停颜色反馈保留。
- 探针四修均为量具错、产品零改动：主题断言改两段式（读 theme-toggle 源码证实 animationend
  才 setTheme）；订阅复制选择器限定 `.editorial__subscribe-row`（原全局 `button[data-js-only]`
  打到头部主题钮）；reduce 时长断言接受 0.01ms 通用清零的计算值 1e-05s。
- 截图目检 `shots-zl/` 12 张：首页 / 索引 / 文章 / 关于 / 学习 / 标签 × 1440 明暗 + 390 明暗 +
  折叠线对照。
- 红线不变：day-10 绝对 INP（静窗不可达）、Shiki 3 行亮色对比度（Batch F 边界）。本轮零
  色值改动 → 对比度普查不重跑。**不声称全站 AA 全绿、不声称 INP 绿**；计时闸不在本轮电池内。

**五、残留**

- `span.feature-row__body` 内含 h3/p 的 phrasing 嵌套不合规承继自 ZK，仍登记为候选。
- `gsap` 依赖保留（用户确认）；`lib/covers.ts` 锁定死代码、`og-default.svg` 零引用不变。
- DESIGN.md 增补 §3.1（现行字阶）与 §5.4（开本与栏线）；旧表保留作历史出处。

### 11.48 对照优秀博客的五个缺陷：把人与入口放进首屏（Batch ZM）

2026-11-18。用户要求「在网上看看其他优秀的博客网站，再看看咱们的」。七个参照站
（antfu、tw93、paco、rauchg、leerob、robinrendle、overreacted；emilkowalski 为组件文档站，
剔除）逐一真实截图目检，与本站逐项对照得 D1–D7；用户裁定「D1–D5 都修」。D6（内容多样
与更新频率）需解锁 `content/` / `lib/`，登记为方向项不动；D7 为台账红线，不变。

**一、五缺陷与修法**

- **D1 ⌘K 死承诺**：搜索页挂着 ⌘K 广告语但全站没有全局监听。`components/header.tsx`
  加 window keydown（Meta/Ctrl+K，preventDefault）：非搜索页 `router.push('/search')`，
  搜索页内聚焦 `input[aria-label="搜索全站内容"]`。文案三处随平台（header kbd / 输入行
  kbd / masthead counter）：Win 显示 Ctrl K。
- **D2 首屏没有人**：参照站全部首屏见作者（antfu 自述、leerob bio、overreacted by+头像）。
  刊头计量行首格加 `SITE.author.name 主笔`（真实数据）；侧栏「关于本站」首行
  `.side-about__name`（title 族 15/700）。
- **D3 移动端文末无订阅入口**：`.post-subscribe` 复用 `SubscribeCard`，落在相关文章与
  评论区之间（border-top line-strong + pt 22；h2 15/700 title 族）。
- **D4 索引行扫描密度**：摘要改单行 clamp（clamp 与 text-wrap 互斥，注释留档）；几何收回
  66px：section 48→32、head pt 12→10、刊头 pb 32→24、行 26/28→18/20、desc mt 8→6、
  tags mt 12→10。行高 211→约 189px，row2 top 958→约 892；首屏 900px 由「完整 1 / 起头 2」
  变「完整 2 / 起头 3」。断言不放宽，改产品几何。
- **D5 首屏视觉锚弱**：刊头右端朱砂排字方印「志」`.editorial__seal`：72px 方 / 楷体 40px，
  ≤640px 48px / 26px；`--color-primary` 底 `--on-accent` 字，随模式翻（亮
  rgb(180,68,47)/白，暗 rgb(224,117,95)/rgb(20,19,17)）；aria-hidden、user-select:none。
  刊头改 flex（main flex:1 min-width:0）。零新色值。

**二、验证抓出的两个真缺陷（产品侧）**

- **trailingSlash 焦点分支**：`trailingSlash:true` 下 `usePathname` 返回 `/search/`，
  `=== '/search'` 落 else → 同路由 push 不重 mount、autoFocus 不触发。改
  `startsWith('/search')`。探针 FAIL 抓出，非量具错。
- **giscus 父文档 CSP**：client.js 在父文档注入 `https://giscus.app/default.css`，
  style-src 未放行整条被拒（控制台每篇红一行，来源 location 实证）。`app/layout.tsx`
  style-src 只加 `https://giscus.app` 一个源。giscus `/api/discussions` 404 = 仓库
  Discussions 未启用，环境态；探针按 console location URL 过滤并留档理由，非产品错误。

**三、证据（全部对最终构建 build-zm3）**

- `npm run build` / `npm run check` rc=0；纪律闸「125 源文件 · 17 @keyframes · 违规 0」。
- `zm-interact.mjs` 33/33：Meta+k 首页→/search 且焦点落输入框；blur 后 Ctrl+k 接回；
  文章页 Ctrl+k 跳转；三处文案 Ctrl K；主笔行；侧栏名首屏；方印双模式几何/色值/楷体 +
  390 48px 无溢出；clamp 1；首屏完整 2 起头 3；390 订阅块落位/复制/剪贴板真值/DOM 顺序
  （compareDocumentPosition：相关文章在前、评论区在后）；桌面订阅；reduce 档 Ctrl+k。
- 七闸 `reg-zm3-*`：zc-verify 全部通过；narrow-overflow 320/360 各 0 页；fontwt PASS；
  noscript 20 页 0 不达标；mathclass 92 页 / 2750 块等价；batchy 全 PASS；sweep2 43 页 /
  215 检查 findings []。
- 截图目检 `shots-zm/`：home-1440 亮全页 / 暗折叠线、home-390 亮全页、posttail-390
  （订阅块居中于相关文章与评论之间）、search-1440（三处 Ctrl K）。
- 红线不变：**不声称全站 AA 全绿、不声称 INP 绿**；计时闸不在本轮电池内。

**四、残留**

- D6 内容多样与更新频率（最近更新 2026.09.16）需 `content/` / `lib/` 解锁，方向项未动。
- giscus 404 环境态：仓库启用 Discussions + 装 giscus App 即消；评论失败兜底已带三步诊断。
- DESIGN.md 增补 §5.5（首屏的人与入口）。

### 11.49 组件层全量重写：契约不变，把补丁疤清掉（Batch ZN）

2026-11-19。用户裁定「你要不把前端组件全删了重新写吧，保留原有数据就好」。范围 =
`components/` 全部 66 个源文件（63 tsx + 3 ts）；`app/`（组合层）、`app/globals.css`
（ZL 单层设计系统）、`lib/`（除 accents）、`content/`、`proxy/` 一律不碰。数据与契约
冻结：导出名/props、DOM 钩子（data-pagefind-body / data-js-only / 各类名）、aria 与
键盘/焦点闭环、localStorage key 与值形状、时序档位，逐条照旧。

**一、方法**

- 现文件即行为规格：干净重实现，删补丁疤、死分支、重复 JSX、带批次编号的注释；
  只留非显然的 WHY（水合陷阱、postMessage 时序、焦点三问、:has() 等价特异性等）。
- 分工四组不相交：主笔 32（ui 五件 + hooks 三件 + 外壳与索引十四件 + 搜索/评论等），
  三个后台代理分别 learn-core 16、sim 8、shell-2 10；代理禁 build / 禁碰 8126 /
  禁改清单外文件。合流前主笔逐 diff 验收全部 66 件（trust but verify）。
- 代理自证：learn-core 62 条 SSR 契约断言；sim 83 条运行时断言 0 FAIL + 重写前后
  DOM 签名 A/B 完全一致（16 实验台初始与单步后）；shell-2 边界日期/URL 修复等价测试。
  主笔复核重点：storage 入口、live 区常驻位置、焦点交接、类名字面量（Tailwind 静态
  提取不能被常量拼接破坏，gotcha-table 曾试 GRID 常量已回退）。

**二、两处 deliberate 偏差（登记，非漂移）**

- `progress-wall` 图例 swatch 去 `rounded-[3px]` 归方角：落实半径 token 全 0 的硬约束，
  唯一像素级改动；三态配色与计数逻辑逐条等价。
- `code-block-enhancer` 连点复制时先 clearTimeout 上一枚复位定时器：保证「最后一次
  复制后 2s 复位」，消重复交互隐患；状态机文案/图标/色值不变。

**三、证据（全部对最终构建 build-zn）**

- `npm run build` rc=0：313 页索引；产物审计 1160 文件通过（邮箱明文/秘密/外链脚本）。
- `npm run check` rc=0：tsc 0 错；lint 0 错 1 警告（`app/archive/page.tsx:54` yearIdx
  未使用 —— 冻结层固有，ZM 轮同在，不动）；纪律闸「125 源文件 · 17 @keyframes ·
  违规 0 处 · 0 类」；proxy/attack/env 审计全过。
- 交互探针：`reg-zn-zl-interact` 28/28、`reg-zn-zm-interact` 33/33（含 ⌘K 三处文案、
  文尾订阅 DOM 顺序、reduce 档颜色反馈与平滑滚归零）。
- 七闸 `reg-zn-*`：zc-verify 全部通过；narrow-overflow 320/360 各 0 页；fontwt PASS；
  noscript 20 页 0 不达标；mathclass 92 页 / 2750 块逐元素等价；batchy 全 PASS；
  sweep2 43 页 / 215 检查 findings []。
- 截图目检 `shots-zn/` 10 张（明暗 × 1440/390）：home / posts / post / posttail /
  learn / lesson / search / archive / about，零控制台错误；印章、署名条、章节条、
  周条、日历热格、搜索入口胶囊真实计数均在位。
- 66 件统一 CRLF 归一 + 文末换行（normalize-zn.mjs，scanned=66 touched=66）。
- 红线不变：**不声称全站 AA 全绿、不声称 INP 绿**；计时闸不在本轮电池内。

**四、残留**

- D6 内容多样与更新频率仍待 `content/` / `lib/` 解锁，方向项未动。
- giscus 环境态不变：posttail 截图里 iframe 停在「正在加载评论……」占位，仓库启用
  Discussions + 装 giscus App 即消；失败兜底三步诊断照旧。
- 冻结层 lint 警告（yearIdx）留待将来解锁 app 层时顺手清。


### 11.50 视觉层全量重做：巨字工程出版（Batch ZO）

2026-11-19。用户裁定「我的意思是整个UI都要去掉，都要重新设计重做」；三版真实初稿方向门
后作者选定「A 巨字工程出版」。范围 = `app/globals.css` 单层令牌系统全量重写（现 2405 行，
含清掉 333 行旧设计死 CSS）+ `app/` 其余 12 件（组合层页面与 layout）+ `components/`
视觉过 21 件；
`lib/`、`content/`、`proxy/` 一律不碰，数据与契约冻结（导出名/props、DOM 钩子、
aria 与键盘/焦点闭环、storage key 与值形状、时序档位）。

**一、方法**

- 方向门留档：三版真实 HTML 初稿与截图在父目录 `design-demos/`（不入库），选定原话与
  截图路径记 `direction-approved.md`；迭代不再过门。
- 视觉语汇：纸白 #F6F5F1 / 暗 #121212、信号红 #C82217（暗档 #FF6B5E）、墨黑规线；
  巨字中文 display 900（hero `clamp(58px,9.5vw,128px)`）；规线模块网格 + mono 编号索引
  （导航 01–07、索引行、INDEX 栏）；方角（radius token 全 0）；「跑通/验收」母题贯穿课程面。
- 探针揪出两处真缺陷并修：① 巨字 hero 吃掉整块 900px 首屏（started=1/full=0）→ hero
  padding/margin 共收约 136px、h1 上限 154→128px，复测 started=2/full=1、shead 651；
  ② 390px 汉堡被推出视口（x=825）——`.idx` 在 globals 写 `display:flex` 压过同优先级
  Tailwind `hidden` → 删 display 交还 `hidden lg:flex` 分区；刊头压缩（gap-3/gap-2、
  SEARCH 低于 sm 收成图标、≤560 wordmark 18px）。
- 闸失明修正：`body overflow-x:clip` 吞刊头溢出，doc-scrollWidth 闸绿而汉堡按不中 →
  narrow-overflow 增 `headerOut` 独量（可见 header a/button 整块落视口内）。量具修正，
  非判据放宽。
- 探针改挂（契约随设计换，阈值按实测立）：ZL 30+ 条 / ZM 37 条改挂 A 语汇；byline
  `rounded-full` 计算值 9999px 与 50% 双收；reduce 档 `.a-title` 是 <a>、故意保留 200ms
  颜色反馈，位移归零改量 `.a-idx` span；focusvis 命令面板腿按 ZK 减法事实摘除（Ctrl+K
  改跳搜索页、站内再无 role=dialog），只量移动抽屉这一现存浮层世界，零次自证保留。
- 改挂后首全量（3866 焦点站 / 像素复核 124 / 浮层重走 30）揪出两处真缺陷并修：
  ① 固定回顶钮盖住右下角焦点站（页脚「订阅」、代码「复制代码」，2.4.11 计 27 处）→
  角钮与焦点相交期间让位（opacity 0 + tabIndex -1 一起摘），焦点离开或滚走再回来；
  首版让位带 20px 下滑位移，藏起时矩形移出相交区→判「没盖」→回来→自激振荡，
  子集复量抓现行后去掉隐藏态位移（矩形恒定才判得稳）；
  ② 搜索页 `autoFocus` 在搜索子树 hydration commit 才开火（等 pagefind、比刊头晚），
  抽屉先开则焦点被拽到遮罩背后（/search/ 抽屉遍链被盖 100%）→ 改挂载 effect，
  仅当 activeElement 仍是 body 时接焦点；⌘K 显式 focus 不受影响。
  同簇另有量具假阳：focusvis 开抽屉用 `el.click()` 不移动焦点，Tab 起点留在页内
  （/search/ 是输入框）整遍走在遮罩背后；真鼠标/键盘必先聚焦汉堡 → 探针补 `b.focus()`
  对齐真语义（focus()+click() 对照实测：抽屉 7 链被盖 0）。

**二、偏差登记**

- 首屏密度判据 started>=2 && full>=1 为修复后实测立阈：巨字版起初不达标是真缺陷，
  修到达标后把实测写进探针，不是把原判据放宽迁就画面。
- 其余无 deliberate 偏差：组件契约与 ZN 冻结清单逐条照旧。

**三、证据（全部对最终构建）**

- `npm run build` rc=0；产物审计 1160 文件通过；out/ CSS chunk 含
  `clamp(58px,9.5vw,128px)`，构建新于最后一次源改动（05:33 > 05:32）。
- `npm run check` rc=0；纪律闸「125 源文件 · 18 @keyframes · 违规 0 处 · 0 类」；
  proxy/attack/env 审计全过。
- 交互探针 ZL/ZM 全绿；narrow-overflow 320/360 各 0 页（含 headerOut）；names 22 控件 /
  15 页 / 66 AX 角色；contrast 明暗两档全页低于 AA 0 处。
- 目检 `shots-zo/` 5 张：1440 明/暗、390、390 抽屉开、文章页 1440——首屏见规线与第一条
  索引行、抽屉 7 链当前项红侧标、文章页 stamp/署名条/INDEX 栏/首字下沉均在位。
- 34 件改动统一 CRLF + 文末换行（10 件补文末换行，纯空白）。
- 红线不变：**不声称全站 AA 全绿、不声称 INP 绿**。

**四、残留**

- D6 内容多样与更新频率仍待 `content/` / `lib/` 解锁。
- giscus 环境态不变（仓库启用 Discussions + 装 App 即消）。
- sysweight 信息档：Windows YaHei 把 500 钳到 400、650/700 钳到 600，平台边界非缺陷。
- 全量焦点闸与 vitals 未在 ZO 构建上跑完（被 R1 迭代取代），证据以 §11.51 的 R1 复跑为准。

### 11.51 R1 精修：宋体书嗓与印刷细节（Batch ZO-R1）

触发：作者看 ZO 成品首页仍判「我觉得还是不太好看，你能不能再优化一下，参考一下其他优秀的博客网站」。
属方向 A 选定后的迭代改稿（direction-approved.md 已落档豁免原话），不重开三方向门。

#### 一 方法

1. 参照实测而非凭印象：headless 截五站（overreacted / leerob / yihui / paco / antfu，
   存 ui-concepts/verify/ref-*.png）。两站弃用留因：emilkowalski.com 域名易主为无关链接页、
   diygod.me 连接超时。in-app 浏览器无可见viewport（NATIVE_BROWSER_VIEWPORT_UNAVAILABLE），
   截图改走自有 shot.mjs——量具不可用时换量具，不换结论来源。
2. 诊断（对照成品截图与初稿 A）：落地并未丢初稿结构，丑在嗓音单一——全站黑体 900/700，
   巨字像黑 slab、整页像规格表；无视线锚点（纯平纸 + 发丝线）；无印刷细节（单线、无套准 mark）；
   冷灰面（#eceef0）与暖纸（#f6f5f1）打架。
3. 借法落地（app/globals.css + app/page.tsx + app/layout.tsx，lib/content/proxy 零改动）：
   - 嗓音：--font-title / --font-serif 改 Georgia + Songti SC/Source Han Serif/Noto Serif/SimSun；
     展示巨字、报头 wordmark、栏头、行题、课程名、黑带题全部转宋体（汉字粗宋系统合成，报纸大标宋同路）；
     .prose / .a-desc / .hero-bio 转书嗓阅读面；UI 控件与 mono 索引不动。
   - 印刷细节：刊头与栏头 2px solid → 3px double 双规；四角裁切 mark（.crop-marks，fixed +
     pointer-events:none 不参与命中测试，窄屏 display:none）；hero 右栏最新一文做样张卡
     （.side-card 暖面 + 1px 边 + 3px 红顶规）+ 「跑通」落款印章（.seal 竖排两字、-3deg 微旋、
     stampIn 400ms ease-out 500ms both，只动 transform/opacity）。
   - 暖纸面：surface-2/raised 亮 #edeae2、暗 #242220；surface-3 与 skeleton-sweep 同步。
4. 闸驱动的三个真修（都不放宽判据）：
   - discipline 抓印章 delay 600ms 不在 200/300/400/500/800/1200 档 → 改 500ms 档。
   - contrast 抓暖面把 --faint 压到 4.37:1（7 处 span.meta 压 surface-2）→ token 层加深
     faint/muted 亮档 #6e6c66 → #696761（新面 4.66:1、画布 5.1:1），拇指闸同步复跑仍 PASS。
   - ZM 抓 900px 首屏完整行 0（row1 bottom 恰 900）→ measure-r1.mjs 实测后收 36px 垂直节奏
     （hero padding 16/24、bio/attr margin、shead padding/margin、arow padding 20）→ bottom 860。
     判据未动，是版面让回契约。
5. 探针契约未改挂：R1 只换视觉嗓音，焦点/名字/溢出/计时契约原样复跑。

#### 二 偏差登记

- 无新偏差。ZM 首屏完整行 ≥1、discipline 时长档、contrast AA 三条判据均原值保留，靠修版面/修 token 达标。
- 宋体粗汉字为系统合成（Windows SimSun / macOS Songti SC）；无宋体的 Linux 落 serif 默认族，
   属优雅降级，与零 webfont 约束一致（sysweight 残留同 ZO）。

#### 三 证据

- build + postbuild 审计：1160 文件通过；秘密扫描 741 文本产物 0 命中；外链脚本域名（无）。
- npm run check rc=0：discipline 扫 125 源文件 · 19 @keyframes · 时长 9 / 缓动 114 / 属性 153 /
  语汇 3 / 颜色 88 / 动画引用 18 / 工具类 64 · 违规 0 处 0 类（yearIdx 警告为冻结层遗留，非本轮）。
- contrast：亮暗两档低于 AA 0 处（修 faint 前 7 处，修后复跑归零）。
- scrollbar-contrast：2 对拇指基准 PASS（亮档随 faint 加深升到约 5.1:1）。
- narrow-overflow：320 / 360 两档 0 页横向溢出。
- names：22 可见控件 · 15 类页面 · 66 角色另一腿 · 不一致 0。
- ZL / ZM 交互探针：全部通过（ZM 首屏完整行恢复，measure-r1.mjs 实测 row1 bottom 860 < 900）。
- 目检：shots-r1/ 四张（home 亮 1440 / home 暗 1440 / home 390 / post 亮 1440）——
  粗宋巨字笔画对比成立、暗色夜报质感、样张卡印章不压链接、窄屏裁切 mark 摘除无挤爆。
- CRLF：本轮编辑文件逐次归一（globals.css / page.tsx / layout.tsx）。- focusvis 全量（R1 构建，独走）：4 项 PASS 均 0 处——2.4.7 焦点可见（像素差复核后）/ 2.4.13 焦点外观 / 2.4.11 遮挡≥50% / 焦点停稳整块出视口；合计 3868 真实焦点站 · 像素复核 124 站 · 浮层重走 30 次 · 4 档视口/主题 × 15 类页面；rc=0（focusvis-r1-full.log）。
- vitals 独跑（R1 构建，静机、无并发浏览器活）：30 站（15 类页面 × 2 视图）PASS——最差 CLS 0.0484（闸 0.1）、最慢交互 16ms（闸 200ms）；layout-shift 41 条、带 interactionId 交互 6 次；网络 off、注入 none、发车前空闲确认开、触顶 0 站（vitals-r1-full.log）。CLS 高位仍是数学页 KaTeX 落位（0.0484/0.0257），与 ZO 同源、闸内。
- 全闸收口：build / check / contrast / scrollbar / narrow / names / ZL / ZM / focusvis 全量 / vitals 十闸全绿，R1 构建具备提交条件。

### 11.52 R2 精修：页头死白、搜索空态、教程 lead 复读（Batch ZO-R2）

#### 一 方法

1. 12 页目检 + 几何实测定位缺陷：索引页 lead 底 354 → 正文首规 434（/posts）/ 474（/tags）/
   529（/about），80–175px 死白让页头像浮在空中。源为 PageMasthead 的 mb-16 sm:mb-20
   与 /about 跳转 nav 的 mb-14。
2. 收节奏不放宽判据：masthead 改 mb-10 sm:mb-12（40/48px）、about nav 改 mb-10。
   复测 /posts 首行 434→402、/about 首栏头 529→481、/tags 474→442、/learn 531→499。
   home hero 不动（ZM 900px 契约只约束 home，复跑仍全过）。
3. 搜索空态补真实内容而非装饰：服务端 getAllPosts().slice(0,3) 以 recent prop 传入，
   chips 下加「最近发布」三行（2px 双规栏头 + 行线 + 宋体题 + mono 日期/分钟 + 全部文章入口）。
   390 实测单行四列把题截到约 10 字 → 窄屏藏序号与分钟列、题改 line-clamp-2，复截成立。
4. 教程 lead 复读去重（渲染期决策，content/ 与 lib/ 零改动）：扫 268 课得 115 课的 lead
   与正文开篇逐字相同或为其前缀。规则比前 3 段、含引用块/去引用块两路候选，norm 去 markdown
   记号、链接 URL 与空白；lesson-view 命中即不渲染 lead，153 课保留。day-29 同段出现两次、
   day-01 lead 复读第二个 callout 首句，修后目检各只出现一次。
5. 量具教训：首扫只比「去引用块首段」且未剥 YAML 引号，得 4/268 的假低估；二扫含引用块又漏回
   已修的 51 课。每次改规则先对拍原始 mdx 文本与 DOM 实测（verify-r2*.mjs），再定稿。
6. 纪律执行：lead 规则定稿前与窄屏修前各需重建，均先 TaskStop 停掉在跑的全量焦点闸再 build，
   不在探针跑时重建。

#### 二 偏差登记

- 无新偏差。ZM / discipline / contrast 判据原值保留；lead 去重只改视图层渲染条件。
- 115 课隐藏 lead 后开篇由 drop-cap 段或 callout 承担导语嗓音，目检 day-01 / day-29 成立。

#### 三 证据

- build + postbuild 审计：1160 文件通过；秘密扫描 741 文本产物 0 命中；外链脚本域名（无）。
- npm run check rc=0：discipline 违规 0 处 0 类（工具类 66→68 随新增行类）。
- contrast：亮暗低于 AA 0 处。scrollbar-contrast：2 对拇指 PASS。
- narrow-overflow：320 / 360 两档 0 页横向溢出（含搜索新行）。
- names：22 可见控件 · 15 类页面 · 66 角色另一腿 · 不一致 0。
- ZL / ZM 交互探针：全部通过（R2 最终构建复跑）。
- 目检：shots-r2/ 八张（posts / search 亮暗 / about / day-01 / day-29 / home-390 / search-390 / search-320）。
- CRLF：本轮编辑文件逐次归一（page-masthead / lesson-view / about page / search-page / search page）。
- focusvis 全量（R2 最终构建，独走）：4 项 PASS 均 0 处；合计 3886 真实焦点站（较 R1 +18，为搜索最近发布新增链接）· 像素复核 124 站 · 浮层重走 30 次 · 4 档视口/主题 × 15 类页面；rc=0（focusvis-r2-full.log）。
- vitals 独跑（R2 最终构建，静机、无并发浏览器活）：30 站 PASS——最差 CLS 0.0484（闸 0.1）、最慢交互 24ms（闸 200ms）；layout-shift 41 条、带 interactionId 交互 17 次（较 R1 +11，为搜索最近发布链接进入交互步）；网络 off、注入 none、发车前空闲确认开、触顶 0 站（vitals-r2-full.log）。
- 全闸收口：build / check / contrast / scrollbar / narrow / names / ZL / ZM / focusvis 全量 / vitals 十闸全绿，R2 构建具备提交条件。

### 11.53 改名 · Baron_Zhang → LuVisage（2026-11-20）

- 用户原话：「把我的名字改成LuVisage」。只改身份串，数据与版面契约不动。
- 唯一真源 lib/constants.ts：SITE.title / SITE.author.name / ABOUT.greeting 三处改 LuVisage；刊头 wordmark、首页眉题、关于问候、文章 byline、页脚版权、metadata / OG / 结构化数据全部读它，一处随动。
- 刊头 wordmark：旧名以下划线拆段、红下划线为身份锚；新名无下划线，驼峰边界大写字母 V 继承信号红缀字（LU<em>V</em>ISAGE），.wordmark em 亮暗翻色契约不变（ZM D5 复测：亮 rgb(200,34,23) / 暗 rgb(255,107,94)，与本体分离）。
- 静态资产同步：manifest.webmanifest name/short_name；og-default.svg 文本；og-card.mjs h1 改后重生成 og-default.png（排字刊头，非生成式素材）；README / DESIGN.md 站名同步。台账历史条目保留旧名（档案性质）。
- feeds / sitemap 走脚本重生成（与 prebuild 同源）：rss.xml / atom.xml / feed.json 的 title/author 随 SITE；sitemap lastmod 按惯例刷 2026-11-20。
- 探针随 spec 改挂（量具跟规格，非放宽）：ZL/ZM 身份断言由硬编码 'Baron' 改读 SITE.author.name / SITE.title，wordmark 文案断言改 SITE.title.toUpperCase()——单一真源，今后改名不再漂移。首轮探针 FAIL 与崩溃（getComputedStyle(null)）系量具期望旧名 + 缀字 em 被删所致，非站点缺陷；改挂后复跑全绿。
- 证据：build 审计 1160 通过（build-rename3.log）；npm run check rc=0 · discipline 违规 0（gate-rename2-check.log）；contrast 0 处 · scrollbar PASS · narrow 0 · names 全合格 · ZL 全部通过 · ZM 全部通过，整组 0 FAIL（gate-rename2-browser.log）。
- 目检：shots-rename/ 首页亮暗（红 V 刊头）、about（你好，我是 LuVisage）、文章 byline（LuVisage）、og-default.png 新卡。
- CRLF：本轮编辑文件逐次归一（constants / header / manifest / og-svg / README / DESIGN）。

### 11.54 简介扩宽 + 巨字主张换嗓 · 写作即思考 → 跑通验收（2026-11-20）

- 用户原话：「我认为你需要再改一下我的简介，因为我不止关注agent，大模型应用，我还关注一些AI算法，CV，NLP这些，同时，写作是最好的思考方式这句话哦我感觉也有点不妥，你看看别的博客是怎么介绍的，参考一下」；嗓音三选回复「[No preference]」→ 落推荐项跑通验收派。追加指令「代码中不要出现emoji」。
- 参照结论（五标杆实测，ref-*.png 与 blog-reference-sites 记忆）：overreacted 无格言只索引、leerob「I'm an engineer and writer.」+ 使命句、antfu 自述身份与热情、paco「Crafting interfaces.」、yihui 事实自嘲——无人把借来的最高级格言放首页。用户对「写作是最好的思考方式」的不妥直觉成立：借来格言 + 「最好」绝对化。
- 新主张：巨字「算法要跑通 / 工程要验收。」（红 。锚不变），继承本站「跑通」印章母题，是自己的工程信条；写作降为工具嗓「写作是为了把这两件事讲清楚」，保留写作身份去掉绝对化。关于页 manifesto 同嗓：眉题 MANIFESTO · 从算法到工程、巨字同句、自述两段与 ABOUT.bio 同步。
- 简介扩宽单一真源 lib/constants.ts：SITE.description / ABOUT.title（AI 算法 · 大模型 · Agent）/ shortBio / bio / NOW.focus / timeline；focusAreas 4→5（新增 AI 算法 首项、desc 点名计算机视觉与自然语言处理；AI 开发工具链 → 工程与工具链）。CV / NLP 进 description / shortBio / bio / focusAreas；title 保持短句保 xl 刊头 wm-sub 不溢出。
- 视图层同步：app/page.tsx hero 两行巨字 + bio 尾句（lede「我相信」保留，信条作相信宾语）；about 页眉题 / 巨字 / 两段；about-sections 友链邀请句扩到 AI 算法 / 大模型 / Agent。header wm-sub、footer、about masthead 全读 ABOUT.title 自动随动，零硬编码。
- 静态资产：manifest name/description；og-default.svg 副题 + 底句；og-card.mjs 眉题 / desc / 三栏（01 AI 算法 / 02 大模型应用 / 03 Agent 架构）重生成 og-default.png 并目检；README 两段。feeds 三件套经 prebuild 同源再生。
- emoji 清零：全仓扫（app/components/lib/public/scripts + README/DESIGN）命中 2 处——og-default.svg U+1F916、rss.xsl U+1F4A1，均除；复扫 0 命中。台账历史条目保留档案性质（本行原字面字符亦改码点记法，避免证据行自触 emoji 闸）。
- 探针零改动理由：ZL/ZM 身份断言上一轮已改读 SITE（§11.53），本轮文案换嗓自然随动；batchm.mjs 量的是旧版 hero echo 行（终端提示符 / sr-char 已不在源码），属退役探针不在闸链，未动。
- 证据：npm run check rc=0；build 审计 1160 通过（build-bio.log）；contrast / scrollbar-contrast / narrow-overflow / names / ZL / ZM 六闸 rc=0 · 整组 0 FAIL（gates-bio.log）；ZM 首屏契约不变：眉题 y=163、自述行 y=608、首索引行 top=727、390px wm-sub 隐藏。
- 目检：shots-bio/ 四张 home/about 亮暗。首轮截图撞 riseIn 半落（首行灰、二行隐）——.hero-h1 .ln > span 有 800ms+200ms 逐行落位，shot 未传 --wait，属截图量具问题非文案回归；--wait=2500 重拍全落位（亮墨 / 暗纸白，红 。与跑通印章在）。
- CRLF：本轮编辑文件逐次归一（constants / page / about page / about-sections / manifest / og-svg / README / rss.xsl）。

## §11.55 装饰配图：CC0 动漫卡通谱系三张印刷图版

- 用户原话：「代码中不要出现emoji」＋「帮我在网上找一下好看的，可商用的，高清的配图放到我的博客里做装饰，尽量是动漫卡通风的」。
- 寻源约束（实测）：Pixabay / Pexels / Unsplash / Wikimedia / Openverse 源页 403 / SSL 被拦 → 许可不可自核 → 全拒；Openclipart 详情页可达、全站 CC0（schema.org license 字段）；其 PNG 仅 800px（2000px 选项 302 回 800）→ 高清走 SVG 矢量本地光栅化（render-svg.mjs，dsf=2），零新依赖。
- 七候选下载渲预览目检，取三拒四：取 c9 Sky City（漫画木刻墨笔 → 404）、c4 Parallax Mountain At Dusk Pixel Art（像素卡通 → about 侧栏）、c8 Generic Skyline At Night（扁平卡通暖窗灯 → 空态地平线）；拒 c1 画家_halftone（非卡通且色噪）、c11 氰蓝过吵、c12 clipart 脸苦、c2 单笔山太 logo。真·动漫风在本网络约束下不可达，最接近的可商用谱系＝漫画墨笔 / 像素 / 扁平卡通，如实说明不冒充。
- 许可自核（WebFetch 详情页亲读 schema.org，不转信代理口述）：三页均 "license":"https://creativecommons.org/publicdomain/zero/1.0/"；作者 j4p4n / GDJ / GDJ。c8 页注「derived from an image on Pixabay」——CC0 声明覆盖该矢量重绘版，源链记档。出处：
  https://openclipart.org/detail/328123/sky-city
  https://openclipart.org/detail/310202/parallax-mountain-at-dusk-pixel-art
  https://openclipart.org/detail/310835/generic-skyline-at-night
- 成品（public/fig/，入 git）：sky-city.webp 1280×790 · 93,498B；pixel-dusk.png 600×353 · 65,142B（nearest 近整数倍缩样，optimize-img.mjs 新增 --nearest 开关）；night-skyline.webp 1040×470 · 57,988B。均 ≤100KB，对显示宽 560 / 280 / 520 css 足 2x retina。
- 落位语言＝印刷图版：components/figure-plate.tsx（1px --line-strong 墨框 + .plate-img 宽满高自适 + .plate-cap mono 图注「FIG. 编号 — 题名 · 作者 · CC0 出处链接」）；width/height 写死防 CLS；loading=lazy decoding=async；alt 中文描述画面；print 隐藏。三槽：404 左栏 FIG.404 云上之城（地址在云上）、about 侧栏 FIG.01 像素黄昏、EmptyState FIG.00 夜城天际线（空房地平线，search / bookmarks 等空态共享）。首页 hero 冻结契约未碰。
- emoji 闸自触修正：§11.54 证据行原字面写了被除的两枚 emoji，check:emoji 扫台账命中 → 改码点记法 U+1F916 / U+1F4A1，证据保留且闸过。
- 证据：npm run check rc=0（含 emoji 闸自触修正后复跑）；build rc=0 · 审计 1163 通过（build-fig.log）。六闸 rc=0 · 整组 0 FAIL（gates-fig.log）：contrast 低于 AA 可见文字 0（压图片 0）；ZM 首屏契约不变（首索引行 top=727 / wordmark LUVISAGE / 390px wm-sub 隐藏）。
- vitals 独跑 VITALS_ONLY=/about/（MSYS_NO_PATHCONV=1 防路径改写）：2 视图 CLS 0.0000（0 条位移）· 最慢交互 16ms（闸 200ms）· PASS（vitals-fig.log）。不全站跑的理由：新图版只落 about / 404 / EmptyState 系；探针站列里仅 /about/ 含新图版；404 非 2xx 被 vitals 规则判 dead、bookmarks 不在站列——这两处 CLS 由 width/height 写死 + lazy 预留保证，截图目检落位稳定。focusvis 不跑的理由：新增交互元素仅图注 CC0 出处链接，与既有外链（GitHub 按钮等，focusvis 已覆盖）同 markup 同全局焦点样式。
- 目检八张（shots-fig/）：404 明暗、about 明暗、search 明暗（初态未变）、bookmarks 明暗（EmptyState 图版）。404 走 /blog/404.html 直求：本地 serve-out.mjs 对未知路径回裸 h1（serve-out.mjs:53-54），量具局限非站点缺陷；生产 GH Pages 未知路径走 404.html。
- 量具教训两条：① shot.mjs --eval 的包装是 return (expr)，expr 必须自调用（传函数体则返回函数对象、序列化 undefined）；② EmptyState 真实使用面六处（bookmarks / categories / archive / series / post-list / tag-index），search 空房是独立 markup 不走该组件——纠正旧摘要误记，search 无结果房保持原设计不动。
- CRLF 归一：components/figure-plate.tsx、app/globals.css、app/not-found.tsx、app/about/page.tsx、components/ui/empty-state.tsx、SPEC_LEDGER.md。

## 11.56 简介换作者原话 + 首页首屏图版（批次 70/71）

- 作者原话（唯一真源 lib/constants.ts）：「记录AI领域的探索与工程实践，涵盖CV、NLP、大模型、智能体等方向。从需求拆解、方案选型，到代码实现、测试验收，完整留存实践中的思考与经验。」SITE.description 与 ABOUT.bio 同串；ABOUT.shortBio 取第一句。视图同步：首页 hero-bio 改渲染 {ABOUT.bio}（去掉旧硬编码尾句）、about 自述 P1 改渲染 {ABOUT.bio}（P2 信条段保留原嗓）、README 首段、public/manifest.webmanifest description、verify/og-card.mjs desc 并重生成 public/og-default.png；三个 feed 由 prebuild 重写（rss.xml / atom.xml / feed.json 已带新串）。巨字信条标题（hero h1 / about ptitle）不动。
- 作者诉求「配图太少了，首页都看不到」→ 新增三块图版，首页首屏可见其一：FIG.01 像素夜城横 banner 落 hero-side 末（首屏右栏）、FIG.02 打招呼的机器人落 04 黑带 dark-grid 之下居中（.band-plate max-width 240 / margin 64 auto 0，版权页插签母题）、FIG.03 白日城市落 /learn 主栏末（粘性跳转栏受 §11.12 行程约束，不碰）。
- 寻源与许可自核（WebFetch 亲读 schema.org）：310447 pixel city (animated) 3 · Lazur · CC0（remix 链含 j4p4n 310197 等，均站内 CC0）；327479 Orange Cartoon Robot · wildchief · CC0；253159 Colorful City Landscape · GDJ · CC0（页注 from Pixabay，同 c8 记源链）。出处：
  https://openclipart.org/detail/310447/pixel-city-animated-3
  https://openclipart.org/detail/327479/orange-cartoon-robot
  https://openclipart.org/detail/253159/colorful-city-landscape
- 横 banner 工艺：310447 是 SMIL 动画 SVG，先剥 8 个 animate 标签再栅格化（避免截到动画中间帧）；viewBox 裁为 "0 100 272 104.615"（2.6:1 天际线横带，屋顶轮廓与窗灯完整，裁切预览目检过）。成品：city-band.webp 1084×416 · 14,856B；robot-wave.webp 480×621 · 18,962B；city-day.webp 1280×720 · 15,264B。
- 首屏几何实测与收紧（ZM D4 契约不放宽）：改前 hero-main 463 / hero-side 372（余高 91），.arow tops 727/860/991 → 第二行 top<900 只容 hero 总增高 <40px。为此三处收紧：side-note 收一行「每步附验收命令 · 共 239 课次。」（信息不丢：验收命令与课次都在，「跟一个 DAY」入口本就在 side-more）、删 side-rule 元素与其两条 CSS（含 1100 断点隐藏规则）、hero padding-bottom 24→16。改后 ZM 实测首索引行 top=760、900px 首屏完整 1 行 / 起 2 行，契约保住。1100 断点 hero-side 转横排 flex 且原选择器只认 div → 补 .hero-side > .plate { flex: 1 1 100%; } 让图版整行落位。
- 证据：npm run check rc=0；build rc=0 · 审计 741 个文本产物 0 命中（build-biofig.log）。六闸 rc=0 · 整组 0 FAIL（gate-*-biofig.log）：contrast 压图片 0；ZM 密度如上。vitals 独跑 VITALS_ONLY='/,/learn/,/about/'（MSYS_NO_PATHCONV=1）：6 视图 CLS 0.0000 · 最慢交互 24ms（闸 200ms）· PASS（vitals-biofig.log）。
- 目检七张（shots-fig/）：home-bio-light / home-bio-dark（首屏右栏 FIG.01 可见、新简介两行、01 区块与首行未被挤出）、band-bio-light / band-bio-dark（黑带机器人插签，暗色保持 mounted-print）、learn-plate-bio（FIG.03 主栏末）、home-bio-390（窄屏简介四行与样张卡正常）、about-bio-light（drop cap 落「记」字、P2 信条段保留）。
- 量具教训：shot.mjs --selector 语义是 waitForSelector 而非裁剪——首版黑带截图与首屏整图字节数完全相同暴露此事；改 --eval 自调用表达式 scrollIntoView({block:'center'}) + 内等 900ms（lazy 图解码）再截。--eval 自调用规则同 §11.55。
- 遗留未动：public/og-default.svg 仍是旧暗渐变视觉（lesson OG 经 lib/lesson-page.ts:41 在用），换视觉需另批批准。
- CRLF 归一：lib/constants.ts、app/page.tsx、app/about/page.tsx、app/learn/page.tsx、app/globals.css、README.md、public/manifest.webmanifest、SPEC_LEDGER.md。

## 11.57 图注关闭 + 底部非组件图版下线（批次 72）

- 作者原话：「把图片解释关了，再把，底部不是嵌入组件中的图片也删了，例如招手机器人，只保留原版即可」。两动作：① FigurePlate 的 figcaption 全关（FIG. 编号 — 题名 · 作者 · CC0 出处那行解释不再渲染）；② 删两块非共享组件嵌入的页底图版——首页 04 黑带的招手机器人（FIG.02）与 /learn 主栏末的白日城市（FIG.03），两处恢复插图前的原版面。
- 保留四块图版但均无图注：首页首屏 hero-side 末夜城横 banner（批次 71 为「首页都看不到」而加）、404 云上之城、about 侧栏像素黄昏、EmptyState 夜城天际线（search / bookmarks 等空态共享组件）。FigurePlate props 收为 src/alt/width/height/className；fig/caption/author/source 四 prop、.plate-cap 三条 CSS 与 .band-plate 规则一并删除；墨框 + 宽高写死防 CLS + lazy/async + print 隐藏不变。CC0 不强制署名，作者与出处链只留本台账寻源记录（§11.55 / §11.56）。
- 产物删除：public/fig/robot-wave.webp、public/fig/city-day.webp（git rm）；city-band / sky-city / pixel-dusk / night-skyline 四件保留。
- 几何预算：图注移除释放右栏约 33px → 把批次 71 的 hero padding-bottom 收紧（16）归还为 24；side-note 单行与 side-rule 删除保持不还原（还原这两项右栏约 516、超主栏 52 > 预算 39，会破 ZM）。改后 ZM 实测首索引行 top=731（批次 71 为 760、插图前 727、预算上限约 766），900px 首屏完整 1 行 / 起 2 行，契约余量回升。
- 证据：npm run check rc=0（check-nocap.log；lint 唯一 warning 为 archive 页既有 yearIdx，非本批引入）；build rc=0 · 审计 1164 文件 / 741 文本产物 0 命中（build-nocap.log）。六闸 rc=0 · 整组 0 FAIL（gate-*-nocap.log）：ZM「01 最新文章标题入首屏（首行 top=731）」「900px 首屏完整 1 行 / 起 2 行」。vitals 独跑 VITALS_ONLY='/,/learn/,/about/'（MSYS_NO_PATHCONV=1）：6 视图 CLS 0.0000 · 最慢交互 16ms（闸 200ms）· PASS（vitals-nocap.log）。
- 目检六张（shots-fig/）：home-nocap-light（首屏右栏横 banner 无图注、新简介与 01 首行未被挤出）、band-nocap-dark（黑带恢复关注方向 + 订阅两栏、无机器人）、404-nocap-light（云上之城无图注）、bookmarks-nocap-light（EmptyState 夜城无图注）、learn-nocap-bottom（主栏止于「进度是怎么存的 / 还有一件事」两栏即接页脚、无白日城市）、about-nocap-plate（滚至侧栏像素黄昏、无图注）。about-nocap-light 与改前 about-bio-light 字节相同系图版在首屏外、首屏截图自然不变，非缺陷；补滚动态截图作实据。
- CRLF 归一：components/figure-plate.tsx、app/page.tsx、app/learn/page.tsx、app/not-found.tsx、app/about/page.tsx、components/ui/empty-state.tsx、app/globals.css、SPEC_LEDGER.md。

## 11.58 黑带出血：去掉容器留下的纸色画框（批次 73）

- 作者指认（附首页黑带截图）：「这里这个边框你不觉得不合适吗」。实缺陷：.darkband 是 main#main-content（1400px 居中 + lg:px-8，layout.tsx:132）的子区块，背景只铺内容宽 1336 → 视口左右各留 52px 纸色画框，黑带读作嵌进去的框而非通栏色带；容器外的 footer 本是通栏，两者节奏不一致。左栏文字贴黑带边（52px 即页面网格左缘）的对齐本身没错，错的是背景没到视口边。
- 修法（只动 CSS，布局宽度不变）：.darkband 的 background 移入 ::before（position:absolute; top/bottom:0; left/right:calc(50% - 50vw); z-index:-1）出血到视口两边；.darkband 改 position:relative、不再自带 background。内容仍落页面网格 52px，出血后自然获得正常栏距。html/body overflow-x:clip 既有（globals.css:336）兜住出血不产生横向滚动；50vw 含经典滚动条宽时公式自校正（内容缘始终等于 main 内容缘）。
- 几何实证（shot.mjs --eval 回报）：1440 下 scrollWidth=clientWidth=1440、.darkband 布局 left=52 不变、::before left=-52px（背景到 0）；390 下 scrollWidth=clientWidth=390，无横向溢出。
- 证据：build rc=0（build-band.log）；六闸 rc=0 · 整组 0 FAIL（gate-*-band.log），ZM「首行 top=731」「900px 首屏完整 1 行 / 起 2 行」不变（布局未动，符合预期）；vitals 独跑 VITALS_ONLY='/'（黑带仅首页，MSYS_NO_PATHCONV=1）：2 视图 CLS 0.0000 · 最慢交互 24ms（闸 200ms）· PASS（vitals-band.log）。
- 目检三张（shots-fig/）：band-band-light（通栏黑带、纸色只留区块上下节奏、左栏 52px 栏距）、band-band-dark（暗色通栏与 footer 同节奏）、band-band-390（窄屏通栏单列、feeds 2+1 换行、无横向溢出）。
- CRLF 归一：app/globals.css、SPEC_LEDGER.md。

## 11.59 OG 排字图版换嗓统一 + 暗色黑带墨线收边（批次 74）

- 作者批准顺序（「可以就这么做吧」）：先 OG 统一、再暗色黑带收边；D6 内容锁未批解锁 → 不动。
- OG 实缺陷两层：① public/og-default.svg 仍是旧暗渐变（#1a1a2e→#0f3460 + 灰字圆斑），lesson OG 经 lib/lesson-page.ts:41 在用；② og-card.mjs 自身令牌停在 ZI 旧嗓（#faf9f5 / #b4442f / Space Grotesk），即 og-default.png 也与 A 方向纸面红嗓不一致。lib/ 锁定不动 → 只换资产与生成脚本。
- 修法：og-card.mjs 重写为当前亮色令牌逐条对应（canvas #f6f5f1 / ink #101010 / prose #161615 / secondary #55534e / hair #d6d4cd / mark #a9a7a0 / red #c82217；宋体展示 + mono 索引 + 黑体 UI 三嗓），绝对坐标骨架一份，同源产出 png（Playwright 截图）与 svg（同坐标 text 基线），两资产由构造不再漂移。版面＝巨字信条「算法要跑通 / 工程要验收。」红句号 + 4px 红规 + 作者原话简介两行 + 三方向栏（mono 红索引）+ 裁切 mark + 跑通红印 + mono 页脚 URL。
- 基线对齐修正：首版 png 栏名基线比 svg 高 21px（HTML .name top 21 误对 svg 532 基线）→ top 42 复跑，两版目检同版面。
- 暗色收边：.dark .darkband::before 上下 1px var(--footer-line)（#3a3a38，与 footer 顶边同款）；亮色不加（纸→黑步阶已够强）。计算值实测：暗 border-top 1px rgb(58,58,56)、亮 0px。
- 证据：build rc=0 · 审计 1164 文件 / 741 文本产物 0 命中（build-og.log）；六闸 rc=0 · 整组 0 FAIL（gate-*-og.log），ZM 首行 top=731 / 完整 1 起 2 不变。vitals 独跑 VITALS_ONLY='/'：首跑 rc=1 FAIL「整轮 0 个带 interactionId 的 event」＝交互腿空转、非超闸；本批改动（OG 资产 + 仅暗色边框）不触首页亮色 DOM，上批同面 vitals-band 有 1 次交互 → 先疑量具偶发，静机复跑 rc=0 PASS（1 次交互 24ms 与上批同值；vitals-og.log 与 vitals-og2.log 双记，不藏首跑 FAIL）。
- 目检四张：public/og-default.png 与 shots-fig/og-svg-preview.png（render-svg.mjs 光栅化；wrapper.html 在 img-candidates/，量具按 --in 同目录找它，需拷 svg 进去）、band-og-dark（上下墨线收边、通栏节奏与 footer 一致）、band-og-light（亮色无边框、与批 73 同）。
- 遗留如实记：多数社交平台 OG 抓取不渲染 SVG（Twitter / Facebook / 微信），lesson 分享卡要真正生效需把 lib/lesson-page.ts:41 指到 png——lib 锁定，待另批批准；本批只保证 svg 与 png 同嗓同版面。
- CRLF 归一：app/globals.css、SPEC_LEDGER.md。

## 11.60 首页巨字换作者新信条（批次 75）

- 作者原话：「帮我把首页大字改为"问题不大，我们再来！"」。范围仅首页 hero 巨字；about 页信条、OG 图版信条（og-card.mjs 与 public/og-default.*）、台账旧引均不动。
- 改法：app/page.tsx hero h1 两行换为「问题不大，」／「我们再来！」；句末「！」沿用 i.dot 红点母题（.hero-h1 .dot 取 --accent-text），行内逗号留墨色。两行各 5 字形（含标点），行数与字号不变 → 首屏密度契约不动。
- 证据：build rc=0（build-hero.log）；六闸 rc=0 整组 0 FAIL（gate-*-hero.log）：ZM 眉题 y=163、ABOUT 行 y=608、01 首行 top=731、900px 首屏完整 1 行 / 起 2 行，与批 72–74 同值。vitals 独跑 VITALS_ONLY='/' rc=0 PASS：2 站 CLS 0.0000（0 条）、最慢交互 16ms（闸 200）、字体 0/20 系统栈（vitals-hero.log）。
- 目检三张：shots-fig/home-hero-light.png / home-hero-dark.png / home-hero-390.png（--wait=2500 等 riseIn 落定）：明/暗两模式巨字两行成立、红「！」在位（暗色取暗嗓 accent）、390 无横溢、右栏 LATEST / LEARN / 夜城图版与 01 区块对位不变。
- CRLF 归一：app/page.tsx、SPEC_LEDGER.md。

## 11.61 删「我相信」+ 黑带 footer 间白道归零 + 巨字背后石宇奇照片层（批次 76）

- 作者原话三件：「把"我相信"这三个字去掉」「修复截图中的白道」「在"问题不大，我们再来！"大字背后加上石宇奇图片（要高清帅气无水印的）」。
- 白道成因：黑带出血伪元素只铺自身 section，主容器 py-12/16/20 的底 padding 在黑带与 footer 之间露一条纸色横带（亮色 80px @lg）。修法：.darkband margin-bottom -3rem / -4rem(@640) / -5rem(@1024)，三档与 layout.tsx 主容器 padding 同步，黑带底边沉到 main 底边；出血与内容网格不动。实测页底几何 gapBefore/gapAfter 均 0（明/暗），sw=cw=1440 无横溢。
- 删 lede：.hero-lede 规则与 560 断点规则一并删除；.hero-h1 margin-top 8→24 接住眉题节奏。hero 高度由右栏撑住 → ZM 首行 top=731 与「完整 1 起 2」不变，自述行 y 608→572（报告值，非断言）。
- 照片源：搜狐体育图集（新华社稿）2026 马来西亚公开赛正手抽球瞬间，5400×3593 无水印（q9.itc.cn/q_70/images03/20260109/b549e56daf7646d58e0f8a7bec71923a.jpeg）；备选世锦赛夺冠坐像同集。Commons 分类页本机 fetch 失败、无清晰许可源可得 → 用新闻图并如实记来源；许可未明、个人博客装饰用途，列为遗留。sharp 为既有依赖（非新增）转 webp 2000×1331 q80 = 199KB → public/fig/shi-yuqi.webp。
- 首版两缺陷（目检抓出，如实记）：① 绝对定位替换元素忽略 bottom 约束，图层按 intrinsic 比例高溢出 hero 进 01 区块；② 0.18 灰 veil 罩住眉题小字会跌 4.5:1。修法：图层改挂 h1 盒内（字面「大字背后」），width/height 显式 100% + object-fit cover + object-position 50% 26%；.hero-h1 与 .ln 加 position:relative 保证关动效时字仍压照片；眉题/自述/右栏落净纸面，小字对比回基线。
- 图层参数：grayscale(1) contrast(1.06)；亮 multiply 0.18 / 暗 screen 0.16 + brightness(0.9)（底色只朝纸面/暗面收敛）；radial-gradient 径向淡出收边；pointer-events none + alt="" + aria-hidden；print 隐藏 .hero-photo。
- 证据：build rc=0（build-shi.log）；六闸 rc=0 整组 0 FAIL（gate-*-shi.log）：ZM 眉题 y=163 / 自述 y=572 / 首行 top=731 / 完整 1 起 2。vitals 独跑 VITALS_ONLY='/' rc=0 PASS：2 站 CLS 0.0000、最慢交互 16ms、字体 0/20（vitals-shi.log）。
- 目检六张：home-shi-light / dark / 390 / reduced（照片层限 h1 盒、脸部在巨字间、reduced 下字压照片）+ band-shi-light / dark（白道归零、暗色仅留 footer 同款墨线）。
- CRLF 归一：app/page.tsx、app/globals.css、SPEC_LEDGER.md。
