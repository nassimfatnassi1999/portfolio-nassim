import { Github, Linkedin, Mail } from 'lucide-react';
import { translations } from '../translations';

type Translation = (typeof translations)[keyof typeof translations];

type FooterProps = {
  t: Translation;
};

export function Footer({ t }: FooterProps) {
  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <img
            src="/photo-cv.png"
            alt="NF"
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/30"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} {t.footer.copyright}</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/-a1698a186/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/nassimfatnassi1999"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="mailto:Fatnassihnifi.nassim@proton.me"
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
