import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { throttle as createThrottle } from './index.mjs';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const throttled = createThrottle(trigger, 40);

  $counter.on(throttled, (value) => value + 1);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "b8c631": 1,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const throttled = createThrottle(trigger, 40);

  $counter.on(throttled, (value, payload) => value + payload);

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(trigger, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(trigger, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "-6be6f6": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "-6be6f6": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent();

  const throttled = createThrottle(trigger, 40);

  $counter.on(throttled, (value, payload) => value + payload);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  await allSettled(trigger, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-fsnd50": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});
