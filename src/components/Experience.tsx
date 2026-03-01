import { Section } from './Section';
import { translations } from '../translations';
import { useProfile } from '../context/ProfileContext';

type Translation = (typeof translations)[keyof typeof translations];

type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: ReadonlyArray<string>;
  tags: ReadonlyArray<string>;
};

type ExperienceProps = {
  t: Translation;
  experiences: ExperienceItem[];
};

export function Experience({ t, experiences }: ExperienceProps) {
  const { profile, currentProfileId } = useProfile();

  // Filter experiences based on current profile
  const filteredExperiences = profile.experienceFilter
    .filter((idx) => idx < experiences.length)
    .map((idx) => experiences[idx]);

  return (
    <Section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.experience.heading[0]}
            <span className="gradient-text">{t.experience.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
        </div>

        <div key={currentProfileId} className="max-w-4xl mx-auto relative profile-content-enter">
          {/* Timeline line */}
          <div className="timeline-line hidden md:block" />

          <div className="space-y-8">
            {filteredExperiences.map((exp, idx) => (
              <div key={idx} className="relative md:pl-16">
                {/* Dot */}
                <div className="hidden md:flex absolute left-4 top-8 w-5 h-5 rounded-full bg-brand-500 border-4 border-white dark:border-gray-950 z-10" />
                <div className="glass-card p-6 sm:p-8 hover:shadow-xl transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                      <p className="text-brand-600 dark:text-brand-400 font-semibold">{exp.company}</p>
                    </div>
                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="skill-badge text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
