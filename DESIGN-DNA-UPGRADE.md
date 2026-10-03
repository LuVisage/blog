# Design DNA 升级追溯（2026-10）

依据本地设计知识库 `C:\Users\lusha\Desktop\UI_skill\design-dna`（91 个参考站点的逆向工程 + 跨站统计）对博客设计做的增量升级。遵循 design-dna-builder 铁律：**文档数值为法律，代码是判决；缺口显式标注，不脑补。**

## 参考来源

| 文档 | 用途 |
| --- | --- |
| `CROSS_SITE_PATTERNS.md` | 91 站聚合统计：间距/排版/色彩/形状/动效/断点的共同做法 |
| `11-linear/DESIGN_DNA.md` | 主参照（暗色玻璃拟态同路）：token 总表、圆角阶梯、阴影纪律、动效时长 |
| `65-stripe-press/theme.css`、`19-superhuman/theme.css`、`42-stripe-docs/theme.css` | 交叉验证动效与 token 结构 |

## 台账 → 改动映射

| # | 文档依据 | 发现的缺口 | 落地改动（均在 `app/globals.css`） |
| --- | --- | --- | --- |
| 1 | Linear §2.1/§11.1：`--duration-base: 175ms`、`--duration-slow: 400ms`、fast 档 80–120ms；跨站 §5：150–300ms 为主流 | 动效时长未 token 化：11 处交互过渡散落 160/180/200/220/240/260ms 字面值 | 新增 `--duration-fast/base/slow`（120/175/400ms）；11 处过渡收敛到 `var(--duration-base)`：`.surface-hover`、`.chip`、`.glass-liquid`、`.btn-primary/secondary/ghost`、`.skip-to-content`、`.prose a`、`.prose tbody tr`、`.hover-lift` |
| 2 | Linear §2.1 圆角阶梯 2/4/5/6/8/10/12px | 圆角无 token 层，25 处字面值（含一处 3px 落在档外） | 新增 `--radius-xs..3xl` 七档；`3px`（skeleton-line）并入 `var(--radius-sm)`；其余字面值已全部落在档内，不批量改写（见决策 3） |
| 3 | Linear §3.4：阴影色复用画布色（`0 4px 32px #08090a99`），阴影与背景同调不发灰 | 卡片 hover 用重黑投影 `0 12px 28px -18px rgba(0,0,0,0.9)`，与画布不同调 | 新增 `--shadow-card`：暗色 `0 4px 32px rgba(11,11,17,0.6)`（画布调色）、纸面模式 `0 4px 32px rgba(21,20,28,0.10)`（墨色调、强度压低）；`.hover-lift:hover` 接入 |
| 4 | 跨站 §10.6：`prefers-reduced-motion` 是 98% 参考站点漏掉的加分项 | — | **已有**（globals.css §12 全局守卫，此前建站时已落），本轮确认无缺口 |
| 5 | Linear §12.1.3：等宽字体承担标签与元信息是「工程感」核心 | — | **已有**（`.eyebrow`/`.meta` 均为 `--font-mono`），本轮确认无缺口 |
| 6 | 跨站 §10.2：正文 16px、层级跨度 2.5–3.5×；§10.3：强调色 1–3 个且低面积占比 | — | **已有**（正文 16px/1.7、标题负字距 -0.012~-0.028em、单一 violet 强调族），确认无缺口 |

## 决策与假设清单（未脑补的部分）

1. **160–260ms → 175ms 的归一**是值变更（差 ≤85ms，感知极小）：依据 Linear 的时长纪律「0–175ms 承担全部交互反馈」，换来自治的 token 体系。入场/主题切换类（300/320/420ms、pagefind 面板滑入 380ms）**保留原值**——它们属「较大位移或入场」，在跨站 300–500ms 主流区间内，且主题圆形揭示是站点签名动效。
2. **圆角字面值不批量替换**：全部已落在文档阶梯内，替换是零视觉收益的纯回归风险；token 层供新组件使用，后续渐进收敛。
3. **音乐播放器内部节奏**（914/920/1056 行 160–380ms）不收敛：独立子系统，且已自带 JS 层 `prefers-reduced-motion` 处理，隔离改动风险。
4. **`::selection` 保持全 accent 底**（`background: var(--accent)`）而非 Linear 的 40% 透明：站点既有签名样式，非缺口。
5. **`--shadow-card` 纸面值 0.10 强度**为 `[推断]`：文档只给了暗色模式图案，纸面白底上按弥散阴影惯例压低强度并改墨色调。

## 验证

- `npm run check` 全绿（typecheck / lint / emoji / 双代理测试 / env 审计）
- `npm run build` 326 页静态导出 + pagefind + 产物审计通过
