/**
 * Smoke test: mount the whole App in jsdom to catch runtime crashes.
 * @vitest-environment jsdom
 */
import { test, expect, beforeAll } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react';

beforeAll(() => {
  // jsdom lacks these; App / tweaks-panel touch them.
  if (!window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
});

test('App mounts without throwing', async () => {
  const mod = await import('./app.jsx');
  const App = mod.default;
  expect(typeof App).toBe('function');

  const container = document.createElement('div');
  container.id = 'root';
  document.body.appendChild(container);

  const root = createRoot(container);
  await act(async () => {
    root.render(React.createElement(App));
  });

  // If we got here without throwing, the tree rendered. Sanity-check output exists.
  expect(container.innerHTML.length).toBeGreaterThan(0);
});
