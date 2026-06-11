import { Section } from './Section';
import { translations } from '../translations';
import { useProfile } from '../context/ProfileContext';
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

        <div key={currentProfileId} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 profile-content-enter">
          {filteredProjects.map((project, idx) => {
            const CardContent = (
              <>
                {/* Header */}
                <div className={`h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                  />
                  <div className="relative z-10 text-white text-center px-6">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <p className="text-sm font-medium opacity-80">{project.subtitle}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {project.title}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 whitespace-pre-line">{project.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="skill-badge text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            );

            return (
              <div
                key={idx}
                className={`glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${project.link ? 'cursor-pointer' : ''}`}
              >
                {project.link ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {CardContent}
                  </a>
                ) : (
                  <div className="h-full">{CardContent}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
