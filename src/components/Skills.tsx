import { Activity, Cloud, Container, Network, Server, Wrench } from 'lucide-react';
import type { LocalizedPortfolio } from '../types/portfolio';
import { Section } from './Section';

type SkillsProps = {
  id: string;
  portfolio: LocalizedPortfolio;
  infrastructure?: boolean;
};

const icons = [Server, Cloud, Wrench, Activity, Network, Container];

export function Skills({ id, portfolio, infrastructure = false }: SkillsProps) {
  const items = infrastructure ? portfolio.technologyDomains : portfolio.expertise;
  const heading = infrastructure ? portfolio.labels.infrastructure : portfolio.labels.expertise;
  const intro = infrastructure ? portfolio.labels.infrastructureIntro : portfolio.labels.expertiseIntro;

  return (
    <Section id={id} className="bg-white/50 px-4 py-24 dark:bg-gray-900/40 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <h2 className="section-heading text-gray-900 dark:text-white">{heading}</h2>
          <p className="text-gray-600 dark:text-gray-400">{intro}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            const technologies = 'technologies' in item ? item.technologies : item.capabilities;
            return (
              <article key={item.id} className="glass-card p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400"><Icon className="h-5 w-5" /></div>
                <h3 className="font-bold text-gray-900 dark:text-white">{'label' in item ? item.label : item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">{item.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technologies.map((technology) => <span key={technology} className="skill-badge text-xs">{technology}</span>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
