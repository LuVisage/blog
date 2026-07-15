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
        // Legacy color scales — kept for backward compatibility, prefer surface/border tokens
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
        // Neutral glass surface tokens — use these for cards, headers, footers
        surface: {
          light: 'rgba(255,255,255,0.12)',
          'light-hover': 'rgba(255,255,255,0.20)',
          dark: 'rgba(0,0,0,0.18)',
          'dark-hover': 'rgba(0,0,0,0.28)',
        },
        // Neutral border tokens
        border: {
          light: 'rgba(255,255,255,0.20)',
          'light-hover': 'rgba(255,255,255,0.30)',
          dark: 'rgba(255,255,255,0.08)',
          'dark-hover': 'rgba(255,255,255,0.14)',
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
        // Neutral glass shadows — subtle depth without color
        'glass': '0 8px 32px rgba(0,0,0,0.06)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.10)',
        'glass-dark': '0 8px 32px rgba(0,0,0,0.25)',
        'glow': '0 0 40px rgba(255,255,255,0.06), 0 0 80px rgba(255,255,255,0.03)',
        // Legacy shadows — kept for backward compatibility
        'pink': '0 4px 24px -4px rgba(0,0,0,0.08)',
        'pink-lg': '0 12px 48px -8px rgba(0,0,0,0.12)',
        'purple': '0 4px 24px -4px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-sakura': 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 100%)',
        'gradient-starry': 'linear-gradient(135deg, #0a0a0f 0%, #0f0f18 30%, #0a0a14 60%, #08080f 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #999999 0%, #aaaaaa 50%, #bbbbbb 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-card-dark': 'linear-gradient(135deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 100%)',
      },
    },
  },
  plugins: [typography],
}

export default config
