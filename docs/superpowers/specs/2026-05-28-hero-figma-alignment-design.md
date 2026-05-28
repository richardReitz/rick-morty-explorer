# Hero Figma Alignment — Design Spec

**Date:** 2026-05-28  
**Scope:** Hero section only (`HomePageClient.tsx` + `ThemeToggle.tsx`)  
**Approach:** Targeted edits — no new components, no token changes

---

## Goal

Align the existing hero section with the approved Figma designs for both dark and light themes.

---

## Changes

### 1. H1 Underline — `HomePageClient.tsx`

Add `underline underline-offset-4` to the `<h1>` element so the entire title carries the underline decoration, matching Figma.

**Before:**
```tsx
<h1 className="text-h1 text-foreground">
  Saiba tudo em um só{' '}
  <span className="text-cyan-primary">lugar.</span>
</h1>
```

**After:**
```tsx
<h1 className="text-h1 text-foreground underline underline-offset-4 decoration-foreground">
  Saiba tudo em um só{' '}
  <span className="text-cyan-primary">lugar.</span>
</h1>
```

The `decoration-foreground` ensures the underline color follows the text (white in dark, dark in light). The `<span>` inherits the underline naturally.

---

### 2. ThemeToggle Active State (light mode) — `ThemeToggle.tsx`

In light mode, the active button should use `bg-cyan-primary text-white` instead of `bg-bg-surface`. Dark mode keeps its current behavior (`bg-bg-surface text-foreground`).

**Logic:**
- Dark mode active: `bg-bg-surface text-foreground` (unchanged)
- Light mode active: `bg-cyan-primary text-white` (new)
- Inactive in both: `text-muted hover:text-foreground` (unchanged)

---

### 3. Image Size — `HomePageClient.tsx`

Increase image container height to better fill the hero, matching the Figma proportions. Image stays contained (no overflow).

- Mobile: `h-[280px]` → `h-[320px]`
- Desktop: `h-[380px]` → `h-[420px]`

Width unchanged.

---

### 4. Hero Background (dark mode) — `HomePageClient.tsx`

Add `dark:bg-black` to the hero `<section>` so its background is pure black in dark mode, matching the Figma. Light mode is unchanged (inherits `bg-primary` = `#F5F5F5`).

This is a scoped override on the section element — it does not touch the global `--bg-primary` token.

---

## Files Modified

| File | Change |
|---|---|
| `src/app/_components/HomePageClient.tsx` | H1 underline, image size, hero section bg |
| `src/components/layout/ThemeToggle.tsx` | Active state color logic |

## Files NOT Modified

- `src/app/globals.css` — no token changes
- `tailwind.config.ts` — no new tokens needed
- All other components — out of scope

---

## Success Criteria

- Dark hero: black background, h1 underlined, image taller
- Light hero: white background, h1 underlined, ThemeToggle "Claro" active state is cyan
- No visual regressions outside the hero section
