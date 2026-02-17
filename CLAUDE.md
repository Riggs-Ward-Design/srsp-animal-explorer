# SRSP Animal Explorer — CLAUDE.md

## Project Overview

A kiosk-style interactive exhibit application for the Staunton River State Park. Visitors browse local wildlife organized by status (Native, Invasive, etc.), taxonomic order, and family. Built with Electron + React + TypeScript using the `electron-vite` template.

The app runs in **quad mode** by default: four independent `MainView` instances arranged in a 2×2 grid (two rotated 180° for visitors on opposite sides of a table). Each instance has its own idle timer.

## Architecture

### Process structure (electron-vite)
- `src/main/index.ts` — Electron main process. Creates a 1920×1080 fullscreen window. Pressing Escape quits the app (dev shortcut).
- `src/preload/` — Preload script (minimal).
- `src/renderer/` — React app (Vite).

### Renderer source root: `src/renderer/src/`

**Data layer**
- `_lib/dataModel.ts` — `DataModel` class. Parses a CSV at build time (imported as `?raw`) into a tree of `FolderNode` / `ItemNode`. Tree path: `[localStatus, order, family?, itemName]`. Folders sort before items; siblings sort alphabetically.
- `_lib/useDataModel.ts` — Hook that manages current `path: string[]` and exposes `push`, `up`, `prev`, `next` navigation.
- `_lib/assets.ts` — Vite glob imports for full-res images (`_assets/content-images/`) and thumbnails (`_assets/content-thumbnails/`). `findUrl(map, name)` converts a common name to kebab-case and finds the matching file.

**Components**
- `App.tsx` — Renders the quad layout. Single-instance layout is commented out.
- `MainView/` — Wraps each quadrant. Manages idle timer (`react-idle-timer`, default 30 s). Switches between `AttractScreen` and `ExplorerView` with fade animations (`framer-motion`/`motion`).
- `AttractScreen/` — "Learn About Local Critters / Touch To Start" splash.
- `ExplorerView/` — Main browsing UI. Hosts `NavBar` and `ExplorerCarousel`.
- `ExplorerCarousel/` — Paginated grid of `FolderButton` or `ItemCard` tiles (6 per page). Expanding an item shows a full `ItemCard` overlay.
- `NavBar/` — Up / prev / next navigation buttons + idle timer countdown + reset button.
- `FolderButton/` — Tile for a folder node (shows animal-class icon + label).
- `ItemCard/` — Tile or expanded card for an animal item (thumbnail / full image + facts).

**rwd-library** (shared UI primitives)
- `DirectionalTransitions/` — Animates between views with directional slide based on `{ x, y, z }` position changes.
- `Shimmer/` — Repeating shimmer animation wrapper.
- `StandardIcon/` — SVG icon lookup from `standard-icons.json`.
- `StandardIconButton/` — Icon-only button.

### Assets (`src/renderer/src/_assets/`)
- `srsp animal facts.csv` — Master content file. Fixed columns: `Common Name`, `Scientific Name`, `Local Status`, `Order`, `Family`. Followed by any number of text block pairs: `Text 1 Heading` / `Text 1 Body`, `Text 2 Heading` / `Text 2 Body`, etc. Column order does not matter; text pair discovery stops at the first N with no matching columns.
- `content-images/` — Full-resolution photos (kebab-case filenames matching common names).
- `content-thumbnails/` — Thumbnail photos (same naming).
- `animal icons/` — SVG icons per animal class (Amphibian, Bird, Fish, Insect, Mammal, Reptile).
- `fonts/` — Franklin Gothic URW (Book, Demi, italics) + Meursault VF.
- `srsp-animal-explorer-attract-bg.jpg` — Attract screen background.

## Key Conventions

- **Image filenames** must be kebab-case versions of the animal's common name (e.g., `bald-eagle.jpg`). The `findUrl` helper handles the conversion via `change-case` `kebabCase`.
- **CSV columns** are header-mapped by normalized key (lowercase, spaces→hyphens). Column order does not matter. Text content uses open-ended `Text N Heading` / `Text N Body` pairs (N = 1, 2, 3, …) so headings like "Habitat", "Diet", and "Fun Fact" are data-driven, not hardcoded.
- **Tree hierarchy**: `Local Status` → `Order` → `Family` (optional) → `Item`. Items with missing `Local Status`, `Order`, or `Common Name` are skipped.
- **Quad layout**: `flipped` prop on `MainView` applies `rotate: 180deg` so two instances read correctly from the other side of the kiosk.
- **Prev/Next navigation** only works at the item level (between sibling items within the same parent folder), not between folders.

## Commands

```bash
npm run dev          # Start dev server (Electron + Vite HMR)
npm run build:win    # Typecheck + build + package Windows portable exe
npm run typecheck    # Run tsc for both node and web tsconfigs
npm run lint         # ESLint
npm run format       # Prettier
```

Build output: `out/` (compiled JS), `dist/` (packaged installer).
Build resources (icons, etc.): `resources/` and `build/`.
Windows target: portable executable (`electron-builder.yml`).

## Dependencies of Note

- `motion` (`framer-motion` v12) — animations throughout.
- `react-idle-timer` — per-quadrant idle detection.
- `change-case` — `kebabCase` for asset lookups.
- `electron-updater` — auto-update support (configured via `dev-app-update.yml`).
