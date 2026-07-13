import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        accent: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"ZCOOL KuaiLe"', '"Noto Sans SC"', 'cursive', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'pink': '0 4px 24px -4px rgba(236, 72, 153, 0.25)',
        'pink-lg': '0 12px 48px -8px rgba(236, 72, 153, 0.3)',
        'purple': '0 4px 24px -4px rgba(139, 92, 246, 0.25)',
        'glow': '0 0 40px -8px rgba(236, 72, 153, 0.4), 0 0 80px -16px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'gradient-sakura': 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #ede9fe 50%, #e0f2fe 100%)',
        'gradient-starry': 'linear-gradient(135deg, #0f0a1a 0%, #1a0a2e 30%, #0f1729 60%, #0a0a1a 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #06b6d4 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, rgba(30,10,50,0.6) 0%, rgba(20,5,40,0.4) 100%)',
      },
    },
  },
  plugins: [typography],
}

export default config
