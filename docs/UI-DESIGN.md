# UI Design System - "Little Image" Theme

## Brand Identity

**Little Image Photography** is a sanctuary for memories. The digital experience is designed to be a "Cozy & Comfort" space—a warm digital hug for the modern mother. It feels safe, soft, and organic.

## Color Palette

### Primary - Sage Green (Growth & Safety)

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-50` | `#f4f6f5` | Lightest backgrounds |
| `sage-100` | `#e7ebe9` | Secondary backgrounds |
| `sage-200` | `#d0d9d4` | Borders |
| `sage-300` | `#aebdb4` | Decorative elements |
| `sage-400` | `#94A396` | **Primary Brand Color** |
| `sage-500` | `#738576` | Primary Hover |
| `sage-600` | `#5a6b5d` | Darker accents |
| `sage-700` | `#49564c` | Text |
| `sage-800` | `#3d463f` | Dark Text |
| `sage-900` | `#333a35` | Deepest Text |

### Secondary - Muted Rose (Heart & Warmth)

| Token | Hex | Usage |
|-------|-----|-------|
| `rose-400` | `#D4A39A` | **Secondary Brand Color** |
| `rose-100` | `#f8ebeb` | Light accents |

### Neutrals - Oatmeal & Clay

| Token | Hex | Usage |
|-------|-----|-------|
| `oatmeal` | `#F5F2ED` | **Main Background** |
| `cream`   | `#FDFCFB` | **Card Background** |
| `clay`    | `#6B5E51` | **Main Text (Foreground)** |

## Typography

### Font Families

```css
--font-serif: 'Solway', serif;      /* Headings */
--font-sans: 'Nunito', sans-serif;  /* Body */
```

### Usage

| Element | Font | Weight | Style |
|---------|------|--------|-------|
| Headings | Solway | 400/500 | Natural, Serif |
| Body | Nunito | 400 | Rounded, Sans |
| UI Elements | Nunito | 600 | Readable, Friendly |

## Geometry "River Stone"

Organic, smooth shapes used to evoke softness.

### Border Radius

```css
--radius-card: 1.25rem; /* 20px */
--radius-btn: 50px;     /* Pill shape */
```

**Rule:** No sharp corners. All containers must be rounded.

## Animation & Motion

- **The Soft Fade**: `duration-800` ease-out. Sections drift into view.
- **The Float**: Subtle up/down motion for hero images.
- **The Hover Expansion**: Letter-spacing increases on button hover.

## Component Patterns

### Buttons

**Primary (Sage)**
- Background: `sage-400`
- Radius: `50px`
- Hover: `sage-500` + letter-spacing expansion

**Secondary (Oatmeal/Ghost)**
- Background: `transparent` or `sage-50`
- Text: `sage-700`

### Cards

- Background: `cream` (#FDFCFB)
- Radius: `1.25rem`
- Shadow: Soft, diffuse ambient shadow.
