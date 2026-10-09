import { Github, Linkedin, Mail } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';

export function Footer({ portfolio }: { portfolio: LocalizedPortfolio }) {
  return (
    <footer className="relative z-10 border-t border-slate-200 px-4 py-10 dark:border-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3"><img src={portfolio.identity.portrait} alt="" className="h-8 w-8 rounded-lg object-cover ring-1 ring-brand-500/30" /><p className="text-sm text-slate-500">© {new Date().getFullYear()} {portfolio.identity.name} — {portfolio.identity.title}</p></div>
        <div className="flex gap-3">
          <a href={portfolio.identity.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors hover:text-brand-600 dark:bg-slate-800 dark:hover:text-brand-400"><Linkedin className="h-5 w-5" /></a>
          <a href={portfolio.identity.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors hover:text-brand-600 dark:bg-slate-800 dark:hover:text-brand-400"><Github className="h-5 w-5" /></a>
          <a href={`mailto:${portfolio.identity.email}`} aria-label={portfolio.labels.email} className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 transition-colors hover:text-brand-600 dark:bg-slate-800 dark:hover:text-brand-400"><Mail className="h-5 w-5" /></a>
        </div>
      </div>
    </footer>
  );
}
