import { createEvent, createEffect } from 'effector';
import { argumentHistory, waitFor } from '../../test-library';
import { status } from './index';

test('change status: initial -> pending -> done', async () => {
  const effect = createEffect<void, void>({
    handler: () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
  });
  const $status = status({ effect });
  const fn = jest.fn();

  $status.watch(fn);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
    ]
  `);

  effect();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
      "pending",
    ]
  `);

  await waitFor(effect.finally);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
      "pending",
      "done",
    ]
  `);
});

test('change status: initial -> pending -> fail', async () => {
  const effect = createEffect({
    handler: () => new Promise<void>((_, reject) => setTimeout(reject, 100)),
  });
  const fn = jest.fn();
  const $status = status({ effect });
  $status.watch(fn);

  effect();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
      "pending",
    ]
  `);

  await waitFor(effect.finally);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
      "pending",
      "fail",
    ]
  `);
});

test('change status: initial -> pending -> fail -> initial (clear)', async () => {
  const clear = createEvent();
  const effect = createEffect({
    handler: () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
  });
  const $status = status({ effect });
  const fn = jest.fn();

  $status.watch(fn);
  $status.reset(clear);

  effect();
  await waitFor(effect.finally);

  clear();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "initial",
      "pending",
      "done",
      "initial",
    ]
  `);
});

test('set default status effect', async () => {
  const effect = createEffect({
    handler: () => new Promise<void>((resolve) => setTimeout(resolve, 100)),
  });
  const $status = status({ effect, defaultValue: 'pending' });
  const fn = jest.fn();

  $status.watch(fn);

  effect();
  await waitFor(effect.finally);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "pending",
      "done",
    ]
  `);
});
