// @ts-nocheck
import { createDomain } from 'effector';
import { fork, allSettled } from 'effector/fork';

import { toBeCloseWithThreshold, wait } from '../test-library';
import { currentTime } from './index';

const TIMER_THRESHOLD = 70;

expect.extend({ toBeCloseWithThreshold });

describe('fork', () => {
  test('currentTime works in forked scope', async () => {
    const app = createDomain();

    const start = app.createEvent();
    const stop = app.createEvent();
    const $now = currentTime({ start, stop });

    const watcher = jest.fn();
    $now.updates.watch(watcher);

    const scope = fork(app);

    await allSettled(start, {
      scope,
    });
    await wait(150);
    await allSettled(stop, {
      scope,
    });

    expect(watcher).toBeCalled();
    expect(scope.getState($now).valueOf()).toBeCloseWithThreshold(
      Date.now(),
      TIMER_THRESHOLD,
    );
  });

  test('does not affects another scope', async () => {
    const app = createDomain();

    const start = app.createEvent();
    const stop = app.createEvent();

    const $now = currentTime({ start, stop });

    const scope1 = fork(app);
    const scope2 = fork(app);

    expect(scope1.getState($now).valueOf()).toBe(scope2.getState($now).valueOf());

    await allSettled(start, { scope: scope1 });
    await wait(150);
    await allSettled(stop, { scope: scope1 });

    expect(scope1.getState($now).valueOf()).not.toBe(scope2.getState($now).valueOf());
  });

  test('does not affects original store state', async () => {
    const app = createDomain();

    const start = app.createEvent();
    const stop = app.createEvent();

    const $now = currentTime({ start, stop });

    const scope = fork(app);

    expect(scope.getState($now).valueOf()).toBe($now.getState().valueOf());

    await allSettled(start, { scope });
    await wait(150);
    await allSettled(stop, { scope });

    expect(scope.getState($now).valueOf()).not.toBe($now.getState().valueOf());
  });
});
