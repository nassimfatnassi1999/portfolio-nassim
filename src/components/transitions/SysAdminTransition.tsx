import { useState, useEffect, useRef } from 'react';

/**
 * System Administrator transition — "System Boot & Services"
 * Simulates a Linux boot sequence with services starting.
 * Duration: ~1000ms
 */

const BOOT_LINES: Array<{ label: string; status: 'ok' | 'spinner' }> = [
  { label: 'Started kernel', status: 'ok' },
  { label: 'Mounted /dev/sda1', status: 'ok' },
  { label: 'Started networking.service', status: 'ok' },
  { label: 'Started sshd.service', status: 'ok' },
  { label: 'Started nginx.service', status: 'ok' },
  { label: 'Started monitoring-agent', status: 'ok' },
  { label: 'Starting firewall...', status: 'spinner' },
];

const SPINNER_CHARS = ['|', '/', '—', '\\'];

export function SysAdminTransition() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [firewallDone, setFirewallDone] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGlitch, setShowGlitch] = useState(true);
  const [spinnerIdx, setSpinnerIdx] = useState(0);
  const spinnerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    // Glitch flash at start
    const glitchTimer = setTimeout(() => setShowGlitch(false), 150);

    // Boot lines appear one by one
    const lineTimers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((_, i) => {
      lineTimers.push(
        setTimeout(() => setVisibleLines(i + 1), 100 + i * 100)
      );
    });

    // Firewall spinner → done
    const firewallTimer = setTimeout(() => setFirewallDone(true), 800);
    // Welcome message
    const welcomeTimer = setTimeout(() => setShowWelcome(true), 900);

    // Spinner rotation
    spinnerRef.current = setInterval(() => {
      setSpinnerIdx((prev) => (prev + 1) % SPINNER_CHARS.length);
    }, 80);

    return () => {
      clearTimeout(glitchTimer);
      lineTimers.forEach(clearTimeout);
      clearTimeout(firewallTimer);
      clearTimeout(welcomeTimer);
      if (spinnerRef.current) clearInterval(spinnerRef.current);
    };
  }, []);

  return (
    <div
      className="w-full h-full flex items-center justify-center relative scanlines crt-flicker"
      style={{ background: '#0c0c0c' }}
    >
      {/* Glitch flash overlay */}
      {showGlitch && (
        <div className="absolute inset-0 sys-glitch-flash bg-white/30 z-10" />
      )}

      <div className="w-full max-w-md px-6 font-mono text-sm leading-loose relative z-20">
        {/* Boot lines */}
        {BOOT_LINES.map((line, i) => {
          if (i >= visibleLines) return null;
          const isFirewall = i === BOOT_LINES.length - 1;
          const isFirewallLine = isFirewall && !firewallDone;

          return (
            <div
              key={i}
              className="boot-line-in flex items-center gap-0"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {isFirewallLine ? (
                <span className="text-yellow-400 w-[52px] flex-shrink-0">
                  [{SPINNER_CHARS[spinnerIdx].padStart(2, ' ').padEnd(2, ' ')}]
                </span>
              ) : (
                <span className="text-green-400 w-[52px] flex-shrink-0">
                  [ OK ]
                </span>
              )}
              <span className="text-gray-300 ml-1">
                {isFirewall && firewallDone ? 'Firewall active' : line.label}
              </span>
            </div>
          );
        })}

        {/* Welcome message */}
        {showWelcome && (
          <div className="mt-4 space-y-1 boot-line-in">
            <div className="text-gray-500 text-xs">─────────────────────────────</div>
            <div className="text-green-400 font-bold text-xs">
              Welcome to Ubuntu 22.04 LTS
            </div>
            <div className="mt-1 text-green-400/80 text-xs">
              <span className="text-cyan-400">nassim</span>
              <span className="text-gray-500">@</span>
              <span className="text-purple-400">server</span>
              <span className="text-gray-400">:~$ </span>
              <span className="cursor-blink text-green-400">▌</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
