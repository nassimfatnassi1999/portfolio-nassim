import { Activity, CloudCog, ServerCog, Workflow } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';

const icons = [ServerCog, CloudCog, Workflow, Activity] as const;

export function EngineeringExpertise({ portfolio }: { portfolio: LocalizedPortfolio }) {
  return (
    <Section id="expertise" className="scroll-mt-20 bg-white/50 px-4 py-24 dark:bg-slate-900/35 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow={`02 / ${portfolio.labels.expertise}`}
          title={portfolio.labels.expertise}
          description={portfolio.labels.expertiseIntro}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {portfolio.expertise.map((item, index) => {
            const Icon = icons[index];
            return (
              <SurfaceCard key={item.id} as="article" data-expertise-id={item.id} className="group p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-brand-500/20 bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-3 border-t border-slate-200/80 pt-5 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                  {item.capabilities.map((capability) => (
                    <li key={capability} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
