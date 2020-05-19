// @ts-nocheck
const { createStore, createEvent, createEffect } = require('effector');
const {
  argumentHistory,
  time,
  toBeCloseWithThreshold,
  waitFor,
} = require('../../test-library');
const { delay } = require('./index');

expect.extend({ toBeCloseWithThreshold });

const TIMER_THRESHOLD = 10;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('delay event with number', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  trigger(1);
  const start = time();
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "1",
    ]
  `);
});

test('double delay event with number', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, 100);
  const fn = jest.fn();
  delayed.watch(fn);

  const startA = time();
  trigger(1);
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(startA.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const startB = time();
  trigger(2);
  expect(fn).toBeCalledTimes(1);

  await waitFor(delayed);
  expect(startB.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "1",
      "2",
    ]
  `);
});

test('delay event with function', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, { time: () => 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start = time();
  trigger(1);

  await waitFor(delayed);
  expect(start.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "1",
    ]
  `);
});

test('delay event with function of argument', async () => {
  const trigger = createEvent();
  const delayed = delay(trigger, { time: (number) => number * 100 });
  const fn = jest.fn();
  delayed.watch(fn);

  const start1 = time();
  trigger(1); // 100ms delay
  expect(fn).toBeCalledTimes(0);

  await waitFor(delayed);
  expect(start1.diff()).toBeCloseWithThreshold(100, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(1);

  const start2 = time();
  trigger(2); // 200ms delay

  await waitFor(delayed);
  expect(start2.diff()).toBeCloseWithThreshold(200, TIMER_THRESHOLD);
  expect(fn).toBeCalledTimes(2);

  await wait(100);
  expect(fn).toBeCalledTimes(2);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "1",
      "2",
    ]
  `);
});

test('delay store', async () => {
  const change = createEvent();
  const $source = createStore(0).on(change, (_, value) => value);
  const delayed = delay($source, 100);
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
      "1",
      "2",
    ]
  `);
});

test('double delay effect', async () => {
  const effect = createEffect().use(() => 0);
  const delayed = delay(effect, 100);
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
      "1",
      "2",
    ]
  `);
});
