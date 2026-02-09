import { ArrowRight, ChevronDown } from 'lucide-react';
import { translations } from '../translations';
import { TypingText } from './TypingText';

type Translation = (typeof translations)[keyof typeof translations];

type HeroProps = {
  t: Translation;
  onProjectsClick: () => void;
  onContactClick: () => void;
  language: 'en' | 'fr';
};

export function Hero({ t, onProjectsClick, onContactClick, language }: HeroProps) {
  return (
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
              <span className="text-gray-900 dark:text-white">Nassim</span>
              <br />
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
                onClick={onProjectsClick}
                className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-brand-500/25 hover:scale-105 transition-all"
              >
                {t.hero.viewProjects} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onContactClick}
                className="px-7 py-3.5 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:border-brand-500 dark:hover:border-brand-500 hover:scale-105 transition-all"
              >
                {t.hero.getInTouch}
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8 mt-12">
              {t.hero.stats.map((stat, idx) => (
                <div key={idx}>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
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
                <p>
                  <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> whoami
                </p>
                <p className="text-white">nassim.fatnassi — Cloud & DevOps Engineer</p>
                <p className="mt-3">
                  <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> cat skills.yaml
                </p>
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
                <p className="mt-3">
                  <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> kubectl get nodes
                </p>
                <p className="text-green-400">NAME        STATUS  ROLES   AGE</p>
                <p>node-01     Ready   master  365d</p>
                <p>node-02     Ready   worker  365d</p>
                <p>node-03     Ready   worker  365d</p>
                <p className="mt-2">
                  <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> <span className="animate-terminal-blink">▎</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16 lg:mt-8">
          <ChevronDown className="w-7 h-7 text-gray-400 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
