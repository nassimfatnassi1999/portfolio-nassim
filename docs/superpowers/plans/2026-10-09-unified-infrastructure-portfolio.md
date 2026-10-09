# Unified Infrastructure Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing portfolio into one bilingual, accessible and responsive Cloud / DevOps / Systems / Infrastructure presentation without losing factual content or working functionality.

**Architecture:** A typed bilingual content module exposes `getPortfolio(locale)` as the single content seam. Existing React sections are refactored in place around a small shared visual system, while profile selection, filtering and transition machinery are removed only after content-preservation tests pass.

**Tech Stack:** React 18, TypeScript 5.5, Vite 5, Tailwind CSS 3.4, Lucide React, Vitest 2 as a development-only test runner.

**Spec:** `docs/superpowers/specs/2026-10-09-unified-infrastructure-portfolio-design.md`

**Content inventory:** `docs/superpowers/specs/2026-10-09-unified-infrastructure-portfolio-content-inventory.md`

## Global Constraints

- Preserve the existing React/Vite single-page application; do not rebuild it or change frameworks.
- Add no runtime dependency and no animation library; Vitest is the only planned development dependency.
- Preserve exactly 5 experience records, 16 projects, 1 certification, 2 education records, 6 résumé URLs and 4 project/demo URLs from the inventory.
- Every visitor-facing content field must be complete in English and French.
- Use only verified facts from the inventory and approved brief; never invent metrics, achievements, results, certifications or infrastructure details.
- Engineering Expertise explains four domains; Production Toolbox inventories technologies. Do not duplicate long tool lists in Expertise.
- Present virtualization and cloud as parallel environments and automation/observability as cross-cutting capabilities; do not depict one fictional mandatory stack.
- Keep software engineering evidence visible after infrastructure-first experience and project evidence.
- Keep dark/light mode, responsive navigation, mobile menu, active-language persistence, theme persistence, résumé access and working external links.
- Respect `prefers-reduced-motion`, WCAG AA contrast targets, keyboard navigation and a 44px minimum interactive target where applicable.
- Optimize for recruiter scanning, maintainability and performance before decorative effects.

## Review Focus

- **Incomplete locale data:** `getPortfolio('en')` and `getPortfolio('fr')` must expose identical stable IDs/counts and no blank visitor-facing strings; pinned in Task 1 content tests.
- **Content lost during profile removal:** all inventory record and URL counts must remain exact after legacy deletion; pinned in Tasks 1, 2 and 10.
- **Small-screen overflow:** terminal, navigation, landscape and long technology labels must not create horizontal document overflow at 375px; pinned to Task 10 browser regression.
- **Reduced-motion accessibility:** typing, looping path/node motion and spatial reveals must resolve to visible static content; pinned to Tasks 3, 4 and 10.
- **Misleading architecture or claims:** landscape relationships and case-study Result/Scope labels must match the approved source semantics; pinned to Tasks 6, 7 and the Task 10 content review.

---

## Planned File Map

### New source files

- `src/types/portfolio.ts` — shared raw/localized portfolio types and `Locale`.
- `src/data/portfolio.ts` — bilingual source records, ordering and `getPortfolio(locale)` implementation.
- `src/data/portfolio.test.ts` — inventory, locale-parity, uniqueness and link-preservation tests.
- `src/hooks/useActiveSection.ts` — active navigation section observer with a safe fallback.
- `src/hooks/useReducedMotion.ts` — reduced-motion preference hook.
- `src/components/ui/SectionHeader.tsx` — consistent section title/eyebrow/description rendering.
- `src/components/ui/SurfaceCard.tsx` — shared card surface with restrained hover/focus treatment.
- `src/components/ui/TechnologyBadge.tsx` — compact technology/tag label.
- `src/components/ui/StatusIndicator.tsx` — accessible operational status treatment.
- `src/components/ui/TerminalWindow.tsx` — terminal frame shared by Hero and Contact.
- `src/components/InfrastructureBackdrop.tsx` — low-cost grid/glow/node background.
- `src/components/RotatingInfraPath.tsx` — non-interactive animated navbar path.
- `src/components/InfrastructureTerminal.tsx` — unified hero terminal.
- `src/components/EngineeringExpertise.tsx` — four responsibility-focused domain cards.
- `src/components/InfrastructureStack.tsx` — capability landscape.
- `src/components/ProductionToolbox.tsx` — interactive technology-domain inventory.
- `src/components/portfolio-render.test.tsx` — server-rendered structural/copy tests for major sections.

### Existing files to modify

- `package.json`, `package-lock.json` — add Vitest test script/development dependency only.
- `src/App.tsx` — unified orchestration, ordered sections and localized portfolio selection.
- `src/main.tsx` — retain global CSS imports and remove the obsolete transition stylesheet import when its replacement lands.
- `src/translations.ts` — retain only complete bilingual UI labels/microcopy not owned by factual portfolio records.
- `src/index.css`, `tailwind.config.js` — approved tokens, surfaces, motion and reduced-motion behavior.
- `index.html` — SEO, social metadata and factual structured data.
- `src/components/NavBar.tsx` — unified navigation, active state, responsive résumé/language/theme controls.
- `src/components/Hero.tsx` — unified identity, actions, verified facts and infrastructure terminal.
- `src/components/About.tsx` — concise infrastructure-focused biography.
- `src/components/Experience.tsx` — unified case-study timeline.
- `src/components/Projects.tsx` — infrastructure-first case-study cards with all 16 records.
- `src/components/Certifications.tsx` — restrained credential presentation.
- `src/components/Education.tsx` — simple timeline.
- `src/components/Contact.tsx` — infrastructure CTA, canonical contacts and résumé variants.
- `src/components/Footer.tsx` — unified title and corrected canonical links.
- `src/components/Section.tsx` — accessible static fallback and reduced-motion-aware reveal.

### Legacy files to delete after replacement verification

- `src/context/ProfileContext.tsx`
- `src/data/cv-profiles.json`
- `src/hooks/useProfileTransition.ts`
- `src/components/ProfileSelector.tsx`
- `src/components/ProfileTransition.tsx`
- `src/components/DynamicTerminal.tsx`
- `src/components/NightSky.tsx`
- `src/components/Skills.tsx`
- `src/components/terminals/CloudTerminal.tsx`
- `src/components/terminals/SoftwareTerminal.tsx`
- `src/components/terminals/SysAdminTerminal.tsx`
- `src/components/transitions/CloudTransition.tsx`
- `src/components/transitions/SoftwareTransition.tsx`
- `src/components/transitions/SysAdminTransition.tsx`
- `src/styles/transitions.css` after unified terminal/path motion has moved to `index.css`

`src/components/TypingText.tsx`, `TerminalTypewriter.tsx` and `Terminal.tsx` are retained only if the unified terminal uses them without duplicating behavior; otherwise delete them in Task 4 after confirming no imports remain.

---

### Task 1: Lock the Unified Content Contract

**Dependencies:** Approved spec and content inventory only.

**Files:**
- Create: `src/types/portfolio.ts`
- Create: `src/data/portfolio.ts`
- Create: `src/data/portfolio.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: factual content and preservation counts from the inventory.
- Produces: `Locale`, `PortfolioSource`, `LocalizedPortfolio`, `Project`, `Experience`, `TechnologyDomain`, `ResumeSet`, and `getPortfolio(locale: Locale): LocalizedPortfolio`.

- [ ] **Step 1: Add the development-only test runner**

Run `npm install --save-dev vitest@2.1.9`, add `"test": "vitest run"`, and make no runtime dependency changes.

- [ ] **Step 2: Write failing inventory and locale-parity tests**

Create tests named:

```ts
it('preserves every inventoried record and link')
it('keeps English and French record IDs in parity')
it('contains no blank localized visitor copy')
it('keeps stable IDs unique within each collection')
it('orders infrastructure evidence before application-only projects')
it('keeps expertise narratives separate from toolbox technologies')
```

Assert exact counts: 5 experiences, 16 projects, 1 certification, 2 education records, 6 résumé URLs and 4 project/demo URLs. Assert both locales return the same stable IDs in the same order.

- [ ] **Step 3: Run the tests to verify the content module is missing**

Run: `npm test -- src/data/portfolio.test.ts`
Expected: FAIL because `portfolio.ts` and exported types do not exist.

- [ ] **Step 4: Define the content types**

Define these exact interfaces in `src/types/portfolio.ts`:

```ts
export type Locale = 'en' | 'fr';
export type LocalizedText = Record<Locale, string>;
export type ProjectPriority = 'infrastructure' | 'mixed' | 'application';
export type CaseStudyOutcome =
  | { kind: 'result'; text: LocalizedText }
  | { kind: 'scope'; text: LocalizedText };
```

The full types must model identity, navigation, hero, expertise, technology domains, experiences, projects, certifications, education, contact and résumé variants. URLs and stable IDs are language-independent.

- [ ] **Step 5: Implement the bilingual source and localization selector**

Populate `src/data/portfolio.ts` from the inventory and existing translations. Normalize naming variants only in toolbox domains. Preserve the detailed project/experience text and every URL. `getPortfolio` resolves `LocalizedText` recursively into a stable ordered `LocalizedPortfolio` without profile IDs or filters.

- [ ] **Step 6: Run content tests, typecheck and lint**

Run:

```bash
npm test -- src/data/portfolio.test.ts
npm run typecheck
npm run lint
```

Expected: all commands exit 0.

- [ ] **Step 7: Review bilingual copy against the inventory**

Compare every record ID, title, company/provider/school, period, technology list and URL with the inventory. Correct source inconsistencies without adding claims.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/types/portfolio.ts src/data/portfolio.ts src/data/portfolio.test.ts
git commit -m "refactor: add unified bilingual portfolio data"
```

**Acceptance criteria:** The content tests prove the complete preservation baseline before any legacy file is removed.

---

### Task 2: Replace Profile State with Unified Application State

**Dependencies:** Task 1 `getPortfolio(locale)` interface.

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/translations.ts`
- Modify: `src/components/NavBar.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/components/DynamicTerminal.tsx`
- Modify: `src/components/About.tsx`
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Footer.tsx`
- Create: `src/components/portfolio-render.test.tsx`
- Delete after verification: `src/context/ProfileContext.tsx`
- Delete after verification: `src/data/cv-profiles.json`
- Delete after verification: `src/hooks/useProfileTransition.ts`
- Delete after verification: `src/components/ProfileTransition.tsx`
- Delete after verification: `src/components/transitions/CloudTransition.tsx`
- Delete after verification: `src/components/transitions/SoftwareTransition.tsx`
- Delete after verification: `src/components/transitions/SysAdminTransition.tsx`
- Modify or delete: `src/styles/transitions.css`

**Interfaces:**
- Consumes: `getPortfolio(language)` from Task 1.
- Produces: App-owned `language`, `dark`, `menuOpen`, `portfolio`, `scrollTo(id)` and the fixed nine-section render order.

- [ ] **Step 1: Write a failing server-render test for unified identity**

Use `renderToStaticMarkup` and assert that the rendered app includes the unified name/title and contains none of `~cloud`, `~dev`, `~sys`, a role-selector listbox, or Cloud/Software/System Admin profile controls.

- [ ] **Step 2: Run the test and verify it fails against the profile-driven app**

Run: `npm test -- src/components/portfolio-render.test.tsx`
Expected: FAIL on unified title or legacy selector assertions.

- [ ] **Step 3: Refactor `App` to select one localized portfolio**

Validate saved language as `en` or `fr`; default to `en`. Validate saved theme as `dark` or `light`; default to dark. Call `getPortfolio(language)` once per render. Define nav IDs exactly as:

```ts
['home', 'about', 'expertise', 'experience', 'projects', 'infrastructure', 'certifications', 'education', 'contact']
```

Pass localized records into every current section. Later tasks change their presentation, but this task must make their data flow independent of profile context.

- [ ] **Step 4: Convert current sections to unified props without redesigning them yet**

Remove `useProfile` from NavBar, Hero, About, Skills, Experience, Projects, Contact and Footer. Experience renders all five records and Projects renders all 16 in unified priority order. Replace the navbar selector with a temporary non-interactive `~/infra` label and make `DynamicTerminal` render one fixed infrastructure-oriented terminal until Task 4 replaces both modules. Keep this step presentation-neutral so Tasks 4–8 own the approved redesign.

- [ ] **Step 5: Remove profile runtime behavior and dead translation branches**

Remove the provider, `?role=` handling, `portfolio-profile` storage, filters, transition overlay and profile theme variables. Preserve factual copy in `portfolio.ts` before deleting the JSON/context files.

- [ ] **Step 6: Prove legacy data is no longer required**

Run:

```bash
rg -n "ProfileProvider|useProfile|currentProfileId|setProfile|experienceFilter|projectFilter|portfolio-profile|[?&]role=" src
npm test -- src/data/portfolio.test.ts
npm run typecheck
```

Expected: `rg` returns no product-source matches, content tests pass, and typecheck identifies no lost data imports.

- [ ] **Step 7: Delete verified-obsolete profile state files and run the build**

Run: `npm run build`
Expected: Vite production build exits 0.

- [ ] **Step 8: Commit**

```bash
git add -A src/App.tsx src/translations.ts src/context src/data/cv-profiles.json src/hooks/useProfileTransition.ts src/components src/styles/transitions.css
git commit -m "refactor: remove profile filtering architecture"
```

**Acceptance criteria:** The app has one content path; language and theme still work; no experience/project is hidden by profile state.

---

### Task 3: Establish the Production Operations Console Foundation

**Dependencies:** Task 2 unified App state.

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `src/components/Section.tsx`
- Create: `src/hooks/useReducedMotion.ts`
- Create: `src/components/ui/SectionHeader.tsx`
- Create: `src/components/ui/SurfaceCard.tsx`
- Create: `src/components/ui/TechnologyBadge.tsx`
- Create: `src/components/ui/StatusIndicator.tsx`
- Create: `src/components/ui/TerminalWindow.tsx`
- Create: `src/components/InfrastructureBackdrop.tsx`
- Delete: `src/components/NightSky.tsx`

**Interfaces:**
- Consumes: theme state through the document `dark` class.
- Produces: reusable visual modules and `useReducedMotion(): boolean` used by later tasks.

- [ ] **Step 1: Add failing structural tests for shared visual modules**

Server-render representative modules and assert semantic elements, visible text and non-empty class names for dark/light-compatible surfaces. Add a pure hook helper test for the reduced-motion fallback value.

- [ ] **Step 2: Run targeted tests and verify missing-module failures**

Run: `npm test -- src/components/portfolio-render.test.tsx`
Expected: FAIL because the new shared modules do not exist.

- [ ] **Step 3: Replace color and typography tokens**

Implement the exact dark/light palette from the spec, keep Inter and JetBrains Mono, and replace red/orange brand gradients with teal/cyan infrastructure accents. Preserve Tailwind class compatibility while migrating callers incrementally.

- [ ] **Step 4: Implement shared visual modules**

Keep each interface small: children plus semantic variants only. `SurfaceCard` owns shared border/elevation behavior; `TerminalWindow` owns frame/header semantics; `SectionHeader` owns heading hierarchy styling.

- [ ] **Step 5: Replace the animated star canvas**

Implement `InfrastructureBackdrop` with CSS gradients/grid and a sparse decorative node layer. It must be `aria-hidden`, pointer-events none, and perform no continuous canvas drawing.

- [ ] **Step 6: Make section reveals safe**

If reduced motion is requested or IntersectionObserver is unavailable, content renders visible without translation. Otherwise preserve one-time subtle reveal behavior.

- [ ] **Step 7: Run tests and production checks**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all exit 0.

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.js src/index.css src/components/Section.tsx src/hooks/useReducedMotion.ts src/components/ui src/components/InfrastructureBackdrop.tsx src/components/NightSky.tsx
git commit -m "feat: establish infrastructure design system"
```

**Acceptance criteria:** Both themes use the approved tokens, content never depends on animation to appear, and the continuously animated canvas is gone.

---

### Task 4: Build Unified Navigation, Hero and Terminal

**Dependencies:** Tasks 1–3 content and shared visual modules.

**Files:**
- Create: `src/hooks/useActiveSection.ts`
- Create: `src/components/RotatingInfraPath.tsx`
- Create: `src/components/InfrastructureTerminal.tsx`
- Modify: `src/components/NavBar.tsx`
- Modify: `src/components/Hero.tsx`
- Delete: `src/components/ProfileSelector.tsx`
- Delete: `src/components/DynamicTerminal.tsx`
- Delete: `src/components/terminals/CloudTerminal.tsx`
- Delete: `src/components/terminals/SoftwareTerminal.tsx`
- Delete: `src/components/terminals/SysAdminTerminal.tsx`
- Modify or delete after import audit: `src/components/TypingText.tsx`
- Modify or delete after import audit: `src/components/TerminalTypewriter.tsx`
- Modify or delete after import audit: `src/components/Terminal.tsx`
- Modify: `src/main.tsx`
- Delete after replacement: `src/styles/transitions.css`
- Modify: `src/components/portfolio-render.test.tsx`

**Interfaces:**
- Consumes: localized identity, navigation, hero, facts and primary résumé; `TerminalWindow`; `useReducedMotion`.
- Produces: sticky active navigation, decorative path rotation and unified hero/terminal.

- [ ] **Step 1: Write failing hero/navigation markup tests**

Assert the unified role, three hero actions, seven rotating discipline strings, four navbar path values, nine navigation targets, the three exact verified facts, primary résumé URL for each locale, terminal commands `whoami`, `cat expertise.yaml`, `kubectl get nodes` and `uptime`, and the final `portfolio interface operational ✓` line.

- [ ] **Step 2: Run targeted tests to verify failure**

Run: `npm test -- src/components/portfolio-render.test.tsx`
Expected: FAIL against old navigation/hero/profile terminal.

- [ ] **Step 3: Implement active-section observation**

Expose:

```ts
export function useActiveSection(sectionIds: readonly string[]): string;
```

Observe sections with a header-aware root margin. Fall back to `home` when IntersectionObserver is unavailable.

- [ ] **Step 4: Replace selector with decorative path**

`RotatingInfraPath` renders `~/cloud`, `~/devops`, `~/systems`, `~/production` in that order. It has no button/listbox role and no click behavior. Reduced motion renders `~/infra` statically.

- [ ] **Step 5: Refactor navbar**

Keep portrait and `~/nassim`, sticky blur/border, theme/language controls and mobile menu. Add active-state text plus a small indicator. Ensure Resume is reachable on desktop and mobile.

- [ ] **Step 6: Implement unified Hero and terminal**

Use the approved title, concise description, actions and exactly three data-derived facts: 4 Cloud Platforms, 5 Professional Roles and 16 Documented Projects. Terminal output is short enough to fit at 375px, ends with `portfolio interface operational ✓`, and is rendered immediately when reduced motion is enabled.

- [ ] **Step 7: Remove replaced profile terminal files and transition styles, then audit imports**

Move any retained unified terminal/path keyframes into `src/index.css`, remove the `transitions.css` import from `src/main.tsx`, and delete the legacy stylesheet. Run: `rg -n "ProfileSelector|DynamicTerminal|CloudTerminal|SoftwareTerminal|SysAdminTerminal|currentProfileId|transitions.css" src`
Expected: no matches.

- [ ] **Step 8: Verify and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add -A src/components src/hooks/useActiveSection.ts src/main.tsx src/index.css src/styles/transitions.css
git commit -m "feat: unify navigation hero and terminal"
```

**Acceptance criteria:** The full identity is visible immediately, the path is decorative only, and no role control or profile terminal remains.

---

### Task 5: Refactor About and Engineering Expertise

**Dependencies:** Localized portfolio and shared visual modules.

**Files:**
- Modify: `src/components/About.tsx`
- Create: `src/components/EngineeringExpertise.tsx`
- Modify: `src/components/portfolio-render.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: localized `about` and four `expertise` records.
- Produces: recruiter-readable About and exactly four responsibility-focused expertise cards.

- [ ] **Step 1: Write failing section tests**

Assert three About paragraphs, the canonical contact links, exactly four expertise IDs, and absence of exhaustive technology badge lists inside Expertise.

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- src/components/portfolio-render.test.tsx`.

- [ ] **Step 3: Refactor About**

Preserve portrait, location, languages and contacts. Replace profile-dependent copy with three localized paragraphs about identity, operational scope and problem-solving interests.

- [ ] **Step 4: Implement Engineering Expertise**

Render Systems & Infrastructure, Cloud & Containers, DevOps & Automation, and Production & Observability using responsibility statements and a restrained icon. Do not render the Production Toolbox technology arrays here.

- [ ] **Step 5: Add the section to App and verify heading/navigation order**

Insert `expertise` between About and Experience.

- [ ] **Step 6: Run checks and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add src/App.tsx src/components/About.tsx src/components/EngineeringExpertise.tsx src/components/portfolio-render.test.tsx
git commit -m "feat: add unified engineering expertise"
```

**Acceptance criteria:** The sections complement each other and do not duplicate long technology lists.

---

### Task 6: Convert Experience and Projects to Scan-Friendly Case Studies

**Dependencies:** Task 1 normalized records and Task 3 UI modules.

**Files:**
- Modify: `src/components/Experience.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/portfolio-render.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: ordered localized `experiences` and `projects` from `LocalizedPortfolio`.
- Produces: one five-record timeline and one 16-record infrastructure-first project grid.

- [ ] **Step 1: Write failing record-preservation and ordering tests**

Render both locales and assert five experience article IDs and 16 project article IDs. Assert the first project group is infrastructure priority, application-only projects remain present, and each outcome renders either Result or Scope according to its discriminated union.

- [ ] **Step 2: Verify tests fail against filtered legacy sections**

Run: `npm test -- src/components/portfolio-render.test.tsx`.

- [ ] **Step 3: Refactor Experience**

Render Company, Role, Period, Mission, Environment, Key Contributions and Technologies. Remove `useProfile` and filter logic. Use a semantic ordered list/timeline and maintain source chronology.

- [ ] **Step 4: Refactor Projects**

Replace large gradient headers with module-style cards. Render Context/Problem, Architecture, Role, Technologies and Result/Scope only from normalized source fields. Keep explicit demo/live-site actions and descriptive accessible names.

- [ ] **Step 5: Confirm project priority without hiding software breadth**

Assert infrastructure projects appear first, mixed projects second and application projects last; no filter controls or collapsed default state may hide records.

- [ ] **Step 6: Run full checks and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add src/App.tsx src/components/Experience.tsx src/components/Projects.tsx src/components/portfolio-render.test.tsx
git commit -m "feat: present experience and projects as case studies"
```

**Acceptance criteria:** Every inventoried record is visible once, source claims remain unchanged in meaning, and recruiters can scan environment/role/evidence quickly.

---

### Task 7: Add the Accurate Infrastructure Landscape and Production Toolbox

**Dependencies:** Task 1 technology domains, Task 3 visual modules and Task 5 expertise separation.

**Files:**
- Create: `src/components/InfrastructureStack.tsx`
- Create: `src/components/ProductionToolbox.tsx`
- Modify: `src/components/portfolio-render.test.tsx`
- Modify: `src/App.tsx`
- Delete: `src/components/Skills.tsx`

**Interfaces:**
- Consumes: localized capability groups and `technologyDomains`.
- Produces: one non-fictional landscape and one keyboard-operable toolbox with `activeDomainId` internal state.

- [ ] **Step 1: Write failing structure tests**

Assert separate labels for Foundations, Virtualization, Cloud Platforms, Runtime & Delivery, Automation, Networking and Observability. Assert Cloud and Virtualization are siblings, and automation/observability are labelled cross-cutting. Assert every technology domain ID is available in the toolbox.

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- src/components/portfolio-render.test.tsx`.

- [ ] **Step 3: Implement the capability landscape**

Use semantic grouped panels. Desktop connectors may communicate “runs on”, “delivers to” or “observes” only where technically accurate. Do not connect individual vendors into a single chain. Mobile removes connector geometry and retains labelled groups.

- [ ] **Step 4: Implement Production Toolbox**

Render domain controls and one associated panel. If tabs semantics are used, implement `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, roving keyboard focus and Left/Right/Home/End behavior. Default to Systems. Changing tabs must not affect any other section.

- [ ] **Step 5: Remove the old Skills section**

Ensure all unique skills have migrated to `technologyDomains` or remain evidenced by a project/experience before deleting `Skills.tsx`.

- [ ] **Step 6: Run checks and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add -A src/App.tsx src/components/InfrastructureStack.tsx src/components/ProductionToolbox.tsx src/components/Skills.tsx src/components/portfolio-render.test.tsx
git commit -m "feat: add infrastructure landscape and toolbox"
```

**Acceptance criteria:** The landscape is a capability model, not a fictional topology, and the toolbox is the sole exhaustive technology inventory.

---

### Task 8: Finish Supporting Evidence, Contact and Résumé Access

**Dependencies:** Unified content data and design system.

**Files:**
- Modify: `src/components/Certifications.tsx`
- Modify: `src/components/Education.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/portfolio-render.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: certification, education, contact and `ResumeSet` records.
- Produces: restrained evidence sections, reliable CTA and language-correct primary/alternate downloads.

- [ ] **Step 1: Write failing supporting-section tests**

Assert one certification and its credential URL, two education records, canonical email/GitHub/LinkedIn, the language-correct primary résumé, two alternate résumé choices, and the “Let’s build reliable infrastructure” CTA in both locales.

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- src/components/portfolio-render.test.tsx`.

- [ ] **Step 3: Refactor Certifications and Education**

Use restrained surfaces and timeline treatment. Remove unnecessary scaling/rotation animations. Keep credential verification visible but subordinate to project/experience evidence.

- [ ] **Step 4: Refactor Contact**

Use canonical contact URLs, availability terminal and four main actions. The primary Resume action follows active language. Alternate Software and Systems résumés are available in a compact labelled download group and do not change page content.

- [ ] **Step 5: Correct Footer links and unified title**

Replace malformed LinkedIn URLs and use the unified role title in both locales.

- [ ] **Step 6: Run checks and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add src/App.tsx src/components/Certifications.tsx src/components/Education.tsx src/components/Contact.tsx src/components/Footer.tsx src/components/portfolio-render.test.tsx
git commit -m "feat: complete credentials education and contact"
```

**Acceptance criteria:** All evidence and contact functionality is preserved, all six résumé URLs remain reachable, and canonical links are consistent.

---

### Task 9: Complete SEO, Metadata and Defensive Accessibility

**Dependencies:** Final section content from Tasks 4–8.

**Files:**
- Modify: `index.html`
- Modify: `src/index.css`
- Modify: `src/App.tsx`
- Modify: affected section modules if the audit finds heading/label/focus issues
- Modify: `src/components/portfolio-render.test.tsx`

**Interfaces:**
- Consumes: verified identity/contact facts only.
- Produces: recruiter metadata, semantic document structure and resilient focus/motion behavior.

- [ ] **Step 1: Write failing metadata/semantic assertions**

Assert one `h1`, unique section IDs in approved order, descriptive labels for icon-only controls, and no empty link text. Add a source-level metadata test for the exact approved title and description.

- [ ] **Step 2: Update metadata**

Set the exact title/description from the spec, approved keywords, theme color, Open Graph fields and factual Person JSON-LD. Do not reference an asset that does not exist.

- [ ] **Step 3: Complete accessibility audit fixes**

Check heading hierarchy, landmarks, focus visibility, mobile-menu state, toolbox keyboard behavior, decorative `aria-hidden` elements, terminal announcements and 44px control targets.

- [ ] **Step 4: Complete reduced-motion and fallback audit**

Ensure static final content is visible when motion is reduced and sections remain visible when IntersectionObserver is unavailable.

- [ ] **Step 5: Run automated checks and commit**

Run `npm test && npm run typecheck && npm run lint && npm run build`, then:

```bash
git add index.html src/index.css src/App.tsx src/components src/components/portfolio-render.test.tsx
git commit -m "feat: finalize portfolio seo and accessibility"
```

**Acceptance criteria:** Metadata matches the approved positioning, semantic structure is valid, and no decorative behavior blocks access to content.

---

### Task 10: Run Full Regression and Remove Remaining Legacy Artifacts

**Dependencies:** Tasks 1–9 complete.

**Files:**
- Modify: any file required by observed regression only
- Delete: any remaining unimported profile/terminal/transition file confirmed obsolete
- Update: `README.md` only if its run/check instructions no longer match package scripts

**Interfaces:**
- Consumes: the completed site.
- Produces: a clean verified branch with no profile-switching residue.

- [ ] **Step 1: Run the complete automated suite**

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: every command exits 0 with no warning treated as unresolved.

- [ ] **Step 2: Prove legacy switching is fully removed**

Run:

```bash
rg -n "cloud-devops|system-admin|currentProfileId|setProfile|ProfileSelector|ProfileTransition|experienceFilter|projectFilter|portfolio-profile|[?&]role=" src
```

Expected: no product-source matches. Mentions in documentation/tests that explicitly verify removal are acceptable.

- [ ] **Step 3: Re-run content preservation audit**

Confirm automated exact counts and manually compare every experience/project/certification/education title and all 10 external/resumé URLs with the content inventory.

- [ ] **Step 4: Run browser regression at required widths**

Check 1920, 1440, 1280, approximately 13-inch laptop, tablet and 375px mobile widths in both themes. Confirm no horizontal overflow and terminal text remains readable.

- [ ] **Step 5: Run interaction regression**

Verify sticky navigation, every anchor, active section indicator, mobile menu open/close/Escape behavior, EN/FR switching, theme switching/persistence, toolbox pointer/keyboard controls and all CTA buttons.

- [ ] **Step 6: Run link regression**

Open canonical LinkedIn, GitHub, email, phone, Aviatrix credential, all six résumé links and four project/demo links. Record any externally unavailable URL as an external-state issue; do not silently replace it with an invented destination.

- [ ] **Step 7: Run accessibility and motion regression**

Navigate by keyboard, verify visible focus, check reduced-motion static states, inspect heading/landmark order, and ensure terminal/background decoration does not create noisy announcements.

- [ ] **Step 8: Inspect console and performance risks**

Confirm no browser console warnings/errors, no continuous canvas loop, no excessive animation timers, no unexpected network request for page content and no newly introduced runtime package.

- [ ] **Step 9: Fix only observed regressions and rerun affected checks**

For each fix, reproduce the issue, make the smallest correction and rerun the owning automated/browser check plus `npm run build`.

- [ ] **Step 10: Commit final cleanup**

```bash
git add -A
git commit -m "chore: complete portfolio regression cleanup"
```

**Acceptance criteria:** Every checklist item below passes and the worktree contains no obsolete profile implementation.

---

## Final Regression Checklist

### Content preservation

- [ ] 5 unique experience records in EN and FR.
- [ ] 16 unique projects in EN and FR.
- [ ] 1 Aviatrix certification with credential link.
- [ ] 2 education records.
- [ ] 6 résumé URLs retained and reachable from the UI.
- [ ] 4 project/demo URLs retained.
- [ ] Canonical email, phone, location, GitHub and LinkedIn retained.
- [ ] Software engineering evidence remains visible.
- [ ] No unsupported numeric or outcome claim introduced.

### Unified experience

- [ ] Unified role is visible without interaction.
- [ ] No role chooser, content filter or role query parameter remains.
- [ ] All nine navigation sections are present in the approved order.
- [ ] Engineering Expertise and Production Toolbox do not duplicate long tool lists.
- [ ] Projects are infrastructure-first without hiding application projects.
- [ ] Infrastructure landscape does not imply one fixed vendor stack.

### Existing functionality

- [ ] EN/FR switching updates the whole interface and persists.
- [ ] Dark/light mode updates the whole interface and persists.
- [ ] Desktop and mobile navigation work.
- [ ] Resume actions work in both languages.
- [ ] External links use safe target/rel behavior where appropriate.
- [ ] Section reveals and terminal/path motion work when allowed.
- [ ] Reduced-motion mode presents complete static content.

### Responsive/accessibility/performance

- [ ] No horizontal overflow at tested widths.
- [ ] Keyboard focus is visible and logical.
- [ ] Mobile menu and toolbox are keyboard operable.
- [ ] Heading order and landmarks are coherent.
- [ ] Body text/control contrast meets WCAG AA expectations.
- [ ] Browser console has no errors or unresolved warnings.
- [ ] Production build succeeds.
- [ ] No full-screen continuous canvas or new runtime dependency exists.

### Legacy removal

- [ ] `ProfileContext` and profile local storage are removed.
- [ ] `?role=` behavior is removed.
- [ ] Profile filters are removed.
- [ ] Profile selector/dropdown is removed.
- [ ] Profile-specific terminals are removed.
- [ ] Profile transition overlays/assets are removed.
- [ ] Old profile JSON is removed only after inventory tests pass.
