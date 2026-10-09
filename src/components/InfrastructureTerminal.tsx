import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TerminalWindow } from './ui/TerminalWindow';

const LAST_STEP = 4;

export function InfrastructureTerminal({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
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
    <TerminalWindow title="nassim@infra:~$" className={variant === 'mobile' ? 'text-[10px]' : ''}>
      <div className="min-w-0 space-y-3 text-[11px] sm:text-xs lg:text-[13px]">
        <div>
          <Command>whoami</Command>
          <div className="mt-1 border-l border-slate-700 pl-3 text-slate-300">
            <p className="font-semibold text-white">Nassim Fatnassi Hnifi</p>
            <p>Cloud &amp; DevOps Engineer</p>
            <p>Systems &amp; Infrastructure Administrator</p>
          </div>
        </div>

        {step >= 2 && (
          <div className="terminal-step-in">
            <Command>cat expertise.yaml</Command>
            <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 border-l border-slate-700 pl-3 text-slate-400">
              <span className="text-sky-400">systems:</span><span>Linux · Windows · AIX · VMware</span>
              <span className="text-sky-400">cloud:</span><span>Azure · AWS · GCP · OpenStack</span>
              <span className="text-sky-400">platform:</span><span>Docker · Kubernetes · Helm</span>
              <span className="text-sky-400">operations:</span><span>CI/CD · IaC · Monitoring</span>
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className="terminal-step-in">
            <Command>kubectl get nodes</Command>
            <div className="mt-1 overflow-hidden border-l border-slate-700 pl-3 text-slate-400">
              <p className="whitespace-pre text-slate-500">NAME       STATUS   ROLE</p>
              <p className="whitespace-pre"><span className="text-slate-300">master-01</span>  <span className="text-emerald-400">Ready</span>    control-plane</p>
              <p className="whitespace-pre"><span className="text-slate-300">worker-01</span>  <span className="text-emerald-400">Ready</span>    worker</p>
              <p className="whitespace-pre"><span className="text-slate-300">worker-02</span>  <span className="text-emerald-400">Ready</span>    worker</p>
            </div>
          </div>
        )}

        {step >= 4 && (
          <div className="terminal-step-in">
            <Command>uptime</Command>
            <p className="mt-1 border-l border-slate-700 pl-3 font-semibold text-emerald-400">portfolio interface operational ✓</p>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
}

function Command({ children }: { children: string }) {
  return <p><span className="text-emerald-400">nassim@infra:~$</span> <span className="text-slate-200">{children}</span></p>;
}
