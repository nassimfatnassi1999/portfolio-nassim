import { useState, useEffect } from 'react';

/**
 * Cloud & DevOps transition — "Containers Orchestration"
 * Simulates a Kubernetes deployment sequence.
 * Duration: ~1000ms
 */
export function CloudTransition() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 0),      // cursor blink
      setTimeout(() => setStep(2), 200),     // kubectl typing
      setTimeout(() => setStep(3), 400),     // container 1 drops
      setTimeout(() => setStep(4), 600),     // container 2 drops
      setTimeout(() => setStep(5), 800),     // container 3 + LB
      setTimeout(() => setStep(6), 950),     // deployment successful
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="w-full h-full flex items-center justify-center font-mono text-sm"
      style={{ background: 'linear-gradient(135deg, #0a1929 0%, #001e3c 100%)' }}
    >
      <div className="w-full max-w-md px-6 space-y-3">
        {/* kubectl typing */}
        {step >= 1 && (
          <div className="text-gray-400 text-xs">
            <span className="text-cyan-400">$</span>{' '}
            <span
              className={step >= 2 ? '' : 'cursor-blink'}
              style={{ color: '#00D4AA' }}
            >
              {step >= 2 ? 'kubectl apply -f deployment.yaml' : ''}
              {step < 2 && <span className="cursor-blink">▌</span>}
            </span>
          </div>
        )}

        {/* Containers area */}
        <div className="relative mt-4 space-y-2">
          {/* Container 1: nginx */}
          {step >= 3 && (
            <div className="cloud-container-drop flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-cyan-500/40 bg-cyan-500/10">
                <span className="text-cyan-400 text-xs">⎈</span>
                <span className="text-cyan-300 text-xs font-semibold">nginx</span>
              </div>
              <span className="text-gray-500 text-xs">
                {step >= 4 ? (
                  <span className="cloud-check-pop text-green-400">✓ pulled</span>
                ) : (
                  '← pulling image...'
                )}
              </span>
            </div>
          )}

          {/* Container 2 + 3 row */}
          {step >= 4 && (
            <div className="cloud-container-drop flex items-center gap-2 pl-4">
              <svg width="16" height="20" className="text-cyan-500/40 flex-shrink-0">
                <line
                  x1="8" y1="0" x2="8" y2="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="cloud-line-draw"
                />
              </svg>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-cyan-400 text-xs">◉</span>
                  <span className="text-cyan-200/80 text-xs">app-1</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-cyan-500/30 bg-cyan-500/5">
                  <span className="text-cyan-400 text-xs">◉</span>
                  <span className="text-cyan-200/80 text-xs">app-2</span>
                </div>
              </div>
              <span className="text-gray-500 text-xs">
                {step >= 5 ? (
                  <span className="cloud-check-pop text-green-400">✓ scheduled</span>
                ) : (
                  '← scheduling...'
                )}
              </span>
            </div>
          )}

          {/* Load Balancer */}
          {step >= 5 && (
            <div className="cloud-container-drop flex items-center gap-2 pl-4">
              <svg width="16" height="16" className="text-cyan-500/40 flex-shrink-0">
                <line
                  x1="8" y1="0"  x2="8" y2="16"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="cloud-line-draw"
                />
              </svg>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-green-500/40 bg-green-500/10">
                <span className="text-green-400 text-xs">⚖</span>
                <span className="text-green-300 text-xs font-semibold">Load Balancer</span>
              </div>
              {step >= 6 && (
                <span className="cloud-check-pop text-green-400 text-xs font-bold">✓ Ready</span>
              )}
            </div>
          )}
        </div>

        {/* Progress bars */}
        {step >= 3 && (
          <div className="space-y-1.5 mt-3">
            <ProgressLine label="Pulling image" done={step >= 4} />
            <ProgressLine label="Creating pods" done={step >= 5} />
            <ProgressLine label="Scheduling" done={step >= 6} />
          </div>
        )}

        {/* Final message */}
        {step >= 6 && (
          <div className="mt-3 text-center">
            <span className="text-green-400 text-xs font-bold cloud-check-pop">
              ✓ Deployment successful — Deploying to AKS...
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressLine({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-28 truncate">{label}</span>
      <div className="flex-1 h-1 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            done ? 'bg-green-400 w-full' : 'bg-cyan-500/60 w-1/3 animate-pulse'
          }`}
        />
      </div>
      <span className={`w-4 text-center ${done ? 'text-green-400' : 'text-gray-600'}`}>
        {done ? '✓' : '…'}
      </span>
    </div>
  );
}
