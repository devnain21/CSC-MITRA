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
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
