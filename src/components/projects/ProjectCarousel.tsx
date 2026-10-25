import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Project, ProjectPriority } from '../../types/portfolio';
import { ProjectCard } from './ProjectCard';

type ProjectCarouselProps = {
  projects: Project[];
  labels: Record<string, string>;
  priorityLabels: Record<ProjectPriority, string>;
  onViewDetails: (project: Project, trigger: HTMLButtonElement) => void;
};

function formatProgress(value: number) {
  return String(value).padStart(2, '0');
}

export function ProjectCarousel({ projects, labels, priorityLabels, onViewDetails }: ProjectCarouselProps) {
  const carouselRef = useRef<HTMLOListElement>(null);
  const animationFrameRef = useRef<number>();
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const finalIndex = Math.max(0, projects.length - 1);

  const updateActiveIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll<HTMLElement>('[data-project-card]'));
    if (cards.length === 0) return;

    const carouselLeft = carousel.getBoundingClientRect().left;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - carouselLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    setActiveIndex(nearestIndex);
  };

  const handleScroll = () => {
    if (animationFrameRef.current !== undefined) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(updateActiveIndex);
  };

  const scrollToProject = (index: number) => {
    const carousel = carouselRef.current;
    const card = carousel?.querySelectorAll<HTMLElement>('[data-project-card]')[index];
    if (!carousel || !card) return;

    const left = carousel.scrollLeft + card.getBoundingClientRect().left - carousel.getBoundingClientRect().left;
    carousel.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
    setActiveIndex(index);
  };

  useEffect(() => () => {
    if (animationFrameRef.current !== undefined) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  if (projects.length === 0) return null;

  const progress = ((activeIndex + 1) / projects.length) * 100;

  return (
    <div className="mt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label={labels.projectProgress} className="min-w-[5rem] flex-1 sm:max-w-xs">
          <div className="flex items-center font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="whitespace-nowrap">{formatProgress(activeIndex + 1)} / {formatProgress(projects.length)}</span>
          </div>
          <div aria-hidden="true" className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-500 transition-[width] duration-[400ms] motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={labels.previousProject}
            disabled={activeIndex === 0}
            onClick={() => scrollToProject(Math.max(0, activeIndex - 1))}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-brand-400/60 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            <span>{labels.previous}</span>
          </button>
          <button
            type="button"
            aria-label={labels.nextProject}
            disabled={activeIndex === finalIndex}
            onClick={() => scrollToProject(Math.min(finalIndex, activeIndex + 1))}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-brand-400/60 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
          >
            <span>{labels.next}</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ol
        ref={carouselRef}
        aria-label={labels.projectCarousel}
        className="project-carousel"
        data-project-carousel="true"
        onScroll={handleScroll}
      >
        {projects.map((project) => (
          <li key={project.id} className="project-carousel-item">
            <ProjectCard
              project={project}
              category={priorityLabels[project.priority]}
              labels={labels}
              onViewDetails={onViewDetails}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
