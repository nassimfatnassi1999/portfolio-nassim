// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPortfolio } from '../../data/portfolio';
import { Projects } from '../Projects';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type MutableMediaQueryList = MediaQueryList & {
  matches: boolean;
};

let reactRoot: Root;
let appRoot: HTMLDivElement;
let reducedMotion = false;

function rectangle(left: number, width: number): DOMRect {
  return {
    x: left,
    y: 0,
    top: 0,
    right: left + width,
    bottom: 400,
    left,
    width,
    height: 400,
    toJSON: () => ({}),
  };
}

function installCarouselGeometry(carousel: HTMLOListElement) {
  const cardWidth = 300;
  const cards = Array.from(carousel.querySelectorAll<HTMLElement>('[data-project-card]'));

  Object.defineProperty(carousel, 'getBoundingClientRect', {
    configurable: true,
    value: () => rectangle(0, 1_000),
  });
  cards.forEach((card, index) => {
    Object.defineProperty(card, 'getBoundingClientRect', {
      configurable: true,
      value: () => rectangle((index * cardWidth) - carousel.scrollLeft, cardWidth),
    });
  });

  const scrollTo = vi.fn(({ left }: ScrollToOptions) => {
    carousel.scrollLeft = left ?? carousel.scrollLeft;
  });
  Object.defineProperty(carousel, 'scrollTo', { configurable: true, value: scrollTo });
  return scrollTo;
}

async function renderProjects(locale: 'en' | 'fr' = 'en') {
  const portfolio = getPortfolio(locale);
  await act(async () => {
    reactRoot.render(<Projects projects={portfolio.projects} labels={portfolio.labels} />);
  });
  return portfolio;
}

beforeEach(() => {
  reducedMotion = false;
  appRoot = document.createElement('div');
  appRoot.id = 'root';
  document.body.appendChild(appRoot);
  reactRoot = createRoot(appRoot);

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes('prefers-reduced-motion') && reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } satisfies MutableMediaQueryList)),
  });
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});

afterEach(async () => {
  await act(async () => reactRoot.unmount());
  appRoot.remove();
  document.body.removeAttribute('style');
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('project carousel interactions', () => {
  it('moves manually, clamps at both ends and updates progress after scrolling', async () => {
    await renderProjects();
    const carousel = document.querySelector<HTMLOListElement>('[data-project-carousel]');
    expect(carousel).not.toBeNull();
    if (!carousel) return;

    const scrollTo = installCarouselGeometry(carousel);
    const previous = document.querySelector<HTMLButtonElement>('button[aria-label="Previous project"]');
    const next = document.querySelector<HTMLButtonElement>('button[aria-label="Next project"]');
    const progress = document.querySelector('[aria-label="Project progress"]');
    expect(previous?.disabled).toBe(true);
    expect(next?.disabled).toBe(false);
    expect(progress?.textContent).toContain('01 / 16');

    for (let index = 1; index < 16; index += 1) {
      await act(async () => next?.click());
    }

    expect(progress?.textContent).toContain('16 / 16');
    expect(previous?.disabled).toBe(false);
    expect(next?.disabled).toBe(true);
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'smooth' }));

    carousel.scrollLeft = 5 * 300;
    await act(async () => carousel.dispatchEvent(new Event('scroll', { bubbles: true })));
    expect(progress?.textContent).toContain('06 / 16');
    expect(next?.disabled).toBe(false);

    carousel.scrollLeft = 0;
    await act(async () => carousel.dispatchEvent(new Event('scroll', { bubbles: true })));
    expect(progress?.textContent).toContain('01 / 16');
    expect(previous?.disabled).toBe(true);
  });

  it('uses immediate carousel scrolling when reduced motion is requested', async () => {
    reducedMotion = true;
    await renderProjects();
    const carousel = document.querySelector<HTMLOListElement>('[data-project-carousel]');
    expect(carousel).not.toBeNull();
    if (!carousel) return;

    const scrollTo = installCarouselGeometry(carousel);
    const next = document.querySelector<HTMLButtonElement>('button[aria-label="Next project"]');
    await act(async () => next?.click());

    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'auto' }));
  });
});

describe('project details dialog interactions', () => {
  it('traps focus, closes with Escape and restores the page state and trigger focus', async () => {
    await renderProjects();
    const trigger = document.querySelector<HTMLButtonElement>('[data-project-card="z-ai-voice-email"] button[aria-haspopup="dialog"]');
    expect(trigger).not.toBeNull();
    if (!trigger) return;

    trigger.focus();
    await act(async () => trigger.click());

    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const close = document.querySelector<HTMLButtonElement>('button[aria-label="Close project details"]');
    const link = dialog?.querySelector<HTMLAnchorElement>('a[href]');
    expect(dialog).not.toBeNull();
    expect(close).not.toBeNull();
    expect(link).not.toBeNull();
    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe('hidden');
    expect(appRoot.hasAttribute('inert')).toBe(true);

    await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true })));
    expect(document.activeElement).toBe(link);
    await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })));
    expect(document.activeElement).toBe(close);

    await act(async () => dialog?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    await act(async () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.body.style.overflow).toBe('');
    expect(appRoot.hasAttribute('inert')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('closes only when the backdrop itself is pressed', async () => {
    await renderProjects();
    const trigger = document.querySelector<HTMLButtonElement>('[data-project-card="modern-cicd-architecture"] button[aria-haspopup="dialog"]');
    expect(trigger).not.toBeNull();
    if (!trigger) return;

    await act(async () => trigger.click());
    const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
    const backdrop = dialog?.parentElement;
    expect(backdrop).not.toBeNull();

    await act(async () => dialog?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();

    await act(async () => backdrop?.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});
