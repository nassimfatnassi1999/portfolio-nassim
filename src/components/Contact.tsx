import { Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Section } from './Section';
import { translations } from '../translations';

type Translation = (typeof translations)[keyof typeof translations];

type ContactProps = {
  t: Translation;
};

export function Contact({ t }: ContactProps) {
  return (
    <Section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.contact.heading[0]}
            <span className="gradient-text">{t.contact.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t.contact.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            <a
              href="mailto:Fatnassihnifi.nassim@proton.me"
              className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{t.contact.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 break-all">Fatnassihnifi.nassim@proton.me</p>
              </div>
            </a>

            <a
              href="tel:+21628021325"
              className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{t.contact.phone}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">+216 28 021 325</p>
              </div>
            </a>

            <div className="glass-card glow-border p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{t.contact.location}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manouba, Tunis, Tunisia</p>
              </div>
            </div>

            <a
              href="https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                <Linkedin className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">LinkedIn</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">nassim-fatnassi-hnifi</p>
              </div>
            </a>
          </div>

          {/* Terminal CTA */}
          <div className="terminal-window max-w-2xl mx-auto">
            <div className="terminal-header">
              <span className="terminal-dot bg-red-500" />
              <span className="terminal-dot bg-yellow-500" />
              <span className="terminal-dot bg-green-500" />
              <span className="ml-4 text-xs text-gray-500 font-mono">contact@nassim</span>
            </div>
            <div className="terminal-body text-gray-300 space-y-1">
              <p>
                <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> {t.contact.terminalEcho}
              </p>
              <p className="text-white">{t.contact.terminalOutput}</p>
              <p className="mt-2">
                <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> {t.contact.terminalMail}
              </p>
              <p className="text-terminal-amber">{t.contact.terminalSuccess}</p>
              <p className="mt-2">
                <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> <span className="animate-terminal-blink">▎</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
