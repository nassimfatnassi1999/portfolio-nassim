import { BookOpen, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';
import { TerminalWindow } from './ui/TerminalWindow';

export function Contact({ portfolio }: { portfolio: LocalizedPortfolio }) {
  const contactLinks = [
    { label: portfolio.labels.email, value: portfolio.identity.email, href: `mailto:${portfolio.identity.email}`, icon: Mail },
    { label: portfolio.labels.phone, value: portfolio.identity.phoneDisplay, href: portfolio.identity.phoneHref, icon: Phone },
    { label: portfolio.labels.linkedIn, value: 'nassim-fatnassi-hnifi', href: portfolio.identity.linkedin, icon: Linkedin },
    { label: portfolio.labels.github, value: 'nassimfatnassi1999', href: portfolio.identity.github, icon: Github },
  ];

  return (
    <Section id="contact" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="surface-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">08 / {portfolio.contact.terminalStatus}</p>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">{portfolio.contact.heading}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{portfolio.contact.subheading}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {contactLinks.map(({ label, value, href, icon: Icon }) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-brand-400/50 hover:bg-brand-500/5 dark:border-slate-800"><Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-brand-500" /><span className="min-w-0"><span className="block text-xs text-slate-500">{label}</span><span className="block truncate text-sm font-medium">{value}</span></span></a>)}
              </div>
              <div className="mt-7"><a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-500"><BookOpen aria-hidden="true" className="h-4 w-4" />{portfolio.labels.downloadResume}</a></div>
              <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
                <p id="alternate-resumes" className="mb-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-500">{portfolio.labels.alternateResumes}</p>
                <div aria-labelledby="alternate-resumes" className="flex flex-wrap gap-3">{portfolio.resumes.alternates.map((resume) => <a key={resume.id} href={resume.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold transition-colors hover:border-brand-400/60 hover:text-brand-600 dark:border-slate-700 dark:hover:text-brand-400">{resume.label}</a>)}</div>
              </div>
            </div>
            <div className="border-t border-slate-200 bg-slate-100/50 p-6 dark:border-slate-800 dark:bg-slate-950/30 lg:border-l lg:border-t-0 lg:p-8">
              <TerminalWindow title="opportunity@infra:~$">
                <p><span className="text-emerald-400">nassim@infra:~$</span> <span className="text-slate-300">{portfolio.contact.terminalCommand}</span></p>
                <p className="mt-4 font-semibold text-white">{portfolio.contact.terminalStatus}</p>
                <p className="mt-8 flex items-center gap-2 text-slate-400"><MapPin aria-hidden="true" className="h-4 w-4 text-sky-400" />{portfolio.identity.location}</p>
              </TerminalWindow>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
