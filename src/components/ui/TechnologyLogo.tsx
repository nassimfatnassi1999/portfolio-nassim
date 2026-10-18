import type { TechnologyVisual } from '../../data/technologyVisuals';

export function TechnologyLogo({ visual }: { visual: TechnologyVisual }) {
  if (visual.kind === 'brand' && visual.source === 'simple-icons') {
    return (
      <svg
        aria-hidden="true"
        className="h-9 w-9"
        viewBox="0 0 24 24"
        fill={`#${visual.icon.hex}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={visual.icon.path} />
      </svg>
    );
  }

  if (visual.kind === 'brand') {
    const Icon = visual.Icon;
    return <Icon aria-hidden="true" focusable="false" size="2.5rem" />;
  }

  return <span aria-hidden="true" className="technology-fallback-label">{visual.label}</span>;
}
