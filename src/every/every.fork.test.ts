import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { every } from '.';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const change = app.createEvent();
  const $first = app.createStore(0);
  const $second = app.createStore(1).on(change, () => 0);
  const $third = app.createStore(0);

  const _$result = every({ predicate: 1, stores: [$first, $second, $third] });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-nh73d7": 0,
      "-nhvpbu": false,
      "-ws9vwg": 0,
      "vke6ox": 0,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app
    .createStore(0)
    .on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const _$result = every({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(change, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(change, {
    scope: scopeB,
    params: 100,
  });

  await allSettled(change, {
    scope: scopeA,
    params: 1,
  });

  await allSettled(change, {
    scope: scopeB,
    params: 100,
  });

  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "-l7l38": 2,
      "-nhvpbu": false,
      "-sgxiye": 0,
      "9nyg8f": 0,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "-l7l38": 200,
      "-nhvpbu": false,
      "-sgxiye": 0,
      "9nyg8f": 0,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app
    .createStore(0)
    .on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const $result = every({
    predicate: (x) => x > 0,
    stores: [$first, $second, $third],
  });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: 1,
  });

  await allSettled(change, {
    scope,
    params: 1,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-dsvzkb": 0,
      "-nhvpbu": false,
      "e2tyav": 2,
      "obzzmi": 0,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});
