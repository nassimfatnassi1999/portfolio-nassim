import { useCallback, useEffect, useRef, useState } from 'react';
import type { Project, ProjectPriority } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { ProjectCarousel } from './projects/ProjectCarousel';
import { ProjectDetailsDialog } from './projects/ProjectDetailsDialog';

type ProjectsProps = { projects: Project[]; labels: Record<string, string> };

export function Projects({ projects, labels }: ProjectsProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);
  const priorityLabels: Record<ProjectPriority, string> = {
    infrastructure: labels.priorityInfrastructure,
    mixed: labels.priorityMixed,
    application: labels.priorityApplication,
  };

  useEffect(() => {
    setSelectedProject((current) => {
      if (!current) return null;
      return projects.find((project) => project.id === current.id) ?? null;
    });
  }, [projects]);

  const openProject = useCallback((project: Project, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger;
    setSelectedProject(project);
  }, []);

  const closeProject = useCallback(() => setSelectedProject(null), []);

  return (
    <Section id="projects" className="scroll-mt-20 bg-white/50 px-4 py-24 dark:bg-slate-900/35 sm:px-6 lg:px-8" threshold={0}>
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={`04 / ${labels.projects}`} title={labels.projects} description={labels.projectsIntro} />
        <ProjectCarousel
          projects={projects}
          labels={labels}
          priorityLabels={priorityLabels}
          onViewDetails={openProject}
        />
      </div>
      {selectedProject && (
        <ProjectDetailsDialog
          project={selectedProject}
          category={priorityLabels[selectedProject.priority]}
          labels={labels}
          returnFocusTo={returnFocusRef.current}
          onClose={closeProject}
        />
      )}
    </Section>
  );
}
