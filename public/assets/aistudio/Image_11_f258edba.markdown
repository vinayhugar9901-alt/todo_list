---
name: Kinetic Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#464555'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#005522'
  on-tertiary: '#ffffff'
  tertiary-container: '#00702f'
  on-tertiary-container: '#78f591'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '700'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a focused, high-cadence productivity experience designed for knowledge workers, product teams, and high-output individuals. It combines the rigorous structure of a modern SaaS workspace with the tactile delight of an agile personal assistant. 

The aesthetic sits at the intersection of **Refined Minimalism** and **Tactile Precision**. The interface prioritizes:
- **Visual Calm**: Background noise is eliminated through soft slate washes, allowing active priorities and completion states to command immediate, unambiguous focus.
- **Micro-Delight**: State changes (checking off tasks, updating priority tiers) feel deliberate, swift, and physically satisfying.
- **Effortless Density**: Generous touch targets and readable line lengths paired with clean, information-dense card layouts that don't overwhelm.

## Colors

The palette is engineered for rapid visual parsing. Tasks and workflows rely on high-signal semantic color-coding underpinned by an ultra-crisp, neutral canvas.

### Core Palette
- **Canvas Base**: `#F8FAFC` (Slate 50) provides a soft, low-glare backdrop that frames white containers cleanly.
- **Surfaces & Cards**: `#FFFFFF` (Pure White) separates functional areas from the application canvas with sharp fidelity.
- **Primary / Brand Action**: `#4F46E5` (Indigo 600) drives primary CTAs, task creation triggers, and active navigation indicators.
- **Secondary (In Progress)**: `#2563EB` (Blue 600) signals dynamic, ongoing work.
- **Tertiary (Success / Completed)**: `#16A34A` (Emerald 600) rewards completion and marks resolved tasks.

### Functional Semantics & System Neutrals
- **Danger / Urgent Priority**: `#DC2626` (Red 600) draws immediate focus to overdue items or blockers.
- **Warning / Scheduled / Pending**: `#F59E0B` (Amber 500) communicates intermediate attention or pending dependencies.
- **Text Primary**: `#0F172A` (Slate 900) for primary headings and dense UI headers; `#1E293B` (Slate 800) for task titles and high-legibility body content.
- **Text Muted**: `#64748B` (Slate 500) for meta counters, timestamps, shortcuts, and placeholder text.
- **Border Subtle**: `#E2E8F0` (Slate 200) ensures structural separation between surfaces without visual clutter.

## Typography

Plus Jakarta Sans is utilized across all hierarchy tiers. Its geometric structure, contemporary proportions, and open counters provide extreme clarity when scanning multi-line todo checklists, priority tags, and nested task hierarchies.

- **Display & Headlines**: Tighter negative tracking (`-0.025em` to `-0.015em`) preserves density and provides a polished editorial authority for workspace boards and project titles.
- **Body Content**: Standard letter-spacing optimized for swift scanning of task descriptions and subtasks.
- **Labels & Badges**: Micro-type utilizes medium-to-bold weights with uppercase tracking (`+0.02em` to `+0.04em`) to maintain sharp legibility within compact status chips and priority pills.

## Layout & Spacing

The layout is grounded in an adaptable **12-column responsive fluid grid** on desktop, shifting into structured 4-column streams on mobile screens.

- **Desktop (>= 1024px)**: Uses a persistent left-rail navigation bar (260px fixed width), a dynamic center working canvas (bounded at max `1280px` for optimal eye tracking), and an optional collapsible inspection drawer (380px) for detailed task views.
- **Tablet (768px – 1023px)**: Left rail collapses into an icon-rail (64px width); boards reflow into 2 horizontal scroll panels or accordion list modes.
- **Mobile (< 768px)**: Single column with edge-to-edge modular cards, anchored by a bottom floating navigation bar and floating creation trigger.
- **Rhythm**: All structural margins, card paddings, and inline list gaps adhere strictly to the 4px/8px modular scale (`space-xs` through `space-xl`).

## Elevation & Depth

Visual hierarchy is maintained through crisp structural borders paired with ambient, diffused drop shadows. This creates a clean "sheet of paper" layering effect that avoids muddy, dark shadows.

- **Surface Level 0 (Canvas)**: Background (`#F8FAFC`), entirely flat.
- **Surface Level 1 (Resting Cards & Containers)**: Solid white background (`#FFFFFF`), `1px solid #E2E8F0`, and an ambient micro-shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Surface Level 2 (Hovered Cards & Interactive Filters)**: Subtle elevation shift to `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)` with border transitioning to `#CBD5E1`.
- **Surface Level 3 (Modals, Context Menus, Floating Bottom Nav)**: Elevated over an overlay (`rgba(15, 23, 42, 0.40)`) using `0 20px 25px -5px rgba(15, 23, 42, 0.10), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`, framed with a crisp `1px solid #E2E8F0` edge.

## Shapes

The design uses an inviting, modern rounded profile that feels soft without sacrificing screen real estate:
- **Base UI & Buttons**: Rounded corners (`0.5rem` / 8px).
- **Cards & Data Modules (`rounded-lg` / `rounded-xl`)**: Primary task cards and section containers scale between `1rem` (16px) and `1.5rem` (24px) for a modern, approachable containment aesthetic.
- **Pills & Status Chips**: Fully rounded pill shapes (`9999px`) to create clear differentiation between rectangular cards and categorical metadata tags.

## Components

### Buttons
- **Primary**: Solid `#4F46E5` background, white text, 8px corner radius, font `label-lg`. Micro-elevation on hover with active depression (`scale(0.98)`).
- **Secondary**: Surface white with a `1px solid #E2E8F0` border, `#1E293B` text. On hover, background shifts to `#F8FAFC`.
- **Ghost / Icon Button**: Transparent background, `#64748B` glyph color; transforms to Slate 100 on hover.

### Status & Priority Badges
- Displayed as compact, pill-shaped chips (`padding: 2px 10px`, font `label-sm`, uppercase).
- **Pending / Backlog**: Tinted Amber (`#FEF3C7` background, `#B45309` text, `#FDE68A` border).
- **In Progress**: Tinted Blue (`#DBEAFE` background, `#1D4ED8` text, `#BFDBFE` border).
- **Completed**: Tinted Emerald (`#DCFCE7` background, `#15803D` text, `#BBF7D0` border).
- **High Priority**: Tinted Crimson (`#FEE2E2` background, `#B91C1C` text, `#FECACA` border) complemented by a 4px circular leading indicator.

### Task Cards
- Built on pure white, wrapped in `1px solid #E2E8F0`, with `rounded-xl` (16px) corners and `space-md` internal padding.
- Equipped with a custom interactive checklist target: a rounded-full checkbox that snaps into `#16A34A` fill with a micro-scale bounce on completion, triggering an immediate subtle strike-through and `#64748B` color shift on the task label.

### Form Inputs & Search Bar
- **Search Bar**: Fully encapsulated with `rounded-lg`, `#FFFFFF` surface, `1px solid #E2E8F0`, left-aligned search icon in `#64748B`, with explicit shortcut chip `⌘K` docked right. Focus state reveals a `2px` focus ring in `#4F46E5` with `0 0 0 1px #4F46E5`.
- **Inputs**: Flat white background, clean `1px solid #E2E8F0` border, `0.75rem` vertical padding, with floating or distinct top label styling in `label-md`.

### Navigation
- **Mobile Bottom Navigation**: Glass-backed bar (`background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px)`) featuring a prominent centered primary floating action button (FAB) in `#4F46E5` for instant task addition.