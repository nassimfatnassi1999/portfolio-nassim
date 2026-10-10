import type { ReactNode } from 'react';
import { Activity, Boxes, Cloud, Server, Settings2, Workflow } from 'lucide-react';
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
  domainMembers?: string[];
  className?: string;
};

function CapabilityPanel({ id, title, icon: Icon, children, layer, scope, domainMembers, className = '' }: CapabilityPanelProps) {
  return (
    <SurfaceCard
      as="article"
      data-capability-group={id}
      data-layer={layer}
      data-scope={scope}
      data-domain-members={domainMembers?.join(' ')}
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

function RelationshipLabel({ relationship, label, direction = 'right' }: { relationship: string; label: string; direction?: 'right' | 'up' }) {
  return (
    <p
      data-relationship={relationship}
      className="hidden items-center justify-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 lg:flex"
    >
      <span aria-hidden="true">{direction === 'up' ? '↑' : '→'}</span> {label}
    </p>
  );
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
          <CapabilityPanel id="foundations" title={portfolio.labels.foundations} icon={Server} domainMembers={['systems', 'networking']} className="lg:col-span-12">
            <div className="grid gap-4 sm:grid-cols-2">
              <DomainSummary domain={domain('systems')} />
              <div data-capability-group="networking"><DomainSummary domain={domain('networking')} /></div>
            </div>
          </CapabilityPanel>

          <CapabilityPanel id="virtualization" title={domain('virtualization').label} icon={Boxes} layer="compute-platforms" className="lg:col-span-6">
            <p>{domain('virtualization').description}</p>
          </CapabilityPanel>
          <CapabilityPanel id="cloud-platforms" title={portfolio.labels.cloudPlatforms} icon={Cloud} layer="compute-platforms" className="lg:col-span-6">
            <p>{domain('cloud').description}</p>
          </CapabilityPanel>

          <div className="lg:col-span-12"><RelationshipLabel relationship="runs-on" label={portfolio.labels.runsOn} direction="up" /></div>

          <CapabilityPanel id="runtime-delivery" title={portfolio.labels.runtimeDelivery} icon={Workflow} domainMembers={['containers', 'middleware', 'application-workloads']} className="lg:col-span-12">
            <div className="grid gap-4 sm:grid-cols-3">
              <DomainSummary domain={domain('containers')} />
              <DomainSummary domain={domain('middleware')} />
              <div data-capability-group="application-workloads">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{portfolio.labels.applicationWorkloads}</p>
                <p>{portfolio.labels.applicationWorkloadsDescription}</p>
              </div>
            </div>
          </CapabilityPanel>

          <CapabilityPanel id="automation" title={portfolio.labels.automation} icon={Settings2} scope="cross-cutting" domainMembers={['infrastructure-as-code', 'scripting', 'devops-cicd']} className="lg:col-span-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">{portfolio.labels.crossCutting}</p>
            <RelationshipLabel relationship="delivers-to" label={portfolio.labels.deliversTo} />
            <div className="mt-3 space-y-3"><DomainSummary domain={domain('infrastructure-as-code')} /><DomainSummary domain={domain('scripting')} /><DomainSummary domain={domain('devops-cicd')} /></div>
          </CapabilityPanel>
          <CapabilityPanel id="observability" title={domain('observability').label} icon={Activity} scope="cross-cutting" className="lg:col-span-6">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">{portfolio.labels.crossCutting}</p>
            <RelationshipLabel relationship="observes" label={portfolio.labels.observes} />
            <p className="mt-3">{domain('observability').description}</p>
          </CapabilityPanel>
        </div>
      </div>
    </Section>
  );
}
