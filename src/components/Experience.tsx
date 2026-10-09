import type { Experience as ExperienceRecord } from '../types/portfolio';
import { Section } from './Section';

type ExperienceProps = {
  experiences: ExperienceRecord[];
  labels: Record<string, string>;
};

export function Experience({ experiences, labels }: ExperienceProps) {
  return (
    <Section id="experience" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="section-heading text-gray-900 dark:text-white">{labels.experience}</h2>
        <div className="mt-12 space-y-6">
          {experiences.map((experience) => (
            <article key={experience.id} data-experience-id={experience.id} className="glass-card p-6 sm:p-8">
              <header className="flex flex-wrap justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
                <div><p className="font-mono text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400">{experience.company}</p><h3 className="mt-1 text-xl font-bold">{experience.role}</h3></div>
                <time className="font-mono text-sm text-gray-500">{experience.period}</time>
              </header>
              <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div><h4 className="text-sm font-semibold">{labels.mission}</h4><p className="mt-2 leading-7 text-gray-600 dark:text-gray-400">{experience.mission}</p></div>
                <div><h4 className="text-sm font-semibold">{labels.contributions}</h4><ul className="mt-2 space-y-2 text-gray-600 dark:text-gray-400">{experience.contributions.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{item}</li>)}</ul></div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">{experience.environment.map((item) => <span key={item} className="skill-badge text-xs">{item}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
