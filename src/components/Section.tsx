import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

function useInView(threshold: number) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const canObserve = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [inView, setInView] = useState(() => reducedMotion || !canObserve);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    setInView(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(element);
        }
      },
      { threshold },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion, threshold]);

  return { ref, inView, reducedMotion };
}

export function Section({
  children,
  className = '',
  id,
  threshold = 0.12,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  threshold?: number;
}) {
  const { ref, inView, reducedMotion } = useInView(threshold);
  const revealClass = reducedMotion ? '' : `transition-[opacity,transform] duration-500 ${inView ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`;

  return <section id={id} ref={ref} className={`${revealClass} ${className}`}>{children}</section>;
}
