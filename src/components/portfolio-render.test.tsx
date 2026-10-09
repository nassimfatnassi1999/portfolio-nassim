import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { getReducedMotionPreference } from '../hooks/useReducedMotion';
import { InfrastructureBackdrop } from './InfrastructureBackdrop';
import { SectionHeader } from './ui/SectionHeader';
import { StatusIndicator } from './ui/StatusIndicator';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyBadge } from './ui/TechnologyBadge';
import { TerminalWindow } from './ui/TerminalWindow';

describe('unified portfolio rendering', () => {
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
