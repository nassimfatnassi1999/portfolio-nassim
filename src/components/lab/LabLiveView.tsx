import { Box, Boxes, FileText, Globe, HardDrive, Server, TerminalSquare } from 'lucide-react';
import type { ReactNode } from 'react';
import type { LabWorld, Pod, PodStatus, ServiceState } from '../../game/types';
import { diskPercent, diskUsedGb, formatSize, httpHealthy } from '../../game/world';

type LabLiveViewProps = {
  world: LabWorld;
  labels: Record<string, string>;
};

const podClasses: Record<PodStatus, string> = {
  Running: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200',
  CrashLoopBackOff: 'border-rose-500/45 bg-rose-500/10 text-rose-800 dark:text-rose-200',
  ContainerCreating: 'border-amber-500/45 bg-amber-500/10 text-amber-800 dark:text-amber-200',
  Terminating: 'border-slate-400/30 bg-slate-500/5 text-slate-500 dark:text-slate-500',
};

const dotClasses: Record<PodStatus | ServiceState | 'exited', string> = {
  Running: 'bg-emerald-500',
  active: 'bg-emerald-500',
  CrashLoopBackOff: 'bg-rose-500',
  failed: 'bg-rose-500',
  ContainerCreating: 'bg-amber-500',
  Terminating: 'bg-slate-400',
  inactive: 'bg-slate-400',
  exited: 'bg-slate-400',
};

function Dot({ state, pulse = false }: { state: keyof typeof dotClasses; pulse?: boolean }) {
  return <span aria-hidden="true" className={`lab-dot inline-block h-2 w-2 shrink-0 rounded-full ${dotClasses[state]} ${pulse ? 'lab-dot-pulse' : ''}`} />;
}

function PanelHeader({ icon, title, meta }: { icon: ReactNode; title: string; meta?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">
        {icon}
        {title}
      </p>
      {meta && <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{meta}</p>}
    </div>
  );
}

function PodChip({ pod }: { pod: Pod }) {
  return (
    <li
      data-pod={pod.name}
      data-status={pod.status}
      className={`lab-pod flex min-w-0 items-center gap-2 rounded-md border px-2 py-1.5 font-mono text-[11px] ${podClasses[pod.status]}`}
    >
      <Dot state={pod.status} pulse={pod.status === 'CrashLoopBackOff'} />
      <span className="min-w-0 flex-1 truncate">{pod.name}</span>
      <span className="shrink-0 text-[10px] opacity-80">{pod.status === 'CrashLoopBackOff' ? 'CrashLoop' : pod.status === 'ContainerCreating' ? 'Creating' : pod.status}</span>
    </li>
  );
}

function KubernetesView({ world, labels }: LabLiveViewProps) {
  return (
    <div className="space-y-4">
      <PanelHeader icon={<Boxes aria-hidden="true" className="h-4 w-4" />} title={labels.labLiveView} meta="cluster lab-k8s · v1.31.2" />
      <div role="group" className="flex flex-wrap gap-2" aria-label={labels.labDeployments}>
        {world.deployments.map((deployment) => {
          const running = world.pods.filter((pod) => pod.app === deployment.name && pod.status === 'Running').length;
          const healthy = running >= deployment.replicas;
          return (
            <span key={deployment.name} data-deployment={deployment.name} className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[11px] ${healthy ? 'border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'border-amber-500/40 text-amber-700 dark:text-amber-300'}`}>
              <Dot state={healthy ? 'Running' : 'ContainerCreating'} />
              deploy/{deployment.name} {running}/{deployment.replicas}
            </span>
          );
        })}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {world.nodes.map((node) => {
          const pods = world.pods.filter((pod) => pod.node === node.name);
          return (
            <div key={node.name} data-node={node.name} className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950/40">
              <p className="mb-2 flex items-center justify-between gap-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200"><Server aria-hidden="true" className="h-3.5 w-3.5 text-sky-500" />{node.name}</span>
                <span className="text-slate-500">{node.role === 'control-plane' ? 'control-plane' : 'worker'}</span>
              </p>
              {node.role === 'control-plane' ? (
                <ul className="flex flex-wrap gap-1.5">
                  {['etcd', 'kube-apiserver', 'scheduler', 'coredns'].map((name) => (
                    <li key={name} className="rounded border border-slate-300/70 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 dark:border-slate-700">{name}</li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-1.5">
                  {pods.map((pod) => <PodChip key={pod.name} pod={pod} />)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DockerView({ world, labels }: LabLiveViewProps) {
  const running = world.containers.filter((container) => container.status === 'running');
  return (
    <div className="space-y-4">
      <PanelHeader icon={<Box aria-hidden="true" className="h-4 w-4" />} title={labels.labLiveView} meta={`${world.host} · Docker Engine 27.3`} />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.labContainers} · {running.length}/{world.containers.length}</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {world.containers.map((container) => (
            <li key={container.id} data-container={container.name} data-status={container.status} className={`lab-pod flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2.5 font-mono text-[11px] ${container.status === 'running' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-300/70 bg-slate-500/5 opacity-70 dark:border-slate-700'}`}>
              <Dot state={container.status === 'running' ? 'Running' : 'exited'} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-800 dark:text-slate-100">{container.name}</span>
                <span className="block truncate text-slate-500">{container.image}{container.ports ? ` · ${container.ports.replace('0.0.0.0:', ':').replace('/tcp', '')}` : ''}</span>
              </span>
              <span className="shrink-0 text-[10px] uppercase text-slate-500">{container.status}</span>
            </li>
          ))}
          {world.containers.length === 0 && <li className="text-sm text-slate-500">{labels.labNoContainers}</li>}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.labImages}</p>
        <ul className="flex flex-wrap gap-1.5">
          {world.images.map((image) => <li key={image} className="technology-badge">{image}</li>)}
        </ul>
      </div>
    </div>
  );
}

function ServerView({ world, labels }: LabLiveViewProps) {
  const percent = diskPercent(world);
  const healthy = httpHealthy(world);
  const barColor = percent >= 90 ? 'bg-rose-500' : percent >= 75 ? 'bg-amber-500' : 'bg-emerald-500';
  const biggestLog = Math.max(...world.logs.map((log) => log.sizeGb), 1);
  return (
    <div className="space-y-4">
      <PanelHeader icon={<Server aria-hidden="true" className="h-4 w-4" />} title={labels.labLiveView} meta={`${world.host} · Ubuntu 24.04 LTS`} />
      <div data-http-status={healthy ? 200 : 502} className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2.5 font-mono text-xs ${healthy ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-200'}`}>
        <span className="flex items-center gap-2"><Globe aria-hidden="true" className="h-4 w-4" />{labels.labHttpCheck}: lb-01 → {world.host}:80</span>
        <span className="font-semibold">{healthy ? '200 OK' : '502 Bad Gateway'}</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
            <span className="flex items-center gap-1.5"><HardDrive aria-hidden="true" className="h-3.5 w-3.5" />{labels.labDisk} /</span>
            <span className="font-mono normal-case tracking-normal">{formatSize(diskUsedGb(world))} / {formatSize(world.disk.sizeGb)}</span>
          </p>
          <div role="meter" aria-label={labels.labDisk} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div data-disk-percent={percent} className={`lab-bar h-full rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
          </div>
          <p className={`mt-1 text-right font-mono text-[11px] ${percent >= 90 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>{percent}%</p>
          <ul className="mt-2 space-y-1.5">
            {world.logs.filter((log) => log.sizeGb > 0).map((log) => (
              <li key={log.path} className="font-mono text-[10px] text-slate-500">
                <span className="flex justify-between gap-2"><span className="truncate">{log.path}</span><span>{formatSize(log.sizeGb)}</span></span>
                <span aria-hidden="true" className="mt-0.5 block h-1 rounded-full bg-slate-200 dark:bg-slate-800"><span className={`lab-bar block h-full rounded-full ${log.sizeGb >= 5 ? 'bg-rose-500/80' : 'bg-sky-500/70'}`} style={{ width: `${Math.max(2, (log.sizeGb / biggestLog) * 100)}%` }} /></span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.labServices}</p>
          <ul className="space-y-1.5">
            {Object.entries(world.services).map(([name, state]) => (
              <li key={name} data-service={name} data-state={state} className="flex items-center justify-between gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 font-mono text-[11px] dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><Dot state={state} pulse={state === 'failed'} />{name}.service</span>
                <span className={state === 'active' ? 'text-emerald-600 dark:text-emerald-400' : state === 'failed' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}>{state}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ShellView({ world, labels }: LabLiveViewProps) {
  return (
    <div className="space-y-4">
      <PanelHeader icon={<TerminalSquare aria-hidden="true" className="h-4 w-4" />} title={labels.labSession} meta={`guest@${world.host} · bash 5.2 · tty1`} />
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.labFiles} · /home/guest</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.keys(world.files).sort().map((name) => (
            <li key={name} className="flex min-w-0 items-center gap-2 rounded-md border border-slate-200 px-2.5 py-2 font-mono text-[11px] text-slate-700 dark:border-slate-800 dark:text-slate-300">
              <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-sky-500" />
              <span className="truncate">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LabLiveView(props: LabLiveViewProps) {
  const view = {
    shell: <ShellView {...props} />,
    docker: <DockerView {...props} />,
    kubernetes: <KubernetesView {...props} />,
    server: <ServerView {...props} />,
  }[props.world.scene];
  return <div data-lab-scene={props.world.scene}>{view}</div>;
}
