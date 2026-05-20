# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm i          # install dependencies
npm run dev    # start dev server (Vite)
npm run build  # production build
```

There is no test suite or linter configured.

## Architecture

This is a **Figma Make** export — a React + TypeScript + Vite single-page app originally designed in Figma. The original Figma file is at `https://www.figma.com/design/HuRqgKcBO5azbeJKZTvii4/Point-system-mobile-app`.

### App overview

A children's point-tracking app ("Score Points") where parents assign points for good/bad behaviours and set reward goals. It supports multiple child profiles.

### Key files

- `src/app/App.tsx` — the entire application. All components live in this one file: `App`, `ChildDashboard`, `ActionModal`, `GoalSettingsModal`, `HistoryModal`, `CelebrationModal`, `ChildSelectorModal`, `ModalOverlay`.
- `src/app/hooks/useLocalStorage.ts` — typed `useState` wrapper that syncs to `localStorage`.
- `src/imports/PointSystemMobileApp-2/` — Figma-generated SVG path data used directly in the app via the `svgPaths` import.

### State management

All state is persisted in `localStorage` via `useLocalStorage`. Storage keys follow this pattern:
- Per-child state: `app-<childId>-points`, `app-<childId>-goal`, `app-<childId>-reward-text`, etc. (the default child uses `app-` prefix without an ID segment)
- Shared across all children: `app-good-actions`, `app-bad-actions`, `app-children-list`, `app-active-child`

### Modal system

`ChildDashboard` manages a single `activeModal` state (`"add" | "deduct" | "goal" | "history" | "celebration" | "switch-child" | null`) to control which bottom-sheet modal is open. `AnimatePresence` from `motion/react` handles enter/exit animations.

### Figma asset integration

`vite.config.ts` includes a custom `figmaAssetResolver` plugin that maps `figma:asset/<filename>` imports to `src/assets/`. The `@` alias maps to `src/`.

### Styling

Tailwind CSS v4 (via `@tailwindcss/vite`). Design tokens are defined as CSS custom properties in `src/styles/theme.css` and exposed to Tailwind via `@theme inline`. The app uses `Nunito` font (loaded in `src/styles/fonts.css`) set inline via `fontFamily` style. Most component-level styling uses raw Tailwind classes with hardcoded hex colours matching the Figma design — avoid replacing these with theme tokens unless intentional.

### UI components

`src/app/components/ui/` contains a full shadcn/ui component library (Radix UI primitives + Tailwind). These are available but the main `App.tsx` largely uses custom-styled raw elements instead of them.
