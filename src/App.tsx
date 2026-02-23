import { useEffect, useState } from 'react';
import {
  Activity,
  Cloud,
  Code2,
  Container,
  GitBranch,
  HardDrive,
  Layers,
  Network,
  Globe,
  Server,
  Shield,
  Users,
} from 'lucide-react';
import { translations } from './translations';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { NightSky } from './components/NightSky';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Certifications } from './components/Certifications';
import { Education } from './components/Education';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved ? saved === 'dark' : true);
    const savedLang = localStorage.getItem('language') as 'en' | 'fr' | null;
    setLanguage(savedLang || 'en');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'fr' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const cvLinks = {
    en: 'https://drive.google.com/uc?export=download&id=1-ql96PCwiaMvd_C-gh1tQtg7pnUA3oP3',
    fr: 'https://drive.google.com/uc?export=download&id=1ZFXNKsu356uliNQzl8TwX38s2NMGWoIz',
  };

  const t = translations[language];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navIds = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'education', 'contact'];

  /* ─── DATA ─── */

  const skillCategories = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: t.skills.categories[0].title,
      skills: ['AWS', 'Google Cloud', 'Azure', 'OpenStack'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Container className="w-6 h-6" />,
      title: t.skills.categories[1].title,
      skills: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm', 'AKS', 'Strimzi'],
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: t.skills.categories[2].title,
      skills: ['Git', 'GitHub', 'GitLab CI/CD', 'Jenkins', 'ArgoCD', 'Vault', 'SonarCloud', 'Nexus', 'Trivy'],
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: t.skills.categories[3].title,
      skills: ['Terraform', 'OpenTofu', 'Ansible', 'Bash Scripting', 'Heat (OpenStack)'],
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: t.skills.categories[4].title,
      skills: ['Prometheus', 'Grafana', 'EFK Stack', 'Promtail', 'Loki', 'Zabbix'],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: t.skills.categories[5].title,
      skills: ['NAS/SAN', 'NFS', 'FTP', 'SMB', 'Ceph', 'RAID', 'VMware', 'VirtualBox', 'KVM', 'Proxmox', 'Rsync'],
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: t.skills.categories[6].title,
      skills: ['TCP/IP', 'DNS', 'DHCP', 'HTTP/HTTPS', 'VPN', 'VLAN', 'Firewall', 'SSH'],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: t.skills.categories[7].title,
      skills: ['Python', 'Java', 'Golang', 'Linux (Ubuntu, Manjaro, Pop!_OS)', 'Windows'],
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const experienceTags = [
    ['React', 'Vite', 'TailwindCSS', 'Gandi', 'VPS Linux', 'Nginx', 'CI/CD', 'Security'],
    ['Azure', 'AKS', 'Kafka', 'Strimzi', 'Prometheus', 'Grafana', 'EFK'],
    ['Docker', 'Kubernetes', 'CI/CD', 'Full-Stack'],
    ['Laravel', 'MySQL', 'Bootstrap'],
    ['JavaFX', 'MySQL', 'RFID', 'Inventory'],
  ];

  const experiences = t.experience.items.map((exp, i) => ({
    ...exp,
    tags: experienceTags[i],
  }));

  const projectMeta = [
    { tags: ['DevOps', 'VPS Linux', 'Nginx', 'Bash CI/CD', 'Security', 'UFW / Fail2ban', 'TLS/SSL', 'PM2'], icon: <Shield className="w-8 h-8" />, gradient: 'from-fuchsia-600 to-purple-600' },
    { tags: ['React', 'Vite', 'TailwindCSS', 'Gandi', 'Production', 'Hosting'], icon: <Globe className="w-8 h-8" />, gradient: 'from-blue-600 to-indigo-500', link: 'https://geodetectionreseaux.fr' },
    { tags: ['Jenkins', 'SonarCloud', 'Nexus', 'Docker', 'Trivy', 'K8s', 'Terraform', 'AKS', 'Prometheus', 'Grafana'], icon: <GitBranch className="w-8 h-8" />, gradient: 'from-brand-600 to-cyan-500' },
    { tags: ['OpenStack', 'Kubernetes', 'Ansible', 'Magnum', 'Heat', 'Prometheus', 'Grafana', 'Angular', 'Spring Boot'], icon: <Cloud className="w-8 h-8" />, gradient: 'from-purple-600 to-brand-500' },
    { tags: ['Azure', 'AKS', 'Kafka', 'Strimzi', 'Helm', 'Prometheus', 'EFK'], icon: <Server className="w-8 h-8" />, gradient: 'from-teal-500 to-emerald-500' },
    { tags: ['Terraform', 'Ansible', 'Bash', 'Multi-Cloud', 'IaC'], icon: <Layers className="w-8 h-8" />, gradient: 'from-amber-500 to-orange-500' },
    { tags: ['Zabbix', 'Linux', 'Windows', 'Monitoring', 'Alerting', 'Metrics', 'CPU', 'Memory', 'Disk', 'Bandwidth'], icon: <Activity className="w-8 h-8" />, gradient: 'from-green-500 to-emerald-500' },
    { tags: ['pfSense', 'OpenVPN', 'Snort', 'Firewall', 'IDS', 'LAN', 'DMZ', 'WAN', 'Security', 'Network'], icon: <Shield className="w-8 h-8" />, gradient: 'from-red-500 to-rose-500' },
    { tags: ['Microservices', 'Authentication', 'Docker', 'Spring Boot', 'API Gateway', 'Cloud', 'MySQL', 'REST API'], icon: <Server className="w-8 h-8" />, gradient: 'from-blue-500 to-indigo-500' },
    { tags: ['Laravel', 'MySQL', 'Bootstrap', 'PHP', 'MVC', 'CRUD', 'HR Management', 'Web App'], icon: <Users className="w-8 h-8" />, gradient: 'from-pink-500 to-purple-500' },
  ];

  const projects = t.projects.items.map((proj, i) => ({
    ...proj,
    ...projectMeta[i],
  }));

  const certifications = t.certifications.items.map((cert) => ({
    ...cert,
    icon: <Globe className="w-8 h-8" />,
  }));

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      {dark && <NightSky />}
      <NavBar
        t={t}
        navIds={navIds}
        onNavClick={scrollTo}
        cvLink={cvLinks[language]}
        language={language}
        toggleLanguage={toggleLanguage}
        dark={dark}
        toggleTheme={() => setDark(!dark)}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <Hero
        t={t}
        language={language}
        onProjectsClick={() => scrollTo('projects')}
        onContactClick={() => scrollTo('contact')}
      />

      <About t={t} />

      <Skills t={t} skillCategories={skillCategories} />

      <Experience t={t} experiences={experiences} />

      <Projects t={t} projects={projects} />

      <Certifications t={t} certifications={certifications} />

      <Education t={t} />

      <Contact t={t} />

      <Footer t={t} />
    </div>
  );
}
