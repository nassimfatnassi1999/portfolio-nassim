import { describe, expect, it } from 'vitest';
import {
  advanceWorld,
  completeInput,
  createLab,
  currentObjective,
  introLines,
  missionComplete,
  parseCommand,
  rankFor,
  runCommand,
} from './engine';
import { CRASHING_POD, HINT_COST, MAX_SCORE, missions } from './missions';
import type { LabState, Locale, OutputLine } from './types';
import { diskPercent, nameSuffix } from './world';

function play(state: LabState, commands: string[], locale: Locale = 'en') {
  let current = state;
  const output: OutputLine[] = [];
  for (const command of commands) {
    const result = runCommand(current, command, locale);
    current = result.state;
    output.push(...result.output);
  }
  return { state: current, output, text: output.map((line) => line.text).join('\n') };
}

/** Lets pods finish starting, like the UI timer does. */
const settle = (state: LabState) => advanceWorld(state);

describe('ops lab command parser', () => {
  it('parses flags, values, aliases and sudo', () => {
    expect(parseCommand('docker run -d --name web -p 8080:80 nginx')).toMatchObject({
      name: 'docker', args: ['run', 'nginx'], flags: { d: true, name: 'web', p: '8080:80' },
    });
    expect(parseCommand('k get po -o wide')).toMatchObject({ name: 'kubectl', args: ['get', 'po'], flags: { o: 'wide' } });
    expect(parseCommand('kubectl scale deploy web --replicas 5').flags.replicas).toBe('5');
    expect(parseCommand('du -sh /var/log/*')).toMatchObject({ args: ['/var/log/*'], flags: { s: true, h: true } });
    expect(parseCommand('sudo truncate -s 0 /var/log/app/debug.log')).toMatchObject({ sudo: true, flags: { s: '0' } });
  });
});

describe('ops lab missions', () => {
  it('has bilingual, non-empty mission content', () => {
    for (const mission of missions) {
      for (const text of [mission.title, mission.brief, mission.debrief, ...mission.objectives.map((objective) => objective.title)]) {
        expect(text.en.trim()).not.toBe('');
        expect(text.fr.trim()).not.toBe('');
      }
      expect(new Set(mission.objectives.map((objective) => objective.id)).size).toBe(mission.objectives.length);
    }
  });

  it('can be completed with every hinted command, in order, for a perfect score', () => {
    let state = createLab();
    for (let index = 0; index < missions.length; index += 1) {
      for (const objective of missions[index].objectives) {
        expect(currentObjective(state)?.id).toBe(objective.id);
        state = runCommand(state, objective.hint, 'en').state;
        if (currentObjective(state)?.id === objective.id) {
          // A pod may still be starting: wait for the scheduler and try again.
          state = runCommand(settle(state), objective.hint, 'en').state;
        }
        expect(state.completed).toContain(objective.id);
      }
      expect(missionComplete(state)).toBe(true);
      state = runCommand(state, 'next', 'en').state;
    }
    expect(state.finished).toBe(true);
    expect(state.score).toBe(MAX_SCORE);
    expect(rankFor(state.score, 'en')).toBe('Principal SRE');
  });

  it('only completes the current objective (guided order)', () => {
    const state = play(createLab(), ['cat mission.txt']).state;
    expect(state.completed).toEqual([]);
    expect(play(state, ['whoami', 'ls', 'cat mission.txt']).state.completed).toEqual(['whoami', 'ls', 'cat']);
  });

  it('charges a hint only once per objective', () => {
    const once = play(createLab(0, 100), ['hint']);
    expect(once.state.score).toBe(100 - HINT_COST);
    expect(once.text).toContain('$ whoami');
    expect(play(once.state, ['hint']).state.score).toBe(100 - HINT_COST);
  });

  it('runs the docker mission with realistic errors', () => {
    let state = createLab(1);
    const conflict = play(state, ['docker run -d --name db -p 8080:80 nginx']);
    expect(conflict.text).toContain('is already in use');
    state = play(state, ['docker ps', 'docker run -d --name web nginx']).state;
    expect(currentObjective(state)?.id).toBe('docker-run');
    expect(play(state, ['curl localhost:8080']).text).toContain("Couldn't connect to server");
    state = play(state, ['docker rm -f web', 'docker run -d --name web -p 8080:80 nginx']).state;
    const verified = play(state, ['curl localhost:8080']);
    expect(verified.text).toContain('Welcome to nginx!');
    expect(missionComplete(verified.state)).toBe(true);
  });

  it('keeps the api crashing until the config is fixed, then rolls out healthy pods', () => {
    let state = play(createLab(2), ['kubectl get pods', `kubectl logs ${CRASHING_POD}`]).state;
    expect(play(state, [`kubectl logs ${CRASHING_POD}`]).text).toContain('DB_HOST');

    const early = settle(play(state, ['kubectl rollout restart deployment/api']).state);
    expect(early.world.pods.filter((pod) => pod.status === 'CrashLoopBackOff')).toHaveLength(1);
    expect(early.completed).not.toContain('restart');

    state = play(early, ['kubectl apply -f api-config.yaml', 'kubectl rollout restart deployment/api']).state;
    expect(state.completed).toContain('restart');
    expect(play(state, ['kubectl get pods']).text).toContain('ContainerCreating');
    state = settle(state);
    expect(state.world.pods.every((pod) => pod.status === 'Running')).toBe(true);
    expect(missionComplete(play(state, ['kubectl get pods']).state)).toBe(true);
  });

  it('accepts deleting the crashing pod as an alternative fix', () => {
    const state = play(createLab(2), ['kubectl get pods', `kubectl logs ${CRASHING_POD}`, 'kubectl apply -f api-config.yaml', `kubectl delete pod ${CRASHING_POD}`]).state;
    expect(state.completed).toContain('restart');
  });

  it('scales a deployment across worker nodes and enforces the quota', () => {
    let state = createLab(3);
    expect(play(state, ['kubectl scale deployment/web --replicas=50']).text).toContain('exceeded quota');
    state = settle(play(state, ['kubectl get deploy', 'kubectl scale deployment web --replicas=5']).state);
    const web = state.world.pods.filter((pod) => pod.app === 'web');
    expect(web).toHaveLength(5);
    expect(new Set(web.map((pod) => pod.node))).toEqual(new Set(['worker-01', 'worker-02']));
    expect(missionComplete(play(state, ['kubectl get pods -o wide']).state)).toBe(true);
  });

  it('cannot restart nginx until disk space is freed', () => {
    let state = play(createLab(4), ['systemctl status nginx', 'df -h', 'du -sh /var/log/*']).state;
    expect(diskPercent(state.world)).toBe(100);
    const blocked = play(state, ['systemctl restart nginx']);
    expect(blocked.text).toContain('Job for nginx.service failed');
    state = play(state, ['> /var/log/app/debug.log']).state;
    expect(diskPercent(state.world)).toBeLessThan(40);
    const done = play(state, ['sudo systemctl restart nginx', 'curl -I localhost']);
    expect(done.text).toContain('HTTP/1.1 200 OK');
    expect(missionComplete(done.state)).toBe(true);
  });
});

describe('ops lab terminal behaviour', () => {
  it('suggests close commands and handles easter eggs', () => {
    expect(play(createLab(), ['kubeclt get pods']).text).toContain('Did you mean `kubectl`?');
    expect(play(createLab(), ['sudo rm -rf /']).text).toContain('dangerous to operate recursively');
    expect(play(createLab(), ['kubectl get pods']).text).toContain('connection to the server');
  });

  it('localizes narration in French while keeping tool output intact', () => {
    const result = play(createLab(), ['whoami', 'cat mission.txt'], 'fr');
    expect(result.text).toContain('guest');
    expect(result.text).toContain('Bienvenue, opérateur.');
    expect(introLines(createLab(), 'fr').map((line) => line.text).join(' ')).toContain('Première connexion');
  });

  it('chains with && and filters pipes into grep', () => {
    const result = play(createLab(2), ['kubectl get pods | grep Crash']);
    expect(result.output.filter((line) => line.text.includes('api-'))).toHaveLength(1);
    expect(play(createLab(), ['whoami && ls']).state.completed).toEqual(['whoami', 'ls']);
  });

  it('clears, resets and skips', () => {
    expect(runCommand(createLab(), 'clear', 'en').clear).toBe(true);
    const skipped = play(createLab(), ['skip']).state;
    expect(skipped.missionIndex).toBe(1);
    expect(skipped.missionsSkipped).toBe(1);
    expect(play(skipped, ['reset']).state.missionIndex).toBe(0);
  });

  it('completes commands, pod names and files with Tab', () => {
    expect(completeInput(createLab(2), 'kubectl get po').value).toBe('kubectl get pods ');
    expect(completeInput(createLab(2), 'kubectl logs api-7').value).toBe(`kubectl logs ${CRASHING_POD} `);
    expect(completeInput(createLab(), 'cat mi').value).toBe('cat mission.txt ');
    expect(completeInput(createLab(), 'sudo who').value).toBe('sudo whoami ');
    expect(completeInput(createLab(4), 'systemctl st').options).toEqual(['status', 'start', 'stop']);
  });

  it('restores progress safely and generates stable pod names', () => {
    expect(createLab(99).finished).toBe(true);
    expect(createLab(-4).missionIndex).toBe(0);
    expect(nameSuffix(7)).toBe(nameSuffix(7));
    expect(nameSuffix(7)).toMatch(/^[a-z0-9]{5}$/);
  });
});
