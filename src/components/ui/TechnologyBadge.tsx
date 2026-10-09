import type { ReactNode } from 'react';

export function TechnologyBadge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`technology-badge ${className}`}>{children}</span>;
}
