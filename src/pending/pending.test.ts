import { createEffect, combine } from 'effector';
import { argumentHistory, waitFor } from '../test-library';
import { pending } from './index';

test('initial at false', async () => {
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const $pending = pending({ effects: [effect] });
  const fn = jest.fn();

  $pending.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
    ]
  `);
});

test('Run effect to get true, after effect get false', async () => {
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const $pending = pending({ effects: [effect] });
  const fn = jest.fn();

  $pending.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
    ]
  `);

  effect();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);

  await waitFor(effect.finally);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
    ]
  `);
});

test('Concurrent runs works simultaneously', async () => {
  const effect = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
  });
  const $pending = pending({ effects: [effect] });
  const fn = jest.fn();

  $pending.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
    ]
  `);

  effect();
  effect();
  effect();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);

  await waitFor(effect.inFlight.updates.filter({ fn: (c) => c === 0 }));
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
    ]
  `);
});

test('Different effects works simultaneously', async () => {
  const effect1 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect3 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const $pending = pending({ effects: [effect1, effect2, effect3] });
  const fn = jest.fn();

  $pending.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
    ]
  `);

  effect1();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);

  await waitFor(effect1.inFlight.updates.filter({ fn: (c) => c === 0 }));
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
    ]
  `);

  effect2();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
      true,
    ]
  `);

  await waitFor(effect2.inFlight.updates.filter({ fn: (c) => c === 0 }));
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
      true,
      false,
    ]
  `);
});

test('Different concurrent effect runs works simultaneously', async () => {
  const effect1 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect3 = createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const $pending = pending({ effects: [effect1, effect2, effect3] });
  const fn = jest.fn();

  $pending.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
    ]
  `);

  effect1();
  effect2();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);

  await waitFor(
    combine(
      effect2.inFlight,
      effect1.inFlight,
      (a, b) => a + b,
    ).updates.filter({ fn: (c) => c === 0 }),
  );
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
      false,
    ]
  `);
});
