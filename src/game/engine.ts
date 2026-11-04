import { portfolioSource } from '../data/portfolio';
import { HINT_COST, MAX_SCORE, missions, POINTS_PER_OBJECTIVE } from './missions';
import type {
  CommandResult,
  LabState,
  LabWorld,
  Locale,
  LocalizedText,
  Mission,
  Objective,
  OutputLine,
  ParsedCommand,
  Pod,
  Tone,
} from './types';
import {
  allPodsRunning,
  cloneWorld,
  deploymentTarget,
  diskPercent,
  diskUsedGb,
  formatSize,
  hasTransitions,
  hexId,
  imageBase,
  leastLoadedWorker,
  levenshtein,
  logDirectory,
  nameSuffix,
  podWillBeHealthy,
  resourceKind,
  withTag,
} from './world';

export { hasTransitions } from './world';

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

export function createLab(missionIndex = 0, score = 0, hintsUsed = 0, missionsSkipped = 0): LabState {
  const finished = missionIndex >= missions.length;
  const index = Math.max(0, Math.min(missionIndex, missions.length - 1));
  return {
    missionIndex: index,
    completed: finished ? missions[index].objectives.map((objective) => objective.id) : [],
    revealed: [],
    world: missions[index].setup(),
    score: Math.max(0, score),
    hintsUsed: Math.max(0, hintsUsed),
    missionsSkipped: Math.max(0, missionsSkipped),
    finished,
    history: [],
  };
}

export const currentMission = (state: LabState): Mission => missions[state.missionIndex];

export function currentObjective(state: LabState): Objective | null {
  if (state.finished) return null;
  return currentMission(state).objectives.find((objective) => !state.completed.includes(objective.id)) ?? null;
}

export const missionComplete = (state: LabState) => !state.finished && currentObjective(state) === null;

export function promptFor(world: LabWorld): string {
  return `guest@${world.host}:~$`;
}

export function rankFor(score: number, locale: Locale): string {
  const ratio = score / MAX_SCORE;
  const ranks: Array<[number, LocalizedText]> = [
    [0.95, { en: 'Principal SRE', fr: 'SRE Principal' }],
    [0.8, { en: 'Senior SysAdmin', fr: 'SysAdmin Senior' }],
    [0.6, { en: 'DevOps Engineer', fr: 'Ingénieur DevOps' }],
    [0, { en: 'Junior Ops', fr: 'Ops Junior' }],
  ];
  return (ranks.find(([minimum]) => ratio >= minimum) ?? ranks[ranks.length - 1])[1][locale];
}

/** Moves pods through their lifecycle (called on a timer by the UI). */
export function advanceWorld(state: LabState): LabState {
  if (!hasTransitions(state.world)) return state;
  const world = cloneWorld(state.world);
  world.pods = world.pods
    .filter((pod) => pod.status !== 'Terminating')
    .map((pod) => {
      if (pod.status !== 'ContainerCreating') return pod;
      const healthy = podWillBeHealthy(world, pod.app);
      return { ...pod, status: healthy ? 'Running' : 'CrashLoopBackOff', restarts: healthy ? 0 : 1, age: '12s' };
    });
  return { ...state, world };
}

/* ------------------------------------------------------------------ */
/* Output helpers                                                      */
/* ------------------------------------------------------------------ */

class Out {
  lines: OutputLine[] = [];
  ok = true;

  constructor(readonly locale: Locale) {}

  say(text: string, tone?: Tone) {
    for (const line of text.split('\n')) this.lines.push({ text: line, tone });
  }

  pre(text: string, tone?: Tone) {
    for (const line of text.split('\n')) this.lines.push({ text: line, tone, pre: true });
  }

  link(text: string, href: string) {
    this.lines.push({ text, href, tone: 'accent' });
  }

  tr(en: string, fr: string, tone?: Tone) {
    this.say(this.locale === 'fr' ? fr : en, tone);
  }

  tip(en: string, fr: string) {
    this.tr(`→ ${en}`, `→ ${fr}`, 'accent');
  }

  fail(text: string) {
    this.ok = false;
    this.say(text, 'error');
  }

  table(rows: string[][], toneFor?: (row: string[]) => Tone | undefined) {
    const widths = rows[0].map((_, column) => Math.max(...rows.map((row) => (row[column] ?? '').length)));
    rows.forEach((row, index) => {
      const text = row.map((cell, column) => (column === row.length - 1 ? cell : cell.padEnd(widths[column] + 3))).join('');
      this.lines.push({ text, pre: true, tone: index === 0 ? 'muted' : toneFor?.(row) });
    });
  }
}

const loc = (value: string | LocalizedText, locale: Locale) => (typeof value === 'string' ? value : value[locale]);

/* ------------------------------------------------------------------ */
/* Parsing                                                             */
/* ------------------------------------------------------------------ */

const VALUE_FLAGS: Record<string, string[]> = {
  docker: ['-p', '--publish', '--name', '-e', '--env', '-v', '--volume'],
  kubectl: ['-o', '--output', '-f', '--filename', '--replicas', '-n', '--namespace', '-l', '--selector', '-c', '--container', '--tail'],
  truncate: ['-s', '--size'],
  journalctl: ['-u', '--unit', '-n'],
  tail: ['-n'],
  head: ['-n'],
  ansible: ['-m', '-i'],
};

const FLAG_ALIASES: Record<string, string> = {
  publish: 'p', output: 'o', filename: 'f', namespace: 'n', selector: 'l', size: 's', unit: 'u', container: 'c', env: 'e', volume: 'v',
};

function tokenize(raw: string): string[] {
  const tokens: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(raw)) !== null) tokens.push(match[1] ?? match[2] ?? match[3]);
  return tokens;
}

export function parseCommand(raw: string): ParsedCommand {
  let tokens = tokenize(raw.trim());
  let sudo = false;
  while (tokens[0] === 'sudo') {
    sudo = true;
    tokens = tokens.slice(1);
  }
  let name = (tokens[0] ?? '').toLowerCase();
  if (name === 'k') name = 'kubectl';
  const valueFlags = VALUE_FLAGS[name] ?? [];
  const args: string[] = [];
  const flags: Record<string, string | true> = {};
  const setFlag = (key: string, value: string | true) => {
    flags[FLAG_ALIASES[key] ?? key] = value;
  };

  for (let index = 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.startsWith('--') && token.length > 2) {
      const equals = token.indexOf('=');
      const key = token.slice(2, equals === -1 ? undefined : equals);
      if (equals !== -1) setFlag(key, token.slice(equals + 1));
      else if (valueFlags.includes(`--${key}`) && index + 1 < tokens.length) setFlag(key, tokens[(index += 1)]);
      else setFlag(key, true);
    } else if (token.startsWith('-') && token.length > 1 && !/^-\d/.test(token)) {
      if (valueFlags.includes(token)) {
        setFlag(token.slice(1), tokens[index + 1] ?? '');
        index += 1;
      } else if (token.length > 2 && valueFlags.includes(token.slice(0, 2))) {
        setFlag(token[1], token.slice(2));
      } else {
        for (const flag of token.slice(1)) setFlag(flag, true);
      }
    } else {
      args.push(token);
    }
  }

  return { raw, name, args, flags, sudo };
}

/* ------------------------------------------------------------------ */
/* Intro, banners and help                                             */
/* ------------------------------------------------------------------ */

export function missionIntro(state: LabState, locale: Locale): OutputLine[] {
  const mission = currentMission(state);
  const objective = currentObjective(state);
  const lines: OutputLine[] = [
    { text: '' },
    { text: `── MISSION ${state.missionIndex + 1}/${missions.length} · ${mission.title[locale]} ──`, tone: 'accent' },
    { text: mission.brief[locale] },
  ];
  if (objective) lines.push({ text: `→ ${objective.title[locale]}`, tone: 'info' });
  return lines;
}

export function introLines(state: LabState, locale: Locale): OutputLine[] {
  const fr = locale === 'fr';
  const lines: OutputLine[] = [
    { text: `Ops Lab v1.0 — ${fr ? 'connecté à' : 'connected to'} ${state.world.host} ${fr ? 'en tant que' : 'as'} guest`, tone: 'muted' },
    { text: fr ? 'Tapez `help` pour les commandes, `hint` si vous êtes bloqué.' : 'Type `help` for commands, `hint` if you are stuck.', tone: 'muted' },
  ];
  if (state.finished) return [...lines, ...labCompleteLines(state, locale)];
  if (state.missionIndex > 0 || state.completed.length > 0) {
    lines.push({ text: fr ? 'Bon retour ! Reprise de votre progression.' : 'Welcome back! Resuming your progress.', tone: 'success' });
  }
  return [...lines, ...missionIntro(state, locale)];
}

function labCompleteLines(state: LabState, locale: Locale): OutputLine[] {
  const fr = locale === 'fr';
  return [
    { text: '' },
    { text: fr ? '━━━━━━━━ LABO TERMINÉ ━━━━━━━━' : '━━━━━━━━ LAB COMPLETE ━━━━━━━━', tone: 'success' },
    { text: `Score: ${state.score} / ${MAX_SCORE} · ${fr ? 'Rang' : 'Rank'}: ${rankFor(state.score, locale)}`, tone: 'success' },
    { text: `${fr ? 'Indices utilisés' : 'Hints used'}: ${state.hintsUsed} · ${fr ? 'Missions passées' : 'Missions skipped'}: ${state.missionsSkipped}` },
    { text: fr ? 'Nassim fait ça pour de vrai : tapez `contact` ou `cv`.' : 'Nassim does this for real: type `contact` or `cv`.', tone: 'accent' },
    { text: fr ? 'Tapez `reset` pour rejouer.' : 'Type `reset` to play again.', tone: 'muted' },
  ];
}

function helpLines(state: LabState, out: Out) {
  const fr = out.locale === 'fr';
  out.say(fr ? 'Commandes du labo :' : 'Lab commands:', 'accent');
  out.pre('  help  hint  missions  next  skip  reset  clear  history');
  out.say(fr ? 'Linux :' : 'Linux:', 'accent');
  out.pre('  whoami  ls [path]  cat <file>  pwd  df -h  du -sh <path>\n  truncate -s 0 <file>  rm <file>  free -h  ps aux  uptime');
  out.say('Docker:', 'accent');
  out.pre('  docker ps [-a]  docker images  docker logs <name>\n  docker run -d --name <name> -p <host>:<port> <image>\n  docker stop|start|rm <name>');
  out.say('Kubernetes:', 'accent');
  out.pre('  kubectl get pods|nodes|deploy|svc [-o wide]\n  kubectl logs <pod>  kubectl describe pod <pod>\n  kubectl apply -f <file>  kubectl delete pod <pod>\n  kubectl rollout restart deployment/<name>\n  kubectl scale deployment/<name> --replicas=<n>');
  out.say(fr ? 'Services et réseau :' : 'Services & network:', 'accent');
  out.pre('  systemctl status|restart <service>  journalctl -u <service>\n  curl [-I] <url>  ping <host>');
  out.say(fr ? 'Bonus :' : 'Extras:', 'accent');
  out.pre('  neofetch  contact  cv  helm list  terraform plan  git log');
  const objective = currentObjective(state);
  if (objective) out.tr(`Current objective: ${objective.title.en}`, `Objectif actuel : ${objective.title.fr}`, 'info');
}

/* ------------------------------------------------------------------ */
/* Command families                                                    */
/* ------------------------------------------------------------------ */

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  nginx: 'A high performance web server and a reverse proxy server',
  sshd: 'OpenBSD Secure Shell server',
  cron: 'Regular background program processing daemon',
  docker: 'Docker Application Container Engine',
  containerd: 'containerd container runtime',
  kubelet: 'kubelet: The Kubernetes Node Agent',
  'portfolio-app': 'Portfolio Node.js application',
};

const LOG_DIRECTORIES = ['/var/log', '/var/log/app', '/var/log/nginx'];

function sceneTip(world: LabWorld, tool: 'docker' | 'kubectl', out: Out) {
  if (tool === 'kubectl') {
    out.tip(
      world.scene === 'docker' ? 'No cluster on this host: this mission is about Docker (try `docker ps`).' : 'No Kubernetes cluster in this mission — kubectl comes in missions 3 and 4.',
      world.scene === 'docker' ? 'Pas de cluster sur cet hôte : cette mission porte sur Docker (essayez `docker ps`).' : 'Pas de cluster Kubernetes dans cette mission — kubectl arrive aux missions 3 et 4.',
    );
  } else {
    out.tip(
      world.scene === 'kubernetes' ? 'Cluster nodes run containerd: use kubectl here.' : 'Docker is not installed on this host — it comes in mission 2.',
      world.scene === 'kubernetes' ? 'Les nœuds du cluster utilisent containerd : utilisez kubectl ici.' : 'Docker n’est pas installé sur cet hôte — il arrive à la mission 2.',
    );
  }
}

function resolveLogs(world: LabWorld, path: string) {
  if (path.endsWith('/*')) {
    const directory = path.slice(0, -2);
    return world.logs.filter((log) => log.path.startsWith(`${directory}/`));
  }
  return world.logs.filter((log) => log.path === path);
}

function logContent(world: LabWorld, path: string, out: Out) {
  if (path === '/var/log/app/debug.log') {
    const log = world.logs.find((item) => item.path === path);
    if (!log || log.sizeGb === 0) return;
    out.pre('[DEBUG] 2026-11-04T03:11:58Z cache miss key=session:9f2c route=/api/projects\n[DEBUG] 2026-11-04T03:11:58Z sql SELECT * FROM projects ORDER BY priority (2ms)\n[DEBUG] 2026-11-04T03:11:58Z cache miss key=session:a71b route=/api/contact', 'muted');
    out.tr(`… ${formatSize(log.sizeGb)} of DEBUG lines. Someone left LOG_LEVEL=debug in production.`, `… ${formatSize(log.sizeGb)} de lignes DEBUG. Quelqu’un a laissé LOG_LEVEL=debug en production.`, 'warn');
  } else if (path === '/var/log/nginx/error.log') {
    if (world.services.nginx === 'active') out.pre('2026/11/04 06:02:11 [notice] 2211#2211: start worker processes');
    else out.pre(`2026/11/04 03:12:09 [emerg] 1187#1187: open() "/var/log/nginx/error.log" failed (28: No space left on device)`, 'error');
  } else if (path === '/var/log/nginx/access.log') {
    out.pre('10.0.0.4 - - [04/Nov/2026:03:11:57 +0000] "GET / HTTP/1.1" 200 3190\n10.0.0.4 - - [04/Nov/2026:03:11:58 +0000] "GET /photo-cv.png HTTP/1.1" 200 48211');
  } else if (path === '/var/log/syslog') {
    out.pre(`Nov  4 03:12:09 ${world.host} systemd[1]: nginx.service: Failed with result 'exit-code'.\nNov  4 03:12:09 ${world.host} kernel: EXT4-fs warning (device sda1): ext4_dx_add_entry: Directory index full!`);
  }
}

function shellCommands(cmd: ParsedCommand, world: LabWorld, state: LabState, out: Out): boolean {
  const fr = out.locale === 'fr';
  const [first] = cmd.args;
  switch (cmd.name) {
    case 'whoami':
      out.say(cmd.sudo ? 'root' : 'guest');
      return true;
    case 'id':
      out.say('uid=1000(guest) gid=1000(guest) groups=1000(guest),27(sudo),998(docker)');
      return true;
    case 'pwd':
      out.say('/home/guest');
      return true;
    case 'hostname':
      out.say(world.host);
      return true;
    case 'uname':
      out.say(cmd.flags.a ? `Linux ${world.host} 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux` : 'Linux');
      return true;
    case 'uptime':
      out.say(' 06:42:07 up 412 days,  3:12,  1 user,  load average: 0.42, 0.31, 0.28');
      return true;
    case 'date':
      out.say(new Date().toUTCString());
      return true;
    case 'echo':
      out.say(cmd.raw.replace(/^\s*(sudo\s+)*echo\s?/, '').replace(/^["']|["']$/g, ''));
      return true;
    case 'history':
      state.history.forEach((entry, index) => out.pre(`${String(index + 1).padStart(4)}  ${entry}`));
      return true;
    case 'ls': {
      const path = (first ?? '~').replace(/\/$/, '');
      if (['~', '.', '/home/guest'].includes(path)) {
        const names = Object.keys(world.files).sort();
        if (cmd.flags.l) {
          out.say(`total ${names.length * 4}`);
          if (cmd.flags.a) out.pre('-rw-r--r-- 1 guest guest  220 Nov  4 06:00 .bashrc');
          names.forEach((name) => out.pre(`-rw-r--r-- 1 guest guest  ${String(loc(world.files[name], 'en').length).padStart(3)} Nov  4 06:00 ${name}`));
        } else {
          out.pre(`${cmd.flags.a ? '.  ..  .bashrc  ' : ''}${names.join('  ')}`, 'info');
        }
        return true;
      }
      if (path === '/var/log') {
        out.pre('app  nginx  syslog', 'info');
        return true;
      }
      if (LOG_DIRECTORIES.includes(path)) {
        const logs = world.logs.filter((log) => log.path.startsWith(`${path}/`));
        if (cmd.flags.l) logs.forEach((log) => out.pre(`-rw-r----- 1 root adm ${formatSize(log.sizeGb).padStart(5)} Nov  4 03:12 ${log.path.split('/').pop()}`, log.sizeGb > 5 ? 'warn' : undefined));
        else out.pre(logs.map((log) => log.path.split('/').pop()).join('  '), 'info');
        return true;
      }
      out.fail(`ls: cannot access '${first}': No such file or directory`);
      return true;
    }
    case 'cat':
    case 'tail':
    case 'head': {
      if (!first) {
        out.fail(`${cmd.name}: missing file operand`);
        return true;
      }
      const name = first.replace(/^(~\/|\.\/|\/home\/guest\/)/, '');
      if (world.files[name] !== undefined) {
        out.pre(loc(world.files[name], out.locale), name.endsWith('.yaml') ? 'info' : undefined);
        return true;
      }
      if (first === '/etc/os-release') {
        out.pre('NAME="Portfolio Linux"\nVERSION="26.11 (Ops Lab)"\nID=ubuntu\nPRETTY_NAME="Ubuntu 24.04 LTS"');
        return true;
      }
      if (world.logs.some((log) => log.path === first)) {
        logContent(world, first, out);
        if (cmd.name === 'tail' && cmd.flags.f) out.tr('(tail -f would follow forever — showing the last lines)', '(tail -f suivrait le fichier sans fin — dernières lignes affichées)', 'muted');
        return true;
      }
      out.fail(`${cmd.name}: ${first}: No such file or directory`);
      return true;
    }
    case 'cd':
      if (!first || ['~', '/home/guest', '.'].includes(first)) return true;
      out.tr('cd: this lab keeps you in your home directory — use `ls /var/log` to look around.', 'cd : ce labo vous garde dans votre répertoire personnel — utilisez `ls /var/log` pour explorer.', 'muted');
      return true;
    case 'free':
      out.pre('               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       2.1Gi       3.9Gi        12Mi       1.8Gi       5.4Gi\nSwap:          2.0Gi          0B       2.0Gi');
      return true;
    case 'ps': {
      const processes = [
        ['root', '1', '/sbin/init'],
        ['root', '612', 'sshd: /usr/sbin/sshd -D'],
        ...(world.services.docker ? [['root', '901', '/usr/bin/dockerd -H fd://']] : []),
        ...(world.services.kubelet ? [['root', '944', '/usr/bin/kubelet --config=/var/lib/kubelet/config.yaml']] : []),
        ...(world.services['portfolio-app'] ? [['www-data', '1302', 'node /srv/portfolio/server.js']] : []),
        ...(world.services.nginx === 'active' ? [['root', '2211', 'nginx: master process /usr/sbin/nginx']] : []),
        ['guest', '4242', `ps ${cmd.raw.split(' ').slice(1).join(' ')}`.trim()],
      ];
      out.table([['USER', 'PID', 'COMMAND'], ...processes]);
      return true;
    }
    case 'top':
    case 'htop':
      out.tr(`${cmd.name}: interactive tools are not available here — try \`ps aux\` or \`free -h\`.`, `${cmd.name} : les outils interactifs ne sont pas disponibles ici — essayez \`ps aux\` ou \`free -h\`.`, 'muted');
      return true;
    case 'ping': {
      const host = first ?? '';
      if (!host) {
        out.fail('ping: usage error: Destination address required');
      } else if (['localhost', '127.0.0.1', world.host, 'web-01', 'lb-01', 'master-01', 'worker-01', 'worker-02'].includes(host)) {
        out.pre(`PING ${host} 56(84) bytes of data.\n64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.041 ms\n64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.038 ms\n--- ${host} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss`);
      } else {
        out.fail(`ping: ${host}: Temporary failure in name resolution`);
        out.tip('This lab is offline on purpose.', 'Ce labo est volontairement hors ligne.');
      }
      return true;
    }
    case 'neofetch':
    case 'fastfetch': {
      const art = ['     .--.     ', '    |o_o |    ', '    |:_/ |    ', '   //   \\ \\   ', '  (|     | )  ', " /'\\_   _/`\\  ", ' \\___)=(___/  '];
      const info = [
        `guest@${world.host}`,
        '-----------------',
        'OS: Portfolio Linux x86_64',
        `Owner: ${portfolioSource.identity.name}`,
        `Role: ${fr ? 'Cloud & DevOps · Admin Systèmes' : 'Cloud & DevOps · SysAdmin'}`,
        'Stack: Linux · K8s · Terraform · Azure',
        'Shell: bash 5.2 · Uptime: 412 days',
      ];
      art.forEach((line, index) => out.pre(`${line}  ${info[index] ?? ''}`, index === 0 ? 'accent' : 'info'));
      return true;
    }
    case 'contact':
      out.tr('Reach Nassim:', 'Contacter Nassim :', 'accent');
      out.link(`  email     ${portfolioSource.identity.email}`, `mailto:${portfolioSource.identity.email}`);
      out.link('  linkedin  nassim-fatnassi-hnifi', portfolioSource.identity.linkedin);
      out.link('  github    nassimfatnassi1999', portfolioSource.identity.github);
      return true;
    case 'cv':
    case 'resume': {
      const resume = portfolioSource.resumes[0];
      out.tr('Opening the résumé:', 'Ouverture du CV :', 'accent');
      out.link(`  ${resume.label[out.locale]} ↗`, resume.urls[out.locale]);
      return true;
    }
    case 'exit':
    case 'logout':
      out.tr('There is no escape from production :) Type `reset` to restart the lab.', 'On ne s’échappe pas de la production :) Tapez `reset` pour recommencer.', 'muted');
      return true;
    case 'vim':
    case 'vi':
    case 'nano':
    case 'emacs':
      out.tr(`${cmd.name}: editors are disabled in this lab (and you would never find how to quit vim anyway).`, `${cmd.name} : les éditeurs sont désactivés dans ce labo (et vous ne trouveriez jamais comment quitter vim).`, 'muted');
      return true;
    case 'man':
      out.tr(`No manual entry for ${first ?? 'that'} — try \`help\`.`, `Pas de manuel pour ${first ?? 'ça'} — essayez \`help\`.`, 'muted');
      return true;
    case 'mkdir':
    case 'touch':
    case 'cp':
    case 'mv':
    case 'chmod':
    case 'chown':
      out.fail(`${cmd.name}: cannot modify '${first ?? ''}': Read-only file system`);
      return true;
    case 'apt':
    case 'apt-get':
    case 'yum':
    case 'dnf':
      if (cmd.sudo) out.tr('Reading package lists... Done (package installs are disabled in this lab).', 'Lecture des listes de paquets... Fait (installations désactivées dans ce labo).', 'muted');
      else out.fail('E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)');
      return true;
    case 'su':
      out.tr('Nice try. Root shells are disabled in this lab ;)', 'Bien essayé. Les shells root sont désactivés dans ce labo ;)', 'warn');
      return true;
    case 'git':
      if (first === 'log') out.pre('a7c3e21 feat: add Ops Lab game and SysAdmin TTY style\n4af189a carousel projects\n5cbc9f4 add logos tools\nc41240b merge: unified infrastructure portfolio redesign', 'info');
      else if (first === 'status') out.say('On branch main\nnothing to commit, working tree clean');
      else out.tr('git: only `git log` and `git status` are wired up in this lab.', 'git : seuls `git log` et `git status` sont branchés dans ce labo.', 'muted');
      return true;
    case 'terraform':
      if (first === 'plan' || first === 'apply') {
        out.say('No changes. Your infrastructure matches the configuration.', 'success');
        out.tr('(Terraform + Ansible is how Nassim provisions the real thing.)', '(Terraform + Ansible : c’est ainsi que Nassim provisionne la vraie infra.)', 'muted');
      } else out.pre('Usage: terraform [global options] <subcommand> [args]\n  plan    Show changes required by the current configuration');
      return true;
    case 'ansible':
      out.pre(`${world.host} | SUCCESS => {\n    "changed": false,\n    "ping": "pong"\n}`, 'success');
      return true;
    case 'helm':
      if (world.scene !== 'kubernetes') {
        out.fail('Error: Kubernetes cluster unreachable');
        sceneTip(world, 'kubectl', out);
      } else {
        out.table([
          ['NAME', 'NAMESPACE', 'REVISION', 'STATUS', 'CHART'],
          ['ingress-nginx', 'ingress', '3', 'deployed', 'ingress-nginx-4.11.3'],
          ['monitoring', 'monitoring', '7', 'deployed', 'kube-prometheus-stack-65.1.0'],
        ]);
      }
      return true;
    default:
      return false;
  }
}

function diskCommands(cmd: ParsedCommand, world: LabWorld, out: Out): boolean {
  const [first] = cmd.args;
  switch (cmd.name) {
    case 'df': {
      const used = diskUsedGb(world);
      const percent = diskPercent(world);
      out.table(
        [
          ['Filesystem', 'Size', 'Used', 'Avail', 'Use%', 'Mounted on'],
          ['/dev/sda1', formatSize(world.disk.sizeGb), formatSize(used), formatSize(Math.max(0, world.disk.sizeGb - used)), `${percent}%`, '/'],
          ['tmpfs', '1.9G', '0', '1.9G', '0%', '/dev/shm'],
        ],
        (row) => (row[0] === '/dev/sda1' && percent >= 90 ? 'error' : undefined),
      );
      return true;
    }
    case 'du': {
      const targets = cmd.args.length ? cmd.args : ['.'];
      for (const target of targets) {
        const star = target.endsWith('/*');
        const path = target.replace(/\/\*$/, '').replace(/\/$/, '') || '/';
        const under = world.logs.filter((log) => log.path === path || log.path.startsWith(`${path}/`));
        const total = under.reduce((sum, log) => sum + log.sizeGb, 0);
        const line = (size: number, label: string) => out.pre(`${formatSize(size).padEnd(6)}${label}`, size >= 5 ? 'warn' : undefined);
        if (['.', '~', '/home/guest'].includes(path)) {
          out.pre(`28K   ${path}`);
        } else if (path === '/') {
          line(diskUsedGb(world), '/');
        } else if (under.length === 0) {
          out.fail(`du: cannot access '${target}': No such file or directory`);
        } else if (under.length === 1 && under[0].path === path) {
          line(total, path);
        } else if (star || !cmd.flags.s) {
          const groups = new Map<string, number>();
          for (const log of under) {
            const key = path === '/var/log' ? logDirectory(log.path) : log.path;
            groups.set(key, (groups.get(key) ?? 0) + log.sizeGb);
          }
          [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([key, size]) => line(size, key));
          if (!star) line(total, path);
        } else {
          line(total, path);
        }
      }
      const big = world.logs.find((log) => log.sizeGb >= 5);
      if (big && out.ok && cmd.args.some((arg) => arg.startsWith('/var/log'))) {
        out.tip(`${logDirectory(big.path)} is huge — look inside with \`ls -lh ${logDirectory(big.path)}\`.`, `${logDirectory(big.path)} est énorme — regardez dedans avec \`ls -lh ${logDirectory(big.path)}\`.`);
      }
      return true;
    }
    case 'truncate': {
      if (!first) {
        out.fail("truncate: missing file operand");
        return true;
      }
      if (cmd.flags.s === undefined || cmd.flags.s === true) {
        out.fail("truncate: you must specify either '--size' or '--reference'");
        return true;
      }
      const logs = resolveLogs(world, first);
      if (logs.length === 0 && world.files[first] === undefined) {
        out.fail(`truncate: cannot open '${first}' for writing: No such file or directory`);
        return true;
      }
      logs.forEach((log) => { log.sizeGb = 0; });
      if (world.files[first] !== undefined) world.files[first] = '';
      out.tr('(no output — that means it worked)', '(aucune sortie — cela veut dire que ça a marché)', 'muted');
      if (logs.length) out.tip(`Disk is now at ${diskPercent(world)}%.`, `Le disque est maintenant à ${diskPercent(world)} %.`);
      return true;
    }
    case 'rm': {
      const target = cmd.args.join(' ');
      if (/^\/\*?$/.test(target) || target === '/ --no-preserve-root') {
        if (cmd.flags['no-preserve-root']) {
          out.tr('Nice try. This lab has backups — and a sense of humour.', 'Bien essayé. Ce labo a des sauvegardes — et de l’humour.', 'warn');
        } else {
          out.fail("rm: it is dangerous to operate recursively on '/'\nrm: use --no-preserve-root to override this failsafe");
          out.tr('…and please don’t. Production thanks you.', '…et s’il vous plaît, non. La production vous remercie.', 'muted');
        }
        return true;
      }
      if (!first) {
        out.fail('rm: missing operand');
        return true;
      }
      if (LOG_DIRECTORIES.includes(first.replace(/\/$/, ''))) {
        out.fail(`rm: refusing to remove '${first}': target the runaway file, not the whole directory`);
        return true;
      }
      const name = first.replace(/^(~\/|\.\/)/, '');
      const logs = resolveLogs(world, first);
      if (logs.length) {
        world.logs = world.logs.filter((log) => !logs.includes(log));
        out.tip(
          `Space freed (disk at ${diskPercent(world)}%). Pro tip: on a live server \`truncate -s 0\` is safer — a running process can keep a deleted file open.`,
          `Espace libéré (disque à ${diskPercent(world)} %). Astuce : sur un serveur en marche, \`truncate -s 0\` est plus sûr — un processus peut garder un fichier supprimé ouvert.`,
        );
        return true;
      }
      if (world.files[name] !== undefined) {
        delete world.files[name];
        return true;
      }
      out.fail(`rm: cannot remove '${first}': No such file or directory`);
      return true;
    }
    default:
      return false;
  }
}

function systemCommands(cmd: ParsedCommand, world: LabWorld, out: Out): boolean {
  const [action, rawService] = cmd.args;
  const normalize = (value: string | undefined) => (value ?? '').replace(/\.service$/, '').replace(/^ssh$/, 'sshd');
  if (cmd.name === 'systemctl') {
    if (!action || action === 'list-units' || action === '--failed') {
      out.table([['UNIT', 'ACTIVE', 'SUB'], ...Object.entries(world.services).map(([name, state]) => [`${name}.service`, state === 'active' ? 'active' : state, state === 'active' ? 'running' : state === 'failed' ? 'failed' : 'dead'])], (row) => (row[1] === 'failed' ? 'error' : undefined));
      return true;
    }
    const service = normalize(rawService);
    if (!service) {
      out.fail(`Too few arguments.`);
      return true;
    }
    if (!(service in world.services)) {
      out.fail(`Unit ${service}.service could not be found.`);
      return true;
    }
    const state = world.services[service];
    const description = SERVICE_DESCRIPTIONS[service] ?? service;
    if (action === 'status') {
      const symbol = state === 'active' ? '●' : state === 'failed' ? '×' : '○';
      out.pre(`${symbol} ${service}.service - ${description}`, state === 'active' ? 'success' : state === 'failed' ? 'error' : 'muted');
      out.pre(`     Loaded: loaded (/lib/systemd/system/${service}.service; enabled; preset: enabled)`);
      if (state === 'active') out.pre('     Active: active (running) since Tue 2026-11-04 06:02:11 UTC; 4min ago', 'success');
      else if (state === 'failed') {
        out.pre('     Active: failed (Result: exit-code) since Tue 2026-11-04 03:12:09 UTC; 3h ago', 'error');
        if (service === 'nginx') out.pre('nginx[1187]: nginx: [emerg] open() "/var/log/nginx/error.log" failed (28: No space left on device)', 'error');
      } else out.pre('     Active: inactive (dead)', 'muted');
      if (state === 'failed') out.tip('"No space left on device" — check the disk with `df -h`.', '« No space left on device » — vérifiez le disque avec `df -h`.');
      return true;
    }
    if (['restart', 'start', 'reload'].includes(action)) {
      if (service === 'nginx' && diskPercent(world) >= 99) {
        out.fail(`Job for nginx.service failed because the control process exited with error code.\nSee "systemctl status nginx.service" and "journalctl -xeu nginx.service" for details.`);
        return true;
      }
      world.services[service] = 'active';
      out.tr('(no output — that is a good sign)', '(aucune sortie — c’est bon signe)', 'muted');
      return true;
    }
    if (action === 'stop') {
      world.services[service] = 'inactive';
      if (service === 'sshd') out.tr('Bold move: you just cut the branch you were sitting on. (Simulated — you are still connected.)', 'Audacieux : vous venez de scier la branche sur laquelle vous étiez assis. (Simulé — vous êtes toujours connecté.)', 'warn');
      return true;
    }
    if (action === 'enable' || action === 'disable') {
      out.say(`${action === 'enable' ? 'Created symlink' : 'Removed'} /etc/systemd/system/multi-user.target.wants/${service}.service.`);
      return true;
    }
    out.fail(`Unknown command verb ${action}.`);
    return true;
  }

  if (cmd.name === 'journalctl') {
    const unit = normalize(typeof cmd.flags.u === 'string' ? cmd.flags.u : undefined);
    if (unit === 'nginx' && world.services.nginx) {
      if (world.services.nginx === 'active') out.pre(`Nov 04 06:02:11 ${world.host} systemd[1]: Started nginx.service - ${SERVICE_DESCRIPTIONS.nginx}.`, 'success');
      else out.pre(`Nov 04 03:12:09 ${world.host} nginx[1187]: nginx: [emerg] open() "/var/log/nginx/error.log" failed (28: No space left on device)\nNov 04 03:12:09 ${world.host} systemd[1]: nginx.service: Failed with result 'exit-code'.`, 'error');
      return true;
    }
    if (unit && !(unit in world.services)) {
      out.say('-- No entries --', 'muted');
      return true;
    }
    out.pre(`Nov 04 06:00:01 ${world.host} CRON[3120]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)\nNov 04 06:01:44 ${world.host} sshd[4011]: Accepted publickey for guest from 10.0.0.42 port 52144`);
    return true;
  }
  return false;
}

function curlCommand(cmd: ParsedCommand, world: LabWorld, out: Out) {
  const target = cmd.args[0];
  if (!target) {
    out.fail("curl: try 'curl --help' for more information");
    return;
  }
  const url = target.replace(/^https?:\/\//, '');
  const [hostPart, ...pathParts] = url.split('/');
  const [host, portText] = hostPart.split(':');
  const local = ['localhost', '127.0.0.1', world.host, 'portfolio'].includes(host);
  if (!local) {
    out.fail(`curl: (6) Could not resolve host: ${host}`);
    out.tip('This lab is offline on purpose — test localhost.', 'Ce labo est volontairement hors ligne — testez localhost.');
    return;
  }
  const port = Number(portText ?? (target.startsWith('https') ? 443 : 80));
  const headersOnly = Boolean(cmd.flags.I || cmd.flags.head || cmd.flags.i);
  const path = `/${pathParts.join('/')}`;

  if (world.scene === 'docker') {
    const container = world.containers.find((item) => item.status === 'running' && item.ports.includes(`:${port}->`));
    if (!container) {
      out.fail(`curl: (7) Failed to connect to localhost port ${port} after 0 ms: Couldn't connect to server`);
      return;
    }
    if (imageBase(container.image) !== 'nginx' && imageBase(container.image) !== 'httpd') {
      out.fail(`curl: (52) Empty reply from server`);
      return;
    }
    if (headersOnly) out.pre('HTTP/1.1 200 OK\nServer: nginx/1.27.2\nContent-Type: text/html', 'success');
    else out.pre('<!DOCTYPE html>\n<html>\n<head><title>Welcome to nginx!</title></head>\n<body><h1>Welcome to nginx!</h1></body>\n</html>', 'success');
    return;
  }

  const nginxUp = world.services.nginx === 'active';
  if (!world.services.nginx || (port !== 80 && port !== 443)) {
    out.fail(`curl: (7) Failed to connect to ${host} port ${port} after 0 ms: Connection refused`);
    return;
  }
  if (!nginxUp) {
    out.fail(`curl: (7) Failed to connect to ${host} port ${port} after 0 ms: Connection refused`);
    out.tip('nginx is not running. Check `systemctl status nginx`.', 'nginx ne tourne pas. Vérifiez `systemctl status nginx`.');
    return;
  }
  if (headersOnly) out.pre(`HTTP/1.1 200 OK\nServer: nginx\nContent-Type: text/html; charset=utf-8\nX-Served-By: ${world.host}`, 'success');
  else out.pre(`<!doctype html>\n<title>Nassim Fatnassi Hnifi | Cloud, DevOps &amp; Systems Engineer</title>\n<!-- ${path} served by ${world.host} -->`, 'success');
}

function dockerCommand(cmd: ParsedCommand, world: LabWorld, out: Out) {
  if (world.scene !== 'docker') {
    out.fail('bash: docker: command not found');
    sceneTip(world, 'docker', out);
    return;
  }
  const [sub, ...rest] = cmd.args;
  const subcommand = sub === 'container' ? rest[0] : sub;
  const params = sub === 'container' ? rest.slice(1) : rest;
  const find = (name?: string) => world.containers.find((item) => item.name === name || (name && item.id.startsWith(name)));

  switch (subcommand) {
    case 'ps':
    case 'ls': {
      const list = cmd.flags.a ? world.containers : world.containers.filter((item) => item.status === 'running');
      out.table(
        [
          ['CONTAINER ID', 'IMAGE', 'STATUS', 'PORTS', 'NAMES'],
          ...list.map((item) => [item.id, withTag(item.image).replace(':latest', ''), item.status === 'running' ? `Up ${item.age.replace(' ago', '')}` : `Exited (1) ${item.age}`, item.ports, item.name]),
        ],
        (row) => (row[2].startsWith('Exited') ? 'muted' : undefined),
      );
      if (!cmd.flags.a && world.containers.some((item) => item.status === 'exited')) {
        out.tip('Add -a to also see stopped containers.', 'Ajoutez -a pour voir aussi les conteneurs arrêtés.');
      }
      return;
    }
    case 'images':
      out.table([
        ['REPOSITORY', 'TAG', 'IMAGE ID', 'SIZE'],
        ...world.images.map((image, index) => {
          const [repository, tag = 'latest'] = image.split(':');
          return [repository, tag, hexId(index + 40), repository === 'nginx' ? '192MB' : repository === 'postgres' ? '438MB' : '128MB'];
        }),
      ]);
      return;
    case 'run': {
      const image = params[0];
      if (!image) {
        out.fail('"docker run" requires at least 1 argument.\nUsage:  docker run [OPTIONS] IMAGE [COMMAND] [ARG...]');
        return;
      }
      const name = typeof cmd.flags.name === 'string' ? cmd.flags.name : `${['brave', 'calm', 'eager', 'quirky'][world.seq % 4]}_${['turing', 'hopper', 'torvalds', 'lovelace'][(world.seq + 1) % 4]}`;
      if (find(name)) {
        out.fail(`docker: Error response from daemon: Conflict. The container name "/${name}" is already in use.`);
        out.tip(`Remove it first with \`docker rm -f ${name}\`, or pick another name.`, `Supprimez-le d’abord avec \`docker rm -f ${name}\`, ou choisissez un autre nom.`);
        return;
      }
      let ports = '';
      if (cmd.flags.p !== undefined) {
        const match = String(cmd.flags.p).match(/^(?:0\.0\.0\.0:)?(\d+):(\d+)$/);
        if (!match) {
          out.fail(`docker: invalid publish spec "${cmd.flags.p}" (expected host:container, e.g. 8080:80)`);
          return;
        }
        const busy = world.containers.find((item) => item.status === 'running' && item.ports.includes(`:${match[1]}->`));
        if (busy) {
          out.fail(`docker: Error response from daemon: Bind for 0.0.0.0:${match[1]} failed: port is already allocated.`);
          return;
        }
        ports = `0.0.0.0:${match[1]}->${match[2]}/tcp`;
      }
      const tagged = withTag(image);
      if (!world.images.includes(tagged) && !world.images.includes(image)) {
        out.pre(`Unable to find image '${tagged}' locally\n${tagged.split(':')[1]}: Pulling from library/${imageBase(image)}\nStatus: Downloaded newer image for ${tagged}`, 'muted');
        world.images.push(tagged);
      }
      const id = hexId(world.seq + 100);
      world.seq += 1;
      world.containers.unshift({ id, name, image: tagged, status: 'running', ports, age: 'Less than a second ago' });
      out.say(`${id}${hexId(world.seq + 200)}${hexId(world.seq + 300).slice(0, 4)}`);
      if (!cmd.flags.d) out.tip('Detached for you. In real life add -d, or the container holds your terminal.', 'Détaché pour vous. En vrai, ajoutez -d, sinon le conteneur bloque votre terminal.');
      if (!ports && imageBase(image) === 'nginx') out.tip('Running, but no port is published: nobody can reach it. Use -p 8080:80.', 'Il tourne, mais aucun port n’est publié : personne ne peut le joindre. Utilisez -p 8080:80.');
      return;
    }
    case 'logs': {
      const container = find(params[0]);
      if (!container) {
        out.fail(`Error response from daemon: No such container: ${params[0] ?? ''}`);
        return;
      }
      const base = imageBase(container.image);
      if (base === 'nginx') out.pre('/docker-entrypoint.sh: Configuration complete; ready for start up\n2026/11/04 06:10:02 [notice] 1#1: nginx/1.27.2\n2026/11/04 06:10:02 [notice] 1#1: start worker processes');
      else if (base === 'postgres') out.pre('LOG:  database system is ready to accept connections');
      else if (container.name === 'legacy-api') out.pre("node:internal/modules/cjs/loader:1228\n  throw err;\nError: Cannot find module '/app/server.js'", 'error');
      else out.pre('(no logs)', 'muted');
      return;
    }
    case 'stop':
    case 'start':
    case 'restart': {
      const container = find(params[0]);
      if (!container) {
        out.fail(`Error response from daemon: No such container: ${params[0] ?? ''}`);
        return;
      }
      if (subcommand === 'start' && container.name === 'legacy-api') {
        out.fail("Error: Cannot find module '/app/server.js' (container exited again)");
        return;
      }
      container.status = subcommand === 'stop' ? 'exited' : 'running';
      container.age = 'Less than a second ago';
      out.say(container.name);
      return;
    }
    case 'rm': {
      const container = find(params[0]);
      if (!container) {
        out.fail(`Error response from daemon: No such container: ${params[0] ?? ''}`);
        return;
      }
      if (container.status === 'running' && !cmd.flags.f) {
        out.fail(`Error response from daemon: cannot remove container "/${container.name}": container is running: stop the container before removing or force remove`);
        return;
      }
      world.containers = world.containers.filter((item) => item !== container);
      out.say(container.name);
      return;
    }
    case 'exec':
      out.tr('Interactive sessions are not available in this lab — use `docker logs`.', 'Les sessions interactives ne sont pas disponibles ici — utilisez `docker logs`.', 'muted');
      return;
    case 'compose':
      out.fail('no configuration file provided: not found');
      return;
    case 'version':
    case '--version':
      out.say('Docker version 27.3.1, build ce12230');
      return;
    default:
      out.fail(`docker: '${sub ?? ''}' is not a docker command.\nSee 'docker --help'`);
  }
}

function podsTable(world: LabWorld, wide: boolean, out: Out, pods: Pod[] = world.pods) {
  if (pods.length === 0) {
    out.say('No resources found in default namespace.');
    return;
  }
  const header = ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE', ...(wide ? ['NODE'] : [])];
  out.table(
    [header, ...pods.map((pod) => [pod.name, pod.status === 'Running' ? '1/1' : '0/1', pod.status, pod.restarts > 0 ? `${pod.restarts} (40s ago)` : '0', pod.age, ...(wide ? [pod.node] : [])])],
    (row) => (row[2] === 'CrashLoopBackOff' ? 'error' : row[2] === 'Running' ? undefined : 'warn'),
  );
}

function deploymentsTable(world: LabWorld, out: Out) {
  out.table(
    [
      ['NAME', 'READY', 'UP-TO-DATE', 'AVAILABLE', 'AGE'],
      ...world.deployments.map((deployment) => {
        const pods = world.pods.filter((pod) => pod.app === deployment.name && pod.status !== 'Terminating');
        const running = pods.filter((pod) => pod.status === 'Running').length;
        const upToDate = pods.filter((pod) => pod.name.includes(`-${deployment.revision}-`)).length;
        return [deployment.name, `${running}/${deployment.replicas}`, String(upToDate), String(running), '41d'];
      }),
    ],
    (row) => {
      const [ready, wanted] = row[1].split('/');
      return ready !== wanted ? 'warn' : undefined;
    },
  );
}

function newPod(world: LabWorld, app: string, revision: string): Pod {
  world.seq += 1;
  const pod: Pod = { name: `${app}-${revision}-${nameSuffix(world.seq)}`, app, node: leastLoadedWorker(world), status: 'ContainerCreating', restarts: 0, age: '1s' };
  world.pods.push(pod);
  return pod;
}

function kubectlCommand(cmd: ParsedCommand, world: LabWorld, out: Out) {
  const fr = out.locale === 'fr';
  if (world.scene !== 'kubernetes') {
    out.fail('The connection to the server localhost:8080 was refused - did you specify the right host or port?');
    sceneTip(world, 'kubectl', out);
    return;
  }
  const [sub, ...rest] = cmd.args;
  const findPod = (value?: string) => {
    const name = value?.includes('/') ? value.split('/')[1] : value;
    return world.pods.find((pod) => pod.name === name);
  };

  switch (sub) {
    case 'get': {
      const kind = resourceKind(rest[0]);
      const wide = cmd.flags.o === 'wide';
      if (kind === 'pods') {
        const pods = rest[1] ? world.pods.filter((pod) => pod.name === rest[1]) : world.pods;
        if (rest[1] && pods.length === 0) out.fail(`Error from server (NotFound): pods "${rest[1]}" not found`);
        else podsTable(world, wide, out, pods);
      } else if (kind === 'deployments') deploymentsTable(world, out);
      else if (kind === 'nodes') {
        out.table([['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION'], ...world.nodes.map((node) => [node.name, 'Ready', node.role === 'control-plane' ? 'control-plane' : '<none>', '41d', 'v1.31.2'])]);
      } else if (kind === 'services') {
        out.table([
          ['NAME', 'TYPE', 'CLUSTER-IP', 'PORT(S)', 'AGE'],
          ['api', 'ClusterIP', '10.96.12.40', '8080/TCP', '41d'],
          ['web', 'LoadBalancer', '10.96.88.17', '80:31380/TCP', '41d'],
          ['postgres', 'ClusterIP', '10.96.3.201', '5432/TCP', '41d'],
        ]);
      } else if (kind === 'configmaps') {
        out.table([['NAME', 'DATA', 'AGE'], ['api-config', world.configFixed ? '3' : '2', world.configFixed ? '5s' : '41d'], ['kube-root-ca.crt', '1', '41d']]);
      } else if (kind === 'namespaces') {
        out.table([['NAME', 'STATUS', 'AGE'], ['default', 'Active', '41d'], ['ingress', 'Active', '41d'], ['kube-system', 'Active', '41d'], ['monitoring', 'Active', '41d']]);
      } else if (kind === 'hpa') {
        out.say('No resources found in default namespace.');
      } else if (kind === 'all') {
        podsTable(world, wide, out);
        out.say('');
        deploymentsTable(world, out);
      } else {
        out.fail(rest[0] ? `error: the server doesn't have a resource type "${rest[0]}"` : 'error: You must specify the type of resource to get.');
      }
      return;
    }
    case 'logs': {
      const target = rest[0];
      const deployment = deploymentTarget(rest);
      const pod = deployment ? world.pods.find((item) => item.app === deployment) : findPod(target);
      if (!target) {
        out.fail('error: expected POD or TYPE/NAME is a required argument for the logs command');
        return;
      }
      if (!pod) {
        out.fail(`Error from server (NotFound): pods "${target}" not found`);
        return;
      }
      if (pod.status === 'ContainerCreating') {
        out.fail(`Error from server (BadRequest): container "${pod.app}" in pod "${pod.name}" is waiting to start: ContainerCreating`);
        return;
      }
      if (pod.app === 'api' && pod.status === 'CrashLoopBackOff') {
        out.pre('[info]  Starting api v2.4.0 (node 20)\n[info]  Loading configuration from ConfigMap api-config\n[error] Missing required environment variable: DB_HOST\n[fatal] Cannot connect to database: host is undefined\n[fatal] Process exited with code 1', 'error');
        out.tip('The ConfigMap is missing DB_HOST. A fixed version is waiting in api-config.yaml (`cat api-config.yaml`).', 'La ConfigMap n’a pas DB_HOST. Une version corrigée attend dans api-config.yaml (`cat api-config.yaml`).');
      } else if (pod.app === 'api') {
        out.pre('[info]  Starting api v2.4.0 (node 20)\n[info]  Connected to postgres.default.svc.cluster.local:5432\n[info]  Listening on :8080', 'success');
      } else if (pod.app === 'web') {
        out.pre('10.244.1.1 - - [04/Nov/2026:06:12:44 +0000] "GET / HTTP/1.1" 200 3190\n10.244.2.1 - - [04/Nov/2026:06:12:45 +0000] "GET /assets/index.js HTTP/1.1" 200 127960');
      } else {
        out.pre('LOG:  database system is ready to accept connections');
      }
      return;
    }
    case 'describe': {
      const kind = resourceKind(rest[0]);
      const pod = kind === 'pods' && !rest[0]?.includes('/') ? findPod(rest[1]) : findPod(rest[0]);
      if (!pod) {
        out.fail(`Error from server (NotFound): pods "${rest[1] ?? rest[0] ?? ''}" not found`);
        return;
      }
      const deployment = world.deployments.find((item) => item.name === pod.app);
      out.pre(`Name:         ${pod.name}\nNamespace:    default\nNode:         ${pod.node}/10.0.1.${pod.node.endsWith('1') ? '11' : '12'}\nContainers:\n  ${pod.app}:\n    Image:          ${deployment?.image ?? 'postgres:16'}`);
      if (pod.status === 'CrashLoopBackOff') {
        out.pre('    State:          Waiting\n      Reason:       CrashLoopBackOff\n    Last State:     Terminated\n      Reason:       Error\n      Exit Code:    1', 'error');
        out.pre(`    Restart Count:  ${pod.restarts}\n    Environment:\n      DB_HOST:  <set to the key 'DB_HOST' of config map 'api-config'>  Optional: false\nEvents:\n  Type     Reason   Age                 From     Message\n  Warning  BackOff  32s (x41 over 14m)  kubelet  Back-off restarting failed container ${pod.app}`);
      } else {
        out.pre(`    State:          ${pod.status === 'Running' ? 'Running' : 'Waiting'}\n    Restart Count:  ${pod.restarts}\nEvents:\n  Type    Reason   Age   From     Message\n  Normal  Started  ${pod.age}   kubelet  Started container ${pod.app}`);
      }
      return;
    }
    case 'apply': {
      const file = cmd.flags.f;
      if (typeof file !== 'string' || !file) {
        out.fail('error: must specify one of -f and -k');
        return;
      }
      const name = file.replace(/^\.\//, '');
      if (world.files[name] === undefined) {
        out.fail(`error: the path "${file}" does not exist`);
        return;
      }
      if (!name.endsWith('.yaml') && !name.endsWith('.yml')) {
        out.fail(`error: error validating "${file}": not a Kubernetes manifest`);
        return;
      }
      world.configFixed = true;
      out.say('configmap/api-config configured', 'success');
      if (world.pods.some((pod) => pod.status === 'CrashLoopBackOff')) {
        out.tip('Running pods only read their config at start-up: restart them.', 'Les pods ne lisent leur config qu’au démarrage : redémarrez-les.');
      }
      return;
    }
    case 'rollout': {
      const [action] = rest;
      const name = deploymentTarget(rest.slice(1));
      const deployment = world.deployments.find((item) => item.name === name);
      if (!name) {
        out.fail('error: required resource not specified (e.g. deployment/api)');
        return;
      }
      if (!deployment) {
        out.fail(`Error from server (NotFound): deployments.apps "${name}" not found`);
        return;
      }
      if (action === 'restart') {
        const active = world.pods.filter((pod) => pod.app === name && pod.status !== 'Terminating');
        if (!podWillBeHealthy(world, name)) {
          active.filter((pod) => pod.status === 'CrashLoopBackOff').forEach((pod) => {
            pod.status = 'Terminating';
            newPod(world, name, deployment.revision);
          });
          out.say(`deployment.apps/${name} restarted`);
          out.tip('Rollout stuck: new pods will crash too until the config is fixed.', 'Rollout bloqué : les nouveaux pods vont crasher aussi tant que la config n’est pas corrigée.');
          return;
        }
        world.seq += 1;
        deployment.revision = hexId(world.seq + 500).slice(0, 6);
        active.forEach((pod) => { pod.status = 'Terminating'; });
        for (let index = 0; index < deployment.replicas; index += 1) newPod(world, name, deployment.revision);
        out.say(`deployment.apps/${name} restarted`, 'success');
        out.tip('New pods are starting… check them with `kubectl get pods`.', 'Les nouveaux pods démarrent… vérifiez avec `kubectl get pods`.');
        return;
      }
      if (action === 'status') {
        const pods = world.pods.filter((pod) => pod.app === name && pod.status !== 'Terminating');
        const ready = pods.filter((pod) => pod.status === 'Running').length;
        if (ready >= deployment.replicas && !hasTransitions(world)) out.say(`deployment "${name}" successfully rolled out`, 'success');
        else out.say(`Waiting for deployment "${name}" rollout to finish: ${ready} of ${deployment.replicas} updated replicas are available...`, 'warn');
        return;
      }
      if (action === 'undo') {
        out.fail(fr ? 'error: rollout undo est désactivé dans ce labo — corrigez vers l’avant !' : 'error: rollout undo is disabled in this lab — fix forward!');
        return;
      }
      out.fail(`error: unknown command "${action ?? ''}" for "kubectl rollout"`);
      return;
    }
    case 'scale': {
      const name = deploymentTarget(rest);
      const deployment = world.deployments.find((item) => item.name === name);
      const replicas = Number(cmd.flags.replicas);
      if (!name) {
        out.fail('error: you must specify the type of resource to scale (e.g. deployment/web)');
        return;
      }
      if (!deployment) {
        out.fail(`Error from server (NotFound): deployments.apps "${name}" not found`);
        return;
      }
      if (cmd.flags.replicas === undefined || cmd.flags.replicas === true || !Number.isInteger(replicas) || replicas < 0) {
        out.fail('error: required flag(s) "replicas" not set (e.g. --replicas=5)');
        return;
      }
      if (replicas > 10) {
        out.fail(`Error from server (Forbidden): exceeded quota: lab-quota, requested: replicas=${replicas}, limited: replicas=10`);
        return;
      }
      const active = world.pods.filter((pod) => pod.app === name && pod.status !== 'Terminating');
      if (replicas > active.length) for (let index = active.length; index < replicas; index += 1) newPod(world, name, deployment.revision);
      else active.slice(replicas).forEach((pod) => { pod.status = 'Terminating'; });
      deployment.replicas = replicas;
      out.say(`deployment.apps/${name} scaled`, 'success');
      return;
    }
    case 'delete': {
      const kind = resourceKind(rest[0]);
      if (kind === 'deployments' || kind === 'nodes' || kind === 'namespaces' || kind === 'services') {
        out.fail(`Error from server (Forbidden): ${rest[0]} is forbidden: guest cannot delete ${kind} in this lab`);
        return;
      }
      const pod = rest[0]?.includes('/') ? findPod(rest[0]) : findPod(rest[1]);
      if (kind !== 'pods' || !pod) {
        out.fail(`Error from server (NotFound): pods "${rest[1] ?? rest[0] ?? ''}" not found`);
        return;
      }
      const deployment = world.deployments.find((item) => item.name === pod.app);
      if (deployment) {
        pod.status = 'Terminating';
        newPod(world, pod.app, deployment.revision);
      } else {
        pod.status = 'ContainerCreating';
        pod.restarts = 0;
        pod.age = '1s';
      }
      out.say(`pod "${pod.name}" deleted`);
      return;
    }
    case 'top':
      out.fail('error: Metrics API not available');
      return;
    case 'cluster-info':
      out.pre('Kubernetes control plane is running at https://master-01:6443\nCoreDNS is running at https://master-01:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy', 'success');
      return;
    case 'version':
      out.pre('Client Version: v1.31.2\nServer Version: v1.31.2');
      return;
    case 'exec':
      out.tr('Interactive sessions are not available in this lab — use `kubectl logs`.', 'Les sessions interactives ne sont pas disponibles ici — utilisez `kubectl logs`.', 'muted');
      return;
    default:
      out.fail(`error: unknown command "${sub ?? ''}" for "kubectl"`);
      out.tip('Try `kubectl get pods`.', 'Essayez `kubectl get pods`.');
  }
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

const META_COMMANDS = ['help', 'hint', 'clear', 'next', 'skip', 'reset', 'missions'];

export const KNOWN_COMMANDS = [
  ...META_COMMANDS,
  'whoami', 'id', 'pwd', 'hostname', 'uname', 'uptime', 'date', 'echo', 'history', 'ls', 'cat', 'tail', 'head', 'cd',
  'free', 'ps', 'top', 'htop', 'ping', 'neofetch', 'contact', 'cv', 'resume', 'exit', 'logout', 'man',
  'df', 'du', 'truncate', 'rm', 'systemctl', 'journalctl', 'curl', 'docker', 'kubectl', 'helm', 'terraform', 'ansible', 'git', 'sudo',
];

function runWorldCommand(cmd: ParsedCommand, world: LabWorld, state: LabState, out: Out) {
  if (cmd.name === 'rm' && cmd.flags.r && cmd.flags.f && cmd.args.some((arg) => arg === '/' || arg === '/*')) {
    diskCommands({ ...cmd, args: ['/'] }, world, out);
    return;
  }
  if (cmd.name === 'docker') return dockerCommand(cmd, world, out);
  if (cmd.name === 'kubectl') return kubectlCommand(cmd, world, out);
  if (cmd.name === 'curl' || cmd.name === 'wget') return curlCommand(cmd, world, out);
  if (systemCommands(cmd, world, out)) return;
  if (diskCommands(cmd, world, out)) return;
  if (shellCommands(cmd, world, state, out)) return;

  out.fail(`bash: ${cmd.name}: command not found`);
  const suggestion = KNOWN_COMMANDS.map((name) => [name, levenshtein(cmd.name, name)] as const)
    .filter(([, distance]) => distance <= 2)
    .sort((a, b) => a[1] - b[1])[0];
  if (suggestion) out.tip(`Did you mean \`${suggestion[0]}\`?`, `Vouliez-vous dire \`${suggestion[0]}\` ?`);
  else out.tip('Type `help` to see what works here.', 'Tapez `help` pour voir ce qui fonctionne ici.');
}

function evaluateObjective(state: LabState, cmd: ParsedCommand, before: LabWorld, ok: boolean, out: Out): LabState {
  const objective = currentObjective(state);
  if (!objective || !objective.done({ cmd, before, after: state.world, ok })) return state;
  const locale = out.locale;
  const next: LabState = { ...state, completed: [...state.completed, objective.id], score: state.score + POINTS_PER_OBJECTIVE };
  out.say(`✔ ${objective.title[locale]} (+${POINTS_PER_OBJECTIVE})`, 'success');
  const upcoming = currentObjective(next);
  if (upcoming) {
    out.say(`→ ${upcoming.title[locale]}`, 'info');
  } else {
    const mission = currentMission(next);
    out.say('');
    out.say(`★ ${locale === 'fr' ? 'MISSION ACCOMPLIE' : 'MISSION COMPLETE'} · ${mission.title[locale]}`, 'success');
    out.say(mission.debrief[locale]);
    out.tr(
      next.missionIndex === missions.length - 1 ? 'Type `next` to see your final score.' : 'Type `next` (or press “Next mission”) to continue.',
      next.missionIndex === missions.length - 1 ? 'Tapez `next` pour voir votre score final.' : 'Tapez `next` (ou « Mission suivante ») pour continuer.',
      'accent',
    );
  }
  return next;
}

function goToNextMission(state: LabState, locale: Locale, skipped: boolean): CommandResult {
  const nextIndex = state.missionIndex + 1;
  if (nextIndex >= missions.length) {
    const finished: LabState = { ...state, finished: true, missionsSkipped: state.missionsSkipped + (skipped ? 1 : 0), completed: currentMission(state).objectives.map((objective) => objective.id) };
    return { state: finished, output: labCompleteLines(finished, locale) };
  }
  const next: LabState = {
    ...state,
    missionIndex: nextIndex,
    completed: [],
    revealed: [],
    world: missions[nextIndex].setup(),
    missionsSkipped: state.missionsSkipped + (skipped ? 1 : 0),
  };
  const output = missionIntro(next, locale);
  if (next.world.host !== state.world.host) output.splice(1, 0, { text: `ssh guest@${next.world.host} … ${locale === 'fr' ? 'connecté' : 'connected'}`, tone: 'muted' });
  return { state: next, output };
}

function runMeta(state: LabState, cmd: ParsedCommand, locale: Locale): CommandResult | null {
  const out = new Out(locale);
  switch (cmd.name) {
    case 'help':
      helpLines(state, out);
      return { state, output: out.lines };
    case 'clear':
      return { state, output: [], clear: true };
    case 'missions':
      missions.forEach((mission, index) => {
        const done = state.finished || index < state.missionIndex || (index === state.missionIndex && missionComplete(state));
        const marker = done ? '✔' : index === state.missionIndex ? '▶' : '·';
        out.pre(`${marker} ${index + 1}. ${mission.title[locale]}`, done ? 'success' : index === state.missionIndex ? 'accent' : 'muted');
      });
      return { state, output: out.lines };
    case 'hint': {
      const objective = currentObjective(state);
      if (state.finished) {
        out.tr('No more hints needed — you finished the lab!', 'Plus besoin d’indice — vous avez terminé le labo !', 'success');
        return { state, output: out.lines };
      }
      if (!objective) {
        out.tr('Mission complete — type `next`.', 'Mission accomplie — tapez `next`.', 'accent');
        return { state, output: out.lines };
      }
      const alreadyRevealed = state.revealed.includes(objective.id);
      const next = alreadyRevealed ? state : {
        ...state,
        revealed: [...state.revealed, objective.id],
        hintsUsed: state.hintsUsed + 1,
        score: Math.max(0, state.score - HINT_COST),
      };
      out.tr(`Hint: ${objective.title.en}`, `Indice : ${objective.title.fr}`, 'info');
      out.pre(`  $ ${objective.hint}`, 'accent');
      if (!alreadyRevealed) out.say(`(-${HINT_COST} pts)`, 'muted');
      return { state: next, output: out.lines };
    }
    case 'next':
      if (state.finished) {
        out.tr('You already finished the lab. Type `reset` to play again.', 'Vous avez déjà terminé le labo. Tapez `reset` pour rejouer.', 'muted');
        return { state, output: out.lines };
      }
      if (!missionComplete(state)) {
        out.tr('Finish the current objectives first (or type `skip`).', 'Terminez d’abord les objectifs en cours (ou tapez `skip`).', 'warn');
        return { state, output: out.lines };
      }
      return goToNextMission(state, locale, false);
    case 'skip':
      if (state.finished) return { state, output: [] };
      return goToNextMission(state, locale, !missionComplete(state));
    case 'reset': {
      const fresh = createLab();
      return { state: fresh, output: [{ text: locale === 'fr' ? 'Labo réinitialisé.' : 'Lab reset.', tone: 'muted' }, ...missionIntro(fresh, locale)] };
    }
    default:
      return null;
  }
}

const REDIRECT = /^(?:sudo\s+)?(?::\s*|true\s*|echo\s+(?:-n\s+)?(?:""|'')?\s*|cat\s+\/dev\/null\s*)?>\s*(\S+)$/;

function runSingle(state: LabState, input: string, locale: Locale): CommandResult & { ok: boolean } {
  let command = input;
  let grep: { pattern: string; ignoreCase: boolean } | null = null;
  const notes: OutputLine[] = [];
  if (input.includes('|')) {
    const [left, ...right] = input.split('|');
    command = left.trim();
    const filter = right.join('|').trim().match(/^grep\s+(-i\s+)?["']?([^"']+?)["']?$/);
    if (filter) grep = { pattern: filter[2], ignoreCase: Boolean(filter[1]) };
    else notes.push({ text: locale === 'fr' ? '(seuls les pipes vers grep sont simulés)' : '(only pipes into grep are simulated)', tone: 'muted' });
  }
  const redirect = command.match(REDIRECT);
  if (redirect) command = `truncate -s 0 ${redirect[1]}`;

  const cmd = parseCommand(command);
  if (cmd.name === '' && cmd.sudo) {
    return { state, output: [{ text: 'usage: sudo <command>', tone: 'error' }], ok: false };
  }
  if (cmd.sudo && (cmd.name === 'su' || cmd.flags.i || cmd.flags.s)) {
    return { state, output: [{ text: locale === 'fr' ? 'Bien essayé. Les shells root sont désactivés dans ce labo ;)' : 'Nice try. Root shells are disabled in this lab ;)', tone: 'warn' }], ok: true };
  }

  const meta = runMeta(state, cmd, locale);
  if (meta) return { ...meta, ok: true };

  const out = new Out(locale);
  const before = state.world;
  const world = cloneWorld(before);
  runWorldCommand(cmd, world, state, out);
  if (grep) {
    const { pattern, ignoreCase } = grep;
    out.lines = out.lines.filter((line) => (ignoreCase ? line.text.toLowerCase().includes(pattern.toLowerCase()) : line.text.includes(pattern)));
  }
  let next: LabState = { ...state, world };
  next = evaluateObjective(next, cmd, before, out.ok, out);
  return { state: next, output: [...out.lines, ...notes], ok: out.ok };
}

export function runCommand(state: LabState, input: string, locale: Locale): CommandResult {
  const raw = input.trim();
  if (!raw) return { state, output: [] };
  let next: LabState = { ...state, history: [...state.history, raw].slice(-100) };
  const output: OutputLine[] = [];
  let clear = false;
  for (const part of raw.split('&&').map((item) => item.trim()).filter(Boolean)) {
    const result = runSingle(next, part, locale);
    next = result.state;
    if (result.clear) {
      clear = true;
      output.length = 0;
    } else {
      output.push(...result.output);
    }
    if (!result.ok) break;
  }
  return { state: next, output, clear };
}

/* ------------------------------------------------------------------ */
/* Tab completion                                                      */
/* ------------------------------------------------------------------ */

function candidatesFor(world: LabWorld, words: string[]): string[] {
  if (words.length === 0) return KNOWN_COMMANDS.filter((name) => name !== 'sudo');
  const [rawName, sub] = words;
  const name = rawName === 'k' ? 'kubectl' : rawName;
  const pods = world.pods.filter((pod) => pod.status !== 'Terminating').map((pod) => pod.name);
  const files = Object.keys(world.files);
  const logPaths = world.logs.map((log) => log.path);
  const deployments = world.deployments.map((deployment) => `deployment/${deployment.name}`);
  const containers = world.containers.map((container) => container.name);
  switch (name) {
    case 'kubectl':
      if (words.length === 1) return ['get', 'logs', 'describe', 'apply', 'rollout', 'scale', 'delete', 'top', 'cluster-info'];
      if (sub === 'get') return words.length === 2 ? ['pods', 'nodes', 'deployments', 'services', 'configmaps', 'all'] : ['-o', 'wide'];
      if (sub === 'logs') return pods;
      if (sub === 'describe' || sub === 'delete') return words.length === 2 ? ['pod'] : pods;
      if (sub === 'apply') return words.length === 2 ? ['-f'] : files.filter((file) => file.endsWith('.yaml'));
      if (sub === 'rollout') return words.length === 2 ? ['restart', 'status'] : deployments;
      if (sub === 'scale') return words.length === 2 ? deployments : ['--replicas=5'];
      return [];
    case 'docker':
      if (words.length === 1) return ['ps', 'images', 'run', 'logs', 'stop', 'start', 'rm'];
      if (['logs', 'stop', 'start', 'rm'].includes(sub)) return containers;
      if (sub === 'run') return ['-d', '--name', 'web', '-p', '8080:80', 'nginx'];
      if (sub === 'ps') return ['-a'];
      return [];
    case 'systemctl':
      return words.length === 1 ? ['status', 'restart', 'start', 'stop'] : Object.keys(world.services);
    case 'journalctl':
      return ['-u', ...Object.keys(world.services)];
    case 'cat': case 'tail': case 'head': case 'rm': case 'truncate': case 'ls': case 'du':
      return [...files, ...logPaths, ...LOG_DIRECTORIES, '/var/log/*', '-s', '0', '-sh', '-lh'];
    case 'curl':
      return ['localhost', 'localhost:8080', '-I'];
    case 'df': case 'free':
      return ['-h'];
    default:
      return [];
  }
}

const commonPrefix = (values: string[]) => values.reduce((prefix, value) => {
  let index = 0;
  while (index < prefix.length && prefix[index] === value[index]) index += 1;
  return prefix.slice(0, index);
});

export function completeInput(state: LabState, input: string): { value: string; options: string[] } {
  const endsWithSpace = /\s$/.test(input);
  const tokens = input.trim() ? input.trim().split(/\s+/) : [];
  const current = endsWithSpace ? '' : tokens.pop() ?? '';
  const words = tokens.filter((token) => token !== 'sudo');
  const matches = [...new Set(candidatesFor(state.world, words))].filter((candidate) => candidate.startsWith(current) && candidate !== current);
  if (matches.length === 0) return { value: input, options: [] };
  const prefix = tokens.length ? `${tokens.join(' ')} ` : '';
  if (matches.length === 1) return { value: `${prefix}${matches[0]} `, options: [] };
  return { value: `${prefix}${commonPrefix(matches)}`, options: matches.slice(0, 12) };
}

export { allPodsRunning, diskPercent, diskUsedGb, formatSize };
