import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import type { LocalizedPortfolio } from '../types/portfolio';
import { TerminalWindow } from './ui/TerminalWindow';

const LAST_STEP = 4;

type InfrastructureTerminalProps = {
  portfolio: LocalizedPortfolio;
  variant?: 'desktop' | 'mobile';
};

export function InfrastructureTerminal({ portfolio, variant = 'desktop' }: InfrastructureTerminalProps) {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(() => (reducedMotion ? LAST_STEP : 1));

  useEffect(() => {
    if (reducedMotion) {
      setStep(LAST_STEP);
      return;
    }
    setStep(1);
    const timers = [2, 3, 4].map((next, index) => window.setTimeout(() => setStep(next), 760 * (index + 1)));
    return () => timers.forEach(window.clearTimeout);
  }, [reducedMotion]);

  return (
    <div>
      <TerminalWindow title="nassim@infra:~$" className={variant === 'mobile' ? 'text-[10px]' : ''}>
        <div className="min-w-0 space-y-3 text-[11px] sm:text-xs lg:text-[13px]">
          <div>
            <Command>whoami</Command>
            <div className="mt-1 border-l border-slate-700 pl-3 text-slate-300">
              <p className="font-semibold text-white">{portfolio.identity.name}</p>
              <p>{portfolio.identity.title}</p>
            </div>
          </div>

          {step >= 2 && (
            <div className="terminal-step-in">
              <Command>cat expertise.yaml</Command>
              <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 border-l border-slate-700 pl-3 text-slate-400">
                <span className="text-sky-400">{portfolio.labels.terminalSystems}:</span><span>Linux · Windows · AIX · VMware</span>
                <span className="text-sky-400">{portfolio.labels.terminalCloud}:</span><span>Azure · AWS · Google Cloud · OpenStack</span>
                <span className="text-sky-400">{portfolio.labels.terminalPlatform}:</span><span>Docker · Kubernetes · Helm</span>
                <span className="text-sky-400">{portfolio.labels.terminalOperations}:</span><span>CI/CD · IaC · Monitoring</span>
              </div>
            </div>
          )}

          {step >= 3 && (
            <div className="terminal-step-in">
              <Command>kubectl get nodes</Command>
              <div className="mt-1 overflow-hidden border-l border-slate-700 pl-3 text-slate-400">
                <p className="whitespace-pre text-slate-500">{portfolio.labels.terminalNodeHeader}</p>
                <p className="whitespace-pre"><span className="text-slate-300">master-01</span>  <span className="text-emerald-400">{portfolio.labels.terminalReady}</span>    {portfolio.labels.terminalControlPlane}</p>
                <p className="whitespace-pre"><span className="text-slate-300">worker-01</span>  <span className="text-emerald-400">{portfolio.labels.terminalReady}</span>    {portfolio.labels.terminalWorker}</p>
                <p className="whitespace-pre"><span className="text-slate-300">worker-02</span>  <span className="text-emerald-400">{portfolio.labels.terminalReady}</span>    {portfolio.labels.terminalWorker}</p>
              </div>
            </div>
          )}

          {step >= 4 && (
            <div className="terminal-step-in">
              <Command>uptime</Command>
              <p className="mt-1 border-l border-slate-700 pl-3 font-semibold text-emerald-400">{portfolio.labels.terminalOperational}</p>
            </div>
          )}
        </div>
      </TerminalWindow>
    </div>
  );
}

function Command({ children }: { children: string }) {
  return <p><span className="text-emerald-400">nassim@infra:~$</span> <span className="text-slate-200">{children}</span></p>;
}
