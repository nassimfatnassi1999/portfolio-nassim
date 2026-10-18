import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Experience as ExperienceRecord } from '../types/portfolio';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyBadge } from './ui/TechnologyBadge';

type ExperienceProps = {
  experiences: ExperienceRecord[];
  labels: Record<string, string>;
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type ExperienceItemProps = {
  experience: ExperienceRecord;
  index: number;
  labels: Record<string, string>;
};

function ExperienceItem({ experience, index, labels }: ExperienceItemProps) {
  const itemRef = useRef<HTMLLIElement>(null);
  const hasRevealed = useRef(false);
  const reducedMotion = useReducedMotion();
  const [revealReady, setRevealReady] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const direction = index % 2 === 0 ? 'left' : 'right';

  useIsomorphicLayoutEffect(() => {
    const item = itemRef.current;
    if (reducedMotion || !item || typeof window.IntersectionObserver !== 'function') {
      hasRevealed.current = true;
      setRevealReady(false);
      setRevealed(true);
      return;
    }

    if (hasRevealed.current) {
      setRevealReady(false);
      setRevealed(true);
      return;
    }

    setRevealReady(true);
    setRevealed(false);

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        hasRevealed.current = true;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(item);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <li
      ref={itemRef}
      data-experience-direction={direction}
      data-reveal-ready={revealReady}
      data-revealed={revealed}
      className={`experience-item experience-from-${direction} relative sm:grid sm:grid-cols-[7rem_1fr] sm:gap-12`}
    >
      <span aria-hidden="true" data-experience-part="connector" className="experience-connector-segment" />
      <div className="mb-3 pl-7 sm:mb-0 sm:pl-0 sm:text-right">
        <span aria-hidden="true" data-experience-part="marker" className="experience-marker absolute left-1 top-2 h-2 w-2 rounded-full bg-brand-500 ring-4 ring-slate-50 dark:ring-slate-950 sm:left-[8.2rem]" />
        <time className="font-mono text-xs leading-5 text-slate-500 dark:text-slate-400">{experience.period}</time>
      </div>
      <SurfaceCard as="article" data-experience-id={experience.id} className="experience-card p-6 sm:p-8">
        <header className="border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <p data-experience-part="company" className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">{experience.company}</p>
          <h3 data-experience-part="role" className="mt-2 text-xl font-bold text-slate-950 dark:text-slate-50">{experience.role}</h3>
        </header>
        <div data-experience-part="content">
          <div className="mt-6 grid gap-7 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.mission}</h4>
              <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{experience.mission}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.contributions}</h4>
              <ul className="mt-2 space-y-2.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {experience.contributions.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /><span>{item}</span></li>)}
              </ul>
            </div>
          </div>
          <div className="mt-6 border-t border-slate-200/80 pt-5 dark:border-slate-800">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.environment} / {labels.technologies}</h4>
            <div className="flex flex-wrap gap-2">{experience.environment.map((item) => <TechnologyBadge key={item}>{item}</TechnologyBadge>)}</div>
          </div>
        </div>
      </SurfaceCard>
    </li>
  );
}

export function Experience({ experiences, labels }: ExperienceProps) {
  return (
    <Section id="experience" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader eyebrow={`03 / ${labels.experience}`} title={labels.experience} />
        <ol className="relative mt-12 space-y-7 before:absolute before:bottom-5 before:left-[0.4375rem] before:top-5 before:w-px before:bg-slate-200 dark:before:bg-slate-800 sm:before:left-[8.45rem]">
          {experiences.map((experience, index) => (
            <ExperienceItem key={experience.id} experience={experience} index={index} labels={labels} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
