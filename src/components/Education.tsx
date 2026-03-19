import { GraduationCap } from 'lucide-react';
import { Section } from './Section';
import { translations } from '../translations';

type Translation = (typeof translations)[keyof typeof translations];

type EducationProps = {
  t: Translation;
};

export function Education({ t }: EducationProps) {
  return (
    <Section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            <span className="gradient-text">{t.education.heading}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {t.education.items.map((edu, idx) => (
            <div key={idx} className="glass-card p-8 sm:p-10 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{edu.degree}</h3>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-lg">{edu.school}</p>
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-2">
                    {edu.period} · {edu.location}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {edu.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="skill-badge text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
