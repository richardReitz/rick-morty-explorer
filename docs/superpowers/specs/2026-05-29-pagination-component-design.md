# Pagination Component Design

**Date:** 2026-05-29
**Status:** Approved

## Goal

Extract the inline pagination block from `CharacterDetailPage` into a reusable `<Pagination>` component available to all list pages in the project.

## Architecture

The component lives in `src/components/ui/Pagination.tsx` and is exported from `src/components/ui/index.ts`, following the same pattern as `Button`, `Badge`, and other UI primitives.

It is a **controlled component** (stateless): it receives the current page and fires a callback on change. The parent manages state with `useState`. No URL synchronization.

## Component API

```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}
```

`getPaginationRange` — the helper that computes the 4-page sliding window — is private to the component file. It is not exported.

## Visual Behavior

Matches the current design in `CharacterDetailPage` exactly:

- **Prev button** — `ChevronLeft` (32px), circular (w-12 h-12), disabled when `currentPage === 1`
- **Page numbers** — 4-page sliding window (`PAGE_WINDOW = 4`):
  - Active: `bg-cyan-primary text-white border-2 border-cyan-primary`
  - Inactive: `border-2 border-foreground hover:border-cyan-primary hover:text-cyan-primary`
- **Next button** — `ChevronRight` (32px), circular, disabled when `currentPage === totalPages`
- **Layout:** `flex items-center justify-center gap-4 mt-16`
- **Accessibility:** `aria-label` on Prev/Next buttons, `aria-current="page"` on active page number

The `className` prop allows the parent to override `mt-16` or other layout concerns.

Scroll-to-section on page change is **not** a responsibility of this component — it stays in the parent's `onPageChange` handler.

## Files Changed

| File | Change |
|---|---|
| `src/components/ui/Pagination.tsx` | **Create** — new component |
| `src/components/ui/index.ts` | **Update** — add `Pagination` export |
| `src/app/characters/[id]/page.tsx` | **Update** — replace inline pagination block (lines 210–244) with `<Pagination>`, remove `ChevronLeft`, `ChevronRight` imports and `getPaginationRange` function |

## Out of Scope

Implementing the list pages (`/characters`, `/episodes`, `/locations`) — they currently return `null`. The `Pagination` component will be available for use when those pages are built.

## Usage After Refactor

```tsx
// CharacterDetailPage
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={changePage}
/>

// Future list pages
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```
