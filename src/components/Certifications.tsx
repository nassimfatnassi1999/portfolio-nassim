import { Award } from 'lucide-react';
import { Section } from './Section';
import { translations } from '../translations';
import type { ReactNode } from 'react';

type Translation = (typeof translations)[keyof typeof translations];

type CertificationItem = {
  title: string;
  issuer: string;
  date: string;
  link: string;
  icon: ReactNode;
};

type CertificationsProps = {
  t: Translation;
  certifications: CertificationItem[];
};

export function Certifications({ t, certifications }: CertificationsProps) {
  return (
    <Section id="certifications" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            <span className="gradient-text">{t.certifications.heading}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
        </div>

        <div className="max-w-2xl mx-auto">
          {certifications.map((cert, idx) => (
            <a
              key={idx}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-8 flex items-center gap-6 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                {cert.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-brand-600 dark:text-brand-400 font-semibold">{cert.issuer}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cert.date}</p>
              </div>
              <Award className="w-8 h-8 text-terminal-amber ml-auto flex-shrink-0 group-hover:rotate-12 transition-transform" />
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
