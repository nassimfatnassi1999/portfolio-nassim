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
- **Ops Lab**: a guided terminal game for visitors (Linux, Docker, Kubernetes and systemd missions) with a live infrastructure view
- **Two visual styles**: the default *Console* style and a *SysAdmin TTY* style (green phosphor console in dark mode, printed ops log in light mode)

## Ops Lab (guided game)

Section `#lab` lets visitors "run production for five minutes". They type real-looking commands into a simulated terminal and watch a live panel react (pods, containers, disk, services). Nothing leaves the browser.

| # | Mission | What the player does |
|---|---------|----------------------|
| 1 | First login | `whoami`, `ls`, `cat mission.txt` |
| 2 | Ship a container | `docker ps`, `docker run -d --name web -p 8080:80 nginx`, `curl localhost:8080` |
| 3 | Pod on fire | find a `CrashLoopBackOff` pod, read its logs, `kubectl apply` the fixed ConfigMap, roll out, verify |
| 4 | Traffic spike | `kubectl scale deployment/web --replicas=5` and watch pods spread across workers |
| 5 | Server down | `systemctl status nginx`, `df -h`, `du -sh /var/log/*`, truncate the runaway log, restart nginx, `curl -I localhost` |

Guidance: an objectives checklist, `hint` (costs 30 points, with a "Type it for me" shortcut), quick-command buttons for mobile, Tab completion, ↑/↓ history, typo suggestions and realistic error messages. Each objective is worth 100 points; the final screen shows a score, a rank and links to contact Nassim or open the résumé. Progress is saved in `localStorage` at mission boundaries.

Extra commands for curious visitors: `neofetch`, `contact`, `cv`, `helm list`, `terraform plan`, `git log`, `missions`, `history`, plus a few easter eggs.

- `src/game/engine.ts` — command parser and simulated Linux/Docker/Kubernetes/systemd behaviour (pure functions, no React)
- `src/game/missions.ts` — mission content (EN/FR), starting worlds and win conditions
- `src/game/world.ts` — world helpers (disk usage, pod names, kubectl resource aliases)
- `src/components/lab/OpsLab.tsx` — section UI: mission panel, terminal, quick commands
- `src/components/lab/LabLiveView.tsx` — live view of the simulated infrastructure

To add a mission, append an object to `missions` with a `setup()` world and ordered `objectives` (each has a `hint` command and a `done(ctx)` check), then add a playthrough case in `src/game/engine.test.ts`.

## Visual styles

The **TTY / GUI** button in the navigation switches style; the choice is stored in `localStorage` (`ui-style`) and applied before first paint by a small script in `index.html`, together with the dark/light theme.

- Brand colours are CSS variables (`--brand-50` … `--brand-950` in `src/index.css`), consumed by Tailwind's `brand` palette, so a style can swap them.
- `src/styles/sysadmin.css` holds the SysAdmin TTY overrides (monospace type, phosphor palette, square corners, `$`/`#` heading prefixes, CRT scanlines in dark mode, paper tones in light mode).

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
- `src/game/engine.test.ts` — full game playthrough, parser, hints, completion and edge cases
- `src/components/lab/ops-lab-interactions.test.tsx` — typing commands in the rendered terminal
- `src/components/portfolio-render.test.tsx` — rendered structure, accessibility and preservation checks

Update visitor-facing copy in both locales in `src/data/portfolio.ts`. Keep record IDs stable, preserve infrastructure-first project ordering and add any new technologies to one appropriate toolbox domain.

## Deployment

This is a static Vite application. Deploy the generated `dist/` directory to a static host such as Netlify, Vercel, GitHub Pages or object storage. Deployment is intentionally separate from repository build and verification.
