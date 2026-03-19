import { BookOpen, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { translations } from '../translations';
import { ProfileSelector } from './ProfileSelector';
import { useProfile } from '../context/ProfileContext';

type Translation = (typeof translations)[keyof typeof translations];

type NavBarProps = {
  t: Translation;
  navIds: string[];
  onNavClick: (id: string) => void;
  language: 'en' | 'fr';
  toggleLanguage: () => void;
  dark: boolean;
  toggleTheme: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

export function NavBar({
  t,
  navIds,
  onNavClick,
  language,
  toggleLanguage,
  dark,
  toggleTheme,
  menuOpen,
  setMenuOpen,
}: NavBarProps) {
  const { profile } = useProfile();

  // CV link from profile, fallback to empty
  const cvLink = profile.cvLinks[language] || '#';
  const hasCvLink = !!profile.cvLinks[language];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo + Profile Selector */}
        <div className="flex items-center gap-3">
          <button onClick={() => onNavClick('home')} className="flex items-center gap-2 group">
            <img
              src="/photo-cv.png"
              alt="NF"
              className="w-9 h-9 rounded-lg object-cover group-hover:scale-110 transition-transform ring-1 ring-brand-500/30"
            />
            <span className="hidden sm:inline font-mono text-sm text-gray-500 dark:text-gray-400">~/nassim</span>
          </button>
          <span className="hidden sm:block text-gray-300 dark:text-gray-600">|</span>
          <ProfileSelector />
        </div>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {t.nav.items.map((item, idx) => (
            <button
              key={navIds[idx]}
              onClick={() => onNavClick(navIds[idx])}
              className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {hasCvLink ? (
            <a
              href={cvLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" /> {t.nav.resume}
            </a>
          ) : (
            <span
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-lg opacity-60 cursor-not-allowed"
              title="CV coming soon"
            >
              <BookOpen className="w-4 h-4" /> {t.nav.resume}
            </span>
          )}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'FR' : 'EN'}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 space-y-1">
          {t.nav.items.map((item, idx) => (
            <button
              key={navIds[idx]}
              onClick={() => onNavClick(navIds[idx])}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
