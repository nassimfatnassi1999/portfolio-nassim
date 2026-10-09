import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { getPortfolio } from '../data/portfolio';
import { getReducedMotionPreference } from '../hooks/useReducedMotion';
import { InfrastructureBackdrop } from './InfrastructureBackdrop';
import { About } from './About';
import { EngineeringExpertise } from './EngineeringExpertise';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { InfrastructureStack } from './InfrastructureStack';
import { ProductionToolbox } from './ProductionToolbox';
import { Certifications } from './Certifications';
import { Education } from './Education';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { NavBar } from './NavBar';
import { SectionHeader } from './ui/SectionHeader';
import { StatusIndicator } from './ui/StatusIndicator';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyBadge } from './ui/TechnologyBadge';
import { TerminalWindow } from './ui/TerminalWindow';
import indexSource from '../../index.html?raw';

const escapeText = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/'/g, '&#x27;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

describe('unified portfolio rendering', () => {
  it('uses the approved recruiter metadata and only existing visual assets', () => {
    expect(indexSource).toContain('<title>Nassim Fatnassi Hnifi | Cloud, DevOps &amp; Systems Engineer</title>');
    expect(indexSource).toContain('content="Cloud &amp; DevOps Engineer and Systems Administrator specializing in Linux, Kubernetes, VMware, automation, monitoring and production infrastructure."');
    expect(indexSource).toContain('name="keywords"');
    expect(indexSource).toContain('name="theme-color"');
    expect(indexSource).toContain('property="og:type" content="profile"');
    expect(indexSource).toContain('type="application/ld+json"');
    expect(indexSource).toContain('/photo-cv.png');
    expect(indexSource).not.toContain('/vite.svg');
  });

  it('renders semantic landmarks, unique ordered sections and labelled controls', () => {
    const markup = renderToStaticMarkup(<App />);
    expect(markup.match(/<h1\b/g)).toHaveLength(1);
    expect(markup).toContain('<main id="main-content"');
    expect(markup).toContain('<nav aria-label=');
    expect(markup).toContain('<footer');
    expect(markup).toContain('aria-controls="mobile-navigation"');
    expect(markup).toContain('aria-live="polite"');

    const sectionIds = [...markup.matchAll(/<section\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
    const approved = ['home', 'about', 'expertise', 'experience', 'projects', 'infrastructure', 'certifications', 'education', 'contact'];
    const positions = approved.map((id) => sectionIds.indexOf(id));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    for (const match of markup.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
      const [, , attributes, children] = match;
      const visibleText = children.replace(/<[^>]+>/g, '').trim();
      expect(visibleText.length > 0 || attributes.includes('aria-label=')).toBe(true);
    }
  });

  it('keeps the profile narrative and four engineering domains complete but distinct from the toolbox', () => {
    const portfolio = getPortfolio('en');
    const about = renderToStaticMarkup(<About portfolio={portfolio} />);
    const expertise = renderToStaticMarkup(<EngineeringExpertise portfolio={portfolio} />);

    for (const paragraph of portfolio.about.paragraphs) expect(about).toContain(escapeText(paragraph));
    expect(portfolio.about.paragraphs).toHaveLength(3);
    expect(about).toContain(portfolio.identity.linkedin);
    expect(about).toContain(portfolio.identity.github);
    expect(about).toContain(`mailto:${portfolio.identity.email}`);
    expect(about).toContain(portfolio.identity.phoneHref);

    expect(expertise.match(/data-expertise-id=/g)).toHaveLength(4);
    for (const item of portfolio.expertise) expect(expertise).toContain(`data-expertise-id="${item.id}"`);
    for (const domain of portfolio.technologyDomains) {
      for (const technology of domain.technologies) expect(expertise).not.toContain(`>${technology}<`);
    }
  });

  it.each(['en', 'fr'] as const)('preserves ordered experience and project evidence in %s', (locale) => {
    const portfolio = getPortfolio(locale);
    const experience = renderToStaticMarkup(<Experience experiences={portfolio.experiences} labels={portfolio.labels} />);
    const projects = renderToStaticMarkup(<Projects projects={portfolio.projects} labels={portfolio.labels} />);

    expect(experience.match(/data-experience-id=/g)).toHaveLength(5);
    expect(projects.match(/data-project-id=/g)).toHaveLength(16);
    const experiencePositions = portfolio.experiences.map((item) => experience.indexOf(`data-experience-id="${item.id}"`));
    expect(experiencePositions.every((position) => position >= 0)).toBe(true);
    expect(experiencePositions).toEqual([...experiencePositions].sort((a, b) => a - b));

    const projectPositions = portfolio.projects.map((item) => projects.indexOf(`data-project-id="${item.id}"`));
    expect(projectPositions.every((position) => position >= 0)).toBe(true);
    expect(projectPositions).toEqual([...projectPositions].sort((a, b) => a - b));
    expect(portfolio.projects.map((project) => project.priority)).toEqual([
      ...portfolio.projects.filter((project) => project.priority === 'infrastructure'),
      ...portfolio.projects.filter((project) => project.priority === 'mixed'),
      ...portfolio.projects.filter((project) => project.priority === 'application'),
    ].map((project) => project.priority));
    expect(portfolio.projects.some((project) => project.priority === 'application')).toBe(true);

    for (const project of portfolio.projects) {
      expect(projects).toContain(`data-project-priority="${project.priority}"`);
      expect(projects).toContain(`data-outcome-kind="${project.outcome.kind}"`);
      expect(projects).toContain(escapeText(project.role));
      expect(projects).toContain(escapeText(project.outcome.text));
    }
    expect(projects).not.toContain('type="checkbox"');
  });

  it.each(['en', 'fr'] as const)('models infrastructure capabilities without presenting a fictional stack in %s', (locale) => {
    const portfolio = getPortfolio(locale);
    const landscape = renderToStaticMarkup(<InfrastructureStack portfolio={portfolio} />);
    const toolbox = renderToStaticMarkup(<ProductionToolbox portfolio={portfolio} />);

    for (const group of ['foundations', 'virtualization', 'cloud-platforms', 'runtime-delivery', 'automation', 'networking', 'observability']) {
      expect(landscape).toContain(`data-capability-group="${group}"`);
    }
    expect(landscape.match(/data-layer="compute-platforms"/g)).toHaveLength(2);
    expect(landscape.match(/data-scope="cross-cutting"/g)).toHaveLength(2);
    expect(landscape).toContain(portfolio.labels.infrastructureIntro.replace('—', '—'));

    expect(toolbox).toContain('role="tablist"');
    expect(toolbox).toContain('role="tabpanel"');
    expect(toolbox).toContain('aria-selected="true"');
    for (const domain of portfolio.technologyDomains) {
      expect(toolbox).toContain(`data-domain-id="${domain.id}"`);
    }
  });

  it.each(['en', 'fr'] as const)('preserves credentials, education, contact and localized resumes in %s', (locale) => {
    const portfolio = getPortfolio(locale);
    const certifications = renderToStaticMarkup(<Certifications certifications={portfolio.certifications} heading={portfolio.labels.certifications} />);
    const education = renderToStaticMarkup(<Education education={portfolio.education} heading={portfolio.labels.education} />);
    const contact = renderToStaticMarkup(<Contact portfolio={portfolio} />);
    const footer = renderToStaticMarkup(<Footer portfolio={portfolio} />);

    expect(certifications.match(/data-certification-id=/g)).toHaveLength(1);
    expect(certifications).toContain(portfolio.certifications[0].url);
    expect(education.match(/data-education-id=/g)).toHaveLength(2);
    expect(contact).toContain(escapeText(portfolio.contact.heading));
    for (const href of [portfolio.identity.linkedin, portfolio.identity.github, `mailto:${portfolio.identity.email}`, portfolio.identity.phoneHref]) {
      expect(contact).toContain(href);
    }
    for (const href of [portfolio.identity.linkedin, portfolio.identity.github, `mailto:${portfolio.identity.email}`]) expect(footer).toContain(href);
    expect(contact).toContain(portfolio.resumes.primary.url.replace(/&/g, '&amp;'));
    expect(contact).toContain(portfolio.labels.alternateResumes);
    for (const resume of portfolio.resumes.alternates) expect(contact).toContain(resume.url.replace(/&/g, '&amp;'));
    expect(footer).toContain(escapeText(portfolio.identity.title));
  });

  it('keeps all six inventoried resume URLs reachable across both locales', () => {
    const markup = (['en', 'fr'] as const).map((locale) => renderToStaticMarkup(<Contact portfolio={getPortfolio(locale)} />)).join('');
    const resumes = (['en', 'fr'] as const).flatMap((locale) => {
      const portfolio = getPortfolio(locale);
      return [portfolio.resumes.primary, ...portfolio.resumes.alternates];
    });
    expect(new Set(resumes.map((resume) => resume.url)).size).toBe(6);
    for (const resume of resumes) expect(markup).toContain(resume.url.replace(/&/g, '&amp;'));
  });

  it('renders one unified professional identity without legacy role controls', () => {
    const markup = renderToStaticMarkup(<App />);

    expect(markup).toContain(
      'Cloud &amp; DevOps Engineer | Systems &amp; Infrastructure Administrator',
    );
    expect(markup).not.toContain('~cloud');
    expect(markup).not.toContain('~dev');
    expect(markup).not.toContain('~sys');
    expect(markup).not.toContain('role="listbox"');

    const sectionIds = [
      'home',
      'about',
      'expertise',
      'experience',
      'projects',
      'infrastructure',
      'certifications',
      'education',
      'contact',
    ];
    const sectionPositions = sectionIds.map((id) => markup.indexOf(`id="${id}"`));
    expect(sectionPositions.every((position) => position >= 0)).toBe(true);
    expect(sectionPositions).toEqual([...sectionPositions].sort((a, b) => a - b));
    expect(markup.match(/data-experience-id=/g)).toHaveLength(5);
    expect(markup.match(/data-project-id=/g)).toHaveLength(16);

    for (const discipline of getPortfolio('en').hero.disciplines) {
      expect(markup).toContain(discipline.replace('&', '&amp;'));
    }
    for (const path of ['~/cloud', '~/devops', '~/systems', '~/production']) {
      expect(markup).toContain(path);
    }
    for (const action of ['Explore My Projects', 'View Infrastructure', 'Contact Me']) {
      expect(markup).toContain(action);
    }
    expect(markup).toContain('4');
    expect(markup).toContain('Cloud Platforms');
    expect(markup).toContain('5');
    expect(markup).toContain('Professional Roles');
    expect(markup).toContain('16');
    expect(markup).toContain('Documented Projects');
    expect(markup).toContain('whoami');
    expect(markup).toContain('cat expertise.yaml');
    expect(markup).toContain('kubectl get nodes');
    expect(markup).toContain('uptime');
    expect(markup).toContain('portfolio interface operational ✓');
  });

  it('renders the language-specific primary resume in navigation', () => {
    const props = {
      navIds: getPortfolio('en').navigation.map((item) => item.id),
      onNavClick: () => undefined,
      toggleLanguage: () => undefined,
      dark: true,
      toggleTheme: () => undefined,
      menuOpen: false,
      setMenuOpen: () => undefined,
    };
    const english = renderToStaticMarkup(<NavBar {...props} portfolio={getPortfolio('en')} language="en" />);
    const french = renderToStaticMarkup(<NavBar {...props} portfolio={getPortfolio('fr')} language="fr" />);

    expect(english).toContain('1-ql96PCwiaMvd_C-gh1tQtg7pnUA3oP3');
    expect(french).toContain('1ZFXNKsu356uliNQzl8TwX38s2NMGWoIz');
  });

  it('renders shared console surfaces with semantic visible content', () => {
    const markup = renderToStaticMarkup(
      <>
        <InfrastructureBackdrop />
        <SectionHeader eyebrow="01 / Expertise" title="Engineering Expertise" description="Four operating domains." />
        <SurfaceCard as="article"><p>Reliable infrastructure</p></SurfaceCard>
        <TechnologyBadge>Linux</TechnologyBadge>
        <StatusIndicator label="Operational" />
        <TerminalWindow title="nassim@infra:~$"><p>whoami</p></TerminalWindow>
      </>,
    );

    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('<article');
    expect(markup).toContain('Engineering Expertise');
    expect(markup).toContain('Reliable infrastructure');
    expect(markup).toContain('Linux');
    expect(markup).toContain('Operational');
    expect(markup).toContain('nassim@infra:~$');
    expect(markup).toContain('whoami');
  });

  it('defaults to reduced motion when a media query is unavailable', () => {
    expect(getReducedMotionPreference()).toBe(true);
    expect(getReducedMotionPreference({ matches: false })).toBe(false);
    expect(getReducedMotionPreference({ matches: true })).toBe(true);
  });
});
