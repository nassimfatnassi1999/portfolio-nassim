import type { ReactNode } from 'react';

export function TerminalWindow({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="terminal-dot bg-slate-500" />
          <span className="terminal-dot bg-amber-500" />
          <span className="terminal-dot bg-emerald-500" />
        </div>
        <span className="ml-3 truncate font-mono text-[11px] text-slate-500 dark:text-slate-400">{title}</span>
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}
