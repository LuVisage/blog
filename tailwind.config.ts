import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

/**
 * Tailwind 只承担字体族、圆角与「动效工具类落到站内档位」这三件事，其余视觉语言全部
 * 住在 app/globals.css 的 DNA token 层（口径见 SPEC_LEDGER §1）。
 *
 * 第 17 轮（§11.33/§11.34）回炉：serif 工具类不再别名到黑体展示栈。它的用处全是
 * 标题与站名（font-serif + font-bold），因此指向 --font-title（拉丁 Georgia + 汉字黑体），
 * 与正文的 --font-serif（拉丁 Georgia + 汉字宋体）分工：标题黑体、正文宋体。
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
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Helvetica Neue"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        serif: ['var(--font-title)'],
        mono: ['ui-monospace', '"SFMono-Regular"', '"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '8px',
        DEFAULT: '12px',
        md: '16px',
        lg: '18px',
        xl: '22px',
        '2xl': '28px',
        '3xl': '32px',
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
