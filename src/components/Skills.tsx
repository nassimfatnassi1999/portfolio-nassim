import { Section } from './Section';
import { translations } from '../translations';
import { useProfile } from '../context/ProfileContext';
import { Cloud, Container, GitBranch, Layers, Activity, HardDrive, Network, Code2, Shield, Server, Database, Cpu } from 'lucide-react';
import type { ReactNode } from 'react';

type Translation = (typeof translations)[keyof typeof translations];

type SkillsProps = {
  t: Translation;
  language: 'en' | 'fr';
};

// Icon mapping for skill categories
const iconMap: Record<string, ReactNode> = {
  'Cloud Platforms': <Cloud className="w-6 h-6" />,
  'Plateformes Cloud': <Cloud className="w-6 h-6" />,
  'Containers & Orchestration': <Container className="w-6 h-6" />,
  'Conteneurs & Orchestration': <Container className="w-6 h-6" />,
  'CI/CD & DevOps Tools': <GitBranch className="w-6 h-6" />,
  'CI/CD & Outils DevOps': <GitBranch className="w-6 h-6" />,
  'Infrastructure as Code': <Layers className="w-6 h-6" />,
  'Monitoring & Logging': <Activity className="w-6 h-6" />,
  'Storage & Virtualization': <HardDrive className="w-6 h-6" />,
  'Stockage & Virtualisation': <HardDrive className="w-6 h-6" />,
  'Networking & Security': <Network className="w-6 h-6" />,
  'Réseau & Sécurité': <Network className="w-6 h-6" />,
  'Programming & OS': <Code2 className="w-6 h-6" />,
  'Programmation & OS': <Code2 className="w-6 h-6" />,
  'Programming Languages': <Code2 className="w-6 h-6" />,
  'Langages de Programmation': <Code2 className="w-6 h-6" />,
  'Frontend Frameworks': <Layers className="w-6 h-6" />,
  'Frameworks Frontend': <Layers className="w-6 h-6" />,
  'Backend Frameworks': <Server className="w-6 h-6" />,
  'Frameworks Backend': <Server className="w-6 h-6" />,
  'Databases': <Database className="w-6 h-6" />,
  'Bases de Données': <Database className="w-6 h-6" />,
  'API & Architecture': <GitBranch className="w-6 h-6" />,
  'DevOps & Tools': <Container className="w-6 h-6" />,
  'DevOps & Outils': <Container className="w-6 h-6" />,
  'Testing & Quality': <Shield className="w-6 h-6" />,
  'Tests & Qualité': <Shield className="w-6 h-6" />,
  'IDE & Collaboration': <Code2 className="w-6 h-6" />,
  'Operating Systems': <Cpu className="w-6 h-6" />,
  "Systèmes d'Exploitation": <Cpu className="w-6 h-6" />,
  'Automation & Scripting': <Layers className="w-6 h-6" />,
  'Automatisation & Scripting': <Layers className="w-6 h-6" />,
  'Networking': <Network className="w-6 h-6" />,
  'Réseaux': <Network className="w-6 h-6" />,
  'Hardware & Routing': <Server className="w-6 h-6" />,
  'Matériel & Routage': <Server className="w-6 h-6" />,
  'Virtualization': <HardDrive className="w-6 h-6" />,
  'Virtualisation': <HardDrive className="w-6 h-6" />,
  'Storage & Backup': <HardDrive className="w-6 h-6" />,
  'Stockage & Sauvegarde': <HardDrive className="w-6 h-6" />,
  'Security': <Shield className="w-6 h-6" />,
  'Sécurité': <Shield className="w-6 h-6" />,
};

function getIcon(title: string): ReactNode {
  return iconMap[title] || <Code2 className="w-6 h-6" />;
}

export function Skills({ t, language }: SkillsProps) {
  const { profile, currentProfileId } = useProfile();
  const skillCategories = profile.skills[language];

  return (
    <Section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-heading text-gray-900 dark:text-white">
            {t.skills.heading[0]}
            <span className="gradient-text">{t.skills.heading[1]}</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.skills.subtitle}</p>
        </div>

        <div key={currentProfileId} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 profile-content-enter">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="glass-card p-6 hover:scale-[1.03] transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {getIcon(category.categoryTitle)}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">{category.categoryTitle}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIdx) => (
                  <span key={skillIdx} className="skill-badge text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
