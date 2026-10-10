import { ExternalLink } from 'lucide-react';
import type { Project, ProjectPriority } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { StatusIndicator } from './ui/StatusIndicator';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyBadge } from './ui/TechnologyBadge';

type ProjectsProps = { projects: Project[]; labels: Record<string, string> };

export function Projects({ projects, labels }: ProjectsProps) {
  const priorityLabels: Record<ProjectPriority, string> = {
    infrastructure: labels.priorityInfrastructure,
    mixed: labels.priorityMixed,
    application: labels.priorityApplication,
  };

  return (
    <Section id="projects" className="scroll-mt-20 bg-white/50 px-4 py-24 dark:bg-slate-900/35 sm:px-6 lg:px-8" threshold={0}>
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={`04 / ${labels.projects}`} title={labels.projects} description={labels.projectsIntro} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {projects.map((project) => (
            <SurfaceCard
              key={project.id}
              as="article"
              data-project-id={project.id}
              data-project-priority={project.priority}
              className="flex h-full flex-col overflow-hidden p-0"
            >
              <div className="border-b border-slate-200/80 bg-slate-100/55 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/45">
                <div className="flex items-center justify-between gap-3">
                  <StatusIndicator label={project.status} />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{priorityLabels[project.priority]}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-slate-950 dark:text-slate-50">{project.title}</h3>
                <p className="mt-1 text-sm font-medium text-brand-700 dark:text-brand-400">{project.subtitle}</p>

                <dl className="mt-6 space-y-5 text-sm leading-6">
                  <div><dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.problem}</dt><dd className="mt-1 text-slate-600 dark:text-slate-400">{project.problem}</dd></div>
                  <div><dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.architecture}</dt><dd className="mt-1 border-l-2 border-sky-500/40 pl-3 text-slate-600 dark:text-slate-400">{project.architecture}</dd></div>
                  <div><dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.role}</dt><dd className="mt-1 text-slate-600 dark:text-slate-400">{project.role}</dd></div>
                  <div data-outcome-kind={project.outcome.kind} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <dt className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400">{labels[project.outcome.kind]}</dt>
                    <dd className="mt-1 text-slate-700 dark:text-slate-300">{project.outcome.text}</dd>
                  </div>
                </dl>

                {project.details.length > 0 && (
                  <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {project.details.map((detail) => <li key={detail} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" /><span>{detail}</span></li>)}
                  </ul>
                )}

                <div className="mt-6 flex flex-wrap gap-2">{project.technologies.map((item) => <TechnologyBadge key={item}>{item}</TechnologyBadge>)}</div>
                {project.links.length > 0 && (
                  <div className="mt-auto flex flex-wrap gap-x-5 pt-6">
                    {project.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label}: ${project.title}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 dark:text-brand-400">{link.label}<ExternalLink aria-hidden="true" className="h-4 w-4" /></a>)}
                  </div>
                )}
              </div>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
