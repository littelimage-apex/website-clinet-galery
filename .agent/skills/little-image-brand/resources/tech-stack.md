# Preferred Tech Stack & Implementation Rules

When generating code or UI components for this brand, you **MUST** strictly adhere to the following technology choices.

## Core Stack
* **Framework:** React (TypeScript preferred)
* **Styling Engine:** Tailwind CSS
* **Component Library:** shadcn/ui (Use these primitives as the base.)
* **Icons:** Lucide React

## Implementation Guidelines

### 1. Tailwind Usage
* Use utility classes directly in JSX.
* Utilize the color tokens defined in `design-tokens.json`.
    * Background: `bg-[#F5F2ED]` (Oatmeal) or configure theme.
    * Text: `text-[#6B5E51]` (Clay Brown).
    * Primary: `bg-[#94A396]` (Sage Green).
* **Dark Mode:** Support dark mode using Tailwind's `dark:` variant modifier (mapping to appropriate darker shades of the organic palette).

### 2. UI Elements & Motion Logic ("River Stone" Geometry)
* **Rule:** No sharp corners.
* **Border Radius:**
    * Cards: `rounded-[1.25rem]` (20px).
    * Buttons: `rounded-full` (Pill shape).
* **Micro-Animations:**
    * **The Float:** Subtle up-and-down movement for featured images.
    * **The Soft Fade:** Sections should fade into view with `duration-800`.
    * **The Hover Expansion:** Buttons should slightly increase in `tracking` (letter-spacing) on hover.

### 3. Component Patterns
* **Buttons:** Primary actions must use the solid Sage Green.
* **Forms:** Labels above inputs. Rounded inputs.

### 4. Forbidden Patterns
* Do NOT use sharp corners for containers.
* Do NOT use harsh blacks (`#000000`) or whites (`#FFFFFF`) for large areas.
