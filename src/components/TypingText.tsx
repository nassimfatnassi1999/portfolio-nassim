import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export function TypingText({ texts }: { texts: string[] }) {
  const reducedMotion = useReducedMotion();
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion || texts.length === 0) return;
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) setCharIndex(charIndex + 1);
        else setTimeout(() => setDeleting(true), 1800);
      } else {
        if (charIndex > 0) setCharIndex(charIndex - 1);
        else {
          setDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, deleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, reducedMotion, textIndex, texts]);

  if (texts.length === 0) return null;
  if (reducedMotion) return <span className="font-mono">{texts[0]}</span>;

  return (
    <span className="font-mono">
      {texts[textIndex].slice(0, charIndex)}
      <span className="animate-terminal-blink text-terminal-green">▎</span>
    </span>
  );
}
