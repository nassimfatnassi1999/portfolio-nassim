import { useState, useEffect, useRef } from 'react';
import {
  Moon, Sun, Menu, X, Mail, Phone, MapPin, Linkedin, Github,
  ChevronDown, Cloud, Server, Shield, Container,
  GitBranch, Activity, Network, Award, GraduationCap,
  Code2, Layers, HardDrive,
  ArrowRight, Globe, Zap, BookOpen
} from 'lucide-react';

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

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    setDark(saved ? saved === 'dark' : true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const navItems = ['Home', 'About', 'Skills', 'Experience', 'Projects', 'Certifications', 'Education', 'Contact'];

  /* ─── DATA ─── */

  const skillCategories = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'Cloud Platforms',
      skills: ['AWS', 'Google Cloud', 'Azure', 'OpenStack'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Container className="w-6 h-6" />,
      title: 'Containers & Orchestration',
      skills: ['Docker', 'Docker Compose', 'Kubernetes', 'Helm', 'AKS', 'Strimzi'],
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: 'CI/CD & DevOps Tools',
      skills: ['Git', 'GitHub', 'GitLab CI/CD', 'Jenkins', 'ArgoCD', 'Vault', 'SonarCloud', 'Nexus', 'Trivy'],
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Infrastructure as Code',
      skills: ['Terraform', 'OpenTofu', 'Ansible', 'Bash Scripting', 'Heat (OpenStack)'],
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Monitoring & Logging',
      skills: ['Prometheus', 'Grafana', 'EFK Stack', 'Promtail', 'Loki'],
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: 'Storage & Virtualization',
      skills: ['NAS/SAN', 'NFS', 'FTP', 'SMB', 'Ceph', 'RAID', 'VMware', 'VirtualBox', 'KVM', 'Proxmox'],
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'Networking & Security',
      skills: ['TCP/IP', 'DNS', 'DHCP', 'HTTP/HTTPS', 'VPN', 'VLAN', 'Firewall', 'SSH'],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Code2 className="w-6 h-6" />,
      title: 'Programming & OS',
      skills: ['Python', 'Java', 'Golang', 'Linux (Ubuntu, Manjaro, Pop!_OS)', 'Windows'],
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const experiences = [
    {
      role: 'Cloud Engineer',
      company: 'Devoteam',
      period: 'Feb 2025 – Aug 2025',
      description: [
        'Designed, deployed, and automated cloud infrastructures on Azure.',
        'Implemented a Kafka cluster in AKS using the Strimzi operator.',
        'Managed production monitoring and observability with Prometheus, Grafana, and the EFK stack.',
      ],
      tags: ['Azure', 'AKS', 'Kafka', 'Strimzi', 'Prometheus', 'Grafana', 'EFK'],
    },
    {
      role: 'DevOps Engineer Intern',
      company: 'Capgemini Engineering',
      period: 'Jun 2024 – Aug 2024',
      description: [
        'Designed and implemented a full-stack web application with fully automated CI/CD pipelines.',
        'Containerized and orchestrated services using Docker and Kubernetes, improving availability and scalability.',
      ],
      tags: ['Docker', 'Kubernetes', 'CI/CD', 'Full-Stack'],
    },
    {
      role: 'Full Stack Engineer Intern',
      company: 'BH Bank',
      period: 'Jul 2023 – Sep 2023',
      description: [
        'Developed an internal trainee management application using Laravel, MySQL, and Bootstrap.',
        'Digitized and optimized HR workflows for the organization.',
      ],
      tags: ['Laravel', 'MySQL', 'Bootstrap'],
    },
    {
      role: 'IT Technician Intern',
      company: 'Tunisair Technics',
      period: 'Feb 2021 – Jun 2021',
      description: [
        'Built an RFID-based stock management system with JavaFX interface and MySQL database.',
        'Enabled real-time tracking of aircraft parts across the warehouse.',
      ],
      tags: ['JavaFX', 'MySQL', 'RFID', 'Inventory'],
    },
  ];

  const projects = [
    {
      title: 'Modern CI/CD Architecture for DevOps',
      subtitle: 'End-to-End DevOps Pipeline',
      description:
        'Built a complete CI/CD pipeline automating deployment, testing, and monitoring of applications in real time. Integrated Jenkins, SonarCloud, Nexus, Docker, Trivy, Kubernetes, Terraform, AKS, Prometheus, and Grafana to ensure quality, security, and reliability.',
      tags: ['Jenkins', 'SonarCloud', 'Nexus', 'Docker', 'Trivy', 'K8s', 'Terraform', 'AKS', 'Prometheus', 'Grafana'],
      icon: <GitBranch className="w-8 h-8" />,
      gradient: 'from-brand-600 to-cyan-500',
    },
    {
      title: 'Cloud Infrastructure with OpenStack',
      subtitle: 'IaaS/PaaS Private Cloud',
      description:
        'Designed and deployed a Cloud infrastructure using OpenStack, integrating an automated Kubernetes cluster for microservices deployment. Used Nova, Neutron, Keystone, Glance, Cinder, Swift, Heat, Horizon, and Magnum with Ansible, Prometheus, and Grafana.',
      tags: ['OpenStack', 'Kubernetes', 'Ansible', 'Magnum', 'Heat', 'Prometheus', 'Grafana', 'Angular', 'Spring Boot'],
      icon: <Cloud className="w-8 h-8" />,
      gradient: 'from-purple-600 to-brand-500',
    },
    {
      title: 'Azure Kafka Cluster (Strimzi on AKS)',
      subtitle: 'Event Streaming Platform',
      description:
        'Deployed a production-grade Kafka cluster on Azure Kubernetes Service using the Strimzi operator. Implemented full observability with Prometheus and Grafana dashboards and log aggregation with EFK stack.',
      tags: ['Azure', 'AKS', 'Kafka', 'Strimzi', 'Helm', 'Prometheus', 'EFK'],
      icon: <Server className="w-8 h-8" />,
      gradient: 'from-teal-500 to-emerald-500',
    },
    {
      title: 'Automated Infrastructure Provisioning',
      subtitle: 'Terraform + Ansible',
      description:
        'Created reusable Terraform modules and Ansible playbooks for automated cloud infrastructure provisioning, configuration management, and application deployment across multi-cloud environments.',
      tags: ['Terraform', 'Ansible', 'Bash', 'Multi-Cloud', 'IaC'],
      icon: <Layers className="w-8 h-8" />,
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const certifications = [
    {
      title: 'MultiCloud Network Associate',
      issuer: 'Aviatrix',
      date: 'Expires: Sep 20, 2028',
      icon: <Globe className="w-8 h-8" />,
    },
  ];

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

      {/* ─── NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              NF
            </div>
            <span className="hidden sm:inline font-mono text-sm text-gray-500 dark:text-gray-400">~/nassim</span>
          </button>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="/Nassim_Fatnassi_Hnifi_CV.pdf"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-lg hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:scale-105"
            >
              <BookOpen className="w-4 h-4" /> Resume
            </a>
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
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
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
                Available for opportunities
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
                <span className="text-gray-900 dark:text-white">Nassim</span><br />
                <span className="gradient-text">Fatnassi Hnifi</span>
              </h1>

              <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-6 min-h-[2.5rem]">
                <TypingText texts={[
                  'Cloud & DevOps Engineer',
                  'Platform Engineer',
                  'System Administrator',
                  'Infrastructure Architect',
                ]} />
              </div>

              <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
                Passionate about automation and system performance. I design reliable, modern, and scalable infrastructures combining technical expertise, rigor, and an innovative mindset.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => scrollTo('projects')}
                  className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-brand-500/25 hover:scale-105 transition-all"
                >
                  View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('contact')}
                  className="px-7 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-brand-500 dark:hover:border-brand-500 hover:scale-105 transition-all"
                >
                  Get in Touch
                </button>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: '4+', label: 'Cloud Platforms' },
                  { value: '4', label: 'Professional Roles' },
                  { value: '3', label: 'Languages Spoken' },
                ].map((s, i) => (
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
                  <p className="text-terminal-amber">iac:</p>
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
            <h2 className="section-heading text-gray-900 dark:text-white">About <span className="gradient-text">Me</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="glass-card p-8 lg:col-span-1 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-lg">
                NF
              </div>
              <h3 className="text-xl font-bold mb-1">Nassim Fatnassi Hnifi</h3>
              <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">Cloud & DevOps Engineer</p>
              <div className="flex gap-3 mb-6">
                <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
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
                  <Globe className="w-4 h-4 text-brand-500 flex-shrink-0" /> English · French · Arabic
                </div>
              </div>
            </div>

            {/* Bio + Highlights */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Profile</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Cloud & DevOps Engineer passionate about <span className="text-brand-600 dark:text-brand-400 font-semibold">automation</span> and <span className="text-brand-600 dark:text-brand-400 font-semibold">system performance</span>. I combine technical expertise, rigor, and an innovative mindset to design reliable, modern, and scalable infrastructures.
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  From provisioning cloud resources on <span className="font-semibold text-terminal-cyan">AWS, Azure, GCP, and OpenStack</span> to orchestrating containers with <span className="font-semibold text-terminal-cyan">Kubernetes</span>, building CI/CD pipelines with <span className="font-semibold text-terminal-cyan">Jenkins and GitLab CI</span>, and implementing observability with <span className="font-semibold text-terminal-cyan">Prometheus & Grafana</span> — I deliver end-to-end infrastructure solutions.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Cloud className="w-5 h-5" />, title: 'Cloud Architecture', desc: 'Multi-cloud design on AWS, Azure, GCP & OpenStack' },
                  { icon: <Container className="w-5 h-5" />, title: 'Container Orchestration', desc: 'Docker, Kubernetes, Helm, Strimzi' },
                  { icon: <Shield className="w-5 h-5" />, title: 'Security & Compliance', desc: 'Vault, Trivy, VPN, Firewall, SSH hardening' },
                  { icon: <Zap className="w-5 h-5" />, title: 'Automation & IaC', desc: 'Terraform, Ansible, Bash, ArgoCD GitOps' },
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
            <h2 className="section-heading text-gray-900 dark:text-white">Technical <span className="gradient-text">Skills</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">A comprehensive toolkit for building, deploying, and managing modern cloud-native infrastructure.</p>
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
            <h2 className="section-heading text-gray-900 dark:text-white">Professional <span className="gradient-text">Experience</span></h2>
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
            <h2 className="section-heading text-gray-900 dark:text-white">Featured <span className="gradient-text">Projects</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Academic and professional projects showcasing cloud architecture, CI/CD pipelines, and infrastructure automation.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
            <h2 className="section-heading text-gray-900 dark:text-white"><span className="gradient-text">Certifications</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="max-w-2xl mx-auto">
            {certifications.map((cert, i) => (
              <div key={i} className="glass-card p-8 flex items-center gap-6 hover:shadow-xl transition-shadow hover:scale-[1.02]">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0">
                  {cert.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{cert.title}</h3>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold">{cert.issuer}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cert.date}</p>
                </div>
                <Award className="w-8 h-8 text-terminal-amber ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── EDUCATION ─── */}
      <Section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white"><span className="gradient-text">Education</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 sm:p-10 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white flex-shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    National Engineering Degree in Computer Science
                  </h3>
                  <p className="text-brand-600 dark:text-brand-400 font-semibold text-lg">
                    ESPRIT — Private Higher School of Engineering and Technology
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mt-2">Sep 2022 – Sep 2025 · Tunisia</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['Cloud Computing', 'DevOps', 'Software Engineering', 'Networking', 'Distributed Systems'].map((t, i) => (
                      <span key={i} className="skill-badge text-xs">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── CONTACT ─── */}
      <Section id="contact" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading text-gray-900 dark:text-white">Get in <span className="gradient-text">Touch</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brand-500 to-terminal-cyan mx-auto rounded-full mt-4" />
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Looking for a Cloud & DevOps Engineer or Platform Engineer? Let's talk about how I can help build and automate your infrastructure.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <a href="mailto:Fatnassihnifi.nassim@proton.me" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 break-all">Fatnassihnifi.nassim@proton.me</p>
                </div>
              </a>

              <a href="tel:+21628021325" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+216 28 021 325</p>
                </div>
              </a>

              <div className="glass-card glow-border p-6 flex items-center gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manouba, Tunis, Tunisia</p>
                </div>
              </div>

              <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi" target="_blank" rel="noopener noreferrer" className="glass-card glow-border p-6 flex items-center gap-5 hover:scale-[1.03] transition-all group">
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
                <p><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> echo "Let's build something amazing together"</p>
                <p className="text-white">Let's build something amazing together</p>
                <p className="mt-2"><span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> mail -s "Collaboration" Fatnassihnifi.nassim@proton.me</p>
                <p className="text-terminal-amber">Message sent successfully ✓</p>
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
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-terminal-cyan flex items-center justify-center text-white font-bold text-xs">
              NF
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Nassim Fatnassi Hnifi — Cloud & DevOps Engineer
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/nassim-fatnassi-hnifi" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all">
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
