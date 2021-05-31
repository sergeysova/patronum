import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { delay } from './index';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent();

  const $counter = app.createStore(0, { sid: '$counter' });

  const throttled = delay({ source, timeout: 40 });

  $counter.on(throttled, (value) => value + 1);

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "$counter": 1,
    }
  `);
});

test('throttle works in forked scope with target', async () => {
  const app = createDomain();
  const source = app.createEvent();
  const target = app.createEvent();

  const $counter = app.createStore(0, { sid: '$counter' });

  delay({ source, timeout: 40, target });

  $counter.on(target, (value) => value + 1);

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "$counter": 1,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0, { sid: '$counter' });

  const trigger = app.createEvent<number>();

  const throttled = delay({ source: trigger, timeout: 40 });

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
      "$counter": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "$counter": 200,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0, { sid: '$counter' });
  const trigger = app.createEvent<number>();

  const throttled = delay({ source: trigger, timeout: 40 });

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
      "$counter": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});
