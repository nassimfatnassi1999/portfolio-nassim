import { Section } from './Section';
import { translations } from '../translations';
import { useProfile } from '../context/ProfileContext';
import { Check, ExternalLink, Github, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';

type Translation = (typeof translations)[keyof typeof translations];

type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: ReactNode;
  gradient: string;
  link?: string;
  features?: ReadonlyArray<string>;
  isMobile?: boolean;
  liveDemo?: string;
  demoLabel?: string;
  github?: string;
};

type ProjectsProps = {
  t: Translation;
  projects: ProjectItem[];
};

export function Projects({ t, projects }: ProjectsProps) {
  const { profile, currentProfileId } = useProfile();

  // Filter projects based on current profile
  const filteredProjects = profile.projectFilter
    .filter((idx) => idx < projects.length)
    .map((idx) => projects[idx]);

  return (
    <Section
      id="projects"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50"
      threshold={0}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.projects.heading[0]}
            <span className="gradient-text">{t.projects.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.projects.subtitle}</p>
        </div>

        <div key={currentProfileId} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch profile-content-enter">
          {filteredProjects.map((project) => {
            const CardContent = (
              <div className="flex h-full flex-col">
                {/* Header */}
                <div
                  className={`h-44 flex-shrink-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}
                  role="img"
                  aria-label={`${project.title} project visual`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                  />
                  {project.isMobile && (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                      {t.projects.mobileBadge}
                    </span>
                  )}
                  <div className="relative z-10 text-white text-center px-6">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <p className="text-sm font-medium opacity-80">{project.subtitle}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="flex items-start gap-2 text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {project.isMobile && <Smartphone className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />}
                    <span>{project.title}</span>
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 whitespace-pre-line">{project.description}</div>
                  {project.features && (
                    <div className="mb-5">
                      <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{t.projects.keyFeatures}</h4>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-1.5 text-xs leading-snug text-gray-600 dark:text-gray-400">
                            <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand-500" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="skill-badge text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {(project.liveDemo || project.github) && (
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-gray-200/70 pt-5 dark:border-gray-700/70">
                      {project.liveDemo && (
                        <a
                          href={project.liveDemo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-brand-500/25"
                        >
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          {project.demoLabel ?? t.projects.liveDemo}
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:scale-105 hover:border-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                        >
                          <Github className="h-4 w-4" aria-hidden="true" />
                          {t.projects.github}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );

            return (
              <article
                key={project.title}
                className={`glass-card h-full overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${project.link ? 'cursor-pointer' : ''}`}
              >
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {CardContent}
                  </a>
                ) : (
                  <div className="h-full">{CardContent}</div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
