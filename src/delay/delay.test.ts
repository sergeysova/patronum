// @ts-nocheck
import { createStore, createEvent, createEffect } from 'effector';
import {
  argumentHistory,
  time,
  toBeCloseWithThreshold,
  waitFor,
} from '../../test-library';
import { delay } from './index';

expect.extend({ toBeCloseWithThreshold });

const TIMER_THRESHOLD = 70;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('delay event with number', async () => {
  const source = createEvent();
  const delayed = delay({ source, timeout: 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  source(1);
  const start = time();
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
    ]
  `);
});

test('delay event with number with target', async () => {
  const source = createEvent();
  const target = createEvent();
  delay({ source, timeout: 100, target });
  const fn = jest.fn();
  target.watch(fn);

  source(1);
  const start = time();
  expect(fn).toBeCalledTimes(0);

  await waitFor(target);
  expect(start.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
    ]
  `);
});

test('double delay event with number', async () => {
  const source = createEvent();
  const delayed = delay({ source, timeout: 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const startA = time();
  source(1);
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(startA.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const startB = time();
  source(2);
  expect(fn).toBeCalledTimes(1);

  await waitFor(delayed);
  expect(startB.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
      2,
    ]
  `);
});

test('delay event with function', async () => {
  const source = createEvent();
  const delayed = delay({ source, timeout: () => 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start = time();
  source(1);

  await waitFor(delayed);
  expect(start.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
    ]
  `);
});

test('delay event with function of argument', async () => {
  const source = createEvent();
  const delayed = delay({ source, timeout: (number) => number * 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start1 = time();
  source(1); // 100ms delay
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start1.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const start2 = time();
  source(2); // 200ms delay

  await waitFor(delayed);
  expect(start2.diff()).toBeCloseWithThreshold(200, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  await wait(100);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
      2,
    ]
  `);
});

test('delay event with store as timeout', async () => {
  const source = createEvent();
  const timeout = createStore(0).on(
    source,
    (current, count) => current + count * 100,
  );
  const delayed = delay({ source, timeout });
  const fn = jest.fn();
  delayed.watch(fn);

  const start1 = time();
  source(1); // 100ms delay
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start1.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const start2 = time();
  source(2); // 200ms delay

  await waitFor(delayed);
  expect(start2.diff()).toBeCloseWithThreshold(300, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  await wait(100);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
      2,
    ]
  `);
});

test('delay store', async () => {
  const change = createEvent();
  const $source = createStore(0).on(change, (_, value) => value);
  const delayed = delay({ source: $source, timeout: 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start1 = time();
  change(1);
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start1.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const start2 = time();
  change(2);
  expect(fn).toBeCalledTimes(1);

  await waitFor(delayed);
  expect(start2.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
      2,
    ]
  `);
});

test('double delay effect', async () => {
  const effect = createEffect().use(() => 1000);
  const delayed = delay({ source: effect, timeout: 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start1 = time();
  effect(1);
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start1.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const start2 = time();
  effect(2);

  await waitFor(delayed);
  expect(start2.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      1,
      2,
    ]
  `);
});
