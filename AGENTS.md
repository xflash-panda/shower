# Repository Guidelines

## Project Structure & Module Organization
Shower is a Vite + React + TypeScript SPA. Feature flows live in `src/pages`, shared UI in `src/components`, layouts in `src/layout`. Config, routing, and providers sit in `src/config`, `src/routes`, `src/providers`. API clients and axios interceptors live in `src/api` and `src/interceptors`; cross-cutting helpers and hooks belong in `src/helpers` and `src/hooks`. Locales reside in `src/locales`, styles in `src/scss` plus `src/index.css`, and static assets in `public/` (published to `dist/`).

## Build, Test, and Development Commands
Install dependencies with Yarn (`npx only-allow` enforces it). `yarn dev` starts Vite on http://localhost:5173. `yarn check:type` runs strict TypeScript, `yarn build` bundles into `dist/`, and `yarn preview` serves the compiled assets. Run `yarn lint` / `yarn lint:fix` for ESLint and `yarn check:format` or `yarn format` for Prettier.

## Coding Style & Naming Conventions
Use TypeScript function components and hooks. Always import via configured aliases (`@/`, `@components/…`) instead of long relative paths. Prettier (tab width 2) and ESLint guard formatting—run them before pushing. Name components and pages in PascalCase (`src/components/Dashboard/`), hooks in camelCase (`useDownloadApp`), and utilities in lowercase files (`helpers/crypto.ts`). Keep SCSS partials in `src/scss`, rely on className overrides (no inline `style`), and mirror URL segments in route folders.

## Testing Guidelines
Automated tests are not yet wired into scripts; record manual QA (browsers, viewport, auth states) in PRs. If you add regression tests, colocate `*.test.tsx` near the code and plan to execute them under a future `vitest` script. Manually verify async flows, locale toggles, and theme switches in `yarn preview` builds.

## Commit & Pull Request Guidelines
History mixes Conventional Commit prefixes with imperative sentences; default to the prefixed style (`fix: align login download button`). Keep commits focused, include locale tweaks, and reference tickets. PRs must provide a crisp summary, desktop/mobile screenshots for UI changes, manual checklists, and call out config or interceptor edits. Request review from the owner of the touched module and wait for lint/type checks before merging.

## Localization & UI Text
All user-facing text must use `t()` from `react-i18next`; never hardcode strings. Keep shared copy in `src/locales/{lang}/common.json` and page-specific namespaces matching the page folder name. Log, error, and analytics messages stay in English.

## Security & Configuration Tips
Never commit secrets—use untracked `.env.local` files. Preserve auth, error, and toast behavior when editing interceptors in `src/interceptors`. Sanitize markdown piped through `rehype-raw`, and treat `src/config` as the canonical source for feature flags and API endpoints.
