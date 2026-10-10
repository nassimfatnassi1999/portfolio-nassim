type StatusIndicatorProps = {
  label: string;
  tone?: 'success' | 'info' | 'warning';
  pulse?: boolean;
};

const toneClasses = {
  success: 'bg-emerald-500',
  info: 'bg-sky-400',
  warning: 'bg-amber-500',
};

export function StatusIndicator({ label, tone = 'success', pulse = false }: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-slate-300">
      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${toneClasses[tone]} ${pulse ? 'motion-safe:animate-pulse' : ''}`} />
      {label}
    </span>
  );
}
