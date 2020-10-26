import 'regenerator-runtime/runtime';
import {
  createStore,
  createEvent,
  createEffect,
  createDomain,
  is,
} from 'effector';
import { throttle } from '.';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('event', () => {
  test('throttle event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const throttled = throttle({ source: trigger, timeout: 40 });

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
    const throttled = throttle({ source: trigger, timeout: 40 });

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

  test('throttled event triggered with latest value', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const throttled = throttle({ source: trigger, timeout: 40 });

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          2,
        ],
      ]
    `);
  });

  test('throttled event works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const throttled = throttle({ source: trigger, timeout: 40 });

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          2,
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
          2,
        ],
        Array [
          4,
        ],
      ]
    `);
  });

  test('throttle call target', async () => {
    const watcher = jest.fn();

    const source = createEvent();
    const target = createEvent();

    throttle({ source, timeout: 40, target });

    target.watch(watcher);

    source();
    source();
    source();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('throttle with target returns target', async () => {
    const source = createEvent();
    const target = createEvent();

    const result = throttle({ source, timeout: 40, target });

    expect(result).toBe(target);
  });

  test('name correctly assigned from trigger', () => {
    const demo = createEvent();
    const throttledDemo = throttle({ source: demo, timeout: 20 });

    expect(throttledDemo.shortName).toMatchInlineSnapshot(`"demoThrottleTick"`);
  });
});

describe('effect', () => {
  test('throttle effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const throttled = throttle({ source: trigger, timeout: 40 });

    throttled.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('throttle effect with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);
    const throttled = throttle({ source: trigger, timeout: 40 });

    throttled.watch(watcher);

    trigger();

    await wait(30);
    trigger();

    await wait(30);
    trigger();

    expect(watcher).toBeCalledTimes(1);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
  });

  test('throttle effect triggered with latest value', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const throttled = throttle({ source: trigger, timeout: 40 });

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
          2,
        ],
      ]
    `);
  });

  test('throttled effect works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<number, void>().use(() => undefined);
    const throttled = throttle({ source: trigger, timeout: 40 });

    throttled.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(50);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          2,
        ],
        Array [
          4,
        ],
      ]
    `);
  });

  test('throttle call target effect', async () => {
    const watcher = jest.fn();

    const source = createEvent<number>();
    const target = createEffect<number, void>().use(() => undefined);

    throttle({ source, timeout: 40, target });

    target.watch(watcher);

    source(0);
    source(1);
    source(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          2,
        ],
      ]
    `);
  });

  test('source effect, target effect', async () => {
    const watcher = jest.fn();

    const source = createEffect<number, void>().use(() => undefined);
    const target = createEffect<number, void>().use(() => undefined);

    throttle({ source, timeout: 40, target });

    target.watch(watcher);

    source(0);
    source(1);
    source(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          2,
        ],
      ]
    `);
  });

  test('throttle with target returns target', async () => {
    const source = createEvent();
    const target = createEffect<void, void>({
      handler() {
        /* */
      },
    });

    const result = throttle({ source, timeout: 40, target });

    expect(result).toBe(target);
    expect(is.effect(result)).toBe(true);
  });

  test('name correctly assigned from trigger', () => {
    const demoFx = createEffect();
    const throttledDemo = throttle({ source: demoFx, timeout: 20 });

    expect(throttledDemo.shortName).toMatchInlineSnapshot(
      `"demoFxThrottleTick"`,
    );
  });
});

describe('store', () => {
  test('throttle store and pass values', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const $store = createStore(0);

    $store.on(trigger, (_, value) => value);

    const throttled = throttle({ source: $store, timeout: 40 });

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
          2,
        ],
      ]
    `);
  });

  test('source store, target store', async () => {
    const watcher = jest.fn();

    const change = createEvent();

    const source = createStore(0).on(change, (state) => state + 1);
    const target = createStore(0);

    throttle({ source, timeout: 40, target });

    target.watch(watcher);

    change();
    change();
    change();

    expect(watcher).toBeCalledTimes(1);

    await wait(40);

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

  test('throttle with target returns target', async () => {
    const source = createEvent<number>();
    const target = createStore(0);

    const result = throttle({ source, timeout: 40, target });

    expect(result).toBe(target);
    expect(is.store(result)).toBe(true);
  });

  test('name correctly assigned from trigger', () => {
    const $demo = createStore(0);
    const throttledDemo = throttle({ source: $demo, timeout: 20 });

    expect(throttledDemo.shortName).toMatchInlineSnapshot(
      `"$demoThrottleTick"`,
    );
  });
});

test('throttle do not affect another instance', async () => {
  const watcherFirst = jest.fn();
  const triggerFirst = createEvent<number>();
  const throttledFirst = throttle({ source: triggerFirst, timeout: 20 });
  throttledFirst.watch(watcherFirst);

  const watcherSecond = jest.fn();
  const triggerSecond = createEvent<string>();
  const throttledSecond = throttle({ source: triggerSecond, timeout: 60 });
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
  const throttledDemo = throttle({
    source: demo,
    timeout: 20,
    name: 'Example',
  });

  expect(throttledDemo.shortName).toMatchInlineSnapshot(
    `"ExampleThrottleTick"`,
  );
});

test('name should not be in domain', () => {
  const domain = createDomain();
  const event = domain.createEvent();
  const throttledDemo = throttle({ source: event, timeout: 20 });

  expect(throttledDemo.shortName).toMatchInlineSnapshot(`"eventThrottleTick"`);
});

test('source event, target effect', async () => {
  const watcher = jest.fn();

  const source = createEvent<number>();
  const target = createEffect<number, void>().use(() => undefined);

  throttle({ source, timeout: 40, target });

  target.watch(watcher);

  source(0);
  source(1);
  source(2);

  expect(watcher).not.toBeCalled();

  await wait(40);

  expect(watcher).toBeCalledTimes(1);
  expect(watcher.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        2,
      ],
    ]
  `);
});

test('source store, target effect', async () => {
  const watcher = jest.fn();

  const change = createEvent();
  const source = createStore<number>(0).on(change, (state) => state + 1);
  const target = createEffect<number, void>().use(() => undefined);

  throttle({ source, timeout: 40, target });

  target.watch(watcher);

  change();
  change();
  change();

  expect(watcher).not.toBeCalled();

  await wait(40);

  expect(watcher).toBeCalledTimes(1);
  expect(watcher.mock.calls).toMatchInlineSnapshot(`
    Array [
      Array [
        3,
      ],
    ]
  `);
});
