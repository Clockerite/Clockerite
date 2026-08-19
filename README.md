# Clockerite

Phase 1 foundation: Astro + TypeScript + Tailwind CSS v4, design tokens for the
light/blue and dark/purple identities, homepage ported from the original static markup.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:4321`).

## What's here

```
src/
  layouts/BaseLayout.astro   → <head>, theme-init script, header/footer shell
  components/Header.astro    → nav, search button (placeholder), theme toggle
  components/Footer.astro    → footer links, legal links, copyright
  styles/global.css          → design tokens (§10 DESIGN_SYSTEM.md), base styles,
                                reduced-motion handling
  pages/index.astro          → homepage
public/
  favicon.svg                → placeholder, swap for real branding later
```

## Theming

Tokens live in `src/styles/global.css` inside `@theme` (light/blue defaults) and
`[data-theme="dark"]` (dark/purple overrides). Tailwind v4 turns each
`--color-*` variable into utilities automatically (`bg-accent`, `text-primary`,
etc.), so overriding the variable re-themes every utility that uses it — no
duplicate class sets.

The theme button in the header toggles `data-theme` on `<html>` and persists
the choice to `localStorage`. An inline script in `BaseLayout.astro` reads that
preference before paint to avoid a flash of the wrong theme.

## Deliberately not built yet

Per `PROJECT_CONTEXT.md` / `TECHNICAL_CONTEXT.md` Phase 1 scope — no search
overlay, no cinematic entrance, no seasonal effects, no mascot, no portfolio/
blog content system, no auth/commerce. These come in later phases.

## Next steps

1. `npm install && npm run dev` — confirm it runs and looks right
2. Real fonts (currently system font stack; swap `--font-sans` in
   `global.css` once a typeface is chosen per DESIGN_SYSTEM.md §12)
3. Real avatar/profile image
4. `/portfolio/`, `/blog/`, `/projects/`, `/about/`, `/shop/` routes
   (currently linked but not built — Phase 2)
