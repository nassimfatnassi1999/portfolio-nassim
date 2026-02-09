import { Cloud, Container, Github, Globe, Linkedin, Mail, MapPin, Phone, Shield, Zap } from 'lucide-react';
import { Section } from './Section';
import { translations } from '../translations';

type Translation = (typeof translations)[keyof typeof translations];

type AboutProps = {
  t: Translation;
};

export function About({ t }: AboutProps) {
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
            <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{t.about.jobTitle}</p>
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
                {t.about.profileP1}{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.about.profileP1Bold1}</span>{' '}
                {t.about.profileP1Mid}{' '}
                <span className="text-brand-600 dark:text-brand-400 font-semibold">{t.about.profileP1Bold2}</span>
                {t.about.profileP1End}
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {t.about.profileP2Start}
                <span className="font-semibold text-terminal-cyan">{t.about.profileP2H1}</span>
                {t.about.profileP2Mid1}
                <span className="font-semibold text-terminal-cyan">{t.about.profileP2H2}</span>
                {t.about.profileP2Mid2}
                <span className="font-semibold text-terminal-cyan">{t.about.profileP2H3}</span>
                {t.about.profileP2Mid3}
                <span className="font-semibold text-terminal-cyan">{t.about.profileP2H4}</span>
                {t.about.profileP2End}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: <Cloud className="w-5 h-5" />, title: t.about.highlights[0].title, desc: t.about.highlights[0].desc },
                { icon: <Container className="w-5 h-5" />, title: t.about.highlights[1].title, desc: t.about.highlights[1].desc },
                { icon: <Shield className="w-5 h-5" />, title: t.about.highlights[2].title, desc: t.about.highlights[2].desc },
                { icon: <Zap className="w-5 h-5" />, title: t.about.highlights[3].title, desc: t.about.highlights[3].desc },
              ].map((item, idx) => (
                <div key={idx} className="glass-card glow-border p-5 flex gap-4">
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
  );
}
