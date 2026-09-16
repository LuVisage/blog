import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

/**
 * ESLint cannot see inside comments or .mdx body text, so the emoji ban is only
 * half-enforced here; `node scripts/check-emoji.mjs` covers the other half.
 */
const EMOJI_CLASS = '\\u{1F000}-\\u{1FAFF}\\u{1F1E6}-\\u{1F1FF}\\u{2600}-\\u{27BF}\\u{2B00}-\\u{2BFF}\\u{FE00}-\\u{FE0F}\\u{200D}\\u{2139}\\u{21A9}-\\u{21AA}\\u{3030}\\u{3297}-\\u{3299}'

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      'out/**',
      '.next/**',
      'node_modules/**',
      '.qoder-scratch/**',
      '.qoder-shots/**',
      '.playwright-mcp/**',
      '.codebuddy/**',
      '.next.bak.*/**',
      'out.bak.*/**',
      'public/sw.js',
      'next-env.d.ts',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/[${EMOJI_CLASS}]/u]`,
          message: '代码里不允许出现 emoji，请改用 tabler 图标或纯文字。',
        },
        {
          selector: `TemplateElement[value.raw=/[${EMOJI_CLASS}]/u]`,
          message: '代码里不允许出现 emoji，请改用 tabler 图标或纯文字。',
        },
        {
          selector: `JSXText[value=/[${EMOJI_CLASS}]/u]`,
          message: '界面文案里不允许出现 emoji，请改用 tabler 图标或纯文字。',
        },
      ],
    },
  },
  {
    rules: {
      // 静态导出托管在 GitHub Pages，next/image 拿不到优化服务，unoptimized 的 Image 并不比 img 强。
      '@next/next/no-img-element': 'off',
      // 这条规则只针对 pages/_document；本站用的是 App Router。
      '@next/next/no-page-custom-font': 'off',
      // `const { content: _content, ...meta } = lesson` 是有意的摘字段落写法。
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
]

export default config
