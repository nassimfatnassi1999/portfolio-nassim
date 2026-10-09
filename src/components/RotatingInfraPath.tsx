import { useEffect, useState } from 'react';
import { Cloud } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INFRA_PATHS = ['~/cloud', '~/devops', '~/systems', '~/production'] as const;

export function RotatingInfraPath() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => setIndex((current) => (current + 1) % INFRA_PATHS.length), 2600);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <span
      aria-hidden="true"
      data-path-values={INFRA_PATHS.join(' ')}
      className="hidden min-w-[8.5rem] items-center gap-2 rounded-md border border-slate-700/80 bg-[#080d17] px-2.5 py-1.5 font-mono text-xs text-emerald-400 shadow-inner sm:inline-flex"
    >
      <Cloud className="h-3.5 w-3.5 text-sky-400" />
      <span key={reducedMotion ? 'infra' : INFRA_PATHS[index]} className="infra-path-text">
        {reducedMotion ? '~/infra' : INFRA_PATHS[index]}
      </span>
    </span>
  );
}
