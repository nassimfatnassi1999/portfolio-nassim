import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import profilesData from '../data/cv-profiles.json';
import { useProfileTransition } from '../hooks/useProfileTransition';
import { ProfileTransition } from '../components/ProfileTransition';

/* ─── Types ─── */
export type ProfileId = 'cloud-devops' | 'software' | 'system-admin';

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  terminalStyle: string;
  backgroundEffect: string;
  fontFamily: string;
  iconSet: string;
}

export interface ProfileAboutLang {
  jobTitle: string;
  profileP1: string;
  profileP1Bold1: string;
  profileP1Mid: string;
  profileP1Bold2: string;
  profileP1End: string;
  profileP2Start: string;
  profileP2H1: string;
  profileP2Mid1: string;
  profileP2H2: string;
  profileP2Mid2: string;
  profileP2H3: string;
  profileP2Mid3: string;
  profileP2H4: string;
  profileP2End: string;
  highlights: Array<{ title: string; desc: string }>;
}

export interface SkillCategoryData {
  categoryTitle: string;
  skills: string[];
  color: string;
}

export interface ProfileData {
  id: string;
  key: string;
  title: { en: string; fr: string };
  tagline: { en: string; fr: string };
  theme: ThemeConfig;
  heroDescription: { en: string; fr: string };
  typingTexts: { en: string[]; fr: string[] };
  about: { en: ProfileAboutLang; fr: ProfileAboutLang };
  skills: { en: SkillCategoryData[]; fr: SkillCategoryData[] };
  experienceFilter: number[];
  projectFilter: number[];
  cvLinks: { en: string; fr: string };
  contactSubtitle: { en: string; fr: string };
  footerTitle: { en: string; fr: string };
  certifications: string[];
}

export interface ProfileContextType {
  currentProfileId: ProfileId;
  setProfile: (id: ProfileId) => void;
  profile: ProfileData;
  theme: ThemeConfig;
  isTransitioning: boolean;
}

const profiles = profilesData.profiles as Record<ProfileId, ProfileData>;

/* ─── Context ─── */
const ProfileContext = createContext<ProfileContextType | null>(null);

/* ─── Provider ─── */
export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfileId, setCurrentProfileId] = useState<ProfileId>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRole = params.get('role');
    if (urlRole && urlRole in profiles) return urlRole as ProfileId;
    const saved = localStorage.getItem('portfolio-profile');
    if (saved && saved in profiles) return saved as ProfileId;
    return 'cloud-devops';
  });

  const { isTransitioning, pendingProfile, startTransition, onTransitionComplete } =
    useProfileTransition();

  /** Apply a profile switch immediately (called by the transition hook mid-animation) */
  const applyProfile = useCallback((id: ProfileId) => {
    setCurrentProfileId(id);
    localStorage.setItem('portfolio-profile', id);
    const url = new URL(window.location.href);
    url.searchParams.set('role', id);
    window.history.replaceState({}, '', url.toString());
  }, []);

  /** Public setter — triggers the themed transition overlay */
  const setProfile = useCallback(
    (id: ProfileId) => {
      if (id === currentProfileId) return;
      startTransition(id, applyProfile);
    },
    [currentProfileId, startTransition, applyProfile],
  );

  const profile = profiles[currentProfileId];
  const theme = profile.theme;

  // Apply CSS variables for dynamic theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--profile-primary', theme.primaryColor);
    root.style.setProperty('--profile-secondary', theme.secondaryColor);
    root.style.setProperty('--profile-accent', theme.accentColor);
  }, [theme]);

  return (
    <ProfileContext.Provider value={{ currentProfileId, setProfile, profile, theme, isTransitioning }}>
      {children}

      {/* Themed transition overlay — rendered above everything */}
      <ProfileTransition
        targetProfile={pendingProfile}
        isVisible={isTransitioning}
        onComplete={onTransitionComplete}
      />
    </ProfileContext.Provider>
  );
}

/* ─── Hooks ─── */
export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export function useTheme(): ThemeConfig {
  return useProfile().theme;
}

export { profiles };
