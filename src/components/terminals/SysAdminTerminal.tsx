import { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { TerminalTypewriter } from '../TerminalTypewriter';

interface SysAdminTerminalProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function SysAdminTerminal({ variant = 'desktop', className = '' }: SysAdminTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogOutput, setShowLogOutput] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking block cursor
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'desktop') {
    return (
      <div className={`rounded-xl overflow-hidden shadow-2xl border border-green-900/50 ${className}`}
        style={{ background: '#0C0C0C' }}
      >
        {/* CRT-style header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-green-900/30" style={{ background: '#111' }}>
          <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_6px_#00FF00]" />
          <span className="w-3 h-3 rounded-full bg-yellow-600" />
          <span className="w-3 h-3 rounded-full bg-red-700" />
          <span className="ml-4 text-xs font-mono" style={{ color: '#00FF00', fontFamily: "'Courier New', monospace" }}>root@server:~#</span>
        </div>

        {/* Scanlines overlay + terminal body */}
        <div className="relative">
          {/* Subtle scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)',
            }}
          />

          <div className="p-5 font-mono text-sm leading-relaxed" style={{ color: '#00FF00', fontFamily: "'Courier New', monospace" }}>
            <p>
              <span style={{ color: '#FFB800' }}>root@server:~#</span> whoami
            </p>
            <p className="text-white">nassim.fatnassi — Systems Administrator</p>
            <p className="mt-3">
              <span style={{ color: '#FFB800' }}>root@server:~#</span> systemctl status sshd
            </p>
            <p><span className="text-green-400">●</span> sshd.service - OpenBSD Secure Shell server</p>
            <p className="pl-4 text-green-300">Active: <span className="text-green-400 font-bold">active (running)</span> since Mon 2026-02-28</p>
            <p className="mt-3">
              <span style={{ color: '#FFB800' }}>root@server:~#</span> netstat -tulpn | head -5
            </p>
            <p style={{ color: '#aaa' }}>Proto  Local Address     State</p>
            <p>tcp    0.0.0.0:22        LISTEN</p>
            <p>tcp    0.0.0.0:80        LISTEN</p>
            <p>tcp    0.0.0.0:443       LISTEN</p>
            <p>udp    0.0.0.0:53        LISTEN</p>
            <p className="mt-3">
              <span style={{ color: '#FFB800' }}>root@server:~#</span> df -h | grep -E "^/dev"
            </p>
            <p style={{ color: '#aaa' }}>Filesystem    Size  Used  Avail  Use%  Mounted</p>
            <p>/dev/sda1     200G  45G   155G   23%  /</p>
            <p>/dev/sdb1     500G  120G  380G   24%  /data</p>

            <div className="mt-3 min-h-[40px]">
              <div className="flex">
                <span style={{ color: '#FFB800' }} className="mr-1">root@server:~#</span>
                <TerminalTypewriter
                  text="tail -f /var/log/syslog"
                  delay={3500}
                  speed={60}
                  onComplete={() => setShowLogOutput(true)}
                  showCursor={!showLogOutput}
                  className="text-green-400"
                />
              </div>
              {showLogOutput && (
                <div className="mt-1 space-y-0.5 text-xs" style={{ color: '#00CC00' }}>
                  <p>[INFO] System running normally — uptime: 365 days</p>
                  <p>[INFO] All services healthy ✓</p>
                </div>
              )}
            </div>

            {!showLogOutput && (
              <p className="mt-2 flex">
                <span style={{ color: '#FFB800' }}>root@server:~#</span>
                <span className="ml-1" style={{ visibility: cursorVisible ? 'visible' : 'hidden' }}>█</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-2xl border border-green-900/50 w-full max-w-md mx-auto transition-all duration-300 ${isExpanded ? 'scale-105 z-20' : ''} ${className}`}
      style={{ background: '#0C0C0C' }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-green-900/30" style={{ background: '#111' }}>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_4px_#00FF00]" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono" style={{ color: '#00FF00' }}>root@server:~#</span>
          {isExpanded ? <Minimize2 size={12} className="text-green-500" /> : <Maximize2 size={12} className="text-green-500" />}
        </div>
      </div>

      <div className={`p-2 font-mono text-[10px] leading-relaxed ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-64 overflow-hidden'}`}
        style={{ color: '#00FF00', fontFamily: "'Courier New', monospace" }}
      >
        <div className="mb-1">
          <span style={{ color: '#FFB800' }}>root#</span> whoami
          <div className="text-white pl-2">nassim — SysAdmin</div>
        </div>
        <div className="mb-1">
          <span style={{ color: '#FFB800' }}>root#</span> systemctl status sshd
          <div className="pl-2"><span className="text-green-400">●</span> active (running)</div>
        </div>
        <div>
          <span style={{ color: '#FFB800' }}>root#</span> netstat -tulpn
          <div className="pl-2 text-green-300">:22 :80 :443 LISTEN</div>
        </div>
        {isExpanded && (
          <div className="mt-1">
            <span style={{ color: '#FFB800' }}>root#</span> df -h
            <div className="pl-2">/dev/sda1 200G 23% /</div>
            <div className="pl-2">/dev/sdb1 500G 24% /data</div>
          </div>
        )}
      </div>
    </div>
  );
}
