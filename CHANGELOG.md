# Changelog

## 1.1.0

### Added
- **Ops Lab** (`#lab`): a guided, bilingual terminal game with five missions (Linux basics, Docker, a Kubernetes CrashLoopBackOff incident, scaling, and a full-disk web server outage), a live infrastructure panel, hints, scoring, Tab completion and command history.
- **SysAdmin TTY style**: a second visual style (green phosphor console / paper ops log) with a TTY/GUI toggle in the navigation.
- "Play the Ops Lab" call to action under the hero terminal and an "Ops Lab" navigation entry.
- Tests for the game engine (full playthrough) and for terminal interactions.

### Fixed
- Dark mode no longer flashes white on page load: theme and style are applied before the first paint.
- `localStorage` access is guarded, so the site keeps working when storage is blocked (private browsing).
- The hero typing animation no longer leaves an un-cleared timer behind when the language changes.
- Decorative icons (hero buttons, About and Footer links) are hidden from screen readers.
- Navigation links never wrap onto two lines.
- Package renamed from the Vite starter name to `portfolio-nassim`.
