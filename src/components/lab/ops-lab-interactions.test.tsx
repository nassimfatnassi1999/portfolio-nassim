// @vitest-environment jsdom

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getPortfolio } from '../../data/portfolio';
import { OpsLab } from './OpsLab';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root;
let container: HTMLDivElement;

function type(command: string) {
  const input = container.querySelector<HTMLInputElement>('#ops-lab-input');
  if (!input) throw new Error('missing terminal input');
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  act(() => {
    setValue?.call(input, command);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  act(() => {
    input.form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
}

const output = () => container.querySelector('[data-lab-output]')?.textContent ?? '';
const objectiveState = (id: string) => container.querySelector(`[data-objective="${id}"]`)?.getAttribute('data-state');

beforeEach(() => {
  window.localStorage.clear();
  window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<OpsLab portfolio={getPortfolio('en')} language="en" onContactClick={() => undefined} />));
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe('Ops Lab interactions', () => {
  it('runs typed commands, ticks objectives and moves to the next mission', () => {
    type('whoami');
    expect(output()).toContain('guest@ops-lab:~$ whoami');
    expect(objectiveState('whoami')).toBe('done');
    expect(objectiveState('ls')).toBe('current');

    type('ls');
    type('cat mission.txt');
    expect(output()).toContain('Welcome, operator.');

    const next = [...container.querySelectorAll('button')].find((button) => button.textContent?.includes('Next mission'));
    expect(next).toBeDefined();
    act(() => next?.click());
    expect(container.querySelector('[data-lab-scene="docker"]')).not.toBeNull();
    expect(JSON.parse(window.localStorage.getItem('ops-lab-progress') ?? '{}')).toMatchObject({ missionIndex: 1, score: 300 });
  });

  it('reveals a hint with a type-it-for-me shortcut and supports clear', () => {
    const hint = [...container.querySelectorAll('button')].find((button) => button.textContent?.startsWith('Hint'));
    act(() => hint?.click());
    expect(output()).toContain('$ whoami');

    const typeForMe = [...container.querySelectorAll('button')].find((button) => button.textContent === 'Type it for me');
    act(() => typeForMe?.click());
    expect(container.querySelector<HTMLInputElement>('#ops-lab-input')?.value).toBe('whoami');

    type('clear');
    expect(output()).toBe('');
  });
});
