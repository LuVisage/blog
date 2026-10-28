import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

/**
 * Tailwind 只承担字体族与圆角两件事，其余视觉语言全部住在
 * app/globals.css 的 DNA token 层（口径见 SPEC_LEDGER §1）。
 *
 * 第 5 轮换血（灰阶系统语言）：标题/展示走 Space Grotesk 700（--font-serif 别名
 * 指向同一展示栈，组件里的 font-serif 字样随之落为 Space Grotesk + Noto Sans SC）；
 * borderRadius 整组收敛到 3px 微圆角档（方向参考 are.na radius-sm 3px）。
 * 存量组件里的 rounded-lg / xl / 2xl 因此随 token 一起落到 3px，不必逐个改写。
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
    },
  },
  plugins: [typography],
}

export default config
