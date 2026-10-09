import { Award, ExternalLink } from 'lucide-react';
import type { Certification } from '../types/portfolio';
import { Section } from './Section';

export function Certifications({ certifications, heading }: { certifications: Certification[]; heading: string }) {
  return (
    <Section id="certifications" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="section-heading">{heading}</h2>
        <div className="mt-10">
          {certifications.map((certification) => (
            <article key={certification.id} className="glass-card flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><Award className="h-6 w-6" /></div>
              <div className="flex-1"><h3 className="text-lg font-bold">{certification.title}</h3><p className="text-brand-600 dark:text-brand-400">{certification.provider}</p><p className="mt-1 text-sm text-gray-500">{certification.date}</p></div>
              <a href={certification.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brand-600 dark:text-brand-400">{certification.verifyLabel}<ExternalLink className="h-4 w-4" /></a>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
