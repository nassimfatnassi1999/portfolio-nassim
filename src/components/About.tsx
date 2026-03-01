import { Cloud, Container, Github, Globe, Linkedin, Mail, MapPin, Phone, Shield, Zap, Code2, Server, Cpu, Network } from 'lucide-react';
import { Section } from './Section';
import { translations } from '../translations';
import { useProfile } from '../context/ProfileContext';
import type { ReactNode } from 'react';

type Translation = (typeof translations)[keyof typeof translations];

type AboutProps = {
  t: Translation;
  language: 'en' | 'fr';
};

// Map highlight titles to icons
const highlightIcons: Record<string, ReactNode> = {
  'Cloud Architecture': <Cloud className="w-5 h-5" />,
  'Architecture Cloud': <Cloud className="w-5 h-5" />,
  'Container Orchestration': <Container className="w-5 h-5" />,
  'Orchestration de Conteneurs': <Container className="w-5 h-5" />,
  'Security & Compliance': <Shield className="w-5 h-5" />,
  'Sécurité & Conformité': <Shield className="w-5 h-5" />,
  'Automation & IaC': <Zap className="w-5 h-5" />,
  'Automatisation & IaC': <Zap className="w-5 h-5" />,
  'Frontend Development': <Code2 className="w-5 h-5" />,
  'Développement Frontend': <Code2 className="w-5 h-5" />,
  'Backend Engineering': <Server className="w-5 h-5" />,
  'Ingénierie Backend': <Server className="w-5 h-5" />,
  'Database Design': <Globe className="w-5 h-5" />,
  'Conception BDD': <Globe className="w-5 h-5" />,
  'DevOps & CI/CD': <Container className="w-5 h-5" />,
  'Server Administration': <Cpu className="w-5 h-5" />,
  'Administration Serveurs': <Cpu className="w-5 h-5" />,
  'Network Engineering': <Network className="w-5 h-5" />,
  'Ingénierie Réseau': <Network className="w-5 h-5" />,
  'Security & Hardening': <Shield className="w-5 h-5" />,
  'Sécurité & Durcissement': <Shield className="w-5 h-5" />,
  'Monitoring & Backup': <Zap className="w-5 h-5" />,
  'Monitoring & Sauvegarde': <Zap className="w-5 h-5" />,
};

export function About({ t, language }: AboutProps) {
  const { profile } = useProfile();
  const aboutData = profile.about[language];

  return (
    <Section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.about.heading[0]}
            <span className="gradient-text">{t.about.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="glass-card p-8 lg:col-span-1 flex flex-col items-center text-center">
            <img
              src="/photo-cv.png"
              alt="Nassim Fatnassi Hnifi"
              className="w-36 h-36 rounded-2xl object-cover object-top mb-6 shadow-lg ring-2 ring-brand-500/30"
              style={{ imageRendering: 'auto' }}
              loading="eager"
            />
            <h3 className="text-xl font-bold mb-1">Nassim Fatnassi Hnifi</h3>
            <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{aboutData.jobTitle}</p>
            <div className="flex gap-3 mb-6">
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
            <div className="w-full space-y-3 text-sm text-left">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" /> Manouba, Tunis
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" /> +216 28 021 325
              </div>
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Globe className="w-4 h-4 text-brand-500 flex-shrink-0" /> {t.about.languages}
              </div>
            </div>
          </div>

          {/* Bio + Highlights */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.about.profileTitle}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {aboutData.profileP1}{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">{aboutData.profileP1Bold1}</span>{' '}
                {aboutData.profileP1Mid}{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">{aboutData.profileP1Bold2}</span>
                {aboutData.profileP1End}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {aboutData.profileP2Start}
                <span className="font-semibold text-terminal-cyan">{aboutData.profileP2H1}</span>
                {aboutData.profileP2Mid1}
                <span className="font-semibold text-terminal-cyan">{aboutData.profileP2H2}</span>
                {aboutData.profileP2Mid2}
                <span className="font-semibold text-terminal-cyan">{aboutData.profileP2H3}</span>
                {aboutData.profileP2Mid3}
                <span className="font-semibold text-terminal-cyan">{aboutData.profileP2H4}</span>
                {aboutData.profileP2End}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {aboutData.highlights.map((item, idx) => (
                <div key={idx} className="glass-card glow-border p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                    {highlightIcons[item.title] || <Zap className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
