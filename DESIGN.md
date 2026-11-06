---
name: Baron_Zhang Blog
version: 5.3.0
codename: Paper
updated: 2026-11-06
---

# Baron_Zhang Blog — Paper Design System v5.1

> 唯一事实来源：`C:\Users\lusha\Desktop\UI_skill\design-dna\22-anthropic\DESIGN_DNA.md`（Anthropic 设计 DNA 逆向工程，14 章）。
> 本文件是该 DNA 在本站的落地规范：值取自文档原文，文档未覆盖处全部标注 `[推断]`。
> 逐条来源、冲突裁决与缺口清单见 `SPEC_LEDGER.md`；机器比对结果见 `AUDIT.md`。

## Changelog v5.3 (2026-11-03)

- 移除背景音乐播放器：FAB / 面板 / 网易云歌单取数 / `#main-content` 的 xl gutter 整块下线（下文 v5.1、v5.2 条目里提到的「音乐播放器」自此不再存在，台账 §11.18）
- 索引行封面预览改为钉在序号栏的 44/56px 缩略图，与序号交叉换位；旧版是 138×92 的跟手浮图，hover 时始终压住标题与摘要（台账 §11.18）
- 撤下标题乱码解密（`ScrambleText`）：它让正是用户在读的那行字暂时不可读
- 页脚底部留白 48→80px：右下角 68×68 是「回到顶部」浮层的固定泊位，旧留白让页脚末行（条款 / 隐私 / RSS）落在泊位里，640~1280 档 RSS 被盖 81~85%（台账 §11.18 四）
- 内容带键盘契约：重复的一份链接改 `inert`；聚焦时轨道收回原点 + `scroll-padding`，焦点离开后清 `scrollLeft`（台账 §11.17 表一 #13）
- 入场的初态全部退出 HTML：`BlurReveal`、统计滚筒、头像淡入改为一次性 CSS 关键帧，元素的静态样式就是终态。旧写法把 `opacity: 0` 和数字 `0` 烘进了 SSR —— 关掉 JS 就是 6 篇文章标题不可见、首页计量条写「文章 0 / 分类 0」而读屏在念真值
- `prefers-reduced-motion` 守卫补两条：连 `animation-delay` / `transition-delay` 一起清零；13 类一次性入场在 reduce 下直接 `animation: none`（新建动画的 pending 期会把元素按在 `from` 态，压时长压不掉它）。退场类 `.animate-fade-out` 例外，终点不等于底样（台账 §11.18 五）
- 评论区嵌入布局本地镜像：giscus 那份 `default.css` 被本站 CSP 的 `style-src` 拒载，iframe 于是退回浏览器默认的 300px —— 1440 档实测 iframe 300 / 宿主栏 790（右侧空 490px），390 档 300 / 316。四条布局规则镜像进 `globals.css` 后是 790×372 与 316×370，`border: none` 也一并补上；刻意不镜像它的 `.giscus-frame--loading { opacity: 0 }`（台账 §11.19 一）
- 评论主题同步改等 iframe 的 `load`：旧代码挂在 `client.js` 的 onload 上，那一刻 iframe 还是 `about:blank`，向 `https://giscus.app` 发的 `postMessage` 被浏览器判目标源不符整条丢弃 —— 每篇红一行控制台，且「评论区刚出现的那一秒里切主题」永远不生效（台账 §11.19 一）
- 接口控制台的连接回执搬出可收起面板，并挂常驻 `role="status"` live 区：面板展开状态由父层按 `!ready` 推导，点「保存并测试连接」的那一帧就把它自己收走了 —— 实测「正在握手」只活约 20ms、失败原因一次都没上过屏。chip 的绿色现在只代表「真验过」，存着却没测的配置是中性色 + 一行「本机存着配置，这次还没测过连接。」；实验台的失败说明同进 `sr-only` 常驻 live 区（台账 §11.19 二）
- 邮箱防收割的图标版占位补上解释：文字版占位带 `title`（「邮箱已做防收割处理，启用 JavaScript 后显示」），图标版没有 —— 关掉 JS 的人在条款页看得到解释，在关于页与基友页只看到一个不带解释的「邮件」按钮。实测 325 个 HTML 产物里明文邮箱 0 处、`mailto:` 0 处；要记全的是另一半：`EMAIL_OBFUSCATED = btoa(...)` 在客户端 chunk 里执行，明文因此存在于 5 个 JS 分块中，会执行 JS 的收割器拿得到（台账 §11.19 三）
- 七个 `dynamic(ssr:false)` 实验台（graph / trace / algo / chunk / vector / hybrid / filter）第一次被逐钮点完，也第一次补上状态播报：`aria-live` 的八处既有约定独独漏了 `components/learn/sim/`，实测 15 次操作 live 区 0→0、6 个主动作彻底静默。挂法两种 —— 结果本来就写在常驻的可见容器上，就把那个容器挂成 `role="status"`（向量相似度台的统计排、RRF 的结论句、父子文档的三个数）；结果住在按需挂载的卡片里，就补一句常驻 `sr-only`（图谱播放器 / 算法播放器 / 报文播放器 / 元数据过滤台）。切分实验台被迫多写一句：这份 218 字样例换一套分隔符，五个统计量一个都不变，只念数字的 live 区永远不响（台账 §11.20 二、三）
- 实验台的两处键盘落点：`interrupt()` 的批准 / 驳回连整个面板一起卸载，焦点现在交还给工具条（`tabIndex={-1}` 容器，同进度墙「重置」的既有做法）；「重置」改成只在有东西可重置时出现 —— 按下去什么都不做的钮比不出现的钮更糟，实测工具条 40px 不涨高、计数器距右沿 0px 不跳位（台账 §11.20 四）
- 归档写作日历的悬停浮层第一次真的出现在鼠标旁边：它用视口坐标定位、却住在 `AnimatedContent` 里，入场跑完 GSAP 留下的 `matrix(1, 0, 0, 1, 0, 0)` 照样建立 containing block —— `fixed` 于是按祖先算，实测格子 488、浮层 829，五格全越界，这功能自上线没被量过一次。现在 `createPortal` 到 body、竖向用 `bottom` 锚上沿（`animate-scale-in` 自己就是 transform，两者会互相覆盖）、`useLayoutEffect` 量一次做左右夹取与上下翻转，且宽度必须写 `max-content`：shrink-to-fit 连 `fit-content` 在内都把宽度算成「视口右沿 − left」，往左夹反而变宽，右沿永远贴着视口。复测距格 0–1px、越界 0（台账 §11.21 三）
- 日历格补上键盘与读屏：一天一篇的格子直接成为那篇文章的链接（4 个焦点站，聚焦同样召出浮层），多篇那天只留 `sr-only` 文本、不做按下去没有去处的假按钮；浮层整块 `aria-hidden`，因为它念的就是格子自己标签里那份。首页热榜不再 `return null`：标题常驻、状态词换成可见的「加载中 / 没应答 / 没有命中 / x月x日 更新」、失败给一句真话并保留不需要数据也能走的 GitHub 链接，三态共用一条常驻 `sr-only role="status"`；关 JS 的解释句走 `app/page.tsx` 的 `<noscript>`，且必须用 `dangerouslySetInnerHTML`（浏览器开着 JS 时 `<noscript>` 的内容是文本节点，挂 React 子节点就判水合不匹配）（台账 §11.21 四、五）
- hero 的 `echo ""` 补回身份串：打字机是 `useState('')` + `setInterval`，静态产物里那句「AI 探索者 & Agent 开发者」根本不存在，关 JS 读到的是一句空 echo —— §11.18 五「初态退出 HTML」在内容侧的同一种破法。改走站内已有的 `SplitReveal`（纯 CSS 交错 delay，SSR 安全），可见副本整段 `aria-hidden`（逐字 `span` 对读屏是 18 个碎片，`aria-label` 挂裸 `span` 又被忽略），读屏由一条 `sr-only` 承担；刻意不采用「先塞全文再用动画盖住」，那是必闪一次的 JS 接管再释放。同批：同周条的课名 `hidden sm:inline` 在窄屏是从可访问名里被删掉，390 档 5 个链接名实测只剩 `01…05`，补 `sr-only sm:hidden` 一份 + 完成勾配 `sr-only「已完成」`；两处 `CustomEase.create()` 忘了 `registerPlugin`，每页两声警，补齐后控制台干净（台账 §11.21 二、六、七）
- 关掉 JavaScript 后页面上那 37 具「按下去永远不会有事」的控件清零：命令面板触发钮与主题切换钮各 14 页、检索输入框、每篇文章的「喜欢」与「复制链接」、以及课程里的清单行和「标记本课完成」。纯 chrome 打 `data-js-only`，由 `app/layout.tsx` 里一条 `<noscript><style>` 整块摘除（`style-src` 本来就允许 `'unsafe-inline'`）；课程清单行**不能藏**——那一页的清单文字实测 1076 字是课程正文本身，改成挂载前渲染普通行、水合后才升级成 `button[role=checkbox]`（台账 §11.22 三）
- 主题切换的占位不再装成按钮：未挂载时它是一枚进 Tab 序列、`aria-label="切换主题"` 却永远按不动的真 `<button>`，现在是同尺寸 44×44 的非交互 `span aria-hidden`。这是「按下去什么都不做的钮比不出现的钮更糟」（§11.20 四）在时间轴上的另一面 —— 还没活起来的钮也别装成钮（台账 §11.22 四）
- `/search/` 摘掉输入框的同时补一句为什么（「检索要在浏览器里跑，关掉 JavaScript 就没有结果」+ 20 条静态栏目出路），否则用户看到的是「搜索页没有搜索框」，比死控件更像站点坏了。`batchn.mjs` 因此立成双面闸：无 JS 那半证明摘干净，有 JS 那半 12 项逐一证明水合后每只都活得回来（换档写回 `localStorage`、喜欢刷新后记住、清单勾一下计数从 `0 / 5` 走到 `1 / 5`、检索出 60 条、控制台零 error）—— 只查无 JS 的单向闸会一路绿灯放过「把交互改死」这种 bug（台账 §11.22 五、六）

- 站长邮箱的明文离开了客户端分块：`EMAIL_OBFUSCATED = btoa(明文常量)` 的写法里，那串明文跟着 `SITE` / `SOCIAL_LINKS` 一起被打包，实测在 5 个公开可读的 JS 分块里各留 2 处、共 10 处 —— 「防收割」保护到的只有 HTML，肯执行 JS 的收割器直接读常量就拿走。现在源里只存 `EMAIL_B64` 一串密文，用时走 `atob`：那是运行时调用，压缩器不会把字面量折叠回明文（`btoa(明文)` 之所以留得下来，正是因为它是个会被折叠的纯字面量表达式）。产物复测 JS 明文 10 → 0，全站只剩刻意公开的 `.well-known/security.txt` 一份明文（RFC 9116 要求它给出可用联系渠道）。诚实边界写进注释：这一手挡掉的是正则型抓取，不是肯花五分钟还原的人；真要收窄只有换渠道或上服务端渲染，而本站是纯静态（台账 §11.23 一、二）
- 这一轮真正的问题在闸上，而且有两处：`scripts/audit-build.mjs` 的邮箱扫描只遍历 `.html` 与 `.xml`，那 10 处明文正是躺在它不看的一堆 `.js` 里一路过闸；它取比对值的方式又是去源里正则抓 `email: '明文'`，于是明文一旦被修走，匹配失败就 `return` —— **这道闸会被自己刚刚守成功的结果关掉**，此后任何泄漏都读作「通过」。现在它从 `EMAIL_B64` 解码取值、扫全部 732 个文本产物（含 Next.js RSC 的 `.txt` 载荷，同样从没被扫过）、把 security.txt 列为带理由的白名单，取不到值或解出来不像邮箱一律判失败。三向验证：干净产物 exit 0；往 `.html` 和 `.js` 各注入一处明文，exit 1 且逐一点名文件名；把常量改名让闸取不到值，它自己报「这道闸已失效」而不是沉默（台账 §11.23 三、四）

- 归档写作日历的单日格在触屏上按不中，这是站内第一次量 WCAG 2.5.8（指针目标 ≥24×24）：15 类页面 × 两档视口共 30 次测量、合计 1553 个目标，唯一硬不合格的是 `/archive/` 那 4 个 13×13 的格子，与邻格重叠 6–482px² 所以间距例外也不成立 —— 它们正是 §11.21 五 把「一天一篇」的格子改成文章链接留下的尾巴（那一批修了「假按钮」，没修「按不中」）。格子尺寸是这张密度图的语言，不能全局放大，于是把尺寸与间距下沉成 `--cal-day` / `--cal-gap`，窄屏（`max-width: 896px` 既有设计断点）覆盖成 24px / 4px，组件里的 `DAY_SIZE` 常量删除。两个理由留下：用断点而不是 `(pointer: coarse)`，因为站里所有窄屏几何闸都按视口宽度条件化，跟着指针类型走就等于在没人复查的地方改动；尺寸放 CSS 而不是 `matchMedia`，因为静态导出的首屏与 SSR 必须同值，否则就是水合后改尺寸的那一下跳动（台账 §11.24 一、二）
- 新闸第一跑把 16 次 `ERR_CONNECTION_REFUSED` 结算成「真不合格 0 处」—— 静态服务器在 `next build` 清空 `out/` 的那一刻退出，而不测量的闸不是中性的，它主动撒谎，比旧版邮箱闸更难察觉因为它绿得理直气壮。补三条：载入失败计入并 `exit 1`、某页量到 0 个目标同样算失败、跑完整表再一次性报（不做 fail-fast，否则第 2 页掉线就看不到第 16 页）。判据推广成一句：**凡按页面循环的闸，收尾必须回答「我真的量了 N 页吗」**（台账 §11.24 三、四）

## Changelog v5.2 (2026-10-05)

- 新增内容带 `.marquee`（文档 §11.3 列出 `marquee` 关键帧、§11.2 有 hover 暂停实测规则）：首页主题标签改为单行无缝滚动，悬停与键盘聚焦暂停，减少动态效果时静止换行
- 刊头与文章头改为分级入场（复用 `.stagger`）：计量条 → 标题块／元信息 → 标题 → 摘要 → 系列 → 标签
- 代码块复制按钮升级为状态机：复制 → 已复制（图标切换 + 强调色 + 300ms 缩放进入），并对读屏同步更新 label
- `DESIGN.md` 结构对齐业界常见的 9 章式设计文档：补第 8 章「Responsive Behavior」与第 9 章「Agent Prompt Guide」

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

## 8. Responsive Behavior

- **断点**：`896px` 为设计断点（§6.1）；`640 / 768 / 1024 / 1280` 沿用 Tailwind 既有断点（1280 起文章 / 课时页的侧栏目录展开）
- **收拢策略**：896px 以下导航收进抽屉（300ms 滑入）；索引台账由网格降为单列；文章页侧栏目录折叠为可展开块
- **触控目标**：控件高 40px；行内控件用 `padding` 扩到 24px 下限；不因动效收紧命中区
- **内容带**：窄屏同样单行平移（周期固定）；系统开启减少动态效果时改为换行读完
- **阅读面**：正文窄栏（`--measure` 38em）在窄屏自然收缩为满宽
- **图片**：封面 `object-fit: cover`，容器固定高度（首屏 190 / 280px、网格卡 112 / 128px）

## 9. Agent Prompt Guide

给后续 AI 代理的最短提示（复制即可生成同风格界面）：

- 画布 `#faf9f5`、正文 `#141413`、标题 `#000000`、唯一强调色 `#cc785c`、发丝线 `#ededea` / `#e4e3df`
- 衬线标题（Newsreader + Noto Serif SC）／无衬线正文（Inter + Noto Sans SC）／等宽元信息（JetBrains Mono）
- 圆角只有 `3 / 24 / 50%` 三档；**0 阴影**；层级一律用 1px 发丝线与留白表达
- 动效只动 `transform / opacity / color`；时长 `200/300/400/500ms`（循环类 `800/1200ms`）；缓动 `ease` 或 `cubic-bezier(.16, 1, .3, 1)`
- 可点元素必须三态齐全（hover / focus-visible / active），并优先复用基元：`.pressable`、`.link-underline`、`.indicator-bar`、`.stagger`、`.marquee`、`.media-frame`、`.field-rule`
- 禁项：渐变、毛玻璃、发光、投影、第二强调色、emoji（`npm run check:emoji` 守卫）

## 10. 出处与校验

| 内容 | 文件 |
|---|---|
| 规格台账（来源 + 置信度 + 缺口 + 冲突裁决） | `SPEC_LEDGER.md` |
| 审计基线（机器可读 token） | `SPEC_LEDGER.tokens.json` |
| 机器比对报告（自创值 / 未落地 token / 间距 / 状态） | `AUDIT.md` |
| 本轮改动台账（文档依据 → 缺口 → 落地） | `DESIGN-DNA-UPGRADE.md` |
| 交付与运行说明 | `README.md` |
