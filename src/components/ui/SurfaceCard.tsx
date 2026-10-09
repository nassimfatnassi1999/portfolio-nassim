import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type SurfaceElement = 'div' | 'article' | 'aside';
type SurfaceCardProps<T extends SurfaceElement = 'div'> = {
  as?: T;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function SurfaceCard<T extends SurfaceElement = 'div'>({ as, children, className = '', ...props }: SurfaceCardProps<T>) {
  const Component = (as ?? 'div') as ElementType;
  return <Component className={`surface-card ${className}`} {...props}>{children}</Component>;
}
