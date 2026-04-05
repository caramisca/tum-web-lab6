# CinemaList 🎬

A Letterboxd-inspired movie & TV diary built with **React + Vite**.  
Track everything you watch, want to watch, or are currently watching.

**Live demo:** _(deploy to GitHub Pages and paste URL here)_

---

## Features

### Core
| Feature | Description |
|---|---|
| **Search & Autocomplete** | Real-time movie & TV search powered by the TMDB API with poster previews |
| **Add titles** | One-click add any result — poster, genres, cast, director, overview auto-filled |
| **Statuses** | Mark each title as *Watchlist*, *Watching*, or *Watched* |
| **Like / Favorite** | Heart-toggle to build a liked collection |
| **Personal rating** | 1–5 star rating per title |
| **Notes** | Free-text diary notes saved per title |
| **Remove** | Remove any title from your list |

### Filtering & Sorting
- Filter by **type** (Movies / TV Shows)
- Filter by **status** tab (All / Watched / Watching / Watchlist / Liked)
- Filter by **genre tags** (multi-select, AND logic)
- **Search** within your existing list by title, genre, or director
- **Sort** by Date Added, Title, Year, My Rating, or TMDB Rating (asc/desc)

### UI / UX
- **Dark & Light theme** — toggle anytime, persisted to `localStorage`
- Letterboxd-inspired dark aesthetic by default
- Responsive grid — works on desktop, tablet, and mobile
- Hover overlays on cards with quick actions

---

## App Flows

### 1 — First Launch
```
Open app → No API key detected → Setup screen
→ Enter TMDB API v3 key → Key validated → App opens
```

### 2 — Adding a Movie / Series
```
Click "+ Add Movie" → Search modal opens
→ Type title → Autocomplete suggestions appear (debounced, ~350 ms)
→ Click a result → Movie details fetched from TMDB
→ Confirm/edit title, choose status, add rating/notes → "Add to List"
→ Card appears in grid
```

### 3 — Managing a Title
```
Click any card → Detail modal opens
→ Change status (Watched / Watching / Watchlist)
→ Set / change 1–5 star rating
→ Like / unlike
→ Edit personal notes and save
→ Remove from list
```

### 4 — Filtering
```
Use header tabs: All / Watched / Watching / Watchlist / Liked
Use filter bar: type dropdown, sort dropdowns, genre tags
Type in the search bar to filter within current view
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Vanilla CSS with CSS custom properties (dark/light) |
| State | React `useState` / `useMemo` / custom hooks |
| Persistence | `localStorage` (movies list + theme + API key) |
| API | [TMDB API v3](https://developer.themoviedb.org/docs) |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Inter (Google Fonts) |

---

## State Architecture

**Runtime-only state** (not persisted):
- Current search query
- Active tab
- Filter/sort settings
- Open modals

**localStorage** (persisted across sessions):
- `cinemalist_movies` — full movies array
- `cinemalist_theme` — `"dark"` or `"light"`
- `cinemalist_tmdb_key` — TMDB API key

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### Development
```bash
npm install
npm run dev
```
Open http://localhost:5173 and enter your TMDB API key on the setup screen.

### Build
```bash
npm run build
```
Output goes to `dist/`.

---

## Deployment — GitHub Pages

1. Create a GitHub repository and push this project.
2. In `vite.config.js`, set `base` to your repo name:
   ```js
   base: '/your-repo-name/',
   ```
3. Add a GitHub Actions workflow or use the `gh-pages` npm package:
   ```bash
   npm install --save-dev gh-pages
   ```
   Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
   Then:
   ```bash
   npm run deploy
   ```
4. In your GitHub repo → Settings → Pages → set source to `gh-pages` branch.

---

## Commit Strategy (Git History)

Suggested commits to demonstrate progress:

1. `feat: initial Vite + React scaffold`
2. `feat: add CSS design system (dark/light theme, variables)`
3. `feat: implement localStorage persistence (movies, theme, API key)`
4. `feat: add TMDB API integration with search autocomplete`
5. `feat: implement movie card grid with hover actions`
6. `feat: add movie detail modal with rating and notes`
7. `feat: implement filter bar (type, sort, genres)`
8. `feat: add like/favorite system and Liked tab`
9. `feat: responsive layout and mobile support`
10. `feat: deploy to GitHub Pages`

---

## Entity: Movie / Series

```ts
{
  id: string            // local UUID
  tmdbId: number        // TMDB ID (duplicate guard)
  type: 'movie' | 'tv'
  title: string
  year: number | null
  poster: string | null // TMDB image URL
  backdrop: string | null
  overview: string
  genres: string[]
  tmdbRating: number | null
  runtime: number | null  // minutes (movies) or ep runtime (TV)
  seasons: number | null  // TV only
  director: string | null
  cast: string[]
  tagline: string
  language: string
  // User data
  liked: boolean
  userRating: 1|2|3|4|5|null
  status: 'watched' | 'watching' | 'watchlist'
  addedAt: string       // ISO date
  userNotes: string
}
```

---

## API Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.  
Movie data and images © The Movie Database (TMDB).
