import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { Project } from '../../types/portfolio';
import { StatusIndicator } from '../ui/StatusIndicator';
import { TechnologyBadge } from '../ui/TechnologyBadge';

type ProjectCardProps = {
  project: Project;
  category: string;
  labels: Record<string, string>;
  onViewDetails: (project: Project, trigger: HTMLButtonElement) => void;
};

const visibleTechnologyCount = 4;

export function ProjectCard({ project, category, labels, onViewDetails }: ProjectCardProps) {
  const visibleTechnologies = project.technologies.slice(0, visibleTechnologyCount);
  const remainingTechnologies = project.technologies.length - visibleTechnologies.length;
  const titleId = `project-card-${project.id}`;

  const handleViewDetails = (event: MouseEvent<HTMLButtonElement>) => {
    onViewDetails(project, event.currentTarget);
  };

  return (
    <article
      aria-labelledby={titleId}
      className="project-card surface-card flex h-full min-w-0 flex-col overflow-hidden p-0"
      data-project-card={project.id}
      data-project-id={project.id}
      data-project-priority={project.priority}
    >
      <div className="border-b border-slate-200/80 bg-slate-100/55 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/45 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <StatusIndicator label={project.status} />
          <span className="text-right font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div>
          <h3 id={titleId} className="text-xl font-bold leading-tight text-slate-950 dark:text-slate-50">
            {project.title}
          </h3>
          <p className="mt-2 text-sm font-semibold text-brand-700 dark:text-brand-400">{project.subtitle}</p>
          <p className="project-card-description mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {project.problem}
          </p>
        </div>

        <div role="group" aria-label={labels.technologies} className="mt-6 flex flex-wrap gap-2">
          {visibleTechnologies.map((technology) => (
            <TechnologyBadge key={technology}>{technology}</TechnologyBadge>
          ))}
          {remainingTechnologies > 0 && (
            <TechnologyBadge className="border-brand-400/30 text-brand-700 dark:text-brand-300">
              +{remainingTechnologies}
            </TechnologyBadge>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 pt-7">
          <button
            type="button"
            aria-haspopup="dialog"
            className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-brand-800"
            onClick={handleViewDetails}
          >
            {labels.viewDetails}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {project.links.length > 0 && (
            <div className="flex items-center gap-2">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${link.label}: ${project.title}`}
                  title={link.label}
                  className="inline-grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-600 transition-colors duration-200 hover:border-brand-400/60 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
                >
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
