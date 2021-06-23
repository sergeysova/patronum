// @ts-nocheck
import { createEvent } from 'effector';
import { toBeCloseWithThreshold, wait } from '../test-library';
import { currentTime } from './index';

const TIMER_THRESHOLD = 70;

expect.extend({ toBeCloseWithThreshold });

describe('start/stop', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should not start automatically', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    const watcher = jest.fn();
    $now.updates.watch(watcher);

    jest.runAllTimers();

    expect(watcher).not.toBeCalled();
  });

  test('should start after start event called', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    const watcher = jest.fn();
    $now.updates.watch(watcher);

    start();
    jest.advanceTimersByTime(1000);
    stop();

    expect(watcher).toBeCalled();
  });

  test('should stop after stop event called', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    const watcher1 = jest.fn();
    $now.updates.watch(watcher1);

    start();
    jest.advanceTimersByTime(1000);
    stop();

    const watcher2 = jest.fn();
    $now.updates.watch(watcher2);

    expect(watcher1).toBeCalled();
    expect(watcher2).not.toBeCalled();
  });

  test('should restart after start-stop-start event chain', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    start();
    jest.advanceTimersByTime(1000);
    stop();

    const watcher = jest.fn();
    $now.updates.watch(watcher);

    start();
    jest.advanceTimersByTime(1000);
    stop();

    expect(watcher).toBeCalled();
  });
});

describe('interval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should use default interval for undefined interval', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    const watcher = jest.fn();
    $now.updates.watch(watcher);

    start();

    // default interval is 100ms
    // run 10 updates
    jest.advanceTimersByTime(1000);

    stop();

    // 11 = 10 updates + 1 update on start
    expect(watcher).toBeCalledTimes(11);
  });

  test('should use custom interval', () => {
    const testIntrevals = [20, 200, 2000];

    for (const interval of testIntrevals) {
      const start = createEvent();
      const stop = createEvent();
      const $now = currentTime({ start, stop, interval });

      const watcher = jest.fn();
      $now.updates.watch(watcher);

      start();

      // run 10 updates
      jest.advanceTimersByTime(interval * 10);

      stop();

      // 11 = 10 updates + 1 update on start
      expect(watcher).toBeCalledTimes(11);
    }
  });
});

describe('value', () => {
  test('should contain current time after inialization', () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    expect($now.getState().valueOf()).toBeCloseWithThreshold(
      Date.now(),
      TIMER_THRESHOLD,
    );
  });

  test('should contain new value after updates', async () => {
    const start = createEvent();
    const stop = createEvent();
    const $now = currentTime({ start, stop });

    const firstValue = $now.getState().valueOf();

    start();
    await wait(150);
    stop();

    expect($now.getState().valueOf()).not.toBe(firstValue);

    expect($now.getState().valueOf()).toBeCloseWithThreshold(
      Date.now(),
      TIMER_THRESHOLD,
    );
  });
});
