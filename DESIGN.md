---
name: Baron_Zhang Blog
version: 4.1.0
codename: Alchemy
updated: 2026-08-02
---

# Baron_Zhang Blog — Alchemy Design System v4.1

## Changelog v4.1 (2026-08-02)

### Visual Polish & Micro-interactions
- **Hero Section**: Gradient accent text, glow-pulse avatar border, refined spacing, hover-lift CTAs, animated content staggering
- **Post Cards**: Gradient pipeline spine, better category pill styling, icon-based meta display, improved hover states, hover-lift on cards
- **Article Page**: Bottom-bordered h2 headings, styled blockquotes with bg, better table styling with hover, improved line-height for readability
- **Navigation**: Active link underline indicator, scroll-aware header shadow, refined mobile menu with scale-in animation
- **Footer**: Refined social icon hover states with primary-soft bg, better spacing, improved divider styling
- **Stats Tiles**: Increased min-height, font-mono values, uppercase labels, better icon spacing
- **AI Hot News**: Refined ranking badges (rounded-lg), star icon from tabler, better typography, header pill styling
- **TOC**: tabler ListIcon instead of raw SVG, better indent for h3 items, primary-colored active border
- **Search**: Clear button on input, better empty/results states, result count display, refined kbd styling
- **Social Share**: Share icon prefix, hover bg transitions, consistent copy feedback
- **Pagination**: Chevron icons, glass-style page buttons, disabled states for first/last
- **Back to Top**: Rounder button, glass-card surface, larger icon, shadow
- **Like Button**: Scale animation on toggle, explicit "喜欢" label, count styling
- **Tags/Categories/Series**: Consistent icon+count header pattern, improved card layouts

### Design System Refinements
- **Dark Mode Primary**: Changed from `#7C5CE7` to `#8B6FEF` for better contrast on dark backgrounds
- **Glass**: Added saturate(1.15) for richer color retention, refined hover background values
- **Typography**: Adjusted line-height for better readability (1.6 body, 1.75 prose p, 1.7 prose li)
- **Animations**: Added float, glowPulse, shimmer keyframes; refined reduced-motion handling
- **Buttons**: btn-primary gradient overlay, refined hover/active states with translateY transforms
- **Prose**: Styled blockquotes with bg, tables with rounded corners and hover, better link underlines

### Emoji Removal
- Removed all emojis from UI components per DESIGN.md rules
- 头像占位图改用 tabler IconUser
- 火焰图标改用 tabler IconFlame
- 星标图标改用 tabler IconStarFilled
- Replaced emoji focus areas in about page with tabler icons (IconRobot, IconBrain, IconTools, IconPencil)

## 1. Philosophy

**"The space between code and consciousness."**

Alchemy is a design language born for this blog alone. It bridges the precision of code with the warmth of human thought — like a beautifully typeset research manuscript rendered on frosted glass.

**Three pillars**:
1. **Glass as space** — Surfaces float on a fixed photographic background
2. **Violet as intelligence** — A warm-leaning indigo bridges technology (blue) and creativity (red)
3. **Typography as voice** — Modest, editorial type lets content speak

## 2. Color Palette

### Primary Accent — "Alchemy Violet"
| Token | Light | Dark | Role |
|---|---|---|---|
| `primary` | `#7C5CE7` | `#8B6FEF` | CTAs, links, active states |
| `primary-hover` | `#6A4BD5` | `#9B83F3` | Press/hover state |
| `primary-soft` | `rgba(124,92,231,0.08)` | `rgba(139,111,239,0.12)` | Subtle backgrounds |
| `primary-glow` | `rgba(124,92,231,0.18)` | `rgba(139,111,239,0.15)` | Glow effects |

### Warm Accent — "Alchemy Gold"
`#F59E0B` — Stars, flame icon, special highlights only.

### Text Scale
| Token | Light | Dark |
|---|---|---|
| `ink` | `#1a1a2e` | `#f0f0f5` |
| `body` | `#3d3d5c` | `#c8c8d4` |
| `muted` | `#6b6b80` | `#9090a0` |
| `muted-soft` | `#9191a0` | `#686880` |

## 3. Typography

- **Headings**: Inter 650-700, -0.025em to -0.01em letter-spacing
- **Body**: Noto Sans SC, 16px, line-height 1.6
- **Code**: JetBrains Mono, 13px, 1.6 line-height
- **Logo**: ZCOOL KuaiLe, cursive

## 4. Glass Morphism

Two tiers:
- **glass-card**: blur(40px) saturate(1.2), heavier background, card shadows
- **glass**: blur(24px) saturate(1.15), lighter background, pill/button surfaces

## 5. Animation System

- **AnimatedContent**: GSAP ScrollTrigger reveal (slide + fade)
- **StatsTile**: Count-up animation with IntersectionObserver
- **Theme toggle**: Circular reveal overlay via View Transitions API
- **Shared keyframes**: scaleIn, fadeUp, float, glowPulse, shimmer
- **Reduced motion**: Respects prefers-reduced-motion

## 6. Do's and Don'ts

### Do
- Use CSS custom properties for all colors
- Use tabler SVG icons, never emojis — enforced by `npm run check:emoji`
- Use solid surfaces with 1px hairlines for all cards and containers
- Maintain perfect dark mode parity
- Round everything (8–32px)

### Don't
- No emojis anywhere — the ban covers code, comments and prose, not just the UI
- No hardcoded colors — always use CSS variables. Two exceptions, both measured
  against artwork rather than against the theme, so they must stay literal:
  `music-player` 的唱片纹路与高光（叠在封面图上），`ui/particles` 的尘埃（刻意淡到两种主题下都几乎不可见）。
- No blur / backdrop-filter — this skin is flat by rule, including overlays
- No more than 3 shadow layers
- No competing accent colors
