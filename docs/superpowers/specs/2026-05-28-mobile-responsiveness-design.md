# Mobile Responsiveness Fix — Design Spec

**Date:** 2026-05-28
**Scope:** CSS/Tailwind changes only, 4 files

## Problem

The app breaks on mobile:
- Content appears stuck to the left across the whole page (caused by horizontal overflow and/or hero text container collapsing)
- Logos are too large for mobile viewports
- H1 in the Hero is 48px on all screen sizes — too large for mobile

## Root Causes

1. `Hero.tsx` — text container (`flex-1 flex flex-col justify-center`) has no `w-full` inside a `flex-col items-center` parent → on mobile the div collapses to content width and appears misaligned
2. `Hero.tsx` — hero `<section>` has no `overflow-hidden` → image can bleed outside bounds and cause horizontal scroll
3. `Hero.tsx` — `text-h1` (48px) is fixed on all breakpoints
4. `Header.tsx` — logo `width={164}` with no responsive class override
5. `Footer.tsx` — logo `width={120}` with no responsive class override
6. `globals.css` — `body` has no `overflow-x: hidden` to catch residual overflow

## Design (Approach A — Targeted Fixes)

### `src/components/layout/Hero.tsx`

- Add `w-full` to the text container div: `flex-1 flex flex-col justify-center w-full`
- Scale the two `<h1>` elements: `text-[32px] sm:text-h1`
- Add `overflow-hidden` to the `<section>` element

### `src/components/layout/Header.tsx`

- Add `className="w-[120px] sm:w-[164px] h-auto object-contain"` to the `<Image>` component

### `src/components/layout/Footer.tsx`

- Add `className="w-[90px] sm:w-[120px] h-auto object-contain"` to the `<Image>` component

### `src/app/globals.css`

- Add `overflow-x: hidden` to the `body` rule

## Out of Scope

- Structural changes to the Hero layout
- Any non-mobile breakpoint changes
- New components or abstractions
