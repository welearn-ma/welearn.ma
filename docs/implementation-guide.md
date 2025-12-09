# WeLearn Frontend Working Guide

Read and respect this guide before each new prompt or implementation. The goal is to avoid duplicate logic, keep components lean, and protect performance for the WeLearn EdTech experience.

## Core principles

- Prefer server components; add `"use client"` only when you need browser-only APIs, local state, or imperative refs.
- Pages orchestrate; they should compose section components and pass data, not hold layout or business logic.
- Reuse before creating: check `components/ui`, shared blocks (e.g., `components/home/*`), and existing patterns prior to adding anything new.
- Keep everything typed; avoid `any`. Co-locate lightweight types with the component or extract shared shapes to `lib/types.ts`.
- Keep copies and datasets in a single place; if reused, extract to a small config file (e.g., `app/<route>/content.ts` or `lib/content/<domain>.ts`).

## Page and component slicing

- Structure pages as: `page.tsx` (orchestrator) -> section components (domain folder) -> primitives (`components/ui`).
- Name files in kebab-case; name components in PascalCase; keep one main export per file.
- Keep section components focused on one concern (e.g., hero, stats, CTA, timeline). If a component exceeds ~120 lines or mixes concerns, split it.
- Accept data via props; make components pure and render-only whenever possible.
- Avoid copy/pasting similar sections; extract shared layouts (cards, grids, timelines) into reusable building blocks.

## Styling and theming

- Use Tailwind utilities; prefer the `cn` helper from `lib/utils` for conditional classes.
- Keep spacing and typography consistent by reusing existing class patterns; avoid ad-hoc magic numbers.
- For repeated style patterns, create small utility components (badges, chips, section shells) instead of duplicating class strings.

## Data and fetching

- Default to static generation. If data may change, set an explicit `export const revalidate = <seconds>`; avoid `force-dynamic` unless required.
- Perform data fetching in server components; pass plain data to client children.
- Guard against undefined data; use narrow, typed props and sensible defaults instead of optional chaining everywhere.

## Assets and media

- Use `next/image` with static imports from `public/images`; always set `alt` text.
- Optimize image dimensions to what the layout needs; avoid loading oversized assets.
- For icons, prefer `lucide-react` or existing icon components; do not add random SVG duplicates.

## Interaction and state (clients only)

- Keep client components small and localized. Lift state only when multiple siblings truly need it.
- Avoid unnecessary `useEffect`; derive values from props or memoized computations first.
- When adding form logic, rely on `react-hook-form` and `zod` resolvers already in the stack.

## Accessibility and semantics

- Preserve heading hierarchy (H1 per page, then H2/H3 in order).
- Provide labels for form fields, `aria-*` for interactive controls, and focus styles that meet contrast.
- Do not hide essential content behind hover-only interactions.

## Performance hygiene

- Minimize client bundles: keep heavy logic server-side, tree-shake unused imports, and avoid inline large JSON blobs.
- Prefer composition over prop drilling for large data objects; pass only what a component needs.
- Defer non-critical UI (carousels, charts) with dynamic import if it measurably helps bundle size.

## Workflow expectations

- Before coding: list the sections you need, then map each to an existing or new reusable component.
- After coding: run `pnpm lint`. Keep diffs small and focused; rename/move files rather than duplicating them.
- When you introduce a new pattern or shared component, add a short note to this guide so future work stays consistent.
