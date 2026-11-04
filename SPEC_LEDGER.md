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
