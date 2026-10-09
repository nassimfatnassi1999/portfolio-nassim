import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'home');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setActiveSection(sectionIds[0] ?? 'home');
      return;
    }

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0, 0.25, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeSection;
}
