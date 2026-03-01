import { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { TerminalTypewriter } from '../TerminalTypewriter';

interface SoftwareTerminalProps {
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function SoftwareTerminal({ variant = 'desktop', className = '' }: SoftwareTerminalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBuildOutput, setShowBuildOutput] = useState(false);

  if (variant === 'desktop') {
    return (
      <div className={`rounded-xl border border-gray-700 overflow-hidden shadow-2xl bg-[#1E1E1E] ${className}`}>
        {/* VS Code-like title bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#323233] border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
            <span className="px-3 py-1 bg-[#1E1E1E] rounded-t border-t-2 border-[#61DAFB] text-gray-300">workspace.ts</span>
            <span className="px-3 py-1 text-gray-500">package.json</span>
          </div>
          <div className="w-16" />
        </div>

        {/* Editor-like body */}
        <div className="p-5 font-mono text-sm leading-relaxed">
          {/* Line numbers + code */}
          <div className="flex gap-4">
            <div className="text-gray-600 text-right select-none w-6 space-y-0">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="leading-relaxed">{i + 1}</div>
              ))}
            </div>
            <div className="text-gray-300 space-y-0 flex-1">
              <p className="leading-relaxed"><span className="text-[#FF79C6]">const</span> <span className="text-[#61DAFB]">developer</span> = {'{'}</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">name</span>: <span className="text-[#F1FA8C]">"nassim.fatnassi"</span>,</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">role</span>: <span className="text-[#F1FA8C]">"Software Engineer"</span>,</p>
              <p className="leading-relaxed">{'};'}</p>
              <p className="leading-relaxed" />
              <p className="leading-relaxed"><span className="text-gray-500">{'// '} Languages & Frameworks</span></p>
              <p className="leading-relaxed"><span className="text-[#FF79C6]">const</span> <span className="text-[#61DAFB]">skills</span> = {'{'}</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">languages</span>: [<span className="text-[#F1FA8C]">"TypeScript"</span>, <span className="text-[#F1FA8C]">"Java"</span>, <span className="text-[#F1FA8C]">"Python"</span>],</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">frontend</span>: [<span className="text-[#F1FA8C]">"React"</span>, <span className="text-[#F1FA8C]">"Angular"</span>, <span className="text-[#F1FA8C]">"Tailwind"</span>],</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">backend</span>: [<span className="text-[#F1FA8C]">"Spring Boot"</span>, <span className="text-[#F1FA8C]">".NET"</span>, <span className="text-[#F1FA8C]">"Node.js"</span>],</p>
              <p className="leading-relaxed pl-4"><span className="text-[#BD93F9]">databases</span>: [<span className="text-[#F1FA8C]">"PostgreSQL"</span>, <span className="text-[#F1FA8C]">"MongoDB"</span>],</p>
              <p className="leading-relaxed">{'};'}</p>
              <p className="leading-relaxed" />
              <p className="leading-relaxed"><span className="text-gray-500">{'// '} Build & deploy</span></p>
              <p className="leading-relaxed"><span className="text-[#FF79C6]">await</span> <span className="text-[#61DAFB]">build</span>(<span className="text-[#F1FA8C]">"production"</span>);</p>
              <p className="leading-relaxed" />
              <div className="flex leading-relaxed">
                <span className="text-gray-500 mr-1">{'>'}</span>
                <TerminalTypewriter
                  text='npm run build — compiled successfully ✓'
                  delay={3000}
                  speed={40}
                  onComplete={() => setShowBuildOutput(true)}
                  showCursor={!showBuildOutput}
                  className="text-green-400"
                />
              </div>
              {showBuildOutput && (
                <p className="leading-relaxed text-[#61DAFB]">Ready for deployment 🚀</p>
              )}
            </div>
          </div>
        </div>

        {/* VS Code-like status bar */}
        <div className="flex items-center justify-between px-4 py-1 bg-[#007ACC] text-white text-xs font-mono">
          <div className="flex items-center gap-4">
            <span>main*</span>
            <span>TypeScript React</span>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>Ln 18, Col 1</span>
            <span>Prettier</span>
          </div>
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div
      className={`rounded-xl border border-gray-700 overflow-hidden shadow-2xl bg-[#1E1E1E] w-full max-w-md mx-auto transition-all duration-300 ${isExpanded ? 'scale-105 z-20' : ''} ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-[#323233] border-b border-gray-700">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
          <span>workspace.ts</span>
          {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
        </div>
      </div>
      <div className={`p-2 font-mono text-[10px] leading-relaxed text-gray-300 ${isExpanded ? 'max-h-96 overflow-y-auto' : 'max-h-64 overflow-hidden'}`}>
        <p><span className="text-[#FF79C6]">const</span> <span className="text-[#61DAFB]">dev</span> = {'{'}</p>
        <p className="pl-3"><span className="text-[#BD93F9]">name</span>: <span className="text-[#F1FA8C]">"nassim.fatnassi"</span>,</p>
        <p className="pl-3"><span className="text-[#BD93F9]">role</span>: <span className="text-[#F1FA8C]">"Software Engineer"</span></p>
        <p>{'};'}</p>
        <p className="mt-1"><span className="text-[#FF79C6]">const</span> <span className="text-[#61DAFB]">skills</span> = {'{'}</p>
        <p className="pl-3"><span className="text-[#BD93F9]">lang</span>: [<span className="text-[#F1FA8C]">"TS"</span>, <span className="text-[#F1FA8C]">"Java"</span>, <span className="text-[#F1FA8C]">"Python"</span>]</p>
        {isExpanded && (
          <>
            <p className="pl-3"><span className="text-[#BD93F9]">front</span>: [<span className="text-[#F1FA8C]">"React"</span>, <span className="text-[#F1FA8C]">"Angular"</span>]</p>
            <p className="pl-3"><span className="text-[#BD93F9]">back</span>: [<span className="text-[#F1FA8C]">"Spring"</span>, <span className="text-[#F1FA8C]">"Node"</span>]</p>
          </>
        )}
        <p>{'};'}</p>
      </div>
      <div className="px-3 py-1 bg-[#007ACC] text-white text-[9px] font-mono flex justify-between">
        <span>main*</span>
        <span>TypeScript</span>
      </div>
    </div>
  );
}
