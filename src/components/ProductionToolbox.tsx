import { useRef, useState, type KeyboardEvent } from 'react';
import { getTechnologyVisual } from '../data/technologyVisuals';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyLogo } from './ui/TechnologyLogo';

export function ProductionToolbox({ portfolio }: { portfolio: LocalizedPortfolio }) {
  const domains = portfolio.technologyDomains;
  const [activeDomainId, setActiveDomainId] = useState(domains[0]?.id ?? 'systems');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeDomain = domains.find((domain) => domain.id === activeDomainId) ?? domains[0];

  const selectByIndex = (index: number) => {
    const normalized = (index + domains.length) % domains.length;
    setActiveDomainId(domains[normalized].id);
    tabRefs.current[normalized]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') selectByIndex(index + 1);
    else if (event.key === 'ArrowLeft') selectByIndex(index - 1);
    else if (event.key === 'Home') selectByIndex(0);
    else if (event.key === 'End') selectByIndex(domains.length - 1);
    else return;
    event.preventDefault();
  };

  if (!activeDomain) return null;

  return (
    <Section id="toolbox" className="bg-white/50 px-4 pb-24 pt-8 dark:bg-slate-900/35 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader title={portfolio.labels.toolbox} description={portfolio.labels.toolboxIntro} />
        <div className="mt-9 grid gap-5 lg:grid-cols-[18rem_1fr]">
          <div role="tablist" aria-label={portfolio.labels.toolbox} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {domains.map((domain, index) => {
              const selected = domain.id === activeDomain.id;
              return (
                <button
                  key={domain.id}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  id={`toolbox-${domain.id}-tab`}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`toolbox-${domain.id}-panel`}
                  tabIndex={selected ? 0 : -1}
                  data-domain-id={domain.id}
                  onClick={() => setActiveDomainId(domain.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`min-h-11 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${selected ? 'border-brand-500/40 bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'border-slate-200 bg-white/60 text-slate-600 hover:border-brand-400/40 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'}`}
                >
                  {domain.label}
                </button>
              );
            })}
          </div>

          <SurfaceCard
            role="tabpanel"
            id={`toolbox-${activeDomain.id}-panel`}
            aria-labelledby={`toolbox-${activeDomain.id}-tab`}
            data-active-domain={activeDomain.id}
            className="self-start p-6 sm:p-8"
          >
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">{activeDomain.label}</p>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">{activeDomain.description}</p>
            <ul key={activeDomain.id} className="technology-logo-grid mt-7">
              {activeDomain.technologies.map((technology) => {
                const visual = getTechnologyVisual(technology);
                return (
                  <li
                    key={technology}
                    data-technology-name={technology}
                    data-technology-visual={visual.kind}
                    className="technology-logo-item"
                  >
                    <span className="technology-logo-circle">
                      <TechnologyLogo visual={visual} />
                    </span>
                    <span className="technology-logo-name">{technology}</span>
                  </li>
                );
              })}
            </ul>
          </SurfaceCard>
        </div>
      </div>
    </Section>
  );
}
