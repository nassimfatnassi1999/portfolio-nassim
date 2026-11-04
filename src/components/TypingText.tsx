import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TYPE_DELAY = 80;
const DELETE_DELAY = 40;
const PAUSE_DELAY = 1800;

export function TypingText({ texts }: { texts: string[] }) {
  const reducedMotion = useReducedMotion();
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion || texts.length === 0) return;
    const current = texts[textIndex % texts.length];
    const fullyTyped = !deleting && charIndex >= current.length;

    // One timer per step, always cleaned up (the pause is a step too).
    const timeout = window.setTimeout(() => {
      if (fullyTyped) setDeleting(true);
      else if (!deleting) setCharIndex(charIndex + 1);
      else if (charIndex > 0) setCharIndex(charIndex - 1);
      else {
        setDeleting(false);
        setTextIndex((textIndex + 1) % texts.length);
      }
    }, fullyTyped ? PAUSE_DELAY : deleting ? DELETE_DELAY : TYPE_DELAY);
    return () => window.clearTimeout(timeout);
  }, [charIndex, deleting, reducedMotion, textIndex, texts]);

  if (texts.length === 0) return null;
  if (reducedMotion) return <span className="font-mono">{texts[0]}</span>;

  return (
    <span className="font-mono">
      {texts[textIndex % texts.length].slice(0, charIndex)}
      <span className="animate-terminal-blink text-terminal-green">▎</span>
    </span>
  );
}
