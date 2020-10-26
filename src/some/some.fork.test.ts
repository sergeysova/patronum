import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { some } from '.';

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
      "fpz6mx": true,
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
      "fpz6mx": true,
      "kszmdg": 2,
      "ut49kn": 0,
      "y9tpoy": 0,
    }
  `);
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "fpz6mx": true,
      "kszmdg": 200,
      "ut49kn": 0,
      "y9tpoy": 0,
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
      "-m38sw3": 0,
      "-pjy90e": 0,
      "fpz6mx": true,
      "zh15rj": 2,
    }
  `);

  expect($result.getState()).toMatchInlineSnapshot(`false`);
});
