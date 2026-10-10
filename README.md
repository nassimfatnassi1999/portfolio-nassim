# Nassim Fatnassi Hnifi — Infrastructure Portfolio

A bilingual EN/FR portfolio for a Cloud & DevOps Engineer and Systems & Infrastructure Administrator. The interface uses a restrained “Production Operations Console” visual system and presents one unified profile across systems, virtualization, cloud, DevOps, middleware, networking and observability.

## Features

- One recruiter-readable identity with no role or content filtering
- Five-role professional timeline and sixteen infrastructure-first project case studies
- Technically separated infrastructure capability landscape and interactive production toolbox
- Complete English and French content
- Persistent dark/light theme and language preference
- Keyboard-operable navigation and toolbox tabs
- Reduced-motion and no-`IntersectionObserver` fallbacks
- Six localized résumé links plus canonical contact, credential and project links
- Factual SEO metadata and Person structured data

## Development

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

The local development server defaults to `http://localhost:5173`.

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The production build is written to `dist/`. Preview it locally with `npm run preview`.

## Content and UI map

- `src/data/portfolio.ts` — typed bilingual source for identity, navigation, expertise, technologies, experience, projects, credentials, education, contact and résumé URLs
- `src/types/portfolio.ts` — source and localized portfolio contracts
- `src/App.tsx` — global language/theme state and approved section order
- `src/components/` — presentation and interaction modules
- `src/components/ui/` — shared console-style primitives
- `src/index.css` and `tailwind.config.js` — design tokens, shared surfaces, focus and motion behavior
- `src/data/portfolio.test.ts` — content inventory, ordering and locale-parity checks
- `src/components/portfolio-render.test.tsx` — rendered structure, accessibility and preservation checks

Update visitor-facing copy in both locales in `src/data/portfolio.ts`. Keep record IDs stable, preserve infrastructure-first project ordering and add any new technologies to one appropriate toolbox domain.

## Deployment

This is a static Vite application. Deploy the generated `dist/` directory to a static host such as Netlify, Vercel, GitHub Pages or object storage. Deployment is intentionally separate from repository build and verification.
