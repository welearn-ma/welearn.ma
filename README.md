# WeLearn — Construction EdTech Platform

WeLearn is an EdTech platform focused on the construction sector, recognized as a Jeune Entreprise Innovante® in France (Passeport Talent-2013) and in Morocco (ADD-2020). We develop competency ecosystems for individuals, organizations, and professional associations through Masters, certificates, and white-label academies delivered in e-learning and in-person formats. Core domains include materials, energy efficiency, BIM, project management, and real estate.

## Tech stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4 with design primitives in `components/ui`
- Radix UI for accessible foundations; lucide-react for icons
- Deployed on Vercel; package scripts use `pnpm` (or `bun` if preferred locally)

## Architecture

- Component-based pages: each route in `app/` composes small, single-purpose sections.
- Shared UI lives in `components/` and `components/ui`; utilities in `lib/`.
- Content and data stay centralized (configs per route when reused).
- Before adding or refactoring, read `docs/implementation-guide.md` (working agreement for component slicing, performance, and accessibility).

## Project structure (high level)

- `app/` — route groups and pages for marketing and program tracks
- `components/` — shared sections (hero, grids, CTA), `components/ui/` primitives
- `lib/` — helpers like `cn`
- `public/images` — static assets for programs, partners, and events
- `styles/` — global styles
- `docs/` — working guide for contributors

## Development

1. Install dependencies: `pnpm install` (or `bun install`).
2. Run locally: `pnpm dev` then open `http://localhost:3000`.
3. Lint before pushing: `pnpm lint`.
4. Production build: `pnpm build` and preview with `pnpm start`.

## Deployment

- Default target: Vercel (runs `pnpm install`, `pnpm build`, `pnpm start`).
- For static-friendly pages, prefer static generation; set `revalidate` explicitly when data changes.

## Maintainer

- Primary developer: @wa1ead
