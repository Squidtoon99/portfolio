# AGENTS.md

## Cursor Cloud specific instructions

This is a static [Next.js](https://nextjs.org/) 15 (App Router) portfolio site. It has no backend, database, or environment variables required to run.

### Services

There is a single service: the Next.js web app.

- Package manager: `npm` (a `package-lock.json` is committed). Dependencies are installed by the startup update script (`npm ci`).
- Dev server: `npm run dev` — serves on `http://localhost:3000`.
- Lint: `npm run lint` (there is one pre-existing `react-hooks/exhaustive-deps` warning in `components/nav.tsx`).
- Build: `npm run build` (production build; static export of all routes).
- Production preview: `npm start` (requires a prior `npm run build`).

### Notes

- There is no automated test suite in this repo.
- Routes are fully static/prerendered; the build emits a harmless `metadataBase not set` warning.
