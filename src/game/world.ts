import type { LabWorld, LocalizedText, Pod } from './types';

export const t = (en: string, fr: string): LocalizedText => ({ en, fr });

export function createWorld(overrides: Partial<LabWorld> = {}): LabWorld {
  return {
    scene: 'shell',
    host: 'ops-lab',
    files: {},
    images: [],
    containers: [],
    nodes: [],
    pods: [],
    deployments: [],
    configFixed: false,
    disk: { sizeGb: 40, baseUsedGb: 13.4 },
    logs: [{ path: '/var/log/syslog', sizeGb: 0.2 }],
    services: { sshd: 'active', cron: 'active' },
    seq: 1,
    ...overrides,
  };
}

export function cloneWorld(world: LabWorld): LabWorld {
  return {
    ...world,
    files: { ...world.files },
    images: [...world.images],
    containers: world.containers.map((container) => ({ ...container })),
    nodes: world.nodes.map((node) => ({ ...node })),
    pods: world.pods.map((pod) => ({ ...pod })),
    deployments: world.deployments.map((deployment) => ({ ...deployment })),
    disk: { ...world.disk },
    logs: world.logs.map((log) => ({ ...log })),
    services: { ...world.services },
  };
}

const round1 = (value: number) => Math.round(value * 10) / 10;

export function diskUsedGb(world: LabWorld): number {
  return round1(world.disk.baseUsedGb + world.logs.reduce((total, log) => total + log.sizeGb, 0));
}

export function diskPercent(world: LabWorld): number {
  return Math.min(100, Math.round((diskUsedGb(world) / world.disk.sizeGb) * 100));
}

export function formatSize(sizeGb: number): string {
  if (sizeGb <= 0) return '0';
  if (sizeGb < 1) return `${Math.round(sizeGb * 1024)}M`;
  return `${Number.isInteger(sizeGb) ? sizeGb.toFixed(0) : sizeGb.toFixed(1)}G`;
}

/** Deterministic Kubernetes-like name suffix (no Math.random, so tests are stable). */
export function nameSuffix(seed: number, length = 5): string {
  const alphabet = 'bcdfghjklmnpqrstvwxz2456789';
  let value = (Math.imul(seed + 7, 2654435761) >>> 0) || 1;
  let suffix = '';
  for (let index = 0; index < length; index += 1) {
    suffix += alphabet[value % alphabet.length];
    value = (Math.imul(value ^ (value >>> 13), 1274126177) + index + 1) >>> 0;
  }
  return suffix;
}

export function hexId(seed: number): string {
  let value = (Math.imul(seed + 3, 2246822519) >>> 0) || 1;
  let id = '';
  for (let index = 0; index < 12; index += 1) {
    id += (value % 16).toString(16);
    value = (Math.imul(value ^ (value >>> 11), 3266489917) + index + 1) >>> 0;
  }
  return id;
}

export function imageBase(image: string): string {
  return image.split(':')[0].split('/').pop() ?? image;
}

export function withTag(image: string): string {
  return image.includes(':') ? image : `${image}:latest`;
}

export type ResourceKind = 'pods' | 'deployments' | 'nodes' | 'services' | 'all' | 'configmaps' | 'namespaces' | 'hpa';

const resourceAliases: Record<string, ResourceKind> = {
  pod: 'pods', pods: 'pods', po: 'pods',
  deployment: 'deployments', deployments: 'deployments', deploy: 'deployments',
  node: 'nodes', nodes: 'nodes', no: 'nodes',
  service: 'services', services: 'services', svc: 'services',
  all: 'all',
  configmap: 'configmaps', configmaps: 'configmaps', cm: 'configmaps',
  namespace: 'namespaces', namespaces: 'namespaces', ns: 'namespaces',
  hpa: 'hpa', horizontalpodautoscaler: 'hpa', horizontalpodautoscalers: 'hpa',
};

export function resourceKind(value: string | undefined): ResourceKind | null {
  if (!value) return null;
  return resourceAliases[value.toLowerCase().split('/')[0]] ?? null;
}

/** Reads "deployment/api", "deploy api" or "deployment api" from kubectl args. */
export function deploymentTarget(args: string[]): string | null {
  const [first, second] = args;
  if (!first) return null;
  if (first.includes('/')) {
    const [kind, name] = first.split('/');
    return resourceKind(kind) === 'deployments' && name ? name : null;
  }
  return resourceKind(first) === 'deployments' && second ? second : null;
}

export function podsOf(world: LabWorld, app: string): Pod[] {
  return world.pods.filter((pod) => pod.app === app);
}

export function allPodsRunning(world: LabWorld): boolean {
  return world.pods.length > 0 && world.pods.every((pod) => pod.status === 'Running');
}

export function hasTransitions(world: LabWorld): boolean {
  return world.pods.some((pod) => pod.status === 'ContainerCreating' || pod.status === 'Terminating');
}

/** Whether a freshly started pod of this app will come up healthy. */
export function podWillBeHealthy(world: LabWorld, app: string): boolean {
  return app !== 'api' || world.configFixed;
}

export function leastLoadedWorker(world: LabWorld): string {
  const workers = world.nodes.filter((node) => node.role === 'worker');
  if (workers.length === 0) return 'worker-01';
  const load = (name: string) => world.pods.filter((pod) => pod.node === name && pod.status !== 'Terminating').length;
  return workers.reduce((best, node) => (load(node.name) < load(best.name) ? node : best), workers[0]).name;
}

export function logDirectory(path: string): string {
  const parts = path.split('/');
  return parts.length > 4 ? parts.slice(0, 4).join('/') : path;
}

export function httpHealthy(world: LabWorld): boolean {
  return world.services.nginx === 'active';
}

export function levenshtein(a: string, b: string): number {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}
