# Pagination Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the inline pagination block from `CharacterDetailPage` into a reusable `<Pagination>` UI component and replace the inline code with it.

**Architecture:** A controlled, stateless `Pagination` component in `src/components/ui/` receives `currentPage`, `totalPages`, and `onPageChange` props. The `getPaginationRange` helper (4-page sliding window) is private to the component file. The parent manages state with `useState`; scroll-on-page-change stays in the parent's handler.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS, lucide-react

---

### Task 1: Create `src/components/ui/Pagination.tsx`

**Files:**
- Create: `src/components/ui/Pagination.tsx`

- [ ] **Step 1: Create the file with the full implementation**

Create `src/components/ui/Pagination.tsx` with the following content:

```tsx
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const PAGE_WINDOW = 4

function getPaginationRange(current: number, total: number): number[] {
  const half = Math.floor(PAGE_WINDOW / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + PAGE_WINDOW - 1)
  start = Math.max(1, end - PAGE_WINDOW + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pageRange = getPaginationRange(currentPage, totalPages)

  return (
    <div className={cn('flex items-center justify-center gap-4 mt-16', className)}>
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Página anterior"
      >
        <ChevronLeft size={32} />
      </button>

      {pageRange.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-12 h-12 flex items-center justify-center rounded-full text-body font-medium transition-colors ${
            p === currentPage
              ? 'bg-cyan-primary text-white border-2 border-cyan-primary'
              : 'bg-transparent text-foreground border-2 border-foreground hover:border-cyan-primary hover:text-cyan-primary'
          }`}
          aria-label={`Página ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Próxima página"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/Pagination.tsx
git commit -m "feat: add reusable Pagination component"
```

---

### Task 2: Export `Pagination` from the UI barrel

**Files:**
- Modify: `src/components/ui/index.ts`

- [ ] **Step 1: Add the export line**

Open `src/components/ui/index.ts`. The current content is:

```ts
export { Button } from './Button'
export { Badge } from './Badge'
export { FavoriteButton } from './FavoriteButton'
export { SectionHeader } from './SectionHeader'
export { SearchBar } from './SearchBar'
export { FilterTabs } from './FilterTabs'
export type { FilterTab } from './FilterTabs'
export { LoadingSpinner } from './LoadingSpinner'
export { SkeletonCard } from './SkeletonCard'
export { EmptyState } from './EmptyState'
```

Add one line at the end:

```ts
export { Pagination } from './Pagination'
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui/index.ts
git commit -m "feat: export Pagination from ui barrel"
```

---

### Task 3: Replace inline pagination in `CharacterDetailPage`

**Files:**
- Modify: `src/app/characters/[id]/page.tsx`

- [ ] **Step 1: Update the import from lucide-react**

In `src/app/characters/[id]/page.tsx`, the current lucide-react import (lines 6–15) is:

```tsx
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dna,
  Tv,
  User,
  Users,
} from 'lucide-react'
```

Remove `ChevronLeft` and `ChevronRight` (they move into the Pagination component):

```tsx
import {
  Activity,
  Dna,
  Tv,
  User,
  Users,
} from 'lucide-react'
```

- [ ] **Step 2: Add `Pagination` to the UI import**

The current UI import (line 18) is:

```tsx
import { FavoriteButton, SkeletonCard } from '@/components/ui'
```

Update to:

```tsx
import { FavoriteButton, Pagination, SkeletonCard } from '@/components/ui'
```

- [ ] **Step 3: Remove `PAGE_WINDOW`, `getPaginationRange`, and `pageRange`**

Delete lines 56–64 (the constant and helper function):

```tsx
const PAGE_WINDOW = 4

function getPaginationRange(current: number, total: number): number[] {
  const half = Math.floor(PAGE_WINDOW / 2)
  let start = Math.max(1, current - half)
  const end = Math.min(total, start + PAGE_WINDOW - 1)
  start = Math.max(1, end - PAGE_WINDOW + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
```

Also delete this line inside `CharacterDetailPage` (currently line 104):

```tsx
const pageRange = getPaginationRange(page, totalPages)
```

- [ ] **Step 4: Replace the inline pagination block with `<Pagination>`**

The inline pagination block (currently lines 210–244) is:

```tsx
<div className="flex items-center justify-center gap-4 mt-16">
  <button
    onClick={() => changePage(Math.max(1, page - 1))}
    disabled={page === 1}
    className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    aria-label="Página anterior"
  >
    <ChevronLeft size={32} />
  </button>

  {pageRange.map((p) => (
    <button
      key={p}
      onClick={() => changePage(p)}
      className={`w-12 h-12 flex items-center justify-center rounded-full text-body font-medium transition-colors ${
        p === page
          ? 'bg-cyan-primary text-white border-2 border-cyan-primary'
          : 'bg-transparent text-foreground border-2 border-foreground hover:border-cyan-primary hover:text-cyan-primary'
      }`}
      aria-label={`Página ${p}`}
      aria-current={p === page ? 'page' : undefined}
    >
      {p}
    </button>
  ))}

  <button
    onClick={() => changePage(Math.min(totalPages, page + 1))}
    disabled={page === totalPages}
    className="w-12 h-12 flex items-center justify-center rounded-full text-foreground hover:bg-bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    aria-label="Próxima página"
  >
    <ChevronRight size={32} />
  </button>
</div>
```

Replace it with:

```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={changePage}
/>
```

- [ ] **Step 5: Verify TypeScript compiles with no errors**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 6: Commit**

```bash
git add src/app/characters/[id]/page.tsx
git commit -m "refact: replace inline pagination in CharacterDetailPage with Pagination component"
```

---

### Task 4: Visual verification

**Files:** none (read-only check)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate to any character detail page**

Open `http://localhost:3000/characters/1` in the browser.

- [ ] **Step 3: Verify pagination renders correctly**

Check all of the following:
- The pagination bar appears below "Mais personagens"
- The active page button is filled with `cyan-primary` background
- Inactive page buttons have a border and change to cyan on hover
- Clicking a page number updates the grid and scrolls the section into view
- Prev button is disabled (dimmed) on page 1
- Next button is disabled (dimmed) on the last page
- Clicking Prev/Next navigates correctly
