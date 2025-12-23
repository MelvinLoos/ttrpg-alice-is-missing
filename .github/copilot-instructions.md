<!-- Copilot instructions for contributors and AI agents -->
# Repo assistant guide

This file gives targeted, actionable guidance for AI coding agents working on this repo.

## Big picture
- Single-page, client-side Vue 3 app mostly implemented inline in [index.html](index.html). The app is served as a static site using `vite` for local dev and build.
- Auth & realtime backend: Supabase. Client usage is injected into the browser bundle (see placeholders in [index.html](index.html#L300-L320)). There's also a server-side helper at [utils/supabase.ts](utils/supabase.ts) which expects `process.env.SUPABASE_URL` and `process.env.SUPABASE_KEY`.
- Offline behavior: A service worker at [sw.js](sw.js) caches core assets but intentionally lets `supabase.co` requests bypass the cache.

## How to run / build (discovered from `package.json`)
- Install deps: `npm install`
- Start dev server: `npm run dev` (Vite)
- Build static site: `npm run build`
- Preview production build: `npm run preview`

## Key patterns & conventions
- Single-file app: Most application logic, UI and state are in [index.html](index.html) (Vue is loaded from CDN). Expect view states like `setup`, `lobby`, and `game` to be controlled by top-level Vue reactive state.
- API keys injection: `index.html` uses placeholder strings (`__SUPABASE_URL__`, `__SUPABASE_KEY__`) that are replaced by the deployment workflow. Do not hardcode secrets into `index.html` — follow the placeholder pattern.
- Service worker: `sw.js` caches static CDN dependencies and local assets; do not change caching logic without ensuring `supabase.co` requests remain network-first.
- Styling: Tailwind is loaded from CDN in [index.html](index.html#L20-L30); UI classes are applied directly in templates.
- Client vs server supabase usage: Client-side code creates a Supabase client with the injected placeholders. The file [utils/supabase.ts](utils/supabase.ts) is a server-focused client that reads env vars — use it from server-side code only.

## Editing guidance for AI agents
- When adding features, prefer adding small, focused edits to [index.html](index.html) rather than creating many new JS files — current app is intentionally inline.
- If introducing new build-time replacements, update the deployment workflow that injects `__SUPABASE_*__` placeholders (deployment workflow not present in repo; search CI to locate it before changing injection names).
- Avoid caching Supabase API calls in `sw.js`. If you must adjust the service worker, keep the `if (e.request.url.includes('supabase.co')) return;` exemption.

## Branching & Pull Requests
- Always start a new git branch for feature work (recommended prefix: `feature/`), e.g. `feature/room-presence` or `feature/ui-tweaks`.
- Open a GitHub pull request targeting `main` (or the repo's primary branch) when the feature is complete.
- PR should include: a short summary, a list of changed files/areas, local verification steps (how to run the app and test the change), and link to any related issue.
- Use clear commit messages (imperative tense) and squash or clean up WIP commits before merging.
- If changes touch deployment placeholders (`__SUPABASE_*__`) or service-worker caching, mention this explicitly in the PR description.

## Files to inspect when troubleshooting
- Application UI & logic: [index.html](index.html)
- Service worker / offline: [sw.js](sw.js)
- Environment-based supabase client: [utils/supabase.ts](utils/supabase.ts)
- Build config and scripts: [package.json](package.json)

## Example edits (concrete snippets)
- To run locally and test UI changes:
```
npm install
npm run dev
open http://localhost:5173
```
- To preserve deployment behavior, keep the `INJECTED_URL` / `INJECTED_KEY` replacement pattern in any templating you add.

---
If any section is unclear or you'd like me to expand examples (CI injection, local dev secrets, or adding tests), tell me which area to expand and I will iterate.
