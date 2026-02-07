import { useState, useEffect, useRef } from 'react';
import {
  Moon, Sun, Menu, X, Mail, Phone, MapPin, Linkedin, Github,
  ChevronDown, Cloud, Server, Shield, Container,
  GitBranch, Activity, Network, Award, GraduationCap,
  Code2, Layers, HardDrive,
  ArrowRight, Globe, Zap, BookOpen, Languages, Users
} from 'lucide-react';
import { translations } from './translations';

/* ─── Intersection Observer Hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated Section Wrapper ─── */
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, inView } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
    >
      {children}
    </section>
  );
}

/* ─── Typing Effect for Hero ─── */
function TypingText({ texts }: { texts: string[] }) {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) setCharIndex(charIndex + 1);
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (charIndex > 0) setCharIndex(charIndex - 1);
        else { setDeleting(false); setTextIndex((textIndex + 1) % texts.length); }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts]);

  return (
    <span className="font-mono">
      {texts[textIndex].slice(0, charIndex)}
      <span className="animate-terminal-blink text-terminal-green">▎</span>
    </span>
  );
}

/* ═══════════════════════════ MAIN APP ═══════════════════════════ */

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group">
            <img
              src="/photo-cv.png"
              alt="NF"
              className="w-9 h-9 rounded-lg object-cover group-hover:scale-110 transition-transform ring-1 ring-brand-500/30"
            />
            <span className="hidden sm:inline font-mono text-sm text-gray-500 dark:text-gray-400">~/nassim</span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {t.nav.items.map((item, idx) => (
              <button
                key={navIds[idx]}
                onClick={() => scrollTo(navIds[idx])}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href={cvLinks[language]}
              download
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" /> {t.nav.resume}
            </a>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle language"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? 'FR' : 'EN'}
            </button>
            <button
              onClick={() => setDark(!dark)}
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
                onClick={() => scrollTo(navIds[idx])}
                className="block w-full text-left px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section id="home" className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl animate-float" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-terminal-cyan/10 dark:bg-terminal-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-terminal-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left — Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6 border border-brand-500/20">
                <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                {t.hero.badge}
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
                <span className="text-gray-900 dark:text-white">Nassim</span><br />
                <span className="gradient-text">Fatnassi Hnifi</span>
              </h1>

              <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-6 min-h-[2.5rem]">
                <TypingText key={language} texts={[...t.hero.typingTexts]} />
              </div>

              <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
                {t.hero.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo('projects')}
                  className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-brand-500/25 hover:scale-105 transition-all"
                >
                  {t.hero.viewProjects} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="px-7 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-brand-500 dark:hover:border-brand-500 hover:scale-105 transition-all"
                >
                  {t.hero.getInTouch}
                </button>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 mt-12">
                {t.hero.stats.map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Terminal Card */}
            <div className="animate-fade-in hidden lg:block" style={{ animationDelay: '0.3s' }}>
              <div className="terminal-window animate-pulse-glow">
                <div className="terminal-header">
                  <span className="terminal-dot bg-red-500" />
                  <span className="terminal-dot bg-yellow-500" />
                  <span className="terminal-dot bg-green-500" />
                  <span className="ml-4 text-xs text-gray-500 font-mono">nassim@cloud ~ </span>
                </div>
                <div className="terminal-body text-gray-300 space-y-2">
                  <p><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> whoami</p>
                  <p className="text-white">nassim.fatnassi — Cloud & DevOps Engineer</p>
                  <p className="mt-3"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> cat skills.yaml</p>
                  <p className="text-terminal-amber">cloud:</p>
                  <p className="pl-4">- AWS, Azure, GCP, OpenStack</p>
                  <p className="text-terminal-amber">containers:</p>
                  <p className="pl-4">- Docker, Kubernetes, Helm</p>
                  <p className="text-terminal-amber">iac & automation:</p>
                  <p className="pl-4">- Terraform, Ansible, Bash</p>
                  <p className="text-terminal-amber">cicd:</p>
                  <p className="pl-4">- Jenkins, GitLab CI, ArgoCD</p>
                  <p className="text-terminal-amber">monitoring:</p>
                  <p className="pl-4">- Prometheus, Grafana, EFK</p>
                  <p className="mt-3"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> kubectl get nodes</p>
                  <p className="text-green-400">NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS&nbsp;&nbsp;ROLES&nbsp;&nbsp;&nbsp;AGE</p>
                  <p>node-01&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;master&nbsp;&nbsp;365d</p>
                  <p>node-02&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;worker&nbsp;&nbsp;365d</p>
                  <p>node-03&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ready&nbsp;&nbsp;&nbsp;worker&nbsp;&nbsp;365d</p>
                  <p className="mt-2"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> <span className="animate-terminal-blink">▎</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16 lg:mt-8">
            <ChevronDown className="w-7 h-7 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── ABOUT ─── */}
      <Section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">{t.about.heading[0]}<span className="gradient-text">{t.about.heading[1]}</span></h2>
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
              <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{t.about.jobTitle}</p>
              <div className="flex gap-3 mb-6">
                <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/-a1698a186/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com/nassimfatnassi1999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:Fatnassihnifi.nassim@proton.me" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
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
                  {t.about.profileP1} <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.about.profileP1Bold1}</span> {t.about.profileP1Mid} <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.about.profileP1Bold2}</span>{t.about.profileP1End}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t.about.profileP2Start}<span className="font-semibold text-terminal-cyan">{t.about.profileP2H1}</span>{t.about.profileP2Mid1}<span className="font-semibold text-terminal-cyan">{t.about.profileP2H2}</span>{t.about.profileP2Mid2}<span className="font-semibold text-terminal-cyan">{t.about.profileP2H3}</span>{t.about.profileP2Mid3}<span className="font-semibold text-terminal-cyan">{t.about.profileP2H4}</span>{t.about.profileP2End}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Cloud className="w-5 h-5" />, title: t.about.highlights[0].title, desc: t.about.highlights[0].desc },
                  { icon: <Container className="w-5 h-5" />, title: t.about.highlights[1].title, desc: t.about.highlights[1].desc },
                  { icon: <Shield className="w-5 h-5" />, title: t.about.highlights[2].title, desc: t.about.highlights[2].desc },
                  { icon: <Zap className="w-5 h-5" />, title: t.about.highlights[3].title, desc: t.about.highlights[3].desc },
                ].map((item, i) => (
                  <div key={i} className="glass-card glow-border p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400 flex-shrink-0">
                      {item.icon}
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

      {/* ─── SKILLS ─── */}
      <Section id="skills" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">{t.skills.heading[0]}<span className="gradient-text">{t.skills.heading[1]}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.skills.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((cat, i) => (
              <div key={i} className="glass-card p-6 hover:scale-[1.03] transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <span key={si} className="skill-badge text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── EXPERIENCE ─── */}
      <Section id="experience" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">{t.experience.heading[0]}<span className="gradient-text">{t.experience.heading[1]}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="timeline-line hidden md:block" />

            <div className="space-y-8">
              {experiences.map((exp, i) => (
                <div key={i} className="relative md:pl-16">
                  {/* Dot */}
                  <div className="hidden md:flex absolute left-4 top-8 w-5 h-5 rounded-full bg-brand-500 border-4 border-white dark:border-gray-950 z-10" />
                  <div className="glass-card p-6 sm:p-8 hover:shadow-xl transition-shadow">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                        <p className="text-brand-600 dark:text-brand-400 font-semibold">{exp.company}</p>
                      </div>
                      <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((d, di) => (
                        <li key={di} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag, ti) => (
                        <span key={ti} className="skill-badge text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── PROJECTS ─── */}
      <Section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">{t.projects.heading[0]}<span className="gradient-text">{t.projects.heading[1]}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{t.projects.subtitle}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <div key={i} className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                {/* Header */}
                <div className={`h-44 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="relative z-10 text-white text-center px-6">
                    <div className="w-14 h-14 mx-auto rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {project.icon}
                    </div>
                    <p className="text-sm font-medium opacity-80">{project.subtitle}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, ti) => (
                      <span key={ti} className="skill-badge text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CERTIFICATIONS ─── */}
      <Section id="certifications" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white"><span className="gradient-text">{t.certifications.heading}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="max-w-2xl mx-auto">
            {certifications.map((cert, i) => (
              <a
                key={i}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-8 flex items-center gap-6 hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  {cert.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{cert.title}</h3>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold">{cert.issuer}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cert.date}</p>
                </div>
                <Award className="w-8 h-8 text-terminal-amber ml-auto flex-shrink-0 group-hover:rotate-12 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── EDUCATION ─── */}
      <Section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white"><span className="gradient-text">{t.education.heading}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {t.education.items.map((edu, i) => (
              <div key={i} className="glass-card p-8 sm:p-10 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-brand-600 dark:text-brand-400 font-semibold text-lg">
                      {edu.school}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-2">{edu.period} · {edu.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {edu.tags.map((tag, ti) => (
                        <span key={ti} className="skill-badge text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CONTACT ─── */}
      <Section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">{t.contact.heading[0]}<span className="gradient-text">{t.contact.heading[1]}</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t.contact.subtitle}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <a href="mailto:Fatnassihnifi.nassim@proton.me" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.contact.email}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">Fatnassihnifi.nassim@proton.me</p>
                </div>
              </a>

              <a href="tel:+21628021325" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
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

              <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/" target="_blank" rel="noopener noreferrer" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
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
                <p><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> {t.contact.terminalEcho}</p>
                <p className="text-white">{t.contact.terminalOutput}</p>
                <p className="mt-2"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> {t.contact.terminalMail}</p>
                <p className="text-terminal-amber">{t.contact.terminalSuccess}</p>
                <p className="mt-2"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> <span className="animate-terminal-blink">▎</span></p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── FOOTER ─── */}
      <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/photo-cv.png"
              alt="NF"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-brand-500/30"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi-a1698a186/-a1698a186/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com/nassimfatnassi1999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:Fatnassihnifi.nassim@proton.me" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
