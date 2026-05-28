# Episodes & Locations Grid Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace horizontal scroll with responsive grid in the Episodes and Locations home page sections, showing max 5 episodes and max 6 locations.

**Architecture:** Single-file change in `HomePageClient.tsx`. Remove the `isSearching`-based layout branching for both sections and replace with a unified grid that works for both default and search states. Cards render directly in the grid without wrapper `div`s.

**Tech Stack:** Next.js 14, React, Tailwind CSS, @tanstack/react-query

---

## Files

| Action | Path |
|--------|------|
| Modify | `src/app/_components/HomePageClient.tsx` |

No other files change.

---

### Task 1: Replace Episodes section with grid

**Files:**
- Modify: `src/app/_components/HomePageClient.tsx` (lines 144–180)

- [ ] **Step 1: Replace the Episodes section JSX**

In `HomePageClient.tsx`, find the Episodes section (lines ~144–180) and replace the entire conditional block inside `SectionHeader` with:

```tsx
{/* Episodes */}
{(!isSearching || activeTab === 'episodes') && (
  <section className="transition-opacity duration-200">
    <SectionHeader title="Episódios" href="/episodes" />
    {isLoadingEpisodes ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} type="episode" />
        ))}
      </div>
    ) : episodes.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {(isSearching ? episodes : episodes.slice(0, 5)).map((ep) => (
          <EpisodeCard key={ep.id} episode={ep} />
        ))}
      </div>
    )}
  </section>
)}
```

- [ ] **Step 2: Verify the dev server compiles without errors**

Run: `npm run dev`
Expected: Server starts with no TypeScript/build errors in the terminal.

- [ ] **Step 3: Visually verify Episodes grid**

Open `http://localhost:3000` in the browser.
Expected:
- Episodes section shows **5 cards** in a grid (not a horizontal scroll)
- On desktop: 5 columns in one row
- On mobile: 1 column, stacked
- Searching still works and shows results in the same 5-column grid

- [ ] **Step 4: Commit**

```bash
git add src/app/_components/HomePageClient.tsx
git commit -m "feat: replace episodes scroll with 5-col grid on home page"
```

---

### Task 2: Replace Locations section with grid

**Files:**
- Modify: `src/app/_components/HomePageClient.tsx` (lines 183–221)

- [ ] **Step 1: Replace the Locations section JSX**

In `HomePageClient.tsx`, find the Locations section (lines ~183–221) and replace the entire conditional block inside `SectionHeader` with:

```tsx
{/* Locations */}
{(!isSearching || activeTab === 'locations') && (
  <section className="transition-opacity duration-200">
    <SectionHeader title="Localizações" href="/locations" />
    {isLoadingLocations ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} type="location" />
        ))}
      </div>
    ) : locations.length === 0 ? (
      <EmptyState />
    ) : (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {(isSearching ? locations : locations.slice(0, 6)).map((loc) => (
          <LocationCard key={loc.id} location={loc} />
        ))}
      </div>
    )}
  </section>
)}
```

- [ ] **Step 2: Visually verify Locations grid**

Open `http://localhost:3000` in the browser.
Expected:
- Locations section shows **6 cards** in a grid (not a horizontal scroll)
- On desktop: 6 columns in one row
- On tablet: 3 columns, 2 rows
- On mobile: 2 columns, 3 rows
- LocationCard globe icon centered above each card — verify it looks correct at all widths
- Searching still works and shows results in the same 6-column grid

- [ ] **Step 3: Commit**

```bash
git add src/app/_components/HomePageClient.tsx
git commit -m "feat: replace locations scroll with 6-col grid on home page"
```

---

### Task 3: Final cross-section verification

- [ ] **Step 1: Verify all three home sections work together**

Open `http://localhost:3000` and check:
- Characters: 4-col grid, 8 items — unchanged
- Episodes: 5-col grid, 5 items — no scroll
- Locations: 6-col grid, 6 items — no scroll

- [ ] **Step 2: Verify search flow**

Type a query in the search bar (e.g. "rick").
Expected:
- Tab filter appears
- Each section filters to matching results
- All sections use grid layout (no scroll appears under any state)
- "Episodes" tab shows episodes grid, "Locations" tab shows locations grid

- [ ] **Step 3: Verify loading skeletons**

Hard-refresh the page with the network throttled to "Slow 3G" in DevTools.
Expected:
- Episodes skeleton: 5 cards in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
- Locations skeleton: 6 cards in `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`
- No layout shift when real data loads in

- [ ] **Step 4: Verify empty state**

Type a nonsense query that returns no results (e.g. "zzzzzzz").
Expected: EmptyState renders in all three sections — no crash, no scroll container.
