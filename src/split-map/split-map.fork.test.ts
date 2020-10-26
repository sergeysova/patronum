import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { splitMap } from '.';

test('works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: { first: 15 },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "xwy4bm": 15,
    }
  `);

  await allSettled(source, {
    scope,
    params: { another: true },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "xwy4bm": -15,
    }
  `);
});

test('do not affect another fork', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scopeA = fork(app);
  const scopeB = fork(app);

  await allSettled(source, {
    scope: scopeA,
    params: { first: 200 },
  });
  expect(serialize(scopeA)).toMatchInlineSnapshot(`
    Object {
      "l4dkuf": 200,
    }
  `);

  await allSettled(source, {
    scope: scopeB,
    params: { first: -5 },
  });
  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "l4dkuf": -5,
    }
  `);
});

test('do not affect original store value', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first?: number; another?: boolean }>();
  const out = splitMap({
    source,
    cases: {
      first: (payload) => payload.first,
    },
  });

  const $data = app.createStore(0);

  $data
    .on(out.first, (state, payload) => state + payload)
    .on(out.__, (state, payload) => (payload ? -state : 0));

  const scope = fork(app);

  await allSettled(source, {
    scope,
    params: { first: 15 },
  });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "8sunrf": 15,
    }
  `);
  expect($data.getState()).toBe($data.defaultState);
});
