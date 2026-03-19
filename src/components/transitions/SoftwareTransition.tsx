import { useState, useEffect } from 'react';

/**
 * Software Engineer transition — "Code Compilation & Build"
 * Simulates an IDE / terminal build sequence.
 * Duration: ~1200ms
 */

const LOG_LINES = [
  { text: 'transforming modules...', color: 'text-gray-400' },
  { text: 'resolving dependencies...', color: 'text-gray-400' },
  { text: 'chunking assets...', color: 'text-blue-400' },
  { text: 'optimizing bundle...', color: 'text-purple-400' },
  { text: 'generating source maps...', color: 'text-gray-400' },
];

const CONFETTI_CHARS = ['{', '}', ';', '</>', '()', '=>', '[ ]', '&&'];

export function SoftwareTransition() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 0),        // terminal appears
      setTimeout(() => setStep(2), 100),       // typing starts
      setTimeout(() => setStep(3), 350),       // typing done, build starts
      setTimeout(() => { setProgress(34); setLogIndex(0); }, 400),
      setTimeout(() => { setLogIndex(1); }, 500),
      setTimeout(() => { setProgress(67); setLogIndex(2); }, 600),
      setTimeout(() => { setLogIndex(3); }, 750),
      setTimeout(() => { setProgress(89); setLogIndex(4); }, 900),
      setTimeout(() => { setProgress(100); setStep(4); }, 1050),  // build done
      setTimeout(() => { setShowConfetti(true); setStep(5); }, 1100), // confetti
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: '#1e1e1e' }}
    >
      <div className="w-full max-w-lg px-6">
        {/* Terminal window */}
        <div className="rounded-lg border border-gray-700/60 overflow-hidden shadow-2xl bg-[#1e1e1e]">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] border-b border-gray-700/40">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-gray-500 font-mono">terminal — build</span>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-xs leading-relaxed space-y-1.5 min-h-[200px]">
            {/* Command line */}
            {step >= 1 && (
              <div>
                <span className="text-green-400">▶</span>{' '}
                <span className={step >= 3 ? 'text-gray-300' : ''}>
                  {step >= 2 ? (
                    <span>
                      <span className="text-pink-400">npm</span>{' '}
                      <span className="text-gray-300">run</span>{' '}
                      <span className="text-green-300">build</span>
                    </span>
                  ) : (
                    <span className="cursor-blink text-gray-400">▌</span>
                  )}
                </span>
              </div>
            )}

            {step >= 3 && (
              <>
                <div className="text-gray-500">
                  {'>'} project@1.0.0 build
                </div>
                <div className="text-gray-500">
                  {'>'} <span className="text-pink-400">tsc</span> && <span className="text-blue-400">vite</span> build
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: `${progress}%`,
                          background: progress >= 100
                            ? '#28c840'
                            : 'linear-gradient(90deg, #61DAFB, #FF79C6)',
                        }}
                      />
                    </div>
                    <span className={`w-10 text-right ${progress >= 100 ? 'text-green-400' : 'text-blue-400'}`}>
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Logs */}
                <div className="mt-2 space-y-0.5">
                  {LOG_LINES.map((log, i) =>
                    i <= logIndex ? (
                      <div key={i} className={`sw-log-slide ${log.color}`} style={{ animationDelay: `${i * 30}ms` }}>
                        {i <= logIndex - 1 || step >= 4 ? (
                          <span className="text-green-400">  ✓</span>
                        ) : (
                          <span className="text-yellow-400">  ●</span>
                        )}{' '}
                        {log.text}
                      </div>
                    ) : null
                  )}
                </div>
              </>
            )}

            {/* Build results */}
            {step >= 4 && (
              <div className="mt-2 space-y-0.5 border-t border-gray-700/40 pt-2">
                <div className="sw-log-slide text-green-400">✓ 42 modules transformed</div>
                <div className="sw-log-slide text-green-400" style={{ animationDelay: '50ms' }}>
                  ✓ dist/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2.4mb
                </div>
                <div className="sw-log-slide text-green-400 font-semibold" style={{ animationDelay: '100ms' }}>
                  ✓ Build completed in 1.2s
                </div>
              </div>
            )}

            {step >= 5 && (
              <div className="mt-2 sw-log-slide text-blue-300 font-semibold" style={{ animationDelay: '100ms' }}>
                {'>'} Ready for deployment 🚀
              </div>
            )}
          </div>
        </div>

        {/* Confetti characters */}
        {showConfetti && (
          <div className="relative h-0">
            {CONFETTI_CHARS.map((char, i) => (
              <span
                key={i}
                className="sw-confetti absolute text-xs font-mono font-bold"
                style={{
                  left: `${10 + i * 12}%`,
                  top: '-8px',
                  color: ['#61DAFB', '#FF79C6', '#28c840', '#febc2e'][i % 4],
                  animationDelay: `${i * 60}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
