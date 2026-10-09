import { ArrowRight, ChevronDown, Network } from 'lucide-react';
import type { LocalizedPortfolio, Locale } from '../types/portfolio';
import { TypingText } from './TypingText';
import { InfrastructureTerminal } from './InfrastructureTerminal';

type HeroProps = {
  portfolio: LocalizedPortfolio;
  language: Locale;
  onProjectsClick: () => void;
  onInfrastructureClick: () => void;
  onContactClick: () => void;
};

export function Hero({
  portfolio,
  language,
  onProjectsClick,
  onInfrastructureClick,
  onContactClick,
}: HeroProps) {
  return (
    <section id="home" aria-labelledby="hero-title" className="relative flex min-h-screen scroll-mt-20 items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400">
              <span className="h-2 w-2 rounded-full bg-terminal-green" />
              {portfolio.identity.availability}
            </div>

            <h1 id="hero-title" className="mb-5 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              <span className="text-gray-900 dark:text-white">{portfolio.identity.name}</span>
            </h1>
            <p className="mb-3 text-xl font-semibold text-gray-800 dark:text-gray-100 sm:text-2xl">
              {portfolio.identity.title}
            </p>
            <div className="mb-6 min-h-10 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              <span className="sr-only">{portfolio.hero.disciplines.join(', ')}</span>
              <span aria-hidden="true"><TypingText key={language} texts={portfolio.hero.disciplines} /></span>
            </div>
            <p className="mb-7 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {portfolio.identity.description}
            </p>

            <div className="mb-8 md:hidden">
              <InfrastructureTerminal variant="mobile" />
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={onProjectsClick} className="group flex min-h-11 items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-500">
                {portfolio.hero.actions.projects} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button onClick={onInfrastructureClick} className="flex min-h-11 items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold dark:border-gray-700 dark:bg-gray-900">
                <Network className="h-4 w-4" /> {portfolio.hero.actions.infrastructure}
              </button>
              <button onClick={onContactClick} className="min-h-11 rounded-xl border border-gray-300 px-6 py-3 font-semibold dark:border-gray-700">
                {portfolio.hero.actions.contact}
              </button>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
              {portfolio.hero.facts.map((fact) => (
                <div key={fact.label}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{fact.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">{fact.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <InfrastructureTerminal variant="desktop" />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <ChevronDown aria-hidden="true" className="h-7 w-7 animate-bounce text-gray-400" />
        </div>
      </div>
    </section>
  );
}
