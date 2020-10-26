import 'regenerator-runtime/runtime';
import { createStore, createEvent, createEffect, createDomain } from 'effector';
import { wait } from '../test-library';
import { debounce } from '.';

describe('triple trigger one wait', () => {
  test('event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce({ source: trigger, timeout: 40 });

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
  });

  test('effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect<void, void>().use(() => undefined);

    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
  });

  test('store', async () => {
    const watcher = jest.fn();

    const trigger = createEvent<number>();
    const $store = createStore(0).on(trigger, (_, value) => value);

    const debounced = debounce({ source: $store, timeout: 40 });
    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });
});

describe('too small wait after each trigger', () => {
  test('event', async () => {
    const watcher = jest.fn();
    const trigger = createEvent();
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    await wait(30);
    trigger();
    await wait(30);
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
  });

  test('effect', async () => {
    const watcher = jest.fn();
    const trigger = createEffect<void, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    await wait(30);
    trigger();
    await wait(30);
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
  });

  test('effect', async () => {
    const watcher = jest.fn();
    const trigger = createEvent();
    const source = createStore(0).on(trigger, (state) => state + 1);
    const debounced = debounce({ source, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    await wait(30);
    trigger();
    await wait(30);
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
  });
});

describe('debounced triggered with latest value', () => {
  test('event', async () => {
    const watcher = jest.fn();
    const trigger = createEvent<number>();
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('effect', async () => {
    const watcher = jest.fn();
    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('store', async () => {
    const watcher = jest.fn();
    const trigger = createEvent();
    const source = createStore(0).on(trigger, (state) => state + 1);
    const debounced = debounce({ source, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });
});

describe('debounced can be triggered after first', () => {
  test('event', async () => {
    const watcher = jest.fn();
    const trigger = createEvent<number>();
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

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
    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('effect', async () => {
    const watcher = jest.fn();
    const trigger = createEffect<number, void>().use(() => undefined);
    const debounced = debounce({ source: trigger, timeout: 40 });
    debounced.watch(watcher);

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
    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('store', async () => {
    const watcher = jest.fn();
    const trigger = createEvent();
    const source = createStore(0).on(trigger, (state) => state + 1);
    const debounced = debounce({ source, timeout: 40 });
    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);

    trigger();
    await wait(30);
    trigger();
    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(3);
    expect(watcher).toBeCalledWith(5);
  });
});

describe('target triggered on debounce', () => {
  test('event target', async () => {
    const watcher = jest.fn();
    const source = createEvent<number>();
    const target = createEvent<number>();
    debounce({ source, timeout: 40, target });
    target.watch(watcher);

    source(1);
    source(2);
    source(3);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });

  test('effect target', async () => {
    const watcher = jest.fn();
    const source = createEvent<number>();
    const target = createEffect<number, void>().use(() => undefined);
    debounce({ source, timeout: 40, target });
    target.watch(watcher);

    source(1);
    source(2);
    source(3);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });

  test('store target', async () => {
    const watcher = jest.fn();
    const source = createEvent<number>();
    const target = createStore(0);
    debounce({ source, timeout: 40, target });
    target.updates.watch(watcher);

    source(1);
    source(2);
    source(3);
    expect(watcher).not.toBeCalled();

    await wait(40);
    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(3);
  });
});

describe('target argument returns the same unit', () => {
  test('event target', () => {
    const source = createEvent();
    const target = createEvent();
    const result = debounce({ source, target, timeout: 40 });

    expect(result).toBe(target);
  });

  test('effect target', () => {
    const source = createEvent<number>();
    const target = createEffect<number, void>();
    const result = debounce({ source, target, timeout: 40 });

    expect(result).toBe(target);
  });

  test('store target', () => {
    const source = createEvent<number>();
    const target = createStore(0);
    const result = debounce({ source, target, timeout: 40 });

    expect(result).toBe(target);
  });
});

describe('source and target type combinations', () => {
  test.todo('source event, target event');

  test('source event, target store', async () => {
    const watcher = jest.fn();
    const source = createEvent<number>();
    const target = createStore<number>(0);
    debounce({ source, timeout: 40, target });
    target.updates.watch(watcher);

    source(1);
    source(2);
    source(3);
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

  test('source event, target effect', async () => {
    const watcher = jest.fn();
    const source = createEvent<number>();
    const target = createEffect<number, void>().use(() => undefined);
    debounce({ source, timeout: 40, target });
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
    debounce({ source, timeout: 40, target });
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

  test.todo('source store, target event');
  test.todo('source store, target store');

  test.todo('source effect, target event');
  test.todo('source effect, target store');
  test.todo('source effect, target effect');
});

describe('name assigned from source', () => {
  test('event', () => {
    const source = createEvent();
    const debounced = debounce({ source, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"sourceDebounceTick"`);
  });

  test('store', () => {
    const $source = createStore(0);
    const debounced = debounce({ source: $source, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"$sourceDebounceTick"`);
  });

  test('effect', () => {
    const sourceFx = createEffect();
    const debounced = debounce({ source: sourceFx, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"sourceFxDebounceTick"`);
  });
});

describe('name assigned from params', () => {
  test('event', () => {
    const source = createEvent();
    const debounced = debounce({ source, name: 'hello', timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"helloDebounceTick"`);
  });

  test('store', () => {
    const $source = createStore(0);
    const debounced = debounce({ source: $source, name: 'hello', timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"helloDebounceTick"`);
  });

  test('effect', () => {
    const sourceFx = createEffect();
    const debounced = debounce({
      source: sourceFx,
      name: 'hello',
      timeout: 40,
    });

    expect(debounced.shortName).toMatchInlineSnapshot(`"helloDebounceTick"`);
  });
});

describe('name of debounced should not inherit domain', () => {
  test('event', () => {
    const domain = createDomain();
    const source = domain.createEvent();
    const debounced = debounce({ source, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"sourceDebounceTick"`);
  });

  test('store', () => {
    const domain = createDomain();
    const $source = domain.createStore(0);
    const debounced = debounce({ source: $source, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"$sourceDebounceTick"`);
  });

  test('effect', () => {
    const domain = createDomain();
    const sourceFx = domain.createEffect();
    const debounced = debounce({ source: sourceFx, timeout: 40 });

    expect(debounced.shortName).toMatchInlineSnapshot(`"sourceFxDebounceTick"`);
  });
});

test('debounce do not affect another instance of debounce', async () => {
  const watcherFirst = jest.fn();
  const triggerFirst = createEvent<number>();
  const debouncedFirst = debounce({ source: triggerFirst, timeout: 20 });
  debouncedFirst.watch(watcherFirst);

  const watcherSecond = jest.fn();
  const triggerSecond = createEvent<string>();
  const debouncedSecond = debounce({ source: triggerSecond, timeout: 60 });
  debouncedSecond.watch(watcherSecond);

  triggerFirst(0);
  expect(watcherFirst).not.toBeCalled();

  await wait(20);
  expect(watcherFirst).toBeCalledWith(0);
  expect(watcherSecond).not.toBeCalled();

  triggerSecond('foo');
  triggerFirst(1);
  await wait(20);
  triggerFirst(2);

  await wait(20);
  expect(watcherFirst).toBeCalledWith(2);
  expect(watcherSecond).not.toBeCalled();

  await wait(20);
  expect(watcherSecond).toBeCalledWith('foo');
});
