import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, Circle, CornerDownLeft, Lightbulb, MessageSquare, RotateCcw, SkipForward, Trophy } from 'lucide-react';
import {
  advanceWorld,
  completeInput,
  createLab,
  currentMission,
  currentObjective,
  hasTransitions,
  introLines,
  missionComplete,
  promptFor,
  rankFor,
  runCommand,
} from '../../game/engine';
import { HINT_COST, MAX_SCORE, missions } from '../../game/missions';
import type { LabState, OutputLine, Scene, Tone } from '../../game/types';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { readStorage, writeStorage } from '../../lib/storage';
import type { Locale, LocalizedPortfolio } from '../../types/portfolio';
import { Section } from '../Section';
import { SectionHeader } from '../ui/SectionHeader';
import { SurfaceCard } from '../ui/SurfaceCard';
import { LabLiveView } from './LabLiveView';

type TermLine = OutputLine & { id: number; prompt?: string };

type OpsLabProps = {
  portfolio: LocalizedPortfolio;
  language: Locale;
  onContactClick: () => void;
};

const STORAGE_KEY = 'ops-lab-progress';
const MAX_LINES = 400;

const toneClasses: Record<Tone, string> = {
  default: 'text-slate-300',
  muted: 'text-slate-500',
  success: 'text-emerald-400',
  error: 'text-rose-400',
  warn: 'text-amber-300',
  accent: 'text-sky-300',
  info: 'text-cyan-200',
};

const starterCommand: Record<Scene, string> = {
  shell: 'whoami',
  docker: 'docker ps -a',
  kubernetes: 'kubectl get pods',
  server: 'df -h',
};

function restoreLab(): LabState {
  try {
    const saved = JSON.parse(readStorage(STORAGE_KEY) ?? 'null') as Record<string, unknown> | null;
    if (!saved) return createLab();
    const number = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
    return createLab(number(saved.missionIndex), number(saved.score), number(saved.hintsUsed), number(saved.missionsSkipped));
  } catch {
    return createLab();
  }
}

/** Progress is saved at mission boundaries, so a reload restarts the current mission cleanly. */
function saveProgress(state: LabState) {
  writeStorage(STORAGE_KEY, JSON.stringify({
    missionIndex: state.finished ? missions.length : state.missionIndex,
    score: state.score,
    hintsUsed: state.hintsUsed,
    missionsSkipped: state.missionsSkipped,
  }));
}

/** Renders `inline code` from engine messages. */
function withCode(text: string): ReactNode {
  const parts = text.split(/`([^`]+)`/);
  if (parts.length === 1) return text;
  return parts.map((part, index) => (index % 2 === 1 ? <code key={index} className="rounded bg-slate-800 px-1 text-emerald-300">{part}</code> : part));
}

export function OpsLab({ portfolio, language, onContactClick }: OpsLabProps) {
  const labels = portfolio.labels;
  const reducedMotion = useReducedMotion();
  const nextId = useRef(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const withIds = (output: OutputLine[]): TermLine[] => output.map((line) => ({ ...line, id: nextId.current++ }));

  const [lab, setLab] = useState<LabState>(restoreLab);
  const [lines, setLines] = useState<TermLine[]>(() => introLines(lab, language).map((line, index) => ({ ...line, id: -1 - index })));
  const [interacted, setInteracted] = useState(false);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [completions, setCompletions] = useState<string[]>([]);

  const mission = currentMission(lab);
  const objective = currentObjective(lab);
  const complete = missionComplete(lab);
  const prompt = promptFor(lab.world);
  const transitioning = hasTransitions(lab.world);

  // Until the visitor types something, the welcome text follows the language switch.
  useEffect(() => {
    if (interacted) return;
    setLines(introLines(lab, language).map((line, index) => ({ ...line, id: -1 - index })));
  }, [interacted, lab, language]);

  // Pods move from ContainerCreating/Terminating to their final state after a short delay.
  useEffect(() => {
    if (!transitioning) return;
    const timer = window.setTimeout(() => setLab((current) => advanceWorld(current)), reducedMotion ? 400 : 1800);
    return () => window.clearTimeout(timer);
  }, [transitioning, reducedMotion]);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  const execute = (raw: string) => {
    const result = runCommand(lab, raw, language);
    const echo: TermLine = { id: nextId.current++, text: raw, prompt };
    const added = withIds(result.output);
    setInteracted(true);
    setLab(result.state);
    setLines((previous) => (result.clear ? added : [...previous, echo, ...added]).slice(-MAX_LINES));
    setInput('');
    setHistoryIndex(null);
    setCompletions([]);
    if (result.state.missionIndex !== lab.missionIndex || result.state.finished !== lab.finished) saveProgress(result.state);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    execute(input);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const history = lab.history;
    if (event.key === 'ArrowUp' && history.length > 0) {
      event.preventDefault();
      const index = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(index);
      setInput(history[index]);
    } else if (event.key === 'ArrowDown' && historyIndex !== null) {
      event.preventDefault();
      const index = historyIndex + 1;
      setHistoryIndex(index >= history.length ? null : index);
      setInput(index >= history.length ? '' : history[index]);
    } else if (event.key === 'Tab' && input.trim()) {
      // Only captures Tab when there is something to complete, so keyboard users can still tab out.
      event.preventDefault();
      const result = completeInput(lab, input);
      setInput(result.value);
      setCompletions(result.options);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'l') {
      event.preventDefault();
      setLines([]);
    } else if (event.ctrlKey && event.key.toLowerCase() === 'c' && !window.getSelection()?.toString()) {
      event.preventDefault();
      setLines((previous) => [...previous, { id: nextId.current++, text: `${input}^C`, prompt }]);
      setInput('');
    }
  };

  const typeForMe = (command: string) => {
    setInput(command);
    inputRef.current?.focus();
  };

  const focusInput = () => {
    if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true });
  };

  const quickCommands = ['help', starterCommand[lab.world.scene], 'ls', 'missions', 'clear'];

  return (
    <Section id="lab" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8" threshold={0.05}>
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow={`06 / ${labels.lab}`} title={labels.labTitle} description={labels.labIntro} />

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-[21rem_minmax(0,1fr)]">
          <SurfaceCard as="aside" aria-label={labels.labObjectives} data-lab-panel className="p-5 sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-700 dark:text-brand-400">
                {labels.labMission} {Math.min(lab.missionIndex + 1, missions.length)}/{missions.length}
              </p>
              <p className="rounded-md border border-brand-500/30 bg-brand-500/10 px-2 py-1 font-mono text-xs font-semibold text-brand-700 dark:text-brand-300">
                {labels.labScore} {lab.score}
              </p>
            </div>

            <ol aria-label={labels.labProgress} className="mt-3 grid grid-cols-5 gap-1.5">
              {missions.map((item, index) => {
                const done = lab.finished || index < lab.missionIndex || (index === lab.missionIndex && complete);
                const current = !lab.finished && index === lab.missionIndex;
                return (
                  <li key={item.id} title={item.title[language]} className={`h-1.5 rounded-full ${done ? 'bg-emerald-500' : current ? 'bg-brand-500/60' : 'bg-slate-200 dark:bg-slate-800'}`}>
                    <span className="sr-only">{item.title[language]}</span>
                  </li>
                );
              })}
            </ol>

            {lab.finished ? (
              <div data-lab-complete className="mt-6 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10 text-amber-500"><Trophy aria-hidden="true" className="h-7 w-7" /></span>
                <h3 className="mt-4 text-xl font-bold text-slate-950 dark:text-slate-50">{labels.labComplete}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{labels.labCompleteText}</p>
                <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800"><dt className="text-[10px] uppercase tracking-wider text-slate-500">{labels.labScore}</dt><dd className="font-mono text-sm font-bold">{lab.score}/{MAX_SCORE}</dd></div>
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800"><dt className="text-[10px] uppercase tracking-wider text-slate-500">{labels.labRank}</dt><dd className="text-xs font-bold">{rankFor(lab.score, language)}</dd></div>
                  <div className="rounded-lg border border-slate-200 p-2 dark:border-slate-800"><dt className="text-[10px] uppercase tracking-wider text-slate-500">{labels.labHintsUsed}</dt><dd className="font-mono text-sm font-bold">{lab.hintsUsed}</dd></div>
                </dl>
                <div className="mt-5 grid gap-2">
                  <button type="button" onClick={onContactClick} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"><MessageSquare aria-hidden="true" className="h-4 w-4" />{labels.labContactCta}</button>
                  <a href={portfolio.resumes.primary.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"><BookOpen aria-hidden="true" className="h-4 w-4" />{labels.downloadResume}</a>
                  <button type="button" onClick={() => execute('reset')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-700 dark:text-slate-400 dark:hover:text-brand-400"><RotateCcw aria-hidden="true" className="h-4 w-4" />{labels.labPlayAgain}</button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="mt-5 text-xl font-bold text-slate-950 dark:text-slate-50">{mission.title[language]}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{withCode(mission.brief[language])}</p>

                <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{labels.labObjectives}</h4>
                <ol className="mt-3 space-y-2.5">
                  {mission.objectives.map((item) => {
                    const done = lab.completed.includes(item.id);
                    const current = objective?.id === item.id;
                    const revealed = lab.revealed.includes(item.id) && !done;
                    return (
                      <li key={item.id} data-objective={item.id} data-state={done ? 'done' : current ? 'current' : 'todo'} className={`rounded-lg border px-3 py-2.5 text-sm transition-colors ${current ? 'border-brand-500/40 bg-brand-500/5' : 'border-transparent'}`}>
                        <span className="flex gap-2.5">
                          {done ? <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : current ? <ChevronRight aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" /> : <Circle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-700" />}
                          <span className={done ? 'text-slate-500 line-through decoration-slate-400/60' : current ? 'font-medium text-slate-900 dark:text-slate-100' : 'text-slate-500'}>{item.title[language]}</span>
                        </span>
                        {revealed && (
                          <span className="mt-2 flex flex-wrap items-center gap-2 pl-6">
                            <code className="rounded bg-slate-900 px-2 py-1 font-mono text-[11px] text-emerald-300">$ {item.hint}</code>
                            {current && <button type="button" onClick={() => typeForMe(item.hint)} className="min-h-9 rounded-md px-2 text-xs font-semibold text-brand-700 underline-offset-2 hover:underline dark:text-brand-400">{labels.labTypeForMe}</button>}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="mt-5 flex flex-wrap gap-2">
                  {complete ? (
                    <button type="button" onClick={() => execute('next')} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800">
                      {lab.missionIndex === missions.length - 1 ? labels.labFinish : labels.labNextMission}<ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  ) : objective && !lab.revealed.includes(objective.id) ? (
                    <button type="button" onClick={() => execute('hint')} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-500/15 dark:text-amber-300">
                      <Lightbulb aria-hidden="true" className="h-4 w-4" />{labels.labHint}<span className="text-xs font-normal opacity-80">(-{HINT_COST} pts)</span>
                    </button>
                  ) : null}
                </div>
                <div className="mt-3 flex justify-between gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-800">
                  <button type="button" onClick={() => execute('skip')} className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-slate-500 hover:text-brand-700 dark:hover:text-brand-400"><SkipForward aria-hidden="true" className="h-3.5 w-3.5" />{labels.labSkip}</button>
                  <button type="button" onClick={() => execute('reset')} className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-slate-500 hover:text-brand-700 dark:hover:text-brand-400"><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />{labels.labRestart}</button>
                </div>
              </>
            )}
          </SurfaceCard>

          <div className="grid min-w-0 gap-5">
            <div role="region" aria-label={labels.labTerminal} className="terminal-window lab-terminal">
              <div className="terminal-header justify-between gap-3">
                <div className="flex min-w-0 items-center">
                  <div aria-hidden="true" className="flex gap-1.5">
                    <span className="terminal-dot bg-rose-500" />
                    <span className="terminal-dot bg-amber-500" />
                    <span className="terminal-dot bg-emerald-500" />
                  </div>
                  <span className="ml-3 truncate font-mono text-[11px] text-slate-400">{prompt} — ops-lab</span>
                </div>
                <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500 sm:inline">{mission.title[language]}</span>
              </div>

              <div
                ref={outputRef}
                role="log"
                aria-label={labels.labOutput}
                tabIndex={0}
                onMouseUp={focusInput}
                data-lab-output
                className="lab-output h-[21rem] overflow-auto px-4 py-3 font-mono text-[12px] leading-relaxed sm:h-[25rem] sm:text-[13px]"
              >
                {lines.map((line) => {
                  if (line.prompt !== undefined) {
                    return (
                      <p key={line.id} className="mt-1 whitespace-pre-wrap break-words">
                        <span className="text-emerald-400">{line.prompt}</span> <span className="text-slate-100">{line.text}</span>
                      </p>
                    );
                  }
                  if (line.href) {
                    return (
                      <p key={line.id} className="whitespace-pre">
                        <a href={line.href} target={line.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sky-300 underline decoration-sky-300/40 underline-offset-2 hover:text-sky-200">{line.text}</a>
                      </p>
                    );
                  }
                  return (
                    <p key={line.id} className={`min-h-[1.2em] ${line.pre ? 'whitespace-pre' : 'whitespace-pre-wrap break-words'} ${toneClasses[line.tone ?? 'default']}`}>
                      {line.pre ? line.text : withCode(line.text)}
                    </p>
                  );
                })}
              </div>

              <form onSubmit={onSubmit} className="lab-input-bar flex items-center gap-2 border-t border-slate-800 bg-[#0a101c] px-4 py-2.5 focus-within:bg-[#0c1424]">
                <label htmlFor="ops-lab-input" className="shrink-0 font-mono text-[12px] text-emerald-400 sm:text-[13px]">
                  <span className="sr-only">{labels.labInput} </span>
                  <span aria-hidden="true"><span className="hidden sm:inline">guest@{lab.world.host}:</span>~$</span>
                </label>
                <input
                  id="ops-lab-input"
                  ref={inputRef}
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setCompletions([]);
                  }}
                  onKeyDown={onKeyDown}
                  type="text"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="send"
                  placeholder={labels.labPlaceholder}
                  className="lab-input min-h-10 min-w-0 flex-1 bg-transparent font-mono text-base text-slate-100 caret-emerald-400 outline-none placeholder:text-slate-600 sm:text-[13px]"
                />
                <button type="submit" aria-label={labels.labRun} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-700 text-slate-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300">
                  <CornerDownLeft aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
              {completions.length > 0 && (
                <p className="lab-completions border-t border-slate-800/70 bg-[#0a101c] px-4 py-2 font-mono text-[11px] text-slate-500">{completions.join('   ')}</p>
              )}

              <div className="lab-chips flex flex-wrap items-center gap-2 border-t border-slate-800 bg-[#080d17] px-4 py-3">
                <span className="sr-only">{labels.labQuickCommands}</span>
                {quickCommands.map((command) => (
                  <button
                    key={command}
                    type="button"
                    onClick={() => execute(command)}
                    className="min-h-9 rounded-md border border-slate-700/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 transition-colors hover:border-emerald-500/60 hover:text-emerald-300"
                  >
                    {command}
                  </button>
                ))}
                <span className="ml-auto hidden font-mono text-[10px] text-slate-600 md:inline">{labels.labKeyboardTip}</span>
              </div>
            </div>

            <SurfaceCard data-lab-live className="p-5 sm:p-6">
              <LabLiveView world={lab.world} labels={labels} />
            </SurfaceCard>
          </div>
        </div>
      </div>
    </Section>
  );
}
