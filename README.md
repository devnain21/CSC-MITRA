# Nain Photostate Next.js Migration

This project has been migrated from Vite + React Router + Electron to Next.js App Router with Tailwind CSS support.

## What changed

- Vite and Electron desktop packaging removed.
- Next.js app router added under `app/`.
- Tailwind CSS configured with PostCSS.
- Existing UI preserved through legacy CSS imports in `app/globals.css` via `src/index.css`.
- React Router links and navigation converted to Next.js routing.
- Firebase pages updated to work in Next.js client components.

## Scripts

```bash
npm run dev
npm run build
npm run build:github-pages
npm run start
npm run lint
```

## Project structure

```text
app/                  Next.js routes and root layout
src/components/       Shared UI and app shell
src/views/            Migrated page views
src/Styles/           Existing global CSS styles
public/               Static files, forms, images, favicon
```

## Tailwind setup

Tailwind is ready to use in the project.

- Config: `tailwind.config.mjs`
- PostCSS: `postcss.config.mjs`
- Global entry: `app/globals.css`

You can now move legacy styles page-by-page into Tailwind utilities or component-level styling without changing routing again.

## Firebase environment variables

The app supports `NEXT_PUBLIC_*` Firebase variables. Existing values are still used as fallback defaults.

Copy `.env.example` to `.env.local` if you want to manage Firebase config through environment variables.

## Notes

- `npm run build` is passing.
- Next.js shows one non-blocking ESLint warning because the project is still using a custom flat ESLint config instead of the official Next ESLint preset.
- Old Electron output folder and service worker were removed as part of cleanup.

## GitHub Pages test repo

If `https://devnain21.github.io/CSC/` is showing this README instead of the website, that means the repository source code was uploaded, not the exported site build.

For GitHub Pages, use the exported static output instead of the source files:

```bash
npm install
npm run build:github-pages
```

After that, upload the contents of the generated `out/` folder to the GitHub Pages repository root or to the branch/folder configured in GitHub Pages settings.

Important for GitHub Pages:

- `NEXT_PUBLIC_SITE_URL` should be `https://devnain21.github.io/CSC`
- `NEXT_PUBLIC_BASE_PATH` should be `/CSC`
- `.nojekyll` is included so the `_next/` folder is served correctly

If you want a normal full Next.js deployment without static export limits, use Vercel or Netlify instead of GitHub Pages.
