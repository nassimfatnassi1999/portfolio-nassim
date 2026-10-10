import { useEffect, useState } from 'react';

type MotionQuery = Pick<MediaQueryList, 'matches'>;

export function getReducedMotionPreference(query?: MotionQuery): boolean {
  return query?.matches ?? true;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return getReducedMotionPreference(window.matchMedia('(prefers-reduced-motion: reduce)'));
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      setReduced(true);
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}
