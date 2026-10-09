import { useEffect, useMemo, useState } from 'react';
import { getPortfolio } from './data/portfolio';
import type { Locale } from './types/portfolio';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { InfrastructureBackdrop } from './components/InfrastructureBackdrop';
import { About } from './components/About';
import { EngineeringExpertise } from './components/EngineeringExpertise';
import { InfrastructureStack } from './components/InfrastructureStack';
import { ProductionToolbox } from './components/ProductionToolbox';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

const navIds = [
  'home',
  'about',
  'expertise',
  'experience',
  'projects',
  'infrastructure',
  'certifications',
  'education',
  'contact',
] as const;

function readLanguage(): Locale {
  if (typeof window === 'undefined') return 'en';
  return window.localStorage.getItem('language') === 'fr' ? 'fr' : 'en';
}

function readDarkMode(): boolean {
  if (typeof window === 'undefined') return true;
  return window.localStorage.getItem('theme') !== 'light';
}

export default function App() {
  const [dark, setDark] = useState(readDarkMode);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Locale>(readLanguage);
  const portfolio = useMemo(() => getPortfolio(language), [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    window.localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === 'en' ? 'fr' : 'en';
      window.localStorage.setItem('language', next);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <InfrastructureBackdrop />
      <NavBar
        portfolio={portfolio}
        navIds={navIds}
        onNavClick={scrollTo}
        language={language}
        toggleLanguage={toggleLanguage}
        dark={dark}
        toggleTheme={() => setDark((current) => !current)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <Hero
        portfolio={portfolio}
        language={language}
        onProjectsClick={() => scrollTo('projects')}
        onInfrastructureClick={() => scrollTo('infrastructure')}
        onContactClick={() => scrollTo('contact')}
      />

      <About portfolio={portfolio} />
      <EngineeringExpertise portfolio={portfolio} />
      <Experience experiences={portfolio.experiences} labels={portfolio.labels} />
      <Projects projects={portfolio.projects} labels={portfolio.labels} />
      <InfrastructureStack portfolio={portfolio} />
      <ProductionToolbox portfolio={portfolio} />
      <Certifications certifications={portfolio.certifications} heading={portfolio.labels.certifications} />
      <Education education={portfolio.education} heading={portfolio.labels.education} />
      <Contact portfolio={portfolio} />
      <Footer portfolio={portfolio} />
    </div>
  );
}
