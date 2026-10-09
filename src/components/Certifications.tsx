import { Award, ExternalLink } from 'lucide-react';
import type { Certification } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';

export function Certifications({ certifications, heading }: { certifications: Certification[]; heading: string }) {
  return (
    <Section id="certifications" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <SectionHeader eyebrow={`06 / ${heading}`} title={heading} />
        <div className="mt-10">
          {certifications.map((certification) => (
            <SurfaceCard key={certification.id} as="article" data-certification-id={certification.id} className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-600 dark:text-brand-400"><Award aria-hidden="true" className="h-6 w-6" /></div>
              <div className="flex-1"><h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">{certification.title}</h3><p className="text-brand-600 dark:text-brand-400">{certification.provider}</p><p className="mt-1 font-mono text-xs text-slate-500">{certification.date}</p></div>
              <a href={certification.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-600 transition-colors hover:text-brand-500 dark:text-brand-400">{certification.verifyLabel}<ExternalLink aria-hidden="true" className="h-4 w-4" /></a>
            </SurfaceCard>
          ))}
        </div>
      </div>
    </Section>
  );
}
