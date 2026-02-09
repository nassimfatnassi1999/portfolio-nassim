import { Section } from './Section';
import { translations } from '../translations';
import type { ReactNode } from 'react';

type Translation = (typeof translations)[keyof typeof translations];

type SkillCategory = {
  icon: ReactNode;
  title: string;
  skills: string[];
  color: string;
};

type SkillsProps = {
  t: Translation;
  skillCategories: SkillCategory[];
};

export function Skills({ t, skillCategories }: SkillsProps) {
  return (
    <Section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.skills.heading[0]}
            <span className="gradient-text">{t.skills.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.skills.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="glass-card p-6 hover:scale-[1.03] transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIdx) => (
                  <span key={skillIdx} className="skill-badge text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
