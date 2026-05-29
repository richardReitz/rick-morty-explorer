# Episode Detail Page — Design Spec

**Date:** 2026-05-29  
**File:** `src/app/episodes/[id]/page.tsx`

---

## Overview

A detail page for a single episode, mirroring the structure and style of `CharacterDetailPage`. Contains a text-only hero (no image) and a "Mais episódios" grid section with pagination.

---

## Architecture

`'use client'` directive. Reads `id` via `useParams<{ id: string }>()`, converts to `episodeId = Number(id)`.

Wrapped in `<MainLayout>`.

Uses `useRef<HTMLDivElement>` on the episodes section for smooth scroll on pagination change.

---

## Data Fetching

Two `useQuery` calls, sem `staleTime`:

| Query key | Function | Purpose |
|-----------|----------|---------|
| `['episode', episodeId]` | `getEpisode(episodeId)` | Hero data |
| `['episodes', page]` | `getEpisodes(page)` | "Mais episódios" grid |

`page` state starts at `1`. `changePage(next)` updates state and calls `sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })`.

---

## Hero Section

Container classes: `border-b-2 dark:border-transparent border-cyan-primary dark:bg-black` (identical to CharacterDetailPage).

Inner container: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10`.

### Loading state

Local `HeroSkeleton` component — text-only, `animate-pulse`, no image column:
- Line 1: wide bar (title + button)
- Line 2: narrow bar (meta)
- Line 3: narrow bar (character count)

### Loaded state

```
<TvMinimalPlay size={48} className="text-foreground-strong" />

<h1 className="text-h1 font-bold text-foreground-strong"> + <FavoriteButton size="lg" />

<Calendar size={16} /> air_date  |  <List size={16} /> episode
  → className="flex items-center gap-2 text-body text-foreground-strong"

<Users size={16} /> "{N} Personagens participaram deste episódio"
  → className="flex items-center gap-2 text-body text-foreground-strong"
```

FavoriteItem shape: `{ id: episode.id, type: 'episode', name: episode.name }` (no `image` — matches EpisodeCard pattern).

Character count: `episode.characters.length`.

---

## Separator

```tsx
<div className="border-b border-cyan-primary" />
```

---

## "Mais episódios" Section

Container: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10`, with `ref={sectionRef}`.

Header row: `<TvMinimalPlay size={24} />` + `<h3 className="text-h3 font-bold text-foreground">Mais episódios</h3>`.

### Loading state

`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4` with 10× `<SkeletonCard type="episode" />`.

### Loaded state

Same grid. Items: `episodesData?.results.filter(e => e.id !== episodeId)` rendered as `<EpisodeCard episode={e} />`.

Pagination: `<Pagination currentPage={page} totalPages={episodesData?.info.pages ?? 1} onPageChange={changePage} />`.

---

## Components Reused

- `EpisodeCard` — episode grid items
- `FavoriteButton` — hero favorite toggle
- `SkeletonCard` (type `"episode"`) — loading placeholders
- `Pagination` — page navigation
- `MainLayout` — page shell

---

## Lucide Icons Used

- `TvMinimalPlay` — hero standalone icon + section header
- `Calendar` — air date meta
- `List` — episode code meta
- `Users` — character count meta
