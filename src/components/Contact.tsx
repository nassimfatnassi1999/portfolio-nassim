import { BookOpen, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';

export function Contact({ portfolio }: { portfolio: LocalizedPortfolio }) {
  const contactLinks = [
    { label: portfolio.labels.email, value: portfolio.identity.email, href: `mailto:${portfolio.identity.email}`, icon: Mail },
    { label: portfolio.labels.phone, value: portfolio.identity.phoneDisplay, href: portfolio.identity.phoneHref, icon: Phone },
    { label: portfolio.labels.linkedIn, value: 'nassim-fatnassi-hnifi', href: portfolio.identity.linkedin, icon: Linkedin },
    { label: portfolio.labels.github, value: 'nassimfatnassi1999', href: portfolio.identity.github, icon: Github },
  ];

  return (
    <Section id="contact" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="glass-card overflow-hidden">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-terminal-green">{portfolio.contact.terminalStatus}</p>
              <h2 className="mt-4 text-4xl font-bold sm:text-5xl">{portfolio.contact.heading}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">{portfolio.contact.subheading}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {contactLinks.map(({ label, value, href, icon: Icon }) => <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex min-h-16 items-center gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800"><Icon className="h-5 w-5 text-brand-500" /><span><span className="block text-xs text-gray-500">{label}</span><span className="text-sm font-medium">{value}</span></span></a>)}
              </div>
              <div className="mt-6 flex flex-wrap gap-3"><a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white"><BookOpen className="h-4 w-4" />{portfolio.labels.downloadResume}</a>{portfolio.resumes.alternates.map((resume) => <a key={resume.id} href={resume.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold dark:border-gray-700">{resume.label}</a>)}</div>
            </div>
            <div className="border-t border-gray-200 bg-gray-950 p-8 font-mono text-sm text-gray-300 dark:border-gray-800 lg:border-l lg:border-t-0">
              <p className="text-terminal-green">nassim@infra:~$ <span className="text-gray-300">{portfolio.contact.terminalCommand}</span></p>
              <p className="mt-4 text-white">{portfolio.contact.terminalStatus}</p>
              <p className="mt-8 flex items-center gap-2 text-gray-400"><MapPin className="h-4 w-4 text-terminal-cyan" />{portfolio.identity.location}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
