import { BookOpen, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import type { LocalizedPortfolio, Locale } from '../types/portfolio';

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
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl transition-colors dark:border-gray-800/60 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavClick('home')} className="group flex items-center gap-2" aria-label={portfolio.navigation[0].label}>
            <img src={portfolio.identity.portrait} alt="" className="h-9 w-9 rounded-lg object-cover ring-1 ring-brand-500/30 transition-transform group-hover:scale-105" />
            <span className="hidden font-mono text-sm text-gray-500 dark:text-gray-400 sm:inline">~/nassim</span>
          </button>
          <span className="hidden text-gray-300 dark:text-gray-600 sm:block">|</span>
          <span className="hidden rounded-md border border-gray-700/60 bg-gray-950 px-2.5 py-1 font-mono text-sm text-terminal-green sm:inline">~/infra</span>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {portfolio.navigation.map((item, index) => (
            <button key={item.id} onClick={() => onNavClick(navIds[index])} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-brand-400">
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-500 sm:flex">
            <BookOpen className="h-4 w-4" /> {portfolio.labels.resume}
          </a>
          <button onClick={toggleLanguage} className="flex min-h-11 items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300" aria-label={portfolio.labels.language}>
            <Languages className="h-4 w-4" /> {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button onClick={toggleTheme} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800" aria-label={portfolio.labels.theme}>
            {dark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 lg:hidden" aria-label={menuOpen ? portfolio.labels.closeMenu : portfolio.labels.menu} aria-expanded={menuOpen}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="space-y-1 border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          {portfolio.navigation.map((item, index) => (
            <button key={item.id} onClick={() => onNavClick(navIds[index])} className="block w-full rounded-lg px-4 py-2.5 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              {item.label}
            </button>
          ))}
          <a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 rounded-lg px-4 py-2.5 font-semibold text-brand-600 dark:text-brand-400">
            <BookOpen className="h-4 w-4" /> {portfolio.labels.resume}
          </a>
        </div>
      )}
    </nav>
  );
}
