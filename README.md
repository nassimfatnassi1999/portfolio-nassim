# Portfolio (React + Vite + Tailwind)

A bilingual (EN/FR) portfolio built with Vite, React, TypeScript, and Tailwind CSS. It ships with light/dark mode, smooth in-page navigation, animated sections, and prefilled content you can swap with your own profile, skills, and projects.

## Features
- React 18 + TypeScript, Vite dev server and build pipeline
- Tailwind CSS with custom utility classes for cards, gradients, timeline, and terminal styling
- Dark/light theme persisted in `localStorage`
- Language toggle (English/French) with centralized copy
- Smooth scrolling navigation and animated section reveal
- Reusable section wrappers and data-driven rendering for skills, experience, projects, and certifications

## Getting Started
1) Install Node.js 18+.
2) Install dependencies:
```bash
npm install
```
3) Run the dev server (default http://localhost:5173):
```bash
npm run dev
```
4) Build for production:
```bash
npm run build
```
5) Preview the production build locally:
```bash
npm run preview
```
6) Optional checks:
```bash
npm run lint      # ESLint
npm run typecheck # TypeScript no-emit check
```

## Where to Edit Your Info
- Global copy (all sections): [src/translations.ts](src/translations.ts) — update text in `en` and `fr`. Adding a new language requires adding a new key plus updating the `Language` union and initial state in [src/App.tsx](src/App.tsx).
- Hero name and terminal text: [src/components/Hero.tsx](src/components/Hero.tsx).
- Profile card, social links, phone, location, and mailto: [src/components/About.tsx](src/components/About.tsx) and [src/components/Contact.tsx](src/components/Contact.tsx).
- CV download links: `cvLinks` map in [src/App.tsx](src/App.tsx).
- Skills categories and items: `skillCategories` array in [src/App.tsx](src/App.tsx).
- Experience tags: `experienceTags` array in [src/App.tsx](src/App.tsx); experience text comes from [src/translations.ts](src/translations.ts).
- Projects tags/icons/gradients: `projectMeta` array in [src/App.tsx](src/App.tsx); project text in [src/translations.ts](src/translations.ts).
- Certifications: text in [src/translations.ts](src/translations.ts); shared icon is set in [src/App.tsx](src/App.tsx).
- Education entries: [src/translations.ts](src/translations.ts).
- Footer year and credit text: [src/components/Footer.tsx](src/components/Footer.tsx) (year renders dynamically).
- Portrait/photo: replace `public/photo-cv.png` with your own image using the same filename.

## Content Model (quick map)
- Sections are rendered in [src/App.tsx](src/App.tsx) via components in `src/components/`.
- Per-section translations live in [src/translations.ts](src/translations.ts) and are injected through props.
- Animations and intersection reveal are handled by [src/components/Section.tsx](src/components/Section.tsx) with a simple `IntersectionObserver` hook.
- Typing effect in the hero uses [src/components/TypingText.tsx](src/components/TypingText.tsx).
- Styling and custom utility classes live in [src/index.css](src/index.css) alongside Tailwind layers.

## Customization Tips
- Add or change a skill/project: edit `skillCategories`, `projectMeta`, or translation arrays, and keep counts aligned (arrays are zipped by index).
- Add a new language: add a new key to the `translations` object, extend the `Language` union in [src/translations.ts](src/translations.ts) and update the `useState<'en' | 'fr'>` in [src/App.tsx](src/App.tsx) to include your code (e.g., `'es'`).
- Update resume downloads: swap the Google Drive (or other) URLs in `cvLinks`.
- Swap icons: components use Lucide icons; import a new icon from `lucide-react` and update the JSX where needed.
- The NavBar buttons scroll to section IDs (`home`, `about`, `skills`, etc.). Match IDs if you add or rename sections.

## Deployment
- Static export: `npm run build` outputs to `dist/`. Deploy that folder to any static host (Vercel, Netlify, GitHub Pages, S3, etc.).
- Custom domain/HTTPS: configure at your host; no server code required.

## Troubleshooting
- Empty page or hydration issues: ensure Node 18+ and rerun `npm install` to match lockfile.
- Styles missing: verify Tailwind is processing `src/**/*.tsx` (config is already set in `tailwind.config.js`).
- Language toggle not switching: confirm the `translations` object has both languages and the keys used by components.

## Project Scripts (npm)
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — serve build locally
- `npm run lint` — ESLint check
- `npm run typecheck` — TypeScript type check

Happy shipping! Replace the seeded content with your details and deploy.
