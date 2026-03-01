import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { TerminalTypewriter } from '../TerminalTypewriter';

interface CloudTerminalProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function CloudTerminal({ variant = 'desktop', className = '' }: CloudTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRamadanOutput, setShowRamadanOutput] = useState(false);

  if (variant === 'desktop') {
    return (
      <div className={`terminal-window animate-pulse-glow ${className}`}>
        <div className="terminal-header">
          <span className="terminal-dot bg-red-500" />
          <span className="terminal-dot bg-yellow-500" />
          <span className="terminal-dot bg-green-500" />
          <span className="ml-4 text-xs text-gray-500 font-mono">nassim@cloud:~$</span>
        </div>
        <div className="terminal-body text-gray-300 space-y-2">
          <p>
            <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> whoami
          </p>
          <p className="text-white">nassim.fatnassi — Cloud & DevOps Engineer</p>
          <p className="mt-3">
            <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> cat skills.yaml
          </p>
          <p className="text-terminal-amber">cloud:</p>
          <p className="pl-4">- AWS, Azure, GCP, OpenStack</p>
          <p className="text-terminal-amber">containers:</p>
          <p className="pl-4">- Docker, Kubernetes, Helm</p>
          <p className="text-terminal-amber">iac & automation:</p>
          <p className="pl-4">- Terraform, Ansible, Bash</p>
          <p className="text-terminal-amber">cicd:</p>
          <p className="pl-4">- Jenkins, GitLab CI, ArgoCD</p>
          <p className="text-terminal-amber">monitoring:</p>
          <p className="pl-4">- Prometheus, Grafana, EFK</p>
          <p className="mt-3">
            <span className="text-terminal-green">➜</span> <span className="text-terminal-cyan">~</span> kubectl get nodes
          </p>
          <p className="text-green-400">NAME        STATUS  ROLES   AGE</p>
          <p>node-01     Ready   master  365d</p>
          <p>node-02     Ready   worker  365d</p>
          <p>node-03     Ready   worker  365d</p>

          <div className="mt-2 min-h-[60px]">
            <div className="flex">
              <span className="text-terminal-green mr-2">➜</span>
              <span className="text-terminal-cyan mr-2">~</span>
              <TerminalTypewriter
                text="terraform apply -auto-approve"
                delay={3000}
                speed={50}
                onComplete={() => setShowRamadanOutput(true)}
                showCursor={!showRamadanOutput}
              />
            </div>

            {showRamadanOutput && (
              <div className="mt-1">
                <TerminalTypewriter
                  text="Apply complete! Resources: 12 added, 0 changed, 0 destroyed."
                  className="text-green-400"
                  speed={30}
                  showCursor={false}
                />
              </div>
            )}
          </div>

          {!showRamadanOutput && (
            <p className="mt-2" style={{ visibility: 'hidden' }}>placeholder</p>
          )}
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div
      className={`terminal-window w-full max-w-md mx-auto transition-all duration-300 ${isExpanded ? 'scale-105 z-20' : ''} ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="terminal-header flex justify-between items-center p-2">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 font-mono">nassim@cloud:~$</span>
          {isExpanded ? <Minimize2 size={12} className="text-gray-500" /> : <Maximize2 size={12} className="text-gray-500" />}
        </div>
      </div>

      <div className={`terminal-body p-2 font-mono text-[10px] leading-relaxed text-gray-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-64 overflow-hidden'}`}>
        <div className="mb-2">
          <div className="flex gap-1">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-cyan">~</span>
            <span>whoami</span>
          </div>
          <div className="text-white pl-4">nassim.fatnassi — Cloud & DevOps</div>
        </div>
        <div className="mb-2">
          <div className="flex gap-1">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-cyan">~</span>
            <span>cat skills.yaml</span>
          </div>
          <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-terminal-amber">cloud: <span className="text-gray-400">AWS, Azure...</span></div>
            <div className="text-terminal-amber">k8s: <span className="text-gray-400">Helm, Docker...</span></div>
            <div className="text-terminal-amber">iac: <span className="text-gray-400">Terraform...</span></div>
            {isExpanded && (
              <>
                <div className="text-terminal-amber">cicd: <span className="text-gray-400">Jenkins, GitLab...</span></div>
                <div className="text-terminal-amber">monitor: <span className="text-gray-400">Prometheus...</span></div>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="flex gap-1">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-cyan">~</span>
            <span>kubectl get nodes</span>
          </div>
          <div className="text-green-400 pl-4 whitespace-pre">{`NAME     STATUS   ROLES\nnode-01  Ready    master`}</div>
          {isExpanded && <div className="text-gray-300 pl-4 whitespace-pre">{`node-02  Ready    worker\nnode-03  Ready    worker`}</div>}
        </div>
      </div>
    </div>
  );
}
