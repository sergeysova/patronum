import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { some } from './index';

test('throttle works in forked scope', async () => {
  const app = createDomain();
  const change = app.createEvent();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, () => 1);
  const $third = app.createStore(0);

  const _$result = some({ predicate: 1, stores: [$first, $second, $third] });

  const scope = fork(app);

  await allSettled(change, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-2c1a0z": 0,
      "-be2ofs": 1,
      "-uke59j": 0,
    }
  `);
});

test('throttle do not affect another forks', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const _$result = some({
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
      "kbxzz9": 2,
      "tdzee2": 0,
      "xss3ar": 0,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "kbxzz9": 200,
      "tdzee2": 0,
      "xss3ar": 0,
    }
  `);
});

test('throttle do not affect original store value', async () => {
  const app = createDomain();
  const change = app.createEvent<number>();
  const $first = app.createStore(0);
  const $second = app.createStore(0).on(change, (state, payload) => state + payload);
  const $third = app.createStore(0);

  const $result = some({
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
      "-yeez55": 0,
      "n5uzih": 2,
      "w7wdxa": 0,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});
