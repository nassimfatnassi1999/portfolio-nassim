# Unified Infrastructure Portfolio Design Specification

**Date:** 2026-10-09
**Status:** Ready for final review
**Content baseline:** [`2026-10-09-unified-infrastructure-portfolio-content-inventory.md`](./2026-10-09-unified-infrastructure-portfolio-content-inventory.md)

## 1. Objective

Refactor the existing React/Vite portfolio into one cohesive professional presentation for:

> Cloud & DevOps Engineer | Systems & Infrastructure Administrator

Within five seconds, a recruiter should understand that Nassim can design, deploy, administer, automate, monitor and troubleshoot production infrastructure across operating systems, virtualization, cloud platforms, containers, middleware and observability.

This is an in-place redesign. It must preserve the existing React/Vite structure, single-page navigation, responsive behavior, English/French language support, dark/light themes, résumé access, animations that still serve the experience, and all valuable factual content.

## 2. Success Criteria

- The hero communicates the unified identity without a role selection step.
- The portfolio gives primary visual priority to infrastructure, Cloud, DevOps, systems administration and production operations.
- Software engineering remains visible as supporting application-layer breadth.
- All records in the content inventory have an explicit migration disposition.
- English and French contain equivalent sections and factual records.
- The interface remains readable and usable at 1920px, 1440px, 1280px, 13-inch laptop, tablet and mobile widths.
- Dark and light modes are deliberately designed and meet accessible contrast expectations.
- Motion is restrained and respects `prefers-reduced-motion`.
- No unsupported metric, achievement, infrastructure claim, certification or project result is introduced.
- The production build, type check, lint check and content invariant tests pass without console warnings or horizontal overflow.

## 3. Non-Goals

- Rebuilding the site in another framework.
- Adding accounts, a backend, persistence, analytics or external application integrations.
- Adding WebGL, particle libraries, video backgrounds or large animation dependencies.
- Creating a fictional end-to-end production architecture from every listed technology.
- Removing application-development projects or experience.
- Replacing the résumé documents themselves.

## 4. Information Architecture

The navigation and document order are:

1. Home
2. About
3. Expertise
4. Experience
5. Projects
6. Infrastructure
7. Certifications
8. Education
9. Contact

### 4.1 Home

The hero uses a 50/50 text-and-terminal composition on desktop and a stacked composition on mobile.

Required content:

- Nassim Fatnassi Hnifi.
- Two-line unified role title.
- Rotating discipline line: Cloud Infrastructure, Systems Administration, DevOps Automation, Kubernetes, Production Engineering, Monitoring & Observability and Middleware Administration.
- Concise description covering cloud, virtualization, Linux, automation, orchestration, monitoring and troubleshooting.
- Actions: Explore My Projects, View Infrastructure and Contact Me.
- Availability badge for Cloud / DevOps / Systems opportunities.
- Three derived factual summaries: 4 Cloud Platforms, 5 Professional Roles and 16 Documented Projects, with equivalent French labels.

The terminal progresses through `whoami`, a concise `expertise.yaml`, `kubectl get nodes` and `uptime`. Its output is illustrative presentation copy, not a claim that the displayed cluster is a real named production environment. The final line reads `portfolio interface operational ✓`, clearly describing the site presentation rather than a real production system, and does not claim an uptime percentage.

### 4.2 About

Three short paragraphs cover identity, operational scope and preferred engineering problems. The portrait, location, languages and contact channels remain available. Generic passion statements are removed.

### 4.3 Engineering Expertise

Four cards explain responsibilities rather than enumerate tools:

1. Systems & Infrastructure
2. Cloud & Containers
3. DevOps & Automation
4. Production & Observability

Each card answers what Nassim operates or delivers. Technology inventories do not appear here, preventing duplication with Production Toolbox.

### 4.4 Experience

All five experiences appear once in a single timeline. Each record is reorganized into Company, Role, Period, Mission, Environment, Key Contributions and Technologies. Existing bullets may be grouped or lightly edited for clarity, but not strengthened beyond their source meaning.

### 4.5 Projects

All 16 projects remain accessible. Infrastructure-first ordering replaces profile filters. Cards use Problem or Context, Architecture, Role, Technologies and Result or Scope. Result is used only when the source documents an outcome; otherwise the factual delivered scope is shown.

Cards resemble restrained infrastructure modules: thin border, small environment/status label, terminal typography for metadata and standard sans-serif typography for explanations. External links and demo actions remain explicit and keyboard accessible.

### 4.6 Infrastructure

This section contains two complementary modules.

**Infrastructure Capability Landscape** explains relationships among technology domains without pretending they form one mandatory deployment stack:

- Foundations: operating systems, storage and core networking.
- Environments: virtualization and cloud platforms shown as parallel options.
- Runtime and delivery: containers/Kubernetes, middleware/reverse proxies and application workloads.
- Cross-cutting operations: automation/CI/CD and observability/logging span the landscape.

Desktop uses grouped panels and restrained connectors labelled by purpose. Mobile removes complex connectors and presents ordered, labelled groups.

**Production Toolbox** is the compact technology inventory. Category controls update only the toolbox panel. The initial category is Systems. Controls use tabs semantics when the visual pattern is tabs, support keyboard navigation and never hide content elsewhere on the page.

### 4.7 Certifications and Education

Certifications remain visually subordinate to professional evidence. The Aviatrix credential shows provider, expiry year and verification action. Education uses a simple timeline without decorative animation.

### 4.8 Contact

The final CTA reads “Let’s build reliable infrastructure” in English and has an equivalent French translation. It includes email, LinkedIn, GitHub, phone, primary résumé and alternate résumé downloads. The terminal line reports availability without simulating a sent message.

## 5. Visual System

### 5.1 Concept

The “Production Operations Console” aesthetic combines enterprise infrastructure interfaces, terminal precision and monitoring clarity. It must not resemble a game, cyberpunk display or crowded dashboard.

### 5.2 Color tokens

| Role | Dark | Light |
| --- | --- | --- |
| Page | `#070B14` | `#F8FAFC` |
| Surface | `#0B1120` | `#FFFFFF` |
| Elevated surface | `#111827` / `#141D2F` | `#F1F5F9` |
| Border | `#243047` | `#CBD5E1` |
| Primary | `#2DD4BF` | `#0F9F8E` |
| Secondary | `#38BDF8` | `#0284C7` |
| Success | `#22C55E` | `#15803D` |
| Warning | `#F59E0B` | `#B45309` |
| Primary text | `#F8FAFC` | `#0F172A` |
| Muted text | `#94A3B8` | `#475569` |

Red appears only in familiar terminal window controls or true error states.

### 5.3 Typography

- Inter remains the UI, heading and body family.
- JetBrains Mono remains the technical metadata and terminal family.
- Monospace is not used for paragraphs.
- Existing Google Fonts loading is retained; no new font dependency is required.

### 5.4 Surfaces and effects

- 12–16px radii.
- One-pixel borders and controlled elevation.
- Hover/focus may strengthen a cyan or teal border and add a restrained shadow.
- Project cards no longer use large saturated gradient headers.
- The background uses CSS gradients/grid plus a small decorative SVG or CSS-node layer. The current full-screen continuously animated canvas is removed.

### 5.5 Motion

- Hover and focus transitions: 160–240ms.
- Section reveal: opacity plus 8–12px translation.
- Terminal animation: progressive, concise and non-blocking.
- Navbar path: slow crossfade among `~/cloud`, `~/devops`, `~/systems` and `~/production`.
- Reduced-motion mode disables typing, looping path animation, node movement and spatial section reveals while leaving all content visible.

## 6. Module Architecture

### 6.1 Content seam

The content module exposes one primary interface:

```ts
type Locale = 'en' | 'fr';

function getPortfolio(locale: Locale): LocalizedPortfolio;
```

`getPortfolio` returns ordered, already-localized data. Presentation modules do not know about profile IDs, filters, raw bilingual fields or legacy metadata arrays. This creates locality for translation fixes, project order, technology normalization and résumé handling.

The raw source uses `LocalizedText` fields and TypeScript `satisfies` checks. Stable IDs are language-independent. The localized return type contains strings and resolved arrays suitable for rendering.

### 6.2 Planned files

```text
src/
├── data/
│   ├── portfolio.ts
│   └── portfolio.test.ts
├── types/
│   └── portfolio.ts
├── hooks/
│   ├── useActiveSection.ts
│   └── useReducedMotion.ts
├── components/
│   ├── ui/
│   │   ├── Section.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── SurfaceCard.tsx
│   │   ├── TechnologyBadge.tsx
│   │   ├── StatusIndicator.tsx
│   │   └── TerminalWindow.tsx
│   ├── InfrastructureBackdrop.tsx
│   ├── RotatingInfraPath.tsx
│   ├── InfrastructureTerminal.tsx
│   ├── EngineeringExpertise.tsx
│   ├── InfrastructureStack.tsx
│   └── ProductionToolbox.tsx
└── existing section modules, refactored in place
```

Modules are extracted only when they centralize behavior, accessibility or repeated styling. One-use pass-through wrappers are not introduced.

### 6.3 Application state

`App` owns language, theme and mobile-menu state. Language and theme continue to persist in local storage. Stored values are validated; invalid language values fall back to English and invalid theme values fall back to dark.

The profile context, role query parameter, profile transition hook and profile-specific dynamic terminal are deleted after the unified data tests prove content preservation.

## 7. Localization Contract

- Every visitor-facing heading, description, label, experience field and project case-study field exists in EN and FR.
- Stable identifiers, URLs, technology names and company names are shared rather than translated.
- `getPortfolio('en')` and `getPortfolio('fr')` return identical record IDs and counts.
- Tests reject missing or blank translations.
- Language switching updates the full page without changing ordering, selected toolbox domain or navigation position.

## 8. Responsive Behavior

- Site container max width: approximately 1280px with fluid side padding.
- Hero: two columns from the medium/large breakpoint when terminal readability permits; stacked otherwise.
- Navigation: full links on large screens, accessible menu on smaller screens; résumé remains available on mobile.
- Expertise: four columns at wide desktop, two at tablet, one on mobile.
- Experience and projects: scanning order remains chronological/priority order at every width.
- Infrastructure landscape: grouped two-dimensional layout on desktop; linear labelled groups on mobile.
- Terminal and long technology labels wrap without horizontal page scrolling.
- Tap targets are at least 44px where controls are interactive.

## 9. Accessibility

- Semantic landmarks, one `h1`, ordered headings and descriptive link labels.
- Keyboard-operable mobile menu, toolbox controls and all links/buttons.
- Visible focus states in both themes.
- Active navigation uses more than color alone.
- Decorative diagrams/background elements are hidden from assistive technology; meaningful group labels remain text.
- Terminal output is readable as ordinary text and does not continuously announce animated updates.
- Color contrast targets WCAG AA for body text and controls.
- `prefers-reduced-motion` shows final terminal/path states immediately.

## 10. Performance

- Retain React, Vite, Tailwind and Lucide; add no runtime dependency.
- Use CSS transforms and opacity for motion.
- Remove continuous full-screen canvas rendering.
- Keep the existing optimized local portrait.
- Avoid large media, WebGL and video.
- Lazy-load below-the-fold non-critical images if any are added; the portrait remains eager in the hero/about context.
- Keep content computation in-process and deterministic; no network request is needed to render the portfolio.

## 11. SEO and Recruiter Visibility

- Title: `Nassim Fatnassi Hnifi | Cloud, DevOps & Systems Engineer`.
- Description: `Cloud & DevOps Engineer and Systems Administrator specializing in Linux, Kubernetes, VMware, automation, monitoring and production infrastructure.`
- Add approved keywords covering Cloud Engineer, DevOps Engineer, Systems Administrator, Infrastructure Engineer, Linux Administrator, Kubernetes, VMware, Azure, AWS, Terraform, Ansible, Jenkins, Prometheus, Grafana, middleware and production engineering.
- Update Open Graph metadata using existing assets only.
- Add factual Person JSON-LD only if every included field comes from the inventory.

## 12. Error and Fallback Behavior

- Invalid saved locale: fall back to English and overwrite on the next explicit language change.
- Missing optional project link: do not render an unavailable action.
- Missing optional project result: render factual Scope content, never placeholder text.
- Motion unavailable or reduced: render final static content.
- IntersectionObserver unavailable: sections remain visible and navigation still works via anchors.
- JavaScript animation failure must not hide terminal content or navigation labels.

## 13. Migration and Deletion Order

1. Lock the legacy inventory and add content invariant tests.
2. Build the unified typed content module and prove EN/FR parity and record/link preservation.
3. Update `App` and section modules to consume `getPortfolio`.
4. Replace the profile selector with the decorative rotating path.
5. Replace profile-specific terminals with one infrastructure terminal.
6. Apply the design tokens and background.
7. Refactor existing sections and add approved new sections.
8. Verify the unified experience before deleting profile context, filters, terminals and transitions.
9. Run the complete regression matrix and search for legacy identifiers.

This ordering prevents legacy data from being deleted before its replacement is testable.

## 14. Verification and Acceptance

Automated checks:

- Content inventory invariants and EN/FR parity.
- TypeScript type check.
- ESLint.
- Production build.
- Search proving profile IDs, filters, role query handling and transition imports are absent.

Browser checks:

- Navigation, mobile menu and active states.
- EN/FR full-page switching.
- Dark/light persistence.
- Primary and alternate résumé downloads.
- All external links and credential verification.
- Hero and terminal at desktop/mobile widths.
- Toolbox keyboard behavior.
- Reduced-motion behavior.
- No horizontal overflow.
- No console warnings or errors.

The redesign is accepted only when the inventory baseline passes, all nine sections are available without role selection, and legacy profile switching has been fully removed.
