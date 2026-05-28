# Design: Grid Layout for Episodes and Locations on Home Page

**Date:** 2026-05-28
**Status:** Approved

## Summary

Replace the horizontal scroll layout used by the Episodes and Locations sections on the home page with a responsive grid, consistent with how the Characters section already works.

## Motivation

The current Episodes and Locations sections use `flex overflow-x-auto` (horizontal scroll) on the home page by default, switching to a 3-column grid only when the user is actively searching. This creates an inconsistent experience and two separate code paths for the same visual context. The goal is to unify both into a clean grid layout always.

## Approach

**Approach A — Unified grid (chosen):** Always render grid regardless of search state. Removes the `isSearching` conditional that controlled layout switching. Simplifies code and aligns with the existing Characters pattern.

## Scope

Single file: `src/app/_components/HomePageClient.tsx`

No changes to `EpisodeCard.tsx`, `LocationCard.tsx`, or any other component.

## Episodes Section

| Breakpoint | Columns |
|------------|---------|
| Mobile     | 1       |
| Tablet (sm)| 2       |
| Desktop (lg)| 5      |

- Max items displayed: **5** (`episodes.slice(0, 5)`)
- Skeleton: 5 cards in the same grid
- Tailwind class: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4`
- Remove: `flex gap-4 overflow-x-auto pb-2` and `min-w-[320px] flex-shrink-0` wrappers
- Remove: conditional `isSearching` layout branching in this section

## Locations Section

| Breakpoint | Columns |
|------------|---------|
| Mobile     | 2       |
| Tablet (sm)| 3       |
| Desktop (lg)| 6      |

- Max items displayed: **6** (`locations.slice(0, 6)`)
- Skeleton: 6 cards in the same grid
- Tailwind class: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4`
- Remove: `flex gap-4 overflow-x-auto pb-2` and `min-w-[200px] flex-shrink-0` wrappers
- Remove: conditional `isSearching` layout branching in this section

## What Does NOT Change

- Characters section — already uses grid, stays as-is
- `/episodes` and `/locations` dedicated pages — out of scope
- Card components (`EpisodeCard`, `LocationCard`) — no changes
- Search behavior — search still filters results, but layout no longer changes based on search state
- `SectionHeader`, `EmptyState`, `SkeletonCard` components — unchanged

## Error and Empty States

- `EmptyState` — rendered the same as today when results are empty
- Loading skeleton — matches the new grid (5 episode skeletons, 6 location skeletons)
