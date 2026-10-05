# 规格台账 — Baron_Zhang Blog（Anthropic 暖调纸感重构）

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
