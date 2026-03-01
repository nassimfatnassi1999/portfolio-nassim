import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useProfile, type ProfileId } from '../context/ProfileContext';

const profileOptions: Array<{ id: ProfileId; short: string; emoji: string; label: string }> = [
  { id: 'cloud-devops', short: '~cloud', emoji: '☁️', label: 'Cloud & DevOps' },
  { id: 'software', short: '~dev', emoji: '💻', label: 'Software Engineer' },
  { id: 'system-admin', short: '~sys', emoji: '🖥️', label: 'System Admin' },
];

export function ProfileSelector() {
  const { currentProfileId, setProfile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [justSwitched, setJustSwitched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = profileOptions.find((p) => p.id === currentProfileId)!;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSelect = (id: ProfileId) => {
    if (id !== currentProfileId) {
      setProfile(id);
      setJustSwitched(true);
      setTimeout(() => setJustSwitched(false), 600);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Compact terminal badge trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 h-8 px-2.5 rounded-md font-mono text-sm
          bg-[#0d0d0d] dark:bg-[#0a0a0a] text-green-400
          border border-gray-700/60 hover:border-green-500/50
          transition-all duration-200 max-w-[140px]
          ${justSwitched ? 'profile-glitch' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm leading-none">{current.emoji}</span>
        <span className="hidden sm:inline truncate text-green-400/90">{current.short}</span>
        <ChevronDown className={`w-3 h-3 text-green-500/60 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Terminal-style dropdown */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1.5 w-[180px] rounded-md overflow-hidden
            bg-[#0a0a0a] border border-gray-700/60
            shadow-xl shadow-black/40
            z-50"
          role="listbox"
        >
          <div className="py-1">
            {profileOptions.map((option, idx) => {
              const isActive = option.id === currentProfileId;
              return (
                <button
                  key={option.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(option.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-all duration-150
                    profile-dropdown-item
                    ${isActive
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-gray-400 hover:text-green-300 hover:bg-green-500/5'
                    }`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <span className="text-sm leading-none">{option.emoji}</span>
                  <span className="truncate">{option.short}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
