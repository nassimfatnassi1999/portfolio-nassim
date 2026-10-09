import { GraduationCap } from 'lucide-react';
import type { Education as EducationRecord } from '../types/portfolio';
import { Section } from './Section';

export function Education({ education, heading }: { education: EducationRecord[]; heading: string }) {
  return (
    <Section id="education" className="bg-white/50 px-4 py-24 dark:bg-gray-900/40 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-heading">{heading}</h2>
        <div className="mt-10 space-y-5">
          {education.map((item) => (
            <article key={item.id} className="glass-card flex gap-5 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><GraduationCap className="h-6 w-6" /></div>
              <div><h3 className="text-xl font-bold">{item.degree}</h3><p className="mt-1 font-medium text-brand-600 dark:text-brand-400">{item.school}</p><p className="mt-2 font-mono text-sm text-gray-500">{item.period} · {item.location}</p><div className="mt-4 flex flex-wrap gap-2">{item.domains.map((domain) => <span key={domain} className="skill-badge text-xs">{domain}</span>)}</div></div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
