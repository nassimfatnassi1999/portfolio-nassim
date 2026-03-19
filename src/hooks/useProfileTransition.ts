import { useState, useCallback, useRef } from 'react';
import type { ProfileId } from '../context/ProfileContext';

interface UseProfileTransitionReturn {
  isTransitioning: boolean;
  pendingProfile: ProfileId | null;
  startTransition: (newProfile: ProfileId, apply: (id: ProfileId) => void) => void;
  onTransitionComplete: () => void;
}

/**
 * Manages the timing of profile transitions.
 *
 * Flow:
 * 1. `startTransition(id, applyFn)` — shows overlay, stores pending profile
 * 2. After ~half the animation, calls `applyFn(id)` to swap profile data
 * 3. `onTransitionComplete()` — called by ProfileTransition when animation ends
 * 4. Overlay unmounts, new content is visible
 */
export function useProfileTransition(): UseProfileTransitionReturn {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<ProfileId | null>(null);
  const applyRef = useRef<((id: ProfileId) => void) | null>(null);
  const appliedRef = useRef(false);

  const startTransition = useCallback((newProfile: ProfileId, applyFn: (id: ProfileId) => void) => {
    setPendingProfile(newProfile);
    setIsTransitioning(true);
    applyRef.current = applyFn;
    appliedRef.current = false;

    // Apply the actual profile switch midway through the animation
    // so content swaps while the overlay is fully opaque
    setTimeout(() => {
      if (!appliedRef.current && applyRef.current) {
        applyRef.current(newProfile);
        appliedRef.current = true;
      }
    }, 400);
  }, []);

  const onTransitionComplete = useCallback(() => {
    // Ensure profile was applied even if timer didn't fire
    if (!appliedRef.current && applyRef.current && pendingProfile) {
      applyRef.current(pendingProfile);
      appliedRef.current = true;
    }
    setIsTransitioning(false);
    setPendingProfile(null);
    applyRef.current = null;
  }, [pendingProfile]);

  return { isTransitioning, pendingProfile, startTransition, onTransitionComplete };
}
