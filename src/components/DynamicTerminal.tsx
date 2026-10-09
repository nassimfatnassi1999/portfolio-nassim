interface DynamicTerminalProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function DynamicTerminal({ variant = 'desktop', className = '' }: DynamicTerminalProps) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <span className="terminal-dot bg-red-500" />
        <span className="terminal-dot bg-yellow-500" />
        <span className="terminal-dot bg-green-500" />
        <span className="ml-4 font-mono text-xs text-gray-500">nassim@infra:~$</span>
      </div>
      <div className={`terminal-body space-y-2 text-gray-300 ${variant === 'mobile' ? 'text-[11px]' : ''}`}>
        <p><span className="text-terminal-green">nassim@infra:~$</span> whoami</p>
        <div className="pl-4 text-white">
          <p>Nassim Fatnassi Hnifi</p>
          <p>Cloud &amp; DevOps Engineer</p>
          <p>Systems &amp; Infrastructure Administrator</p>
        </div>
        <p className="pt-2"><span className="text-terminal-green">nassim@infra:~$</span> cat expertise.yaml</p>
        <div className="space-y-1 pl-4 text-gray-400">
          <p><span className="text-terminal-cyan">systems:</span> Linux, Windows, AIX, VMware</p>
          <p><span className="text-terminal-cyan">cloud:</span> Azure, AWS, GCP, OpenStack</p>
          <p><span className="text-terminal-cyan">platform:</span> Docker, Kubernetes, Helm</p>
          <p><span className="text-terminal-cyan">operations:</span> CI/CD, IaC, Observability</p>
        </div>
      </div>
    </div>
  );
}
