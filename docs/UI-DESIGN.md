# UI Design System - "Lavender Keepsake" Theme

## Brand Identity

**Little Image Photography** specializes in newborn and early-childhood photography. The digital experience should feel like a "Digital Keepsake Box" - safe, sophisticated, and deeply personal for young mothers.

## Color Palette

### Primary - Muted Lavender / Dusty Purple

| Token | Hex | Usage |
|-------|-----|-------|
| `lavender-50` | `#faf8fc` | Light backgrounds |
| `lavender-100` | `#f3eff7` | Secondary backgrounds, badges |
| `lavender-200` | `#e9e1f0` | Borders, dividers |
| `lavender-300` | `#d8c9e4` | Hover states, selection glow |
| `lavender-400` | `#c1a8d3` | Focus rings |
| `lavender-500` | `#a785be` | **Primary brand color** |
| `lavender-600` | `#8e68a4` | Primary hover |
| `lavender-700` | `#775689` | Text on light backgrounds |
| `lavender-800` | `#634871` | Dark text |
| `lavender-900` | `#533d5e` | Headings |

### Secondary - Cloud White & Soft Cream

| Token | Hex | Usage |
|-------|-----|-------|
| `cream-50` | `#fefdfb` | Page backgrounds |
| `cream-100` | `#fdfaf5` | Card backgrounds |
| `cream-200` | `#faf5eb` | Input backgrounds |
| `cream-300` | `#f5ecda` | Hover states |

### Neutral - Charcoal Gray

| Token | Hex | Usage |
|-------|-----|-------|
| `charcoal-400` | `#818181` | Muted text |
| `charcoal-500` | `#666666` | Secondary text |
| `charcoal-600` | `#515151` | Body text |
| `charcoal-700` | `#434343` | Labels |
| `charcoal-800` | `#383838` | Primary text |

### Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `sage-500` | `#7a9480` | Success, "Ready" stage |
| `champagne-500` | `#c9a066` | "In progress" stage |

## Typography

### Font Families

```css
--font-serif: 'Playfair Display', Georgia, serif;
--font-sans: 'Quicksand', system-ui, sans-serif;
--font-script: 'Dancing Script', cursive;
```

### Usage

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Hero Headline | Playfair Display | 600 | 3rem - 4.5rem |
| Section Headings | Playfair Display | 500 | 2rem - 2.5rem |
| Card Titles | Playfair Display | 500 | 1.25rem |
| Body Text | Quicksand | 400 | 1rem |
| Button Text | Quicksand | 500 | 0.875rem - 1rem |
| Accent/Signature | Dancing Script | 500 | varies |

## Geometry

### Border Radius

All UI elements use soft, rounded corners:

```css
--radius-sm: 0.5rem;    /* 8px - small elements */
--radius-md: 0.75rem;   /* 12px - inputs */
--radius-lg: 1rem;      /* 16px - cards */
--radius-xl: 1.5rem;    /* 24px - large cards */
--radius-2xl: 2rem;     /* 32px - hero sections */
--radius-full: 9999px;  /* pills, buttons */
```

**Rule:** Sharp corners are strictly prohibited.

## Shadows

### Soft Shadow (resting state)
```css
.shadow-soft {
  box-shadow:
    0 4px 20px -4px rgba(167, 133, 190, 0.15),
    0 8px 32px -8px rgba(167, 133, 190, 0.1);
}
```

### Lifted Shadow (hover/active state)
```css
.shadow-lifted {
  box-shadow:
    0 8px 30px -6px rgba(167, 133, 190, 0.25),
    0 16px 48px -12px rgba(167, 133, 190, 0.15);
}
```

### Selection Glow
```css
.selection-glow {
  box-shadow:
    0 0 0 3px var(--lavender-300),
    0 0 20px rgba(167, 133, 190, 0.4);
}
```

## Transitions

All animations should be slow and fluid to maintain a calm atmosphere:

```css
--transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

### Image Hover Effect

The "picked up from table" effect:
```css
.image-hover {
  transition: transform 400ms ease, box-shadow 400ms ease;
}

.image-hover:hover {
  transform: scale(1.05);
  /* shadow-lifted applied */
}
```

## Component Patterns

### Buttons

**Primary Button**
- Background: `lavender-500`
- Text: White
- Hover: `lavender-600` + slight lift
- Border radius: Full (pill shape)

**Secondary Button**
- Background: `lavender-100`
- Text: `lavender-700`
- Hover: `lavender-200`
- Border radius: Full

**Sage Button (Download/Success)**
- Background: `sage-500`
- Text: White
- Used for Stage 3 download actions

### Cards

```css
.card {
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid var(--lavender-100);
  box-shadow: /* shadow-soft */;
}
```

### Stage Badges

| Stage | Label | Background | Text |
|-------|-------|------------|------|
| 1 | "Choosing your favorites" | `lavender-100` | `lavender-700` |
| 2 | "In the darkroom" | `champagne-400` | `charcoal-800` |
| 3 | "Ready to cherish" | `sage-400` | White |

### Inputs

- Background: White
- Border: `lavender-200`
- Focus: `lavender-400` border + `lavender-100` ring
- Border radius: `radius-xl` (1.5rem)
- Padding: 0.75rem 1rem

### Modals

- Backdrop: Semi-transparent with blur effect
- Panel: White with `shadow-lifted`
- Animation: Fade in + slight slide up

## Layout Patterns

### Landing Page

```
┌────────────────────────────────────────┐
│  Nav: Logo          [Client Portal]    │
├────────────────────────────────────────┤
│                                        │
│           HERO SECTION                 │
│     "Capturing life's most precious    │
│           beginnings"                  │
│                                        │
├────────────────────────────────────────┤
│         PORTFOLIO GRID                 │
│   ┌───┐ ┌───┐ ┌───┐ ┌───┐            │
│   │   │ │   │ │   │ │   │            │
│   └───┘ └───┘ └───┘ └───┘            │
│      [View Full Portfolio]             │
├────────────────────────────────────────┤
│         PRICING CARDS                  │
│   ┌─────┐ ┌─────┐ ┌─────┐            │
│   │Mini │ │Class│ │Prem │            │
│   │  5  │ │ 10  │ │ 20  │            │
│   └─────┘ └─────┘ └─────┘            │
├────────────────────────────────────────┤
│         CONTACT FORM                   │
└────────────────────────────────────────┘
```

### Client Portal

```
┌──────────┬────────────────────────────┐
│          │                            │
│  SIDEBAR │    MAIN CONTENT AREA       │
│          │                            │
│  ┌────┐  │    ┌───┐ ┌───┐ ┌───┐     │
│  │Proj│  │    │   │ │   │ │   │     │
│  │ 1  │  │    └───┘ └───┘ └───┘     │
│  └────┘  │    ┌───┐ ┌───┐ ┌───┐     │
│  ┌────┐  │    │   │ │   │ │   │     │
│  │Proj│  │    └───┘ └───┘ └───┘     │
│  │ 2  │  │                            │
│  └────┘  │         [7 of 10]          │
│          │                            │
│  ┌────┐  │                            │
│  │User│  │                            │
│  │Menu│  │                            │
│  └────┘  │                            │
└──────────┴────────────────────────────┘
```

## Locked State

When a project stage is submitted/being edited:

```css
.locked-state {
  opacity: 0.6;
  pointer-events: none;
  filter: grayscale(20%);
}
```

## Responsive Breakpoints

| Breakpoint | Width | Notes |
|------------|-------|-------|
| Mobile | < 640px | Low priority but functional |
| Tablet | 640px - 1024px | "Tablet-friendly" requirement |
| Desktop | > 1024px | Primary design target (98% usage) |

## Accessibility

- Focus states: 2px `lavender-400` outline with 2px offset
- Color contrast: All text meets WCAG AA standards
- Interactive elements: Minimum 44x44px touch targets
- Animations: Respect `prefers-reduced-motion`
