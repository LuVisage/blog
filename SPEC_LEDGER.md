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
| 悬停 / 键盘聚焦暂停 | `.marquee:hover`、`.marquee:focus-within` → `animation-play-state: paused` | 同上（原文实测规则） |
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
| 3 | 回顶走 Lenis | — | `back-to-top.tsx`：`__lenis.scrollTo(0, 1.2s)`，无 Lenis 回退原生 smooth | 全站 |
| 4 | TOC 点击走 Lenis | — | `toc.tsx`：`__lenis.scrollTo(el, { offset: -96, duration: 1.0 })`（避让 sticky 头），reduced-motion 直跳 | 文章目录（桌面+移动） |

**自检**：翻板数字零新色；视差系数 5% 克制（配合 4px 卡片浮起与 1.05 封面缩放三层叠加不打架）；reduced-motion 下数字直显、视差过渡被全局守卫瞬平；Lenis scrollTo 均带 duration 且回退路径保留。
