import { Github, Globe2, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';

export function About({ portfolio }: { portfolio: LocalizedPortfolio }) {
  return (
    <Section id="about" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="font-mono text-sm text-brand-600 dark:text-brand-400">01 / {portfolio.labels.about}</p>
          <h2 className="section-heading text-gray-900 dark:text-white">{portfolio.about.heading}</h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <aside className="glass-card p-8 text-center">
            <img src={portfolio.identity.portrait} alt={portfolio.identity.name} className="mx-auto mb-6 h-36 w-36 rounded-2xl object-cover object-top ring-2 ring-brand-500/30" />
            <h3 className="text-xl font-bold">{portfolio.identity.name}</h3>
            <p className="mt-2 text-sm font-medium text-brand-600 dark:text-brand-400">{portfolio.identity.shortTitle}</p>
            <div className="my-6 flex justify-center gap-3">
              <a href={portfolio.identity.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"><Linkedin className="h-5 w-5" /></a>
              <a href={portfolio.identity.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"><Github className="h-5 w-5" /></a>
              <a href={`mailto:${portfolio.identity.email}`} aria-label={portfolio.labels.email} className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800"><Mail className="h-5 w-5" /></a>
            </div>
            <div className="space-y-3 text-left text-sm text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-brand-500" /> {portfolio.identity.location}</p>
              <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-brand-500" /> {portfolio.identity.phoneDisplay}</p>
              <p className="flex items-center gap-3"><Globe2 className="h-4 w-4 text-brand-500" /> {portfolio.identity.languages}</p>
            </div>
          </aside>
          <div className="glass-card space-y-5 p-8 lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gray-500">{portfolio.about.profileLabel}</p>
            {portfolio.about.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-8 text-gray-600 dark:text-gray-300 sm:text-lg">{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
