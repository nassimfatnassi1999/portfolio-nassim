import { useEffect } from 'react';
import { BookOpen, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import type { LocalizedPortfolio, Locale } from '../types/portfolio';
import { useActiveSection } from '../hooks/useActiveSection';
import { RotatingInfraPath } from './RotatingInfraPath';

type NavBarProps = {
  portfolio: LocalizedPortfolio;
  navIds: readonly string[];
  onNavClick: (id: string) => void;
  language: Locale;
  toggleLanguage: () => void;
  dark: boolean;
  toggleTheme: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export function NavBar({
  portfolio,
  navIds,
  onNavClick,
  language,
  toggleLanguage,
  dark,
  toggleTheme,
  menuOpen,
  setMenuOpen,
}: NavBarProps) {
  const activeSection = useActiveSection(navIds);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen, setMenuOpen]);

  return (
    <nav aria-label={portfolio.labels.navigation} className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-[#070b13]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavClick('home')} className="group flex min-h-11 items-center gap-2" aria-label={portfolio.navigation[0].label}>
            <img src={portfolio.identity.portrait} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-brand-500/30 transition-transform group-hover:scale-105" />
            <span className="hidden font-mono text-sm text-gray-500 dark:text-gray-400 sm:inline">~/nassim</span>
          </button>
          <span className="hidden text-gray-300 dark:text-gray-600 sm:block">|</span>
          <RotatingInfraPath />
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {portfolio.navigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavClick(navIds[index])}
              aria-current={activeSection === navIds[index] ? 'page' : undefined}
              data-section-target={navIds[index]}
              className={`relative min-h-11 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeSection === navIds[index]
                  ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-brand-400'
              }`}
            >
              {item.label}
              {activeSection === navIds[index] && <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-brand-500" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="hidden min-h-11 items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 sm:flex">
            <BookOpen aria-hidden="true" className="h-4 w-4" /> {portfolio.labels.resume}
          </a>
          <button onClick={toggleLanguage} className="flex min-h-11 items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300" aria-label={portfolio.labels.language}>
            <Languages aria-hidden="true" className="h-4 w-4" /> {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800" aria-label={dark ? portfolio.labels.useLightTheme : portfolio.labels.useDarkTheme}>
            {dark ? <Sun aria-hidden="true" className="h-5 w-5 text-amber-400" /> : <Moon aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 lg:hidden" aria-label={menuOpen ? portfolio.labels.closeMenu : portfolio.labels.menu} aria-expanded={menuOpen} aria-controls="mobile-navigation">
            {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-navigation" className="space-y-1 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          {portfolio.navigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => onNavClick(navIds[index])}
              aria-current={activeSection === navIds[index] ? 'page' : undefined}
              data-section-target={navIds[index]}
              className={`block min-h-11 w-full rounded-lg px-4 py-2.5 text-left ${activeSection === navIds[index] ? 'bg-brand-500/10 text-brand-700 dark:text-brand-300' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}
            >
              {item.label}
            </button>
          ))}
          <a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-brand-600 dark:text-brand-400">
            <BookOpen aria-hidden="true" className="h-4 w-4" /> {portfolio.labels.resume}
          </a>
        </div>
      )}
    </nav>
  );
}
