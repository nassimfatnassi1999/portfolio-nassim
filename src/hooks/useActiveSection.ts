import { useEffect, useState } from 'react';

export function useActiveSection(sectionIds: readonly string[]): string {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'home');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const documentBottom = document.documentElement.scrollHeight - 2;
      if (window.scrollY + window.innerHeight >= documentBottom) {
        setActiveSection(elements[elements.length - 1].id);
        return;
      }

      const marker = window.scrollY + Math.min(window.innerHeight * 0.25, 220);
      const current = elements.reduce((selected, element) => {
        const top = element.getBoundingClientRect().top + window.scrollY;
        return top <= marker ? element : selected;
      }, elements[0]);
      setActiveSection(current.id);
    };
    const scheduleUpdate = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [sectionIds]);

  return activeSection;
}
