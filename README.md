# DFS Slate Explorer (Next.js + Tailwind + TypeScript)

This is a single-page application that loads static data from `data.json` to explore DFS slates. It fulfills the provided assessment requirements: operator selection, dependent game type and slate name population, player list with selection, working pagination, and responsive (desktop) layout.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4

## Prerequisites
- Node.js 18.18+ (recommended 20+)
- npm 9+ (or use yarn/pnpm if you prefer; commands below use npm)

## Getting Started

1. Install dependencies:
   - npm install
2. Run the development server:
   - npm run dev
   - Open http://localhost:3000 in your browser
3. Build for production:
   - npm run build
   - npm start (serves the production build)
4. Lint (optional):
   - npm run lint

No external API is required: data is loaded statically during build/runtime from the provided `data.json`.

## Project Structure
- `app/` — App Router pages and global layout/styles
- `components/` — UI components (Select, PlayerCard, Pagination)
- `lib/` — Types and data adapter (`lib/data.ts`) that normalizes `data.json` fields
- `data.json` — Provided large dataset of slates, games, and players

## How It Works
- The app reads from `data.json` and maps each slate to the minimal fields required by the UI (`operator`, `operatorGameType`, `operatorName`, `dfsSlatePlayers`).
- Selecting an Operator filters available Game Types.
- Selecting a Game Type filters available Slate Names (from `operatorName`).
- Selecting a Game Type (and Slate) shows the players list from the first matching slate, auto-selecting the first player.
- Clicking a player updates the right-side player details.
- Pagination is implemented client-side with a configurable page size (default 8 in UI; options include 5, 8, 10, 12, 20, 50).
- Layout is responsive for desktop widths (md and up); mobile fine-tuning is not required by the brief.

## Reviewer Commentary (Design Rationale & Decisions)
- App Router + Client Components: The main page is a client component to support interactive filtering, selection, and pagination without extra API calls or server state.
- Data normalization: `lib/data.ts` maps the large raw dataset into minimal typed fields and tolerates casing/field-name variations (e.g., `dfsSlatePlayers` vs `DfsSlatePlayers`). This reduces UI conditionals and prevents runtime errors.
- Accessibility:
  - Native `<select>` is used for the three filters (Operator, Game Type, Slate Name) to inherit keyboard and screen reader support out of the box.
  - `Pagination` includes ARIA attributes for the dropdown listboxes, escape-to-close, outside-click closing, and proper button labels for prev/next.
  - Interactive player rows are keyboard-activatable (Enter/Space) and expose pressed state via `aria-pressed`.
- Pagination behavior: total pages = ceil(total/pageSize) with clamping on navigation. Changing page or page size resets selection predictably (first item on the current view).
- Performance: All filtering and pagination are client-side over static data. Derived arrays are memoized (`useMemo`) to avoid unnecessary recalculations. No network requests are made.
- Styling: Tailwind 4 is used for fast iteration and consistent spacing/typography; styles are colocated in components to keep the footprint small.
- State management: Local React state is sufficient for this scope; no external state library is needed.
- Graceful Fallbacks: The `PlayerCard` component includes logic to handle missing data, such as calculating a fallback "points" value if `operatorSalary` is not provided. It also displays a clear message if no player is selected.

## Common Commands
- Start dev server: `npm run dev`
- Build production: `npm run build`
- Serve production: `npm start`
- Lint: `npm run lint`

## Troubleshooting
- If port 3000 is in use, set `PORT=3001` before `npm run dev`.
- Ensure Node 18.18+ or 20+ is installed. Different Node versions can cause build issues with Next 15 or Tailwind 4.

## License
This project is provided for assessment purposes.
