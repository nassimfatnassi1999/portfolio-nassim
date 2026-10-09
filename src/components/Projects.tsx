import { ExternalLink } from 'lucide-react';
import type { Project } from '../types/portfolio';
import { Section } from './Section';

type ProjectsProps = { projects: Project[]; labels: Record<string, string> };

export function Projects({ projects, labels }: ProjectsProps) {
  return (
    <Section id="projects" className="bg-white/50 px-4 py-24 dark:bg-gray-900/40 sm:px-6 lg:px-8" threshold={0}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl"><h2 className="section-heading">{labels.projects}</h2><p className="text-gray-600 dark:text-gray-400">{labels.projectsIntro}</p></div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} data-project-id={project.id} className="glass-card flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-terminal-green">● {project.status}</span><span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">{project.priority}</span></div>
              <h3 className="mt-4 text-xl font-bold">{project.title}</h3>
              <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">{project.subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">{project.problem}</p>
              <p className="mt-4 border-l-2 border-brand-500/40 pl-3 font-mono text-xs leading-6 text-gray-500 dark:text-gray-400">{project.architecture}</p>
              <div className="mt-5 flex flex-wrap gap-2">{project.technologies.map((item) => <span key={item} className="skill-badge text-xs">{item}</span>)}</div>
              {project.links.length > 0 && <div className="mt-auto pt-6">{project.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400">{link.label}<ExternalLink className="h-4 w-4" /></a>)}</div>}
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
