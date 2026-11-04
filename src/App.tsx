import { useEffect, useMemo, useState } from 'react';
import { getPortfolio } from './data/portfolio';
import type { Locale, UiStyle } from './types/portfolio';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { InfrastructureBackdrop } from './components/InfrastructureBackdrop';
import { About } from './components/About';
import { EngineeringExpertise } from './components/EngineeringExpertise';
import { InfrastructureStack } from './components/InfrastructureStack';
import { ProductionToolbox } from './components/ProductionToolbox';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { OpsLab } from './components/lab/OpsLab';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { useReducedMotion } from './hooks/useReducedMotion';
import { readStorage, writeStorage } from './lib/storage';

const navIds = [
  'home',
  'about',
  'expertise',
  'experience',
  'projects',
  'infrastructure',
  'lab',
  'certifications',
  'education',
  'contact',
] as const;

const readLanguage = (): Locale => (readStorage('language') === 'fr' ? 'fr' : 'en');
const readDarkMode = (): boolean => readStorage('theme') !== 'light';
const readUiStyle = (): UiStyle => (readStorage('ui-style') === 'sysadmin' ? 'sysadmin' : 'console');

export default function App() {
  const [dark, setDark] = useState(readDarkMode);
  const [uiStyle, setUiStyle] = useState<UiStyle>(readUiStyle);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Locale>(readLanguage);
  const portfolio = useMemo(() => getPortfolio(language), [language]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    writeStorage('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    document.documentElement.dataset.style = uiStyle;
    writeStorage('ui-style', uiStyle);
  }, [uiStyle]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((current) => {
      const next = current === 'en' ? 'fr' : 'en';
      writeStorage('language', next);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="app-shell relative min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <a href="#main-content" className="skip-link">{portfolio.labels.skipToContent}</a>
      <InfrastructureBackdrop />
      <NavBar
        portfolio={portfolio}
        navIds={navIds}
        onNavClick={scrollTo}
        language={language}
        toggleLanguage={toggleLanguage}
        dark={dark}
        toggleTheme={() => setDark((current) => !current)}
        uiStyle={uiStyle}
        toggleStyle={() => setUiStyle((current) => (current === 'console' ? 'sysadmin' : 'console'))}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main id="main-content">
        <Hero
          portfolio={portfolio}
          language={language}
          onProjectsClick={() => scrollTo('projects')}
          onInfrastructureClick={() => scrollTo('infrastructure')}
          onContactClick={() => scrollTo('contact')}
          onLabClick={() => scrollTo('lab')}
        />

        <About portfolio={portfolio} />
        <EngineeringExpertise portfolio={portfolio} />
        <Experience experiences={portfolio.experiences} labels={portfolio.labels} />
        <Projects projects={portfolio.projects} labels={portfolio.labels} />
        <InfrastructureStack portfolio={portfolio} />
        <ProductionToolbox portfolio={portfolio} />
        <OpsLab portfolio={portfolio} language={language} onContactClick={() => scrollTo('contact')} />
        <Certifications certifications={portfolio.certifications} heading={portfolio.labels.certifications} />
        <Education education={portfolio.education} heading={portfolio.labels.education} />
        <Contact portfolio={portfolio} />
      </main>
      <Footer portfolio={portfolio} />
      <div aria-hidden="true" className="crt-overlay" />
    </div>
  );
}
