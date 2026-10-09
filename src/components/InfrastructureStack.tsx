import type { ReactNode } from 'react';
import { Activity, Boxes, Cloud, Network, Server, Settings2, Workflow } from 'lucide-react';
import type { LocalizedPortfolio, TechnologyDomain } from '../types/portfolio';
import { Section } from './Section';
import { SectionHeader } from './ui/SectionHeader';
import { SurfaceCard } from './ui/SurfaceCard';

type CapabilityPanelProps = {
  id: string;
  title: string;
  icon: typeof Server;
  children: ReactNode;
  layer?: string;
  scope?: string;
  className?: string;
};

function CapabilityPanel({ id, title, icon: Icon, children, layer, scope, className = '' }: CapabilityPanelProps) {
  return (
    <SurfaceCard
      as="article"
      data-capability-group={id}
      data-layer={layer}
      data-scope={scope}
      className={`relative p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          {scope && <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">{scope}</p>}
          <h3 className="font-bold text-slate-950 dark:text-slate-50">{title}</h3>
        </div>
      </div>
      <div className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{children}</div>
    </SurfaceCard>
  );
}

function DomainSummary({ domain }: { domain: TechnologyDomain }) {
  return <div><p className="font-semibold text-slate-800 dark:text-slate-200">{domain.label}</p><p>{domain.description}</p></div>;
}

export function InfrastructureStack({ portfolio }: { portfolio: LocalizedPortfolio }) {
  const domain = (id: string) => {
    const match = portfolio.technologyDomains.find((item) => item.id === id);
    if (!match) throw new Error(`Missing technology domain: ${id}`);
    return match;
  };

  return (
    <Section id="infrastructure" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={`05 / ${portfolio.labels.infrastructure}`} title={portfolio.labels.infrastructure} description={portfolio.labels.infrastructureIntro} />

        <div className="relative mt-12 grid gap-5 lg:grid-cols-12">
          <CapabilityPanel id="foundations" title={portfolio.labels.foundations} icon={Server} className="lg:col-span-12">
            <DomainSummary domain={domain('systems')} />
          </CapabilityPanel>

          <CapabilityPanel id="virtualization" title={domain('virtualization').label} icon={Boxes} layer="compute-platforms" className="lg:col-span-6">
            <p>{domain('virtualization').description}</p>
          </CapabilityPanel>
          <CapabilityPanel id="cloud-platforms" title={portfolio.labels.cloudPlatforms} icon={Cloud} layer="compute-platforms" className="lg:col-span-6">
            <p>{domain('cloud').description}</p>
          </CapabilityPanel>

          <CapabilityPanel id="runtime-delivery" title={portfolio.labels.runtimeDelivery} icon={Workflow} className="lg:col-span-12">
            <div className="grid gap-4 sm:grid-cols-3">
              <DomainSummary domain={domain('containers')} />
              <DomainSummary domain={domain('middleware')} />
              <DomainSummary domain={domain('devops-cicd')} />
            </div>
          </CapabilityPanel>

          <CapabilityPanel id="automation" title={portfolio.labels.automation} icon={Settings2} scope="cross-cutting" className="lg:col-span-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">{portfolio.labels.crossCutting}</p>
            <div className="space-y-3"><DomainSummary domain={domain('infrastructure-as-code')} /><DomainSummary domain={domain('scripting')} /></div>
          </CapabilityPanel>
          <CapabilityPanel id="networking" title={domain('networking').label} icon={Network} className="lg:col-span-4">
            <p>{domain('networking').description}</p>
          </CapabilityPanel>
          <CapabilityPanel id="observability" title={domain('observability').label} icon={Activity} scope="cross-cutting" className="lg:col-span-4">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">{portfolio.labels.crossCutting}</p>
            <p>{domain('observability').description}</p>
          </CapabilityPanel>
        </div>
      </div>
    </Section>
  );
}
