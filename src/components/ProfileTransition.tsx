import { useEffect, useState } from 'react';
import type { ProfileId } from '../context/ProfileContext';
import { CloudTransition } from './transitions/CloudTransition';
import { SoftwareTransition } from './transitions/SoftwareTransition';
import { SysAdminTransition } from './transitions/SysAdminTransition';

interface ProfileTransitionProps {
  targetProfile: ProfileId | null;
  isVisible: boolean;
  onComplete: () => void;
}

/** Durations per profile (ms) */
const DURATIONS: Record<ProfileId, number> = {
  'cloud-devops': 1000,
  'software': 1200,
  'system-admin': 1000,
};

const FADE_OUT_MS = 300;

/**
 * Full-screen themed transition overlay.
 * Shows the animation for the TARGET profile, then calls onComplete.
 */
export function ProfileTransition({ targetProfile, isVisible, onComplete }: ProfileTransitionProps) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (!isVisible || !targetProfile) return;

    setFadingOut(false);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reducedMotion ? 200 : DURATIONS[targetProfile];

    // Start fade-out when animation is almost done
    const fadeTimer = setTimeout(() => setFadingOut(true), duration);
    // Complete after fade-out finishes
    const completeTimer = setTimeout(() => onComplete(), duration + FADE_OUT_MS);
    // Safety net: force complete after 1500ms max
    const safetyTimer = setTimeout(() => onComplete(), 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, [isVisible, targetProfile, onComplete]);

  if (!isVisible || !targetProfile) return null;

  // For prefers-reduced-motion, show a simple fade
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`profile-transition-overlay ${fadingOut ? 'fade-out' : ''}`}>
      {reducedMotion ? (
        <div className="w-full h-full bg-gray-950 flex items-center justify-center">
          <div className="text-gray-400 font-mono text-sm animate-pulse">Loading...</div>
        </div>
      ) : (
        <>
          {targetProfile === 'cloud-devops' && <CloudTransition />}
          {targetProfile === 'software' && <SoftwareTransition />}
          {targetProfile === 'system-admin' && <SysAdminTransition />}
        </>
      )}
    </div>
  );
}
