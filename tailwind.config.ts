import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

/**
 * Tailwind 只承担字体族、圆角与「动效工具类落到站内档位」这三件事，其余视觉语言全部
 * 住在 app/globals.css 的 DNA token 层（口径见 SPEC_LEDGER §1）。
 *
 * 第 5 轮换血（灰阶系统语言）：标题/展示走 Space Grotesk 700（--font-serif 别名
 * 指向同一展示栈，组件里的 font-serif 字样随之落为 Space Grotesk + Noto Sans SC）；
 * borderRadius 整组收敛到 3px 微圆角档（方向参考 are.na radius-sm 3px）。
 * 存量组件里的 rounded-lg / xl / 2xl 因此随 token 一起落到 3px，不必逐个改写。
 *
 * 第 14 轮（§11.26）：`transition-colors` 一类工具类在组件里有 76 处，而 config 从没
 * 管过动效 —— Tailwind 默认给的是 150ms + cubic-bezier(0.4,0,0.2,1)，两个都不在站内
 * 档位（200/300/400/500/800/1200ms、--ease/--ease-out）里，`transition` 简写的属性表
 * 还包含 box-shadow / filter / backdrop-filter。在这里一次性对齐比逐处补 duration-*
 * 更可靠：默认值改的是「语言」，补 class 改的是「句子」，句子还会再写错。
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Noto Sans SC"', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['"Space Grotesk"', '"Noto Sans SC"', '-apple-system', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '3px',
        DEFAULT: '3px',
        md: '3px',
        lg: '3px',
        xl: '3px',
        '2xl': '3px',
        '3xl': '3px',
      },
      // 与 globals.css 的 --duration-fast/base/slow 同一套档位；不带 duration-* 的
      // transition-* 工具类因此落进 200ms 而不是 Tailwind 的 150ms。
      transitionDuration: {
        DEFAULT: '200ms',
        '400': '400ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'ease',
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      // 简写 `transition` 的属性表里去掉 box-shadow / filter / backdrop-filter：
      // 投影与滤镜是逐帧重绘，站内只让 transform / opacity / color 系插值。
      transitionProperty: {
        DEFAULT:
          'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, transform',
      },
    },
  },
  plugins: [typography],
}

export default config
