import 'regenerator-runtime/runtime';
import { createStore, createEvent, createEffect, createDomain } from 'effector';
import { throttle as createThrottle } from './index.mjs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('event', () => {
  test('throttle event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('throttled event with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
  });

  test('throttled event triggered with first value', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          0,
        ],
      ]
    `);
  });

  test('throttled event works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          0,
        ],
      ]
    `);

    trigger(3);
    await wait(30);
    trigger(4);
    await wait(50);

    expect(watcher.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    0,
  ],
  Array [
    3,
  ],
]
`);
  });

  test('name correctly assigned from trigger', () => {
    const demo = createEvent();
    const throttledDemo = createThrottle(demo, 20);

    expect(throttledDemo.shortName).toMatchInlineSnapshot(`"demoThrottleTick"`);
  });
});

describe('effect', () => {
  test('throttle effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const throttle = createThrottle(trigger, 40);

    throttle.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('throttle effect with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const throttle = createThrottle(trigger, 40);

    throttle.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).toBeCalledTimes(1);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
  });

  test('throttle effect triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    0,
  ],
]
`);
  });

  test('throttled effect works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const throttled = createThrottle(trigger, 40);

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(0);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(50);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    0,
  ],
  Array [
    3,
  ],
]
`);
  });

  test('name correctly assigned from trigger', () => {
    const demoFx = createEffect();
    const throttledDemo = createThrottle(demoFx, 20);

    expect(throttledDemo.shortName).toMatchInlineSnapshot(
      `"demoFxThrottleTick"`,
    );
  });
});

describe('store', () => {
  test('throttle store and pass values', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const $store = createStore(0);

    $store.on(trigger, (_, value) => value);

    const throttled = createThrottle($store, 40);

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    1,
  ],
]
`);
  });

  test('name correctly assigned from trigger', () => {
    const $demo = createStore(0);
    const throttledDemo = createThrottle($demo, 20);

    expect(throttledDemo.shortName).toMatchInlineSnapshot(
      `"$demoThrottleTick"`,
    );
  });
});

test('debounce do not affect another instance', async () => {
  const watcherFirst = jest.fn();
  const triggerFirst = createEvent();
  const throttledFirst = createThrottle(triggerFirst, 20);
  throttledFirst.watch(watcherFirst);

  const watcherSecond = jest.fn();
  const triggerSecond = createEvent();
  const throttledSecond = createThrottle(triggerSecond, 60);
  throttledSecond.watch(watcherSecond);

  triggerFirst(0);

  expect(watcherFirst).not.toBeCalled();
  await wait(20);

  expect(watcherFirst).toBeCalledTimes(1);
  expect(watcherFirst.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    0,
  ],
]
`);

  expect(watcherSecond).not.toBeCalled();

  triggerSecond('foo');
  triggerFirst(1);
  await wait(20);
  triggerFirst(2);
  await wait(20);

  expect(watcherFirst).toBeCalledTimes(3);
  expect(watcherFirst.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    0,
  ],
  Array [
    1,
  ],
  Array [
    2,
  ],
]
`);
  expect(watcherSecond).not.toBeCalled();

  await wait(20);

  expect(watcherSecond).toBeCalledTimes(1);
  expect(watcherSecond.mock.calls).toMatchInlineSnapshot(`
Array [
  Array [
    "foo",
  ],
]
`);
});

test('name correctly assigned from params', () => {
  const demo = createEvent();
  const throttledDemo = createThrottle(demo, 20, { name: 'Example' });

  expect(throttledDemo.shortName).toMatchInlineSnapshot(
    `"ExampleThrottleTick"`,
  );
});

test('name should not be in domain', () => {
  const domain = createDomain();
  const event = domain.createEvent();
  const throttledDemo = createThrottle(event, 20);

  expect(throttledDemo.shortName).toMatchInlineSnapshot(`"eventThrottleTick"`);
});
