import { ArrowRight, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../../types/portfolio';
import { StatusIndicator } from '../ui/StatusIndicator';
import { TechnologyBadge } from '../ui/TechnologyBadge';

type ProjectDetailsDialogProps = {
  project: Project;
  category: string;
  labels: Record<string, string>;
  returnFocusTo: HTMLButtonElement | null;
  onClose: () => void;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function DialogSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-slate-200/80 pt-6 dark:border-slate-800">
      <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-brand-700 dark:text-brand-400">
        {title}
      </h3>
      <div className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{children}</div>
    </section>
  );
}

function ArchitectureBlock({ architecture }: { architecture: string }) {
  if (!architecture.includes('→')) {
    return (
      <div
        className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4 text-slate-700 dark:text-slate-300"
        data-architecture-kind="text"
      >
        {architecture}
      </div>
    );
  }

  const steps = architecture.split('→').map((step) => step.trim());

  return (
    <div
      role="img"
      aria-label={architecture}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-4"
      data-architecture-kind="pipeline"
    >
      {steps.map((step, index) => (
        <div key={`${step}-${index}`} className="contents">
          <span className="rounded-lg border border-slate-200 bg-white/85 px-3 py-2 font-mono text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/85 dark:text-slate-200">
            {step}
          </span>
          {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-brand-500" />}
        </div>
      ))}
    </div>
  );
}

export function ProjectDetailsDialog({ project, category, labels, returnFocusTo, onClose }: ProjectDetailsDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = `project-dialog-title-${project.id}`;
  const descriptionId = `project-dialog-description-${project.id}`;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const appRoot = document.getElementById('root');
    const rootWasInert = appRoot?.hasAttribute('inert') ?? false;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    appRoot?.setAttribute('inert', '');

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus({ preventScroll: true }));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (!firstElement || !lastElement) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === firstElement || !dialog.contains(activeElement))) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (!rootWasInert) appRoot?.removeAttribute('inert');
      returnFocusTo?.focus({ preventScroll: true });
    };
  }, [onClose, returnFocusTo]);

  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const dialog = (
    <div
      className="project-dialog-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/75 p-2 backdrop-blur-sm sm:p-6"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        id="project-details-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="project-dialog-panel relative w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0b1120]"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label={labels.closeProjectDetails}
          onClick={onClose}
          className="sticky right-4 top-4 z-10 float-right mr-4 mt-4 inline-grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white/95 text-slate-600 shadow-sm transition-colors duration-200 hover:border-brand-400/60 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-300 dark:hover:border-brand-400/60 dark:hover:text-brand-300"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>

        <header className="border-b border-slate-200/80 bg-slate-50 px-5 pb-7 pt-8 dark:border-slate-800 dark:bg-[#0d1728] sm:px-8 sm:pb-8 sm:pt-10">
          <div className="pr-14">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-brand-700 dark:text-brand-400">
              {labels.projectDetails} · {category}
            </p>
            <div className="mt-4"><StatusIndicator label={project.status} tone="info" /></div>
            <h2 id={titleId} className="mt-5 text-2xl font-bold leading-tight tracking-[-0.025em] text-slate-950 dark:text-slate-50 sm:text-4xl">
              {project.title}
            </h2>
            <p id={descriptionId} className="mt-3 text-base font-semibold text-brand-700 dark:text-brand-300 sm:text-lg">
              {project.subtitle}
            </p>
          </div>
        </header>

        <div className="space-y-7 px-5 py-7 sm:px-8 sm:py-8">
          <DialogSection title={labels.problem}><p>{project.problem}</p></DialogSection>
          <DialogSection title={labels.architecture}><ArchitectureBlock architecture={project.architecture} /></DialogSection>
          <DialogSection title={labels.role}><p>{project.role}</p></DialogSection>

          {project.details.length > 0 && (
            <DialogSection title={labels.implementationDetails}>
              <ul className="space-y-2.5">
                {project.details.map((detail) => (
                  <li key={detail} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </DialogSection>
          )}

          <DialogSection title={labels.technologies}>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((technology) => <TechnologyBadge key={technology}>{technology}</TechnologyBadge>)}
            </div>
          </DialogSection>

          <section
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5"
            data-outcome-kind={project.outcome.kind}
          >
            <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-400">
              {labels[project.outcome.kind]}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200 sm:text-base">{project.outcome.text}</p>
          </section>

          {project.links.length > 0 && (
            <DialogSection title={labels.verifiedLinks}>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/[0.07] px-4 py-2.5 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:border-brand-500/60 hover:bg-brand-500/[0.12] dark:text-brand-300"
                  >
                    {link.label}<ExternalLink aria-hidden="true" className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </DialogSection>
          )}
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return dialog;
  return createPortal(dialog, document.body);
}
