import type { Locale, LocalizedText } from '../types/portfolio';

export type Tone = 'default' | 'muted' | 'success' | 'error' | 'warn' | 'accent' | 'info';

export interface OutputLine {
  text: string;
  tone?: Tone;
  /** Keep spacing as-is (tables). Long lines scroll instead of wrapping. */
  pre?: boolean;
  href?: string;
}

export type Scene = 'shell' | 'docker' | 'kubernetes' | 'server';

export type PodStatus = 'Running' | 'CrashLoopBackOff' | 'ContainerCreating' | 'Terminating';
export type ServiceState = 'active' | 'failed' | 'inactive';

export interface Container {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'exited';
  ports: string;
  age: string;
}

export interface KubeNode {
  name: string;
  role: 'control-plane' | 'worker';
}

export interface Pod {
  name: string;
  app: string;
  node: string;
  status: PodStatus;
  restarts: number;
  age: string;
}

export interface Deployment {
  name: string;
  replicas: number;
  image: string;
  revision: string;
}

export interface LogFile {
  path: string;
  sizeGb: number;
}

export interface LabWorld {
  scene: Scene;
  host: string;
  files: Record<string, string | LocalizedText>;
  images: string[];
  containers: Container[];
  nodes: KubeNode[];
  pods: Pod[];
  deployments: Deployment[];
  configFixed: boolean;
  disk: { sizeGb: number; baseUsedGb: number };
  logs: LogFile[];
  services: Record<string, ServiceState>;
  seq: number;
}

export interface ParsedCommand {
  raw: string;
  name: string;
  /** Positional arguments (flags removed). */
  args: string[];
  flags: Record<string, string | true>;
  sudo: boolean;
}

export interface CheckContext {
  cmd: ParsedCommand;
  before: LabWorld;
  after: LabWorld;
  /** False when the command failed (error output). */
  ok: boolean;
}

export interface Objective {
  id: string;
  title: LocalizedText;
  /** The command revealed by `hint`. */
  hint: string;
  done: (ctx: CheckContext) => boolean;
}

export interface Mission {
  id: string;
  scene: Scene;
  title: LocalizedText;
  brief: LocalizedText;
  debrief: LocalizedText;
  objectives: Objective[];
  setup: () => LabWorld;
}

export interface LabState {
  missionIndex: number;
  /** Objective ids completed in the current mission. */
  completed: string[];
  /** Objective ids whose hint was revealed in the current mission. */
  revealed: string[];
  world: LabWorld;
  score: number;
  hintsUsed: number;
  missionsSkipped: number;
  finished: boolean;
  history: string[];
}

export interface CommandResult {
  state: LabState;
  output: OutputLine[];
  clear?: boolean;
}

export type { Locale, LocalizedText };
