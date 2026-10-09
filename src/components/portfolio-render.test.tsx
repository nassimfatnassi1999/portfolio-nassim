import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import App from '../App';

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
});
