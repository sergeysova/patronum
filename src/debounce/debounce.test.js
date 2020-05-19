import 'regenerator-runtime/runtime';
import { createStore, createEvent, createEffect, createDomain } from 'effector';
import { debounce } from './index.mjs';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('event', () => {
  test('debounce event', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce event with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce(trigger, 40);

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

  test('debounced event triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced event works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('name correctly assigned from trigger', () => {
    const demo = createEvent();
    const debouncedDemo = debounce(demo, 20);

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(`"demoDebounceTick"`);
  });
});

describe('effect', () => {
  test('debounce effect', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger();
    trigger();
    trigger();

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
  });

  test('debounce effect with wait', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const debounced = debounce(trigger, 40);

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

  test('debounced effect triggered with last value', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('debounced effect works after trigger', async () => {
    const watcher = jest.fn();

    const trigger = createEffect().use(() => undefined);
    const debounced = debounce(trigger, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    trigger(3);
    await wait(30);
    trigger(4);

    await wait(40);

    expect(watcher).toBeCalledTimes(2);
    expect(watcher).toBeCalledWith(2);
    expect(watcher).toBeCalledWith(4);
  });

  test('name correctly assigned from trigger', () => {
    const demoFx = createEffect();
    const debouncedDemo = debounce(demoFx, 20);

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(
      `"demoFxDebounceTick"`,
    );
  });
});

describe('store', () => {
  test('debounce store and pass values', async () => {
    const watcher = jest.fn();

    const trigger = createEvent();
    const $store = createStore(0);

    $store.on(trigger, (_, value) => value);

    const debounced = debounce($store, 40);

    debounced.watch(watcher);

    trigger(0);
    trigger(1);
    trigger(2);

    expect(watcher).not.toBeCalled();

    await wait(40);

    expect(watcher).toBeCalledTimes(1);
    expect(watcher).toBeCalledWith(2);
  });

  test('name correctly assigned from trigger', () => {
    const $demo = createStore(0);
    const debouncedDemo = debounce($demo, 20);

    expect(debouncedDemo.shortName).toMatchInlineSnapshot(
      `"$demoDebounceTick"`,
    );
  });
});

test('debounce do not affect another instance', async () => {
  const watcherFirst = jest.fn();
  const triggerFirst = createEvent();
  const debouncedFirst = debounce(triggerFirst, 20);
  debouncedFirst.watch(watcherFirst);

  const watcherSecond = jest.fn();
  const triggerSecond = createEvent();
  const debouncedSecond = debounce(triggerSecond, 60);
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

test('name correctly assigned from params', () => {
  const demo = createEvent();
  const debouncedDemo = debounce(demo, 20, { name: 'Example' });

  expect(debouncedDemo.shortName).toMatchInlineSnapshot(
    `"ExampleDebounceTick"`,
  );
});

test('name should not be in domain', () => {
  const domain = createDomain();
  const event = domain.createEvent();
  const debouncedDemo = debounce(event, 20);

  expect(debouncedDemo.shortName).toMatchInlineSnapshot(`"eventDebounceTick"`);
});
