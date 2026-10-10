import { GraduationCap } from 'lucide-react';
import type { Education as EducationRecord } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';
import { TechnologyBadge } from './ui/TechnologyBadge';

export function Education({ education, heading }: { education: EducationRecord[]; heading: string }) {
  return (
    <Section id="education" className="scroll-mt-20 bg-white/50 px-4 py-24 dark:bg-slate-900/35 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow={`07 / ${heading}`} title={heading} />
        <ol className="mt-10 space-y-5">
          {education.map((item) => (
            <li key={item.id}>
            <SurfaceCard as="article" data-education-id={item.id} className="flex gap-5 p-6 sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-700 dark:text-brand-400"><GraduationCap aria-hidden="true" className="h-6 w-6" /></div>
              <div><h3 className="text-xl font-bold">{item.degree}</h3><p className="mt-1 font-medium text-brand-700 dark:text-brand-400">{item.school}</p><p className="mt-2 font-mono text-sm text-gray-500">{item.period} · {item.location}</p><div className="mt-4 flex flex-wrap gap-2">{item.domains.map((domain) => <TechnologyBadge key={domain}>{domain}</TechnologyBadge>)}</div></div>
            </SurfaceCard>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
