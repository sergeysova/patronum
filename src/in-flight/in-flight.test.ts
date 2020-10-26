import { createEffect, combine, createDomain } from 'effector';
import { argumentHistory, waitFor } from '../test-library';
import { inFlight } from './index';

describe('effects', () => {
  test('initial at 0', async () => {
    const effect = createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
    });
    const $count = inFlight({ effects: [effect] });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);
  });

  test('Run effect to get 1, after effect get 0', async () => {
    const effect = createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
    });
    const $count = inFlight({ effects: [effect] });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
    ]
  `);

    await waitFor(effect.finally);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
    ]
  `);
  });

  test('Concurrent runs works simultaneously', async () => {
    const effect = createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
    });
    const $count = inFlight({ effects: [effect] });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect();
    effect();
    effect();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
      3,
    ]
  `);

    await waitFor(effect.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
      3,
      2,
      1,
      0,
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
    const $count = inFlight({ effects: [effect1, effect2, effect3] });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect1();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
    ]
  `);

    await waitFor(effect1.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
    ]
  `);

    effect2();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
      1,
    ]
  `);

    await waitFor(effect2.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
      1,
      0,
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
    const $count = inFlight({ effects: [effect1, effect2, effect3] });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect1();
    effect2();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
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
      0,
      1,
      2,
      1,
      0,
    ]
  `);
  });
});

describe('domain', () => {
  test('initial at 0', async () => {
    const domain = createDomain();
    domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
    });
    const $count = inFlight({ domain });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);
  });

  test('Run effect to get 1, after effect get 0', async () => {
    const domain = createDomain();
    const effect = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
    });
    const $count = inFlight({ domain });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
    ]
  `);

    await waitFor(effect.finally);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
    ]
  `);
  });

  test('Concurrent runs works simultaneously', async () => {
    const domain = createDomain();
    const effect = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 100)),
    });
    const $count = inFlight({ domain });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect();
    effect();
    effect();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
      3,
    ]
  `);

    await waitFor(effect.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
      3,
      2,
      1,
      0,
    ]
  `);
  });

  test('Different effects works simultaneously', async () => {
    const domain = createDomain();
    const effect1 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const effect2 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const _effect3 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const $count = inFlight({ domain });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect1();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
    ]
  `);

    await waitFor(effect1.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
    ]
  `);

    effect2();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
      1,
    ]
  `);

    await waitFor(effect2.inFlight.updates.filter({ fn: (c) => c === 0 }));
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      0,
      1,
      0,
    ]
  `);
  });

  test('Different concurrent effect runs works simultaneously', async () => {
    const domain = createDomain();
    const effect1 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const effect2 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const _effect3 = domain.createEffect({
      handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
    });
    const $count = inFlight({ domain });
    const fn = jest.fn();

    $count.watch(fn);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
    ]
  `);

    effect1();
    effect2();
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      0,
      1,
      2,
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
      0,
      1,
      2,
      1,
      0,
    ]
  `);
  });
});
