---
name: Baron_Zhang Blog
version: 4.0.0
codename: Alchemy
created: 2026-07-20
---

# Baron_Zhang Blog — Alchemy Design System

## 1. Philosophy

**"The space between code and consciousness."**

Alchemy is a design language born for this blog alone. It bridges the precision of code with the warmth of human thought — like a beautifully typeset research manuscript rendered on frosted glass. The name comes from the blog's core purpose: transforming complex AI concepts into accessible, beautiful prose.

**Three pillars**:
1. **Glass as space** — Surfaces float on a fixed photographic background, creating depth without heaviness
2. **Violet as intelligence** — A warm-leaning indigo bridges technology (blue) and creativity (red)
3. **Typography as voice** — Modest, editorial type lets the content speak; code snippets use monospace as punctuation

**Mood**: Thoughtful, warm, modern. A developer's study with frosted glass windows overlooking a city at dusk.

## 2. Color Palette

### Primary Accent — "Alchemy Violet"
A warm-leaning violet-indigo unique to this blog. It sits between tech-blue and creative-magenta, representing the fusion of engineering precision with human insight.

| Token | Light/Dark | Hex | Role |
|---|---|---|---|
| `primary` | both | `#7C5CE7` | CTAs, links, active states, brand mark |
| `primary-hover` | both | `#6A4BD5` | Press/hover state |
| `primary-soft` | light | `rgba(124,92,231,0.08)` | Subtle accent backgrounds |
| `primary-soft` | dark | `rgba(124,92,231,0.12)` | Subtle accent backgrounds |

### Warm Accent — "Alchemy Gold"
Used sparingly — only for star ratings, special highlights, and the "AI Hot News" flame icon.

| Token | Hex | Role |
|---|---|---|
| `accent-gold` | `#F59E0B` | Stars, special highlights |

### Text
| Token | Light | Dark | Role |
|---|---|---|---|
| `ink` | `#1a1a2e` | `#f0f0f5` | Headlines, body text, primary content |
| `body` | `#3d3d5c` | `#c8c8d4` | Secondary running text |
| `muted` | `#6b6b80` | `#9090a0` | Subtitles, inactive tabs, footer |
| `muted-soft` | `#9191a0` | `#686880` | Disabled text, micro-labels |

### Canvas & Glass Surfaces
| Token | Light | Dark | Role |
|---|---|---|---|
| `bg-overlay` | `rgba(255,255,255,0.35)` | `rgba(0,0,0,0.42)` | Page-level overlay on bg image |
| `glass-card-bg` | `rgba(255,255,255,0.55)` | `rgba(18,18,30,0.42)` | Card background |
| `glass-bg` | `rgba(255,255,255,0.42)` | `rgba(18,18,30,0.30)` | Lighter glass (header, footer) |
| `glass-card-hover` | `rgba(255,255,255,0.68)` | `rgba(28,28,42,0.55)` | Card hover state |

### Borders & Hairlines
| Token | Light | Dark | Role |
|---|---|---|---|
| `hairline` | `#e0e0eb` | `#2e2e3d` | Card borders, dividers |
| `hairline-soft` | `#ededf5` | `#252535` | Subtle separators |
| `border-strong` | `#c5c5d5` | `#3d3d52` | Input outlines, focus rings |

### Semantic
| Token | Hex | Role |
|---|---|---|
| `success` | `#10b981` | Success states |
| `danger` | `#ef4444` | Error, destructive actions |

### Shadows — "Alchemy Depth"
Proprietary three-layer shadow system. Not borrowed from any design library.

```
Light:
  0 0 0 1px rgba(124, 92, 231, 0.04),
  0 1px 2px rgba(0, 0, 0, 0.03),
  0 4px 12px rgba(0, 0, 0, 0.06)

Dark:
  0 0 0 1px rgba(124, 92, 231, 0.06),
  0 1px 2px rgba(0, 0, 0, 0.15),
  0 4px 12px rgba(0, 0, 0, 0.25)
```

The first layer uses primary-color tint — a subtle violet rim that ties the shadow to the brand.

## 3. Typography

### Font Stack
- **Headings**: `'Inter', -apple-system, system-ui, sans-serif`
- **Body**: `'Noto Sans SC', 'Inter', -apple-system, system-ui, sans-serif`
- **Code**: `'JetBrains Mono', 'Fira Code', monospace`
- **Logo/Display**: `'ZCOOL KuaiLe', cursive` — the blog's personality mark

### Type Scale
| Role | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|
| Hero title | clamp(36px, 6vw, 56px) | 700 | 1.15 | -0.02em |
| Page title | 30–40px | 700 | 1.2 | -0.015em |
| Section heading | 22px | 600 | 1.25 | -0.009em |
| Card title | 16px | 600 | 1.25 | 0 |
| Body | 16px | 400 | 1.5 | 0 |
| Body small / meta | 14px | 400 | 1.43 | 0 |
| Caption / footer | 12px | 400 | 1.3 | 0 |
| Button | 16px | 500 | 1.25 | 0 |
| Inline code | 0.875em | 400 | inherit | 0 |

### Gradient Text
```
Light: linear-gradient(135deg, #1a1a2e 0%, #3d3d5c 50%, #1a1a2e 100%)
Dark:  linear-gradient(135deg, #ffffff 0%, #b0b0c8 50%, #e0e0f0 100%)
```

## 4. Spacing (4px base grid)
`4 8 12 16 20 24 32 40 48 56 64 80`

- Card padding: 24px
- Section gap: 64px (desktop) / 48px (mobile)
- Grid gap: 16px
- Content max-width: 1120px
- Page padding: 16px sides (mobile), 24px (desktop)

## 5. Border Radius
| Token | Value | Use |
|---|---|---|
| `sm` | 8px | Buttons, inputs, tags |
| `md` | 12px | Small cards, pills |
| `lg` | 16px | Post cards, glass cards |
| `xl` | 24px | Article cards, hero sections |
| `2xl` | 32px | Large feature cards |
| `full` | 9999px | Pills, badges |

## 6. Glass Morphism System

Two tiers of glass surfaces:

### Glass Card (`.glass-card`) — Heavy presence
```
backdrop-filter: blur(40px)
background: rgba(255,255,255,0.55) / rgba(18,18,30,0.42)
border: 1px solid hairline
box-shadow: alchemy-depth
Hover: background increases to 0.68/0.55, translateY(-2px)
```

Used for: post cards, article content area, AI Hot News, share cards, Giscus comments, CTA buttons, feature cards.

### Glass (`.glass`) — Light presence
```
backdrop-filter: blur(24px)
background: rgba(255,255,255,0.42) / rgba(18,18,30,0.30)
border: 1px solid hairline
box-shadow: 0 0 0 1px rgba(124,92,231,0.03), 0 1px 4px rgba(0,0,0,0.04)
```

Used for: header navbar, footer, theme toggle, search trigger, tag pills, category pills, publish button.

### Glass Code (`.glass-code`) — For code blocks
```
backdrop-filter: blur(16px)
background: rgba(248,250,252,0.75) / rgba(15,15,20,0.55)
border: 1px solid hairline
border-radius: 16px
```

## 7. Components

### Buttons
- **Primary** (`.btn-primary`): Solid violet bg, white text, 8px radius, 16px/500 font. Hover: darker violet.
- **Secondary** (`.btn-secondary`): Transparent bg, ink text, hairline border, 8px radius.
- **Ghost** (`.btn-ghost`): Transparent, muted text. Hover: soft bg + ink text.
- **Glass CTA** (`.glass-card .rounded-xl`): Glass-card surface, used for prominent secondary actions.

### Cards (Post Cards)
- Glass-card surface with 40px blur
- 16px border-radius
- Alchemy depth shadow
- Hover: lift to higher opacity, subtle translateY(-2px), border strengthens

### Header
- Sticky top-3, 14px height
- Glass surface, 16px border-radius
- Logo: ZCOOL KuaiLe + IconSparkles (primary color)
- Nav links: 14px/500, ink (active, with white bg overlay) / muted (idle)
- Mobile: full glass dropdown

### Section Title
All section titles use the `.section-title` class:
```
font: Inter 600, 22px, ink color
prefix: 3px × 18px rounded bar in primary color
```

### Post Content (Article)
- Article body in glass-card container, 24px border-radius
- Prose headings: Inter 600
- Code blocks: glass-code surface, JetBrains Mono 13px
- Inline code: rounded bg pill, JetBrains Mono 0.875em

## 8. Iconography

All icons use `@tabler/icons-react` v3. No emojis.

| Context | Icon | Color |
|---|---|---|
| Logo/Brand | `IconSparkles` | primary |
| Post reading | `IconBook` | primary |
| GitHub | `IconBrandGithub` | ink |
| Publish | `IconPencil` | primary |
| Search | `IconSearch` | muted |
| Theme light | `IconSun` | gold accent |
| Theme dark | `IconMoon` | muted |
| Calendar/Date | `IconCalendar` | muted |
| Clock/Reading | `IconClock` | muted |
| Category folder | `IconFolderFilled` | primary |
| Tags | `IconTag` | violet (primary-soft bg) |
| Flame/Hot | `IconFlameFilled` | gold accent |
| Back to top | `IconArrowUp` | muted |
| Heart/Love | `IconHeartFilled` | danger |
| Mail | `IconMail` | muted |
| Home | `IconHome` | muted |
| AI/Sparkles | `IconSparkles` | primary |
| Article/Write | `IconArticle` | muted |
| Chevron arrows | `IconChevronLeft/Right` | muted |
| External link | `IconExternalLink` | muted |

## 9. Dark Mode

Dark mode is a first-class citizen, not an afterthought:
- Background overlay darkens to `rgba(0,0,0,0.42)`
- Glass surfaces shift to `rgba(18,18,30,0.30–0.42)`
- Text inverts to `#f0f0f5` ink
- Primary color stays the same (violet reads well on dark)
- Shadows deepen for contrast
- Code blocks shift to near-black `#0f0f14`

## 10. Responsive Strategy

| Breakpoint | Layout |
|---|---|
| <640px | Single column, full-width cards, 16px page padding |
| ≥640px | 2-col card grid where applicable |
| ≥768px | Desktop nav visible, larger headings |
| ≥1024px | 3-col grid capabilities, TOC sidebar on posts |
| ≥1280px | Max-width container expands slightly |

## 11. Do's and Don'ts

### Do
- Use `#7C5CE7` (Alchemy Violet) as the ONLY primary accent color
- Use `#F59E0B` (Alchemy Gold) ONLY for stars and the flame icon
- Let the background image carry visual weight
- Use glass surfaces for all cards and containers
- Keep typography modest — max 56px
- Round everything (8–32px)
- Use tabler SVG icons, never emojis
- Maintain perfect dark mode parity
- Use CSS custom properties for all colors

### Don't
- No emojis anywhere in the UI (content only)
- No yellow/gold except for stars/flame
- No pure black (#000) or pure white (#fff) text
- No hard corners except in code blocks
- No competing accent colors
- No hardcoded colors — always use CSS variables
- No inline style objects for colors — use class-based styles
- No more than 3 shadow layers

## 12. CSS Variable Reference

All design tokens are available as CSS custom properties:

```
--color-primary          #7C5CE7
--color-primary-hover    #6A4BD5
--color-ink              #1a1a2e / #f0f0f5
--color-body             #3d3d5c / #c8c8d4
--color-muted            #6b6b80 / #9090a0
--color-muted-soft       #9191a0 / #686880
--color-hairline         #e0e0eb / #2e2e3d
--color-hairline-soft    #ededf5 / #252535
--color-border-strong    #c5c5d5 / #3d3d52
--color-success          #10b981
--color-danger           #ef4444
--color-accent-gold      #F59E0B
--shadow-alchemy         (multi-layer shadow)
```
