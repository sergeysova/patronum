import { createDomain } from 'effector';
import { fork, allSettled } from 'effector/fork';
import { combineEvents } from './index';

test('works in forked scope', async () => {
  const app = createDomain();
  const e1 = app.createEvent<string>();
  const e2 = app.createEvent<string>();
  const e3 = app.createEvent<string>();
  const result = combineEvents({
    events: { e1, e2, e3 },
  });
  const $store = app
    .createStore({ e1: '', e2: '', e3: '' })
    .on(result, (_, payload) => payload);
  const scope = fork(app);
  await Promise.all([
    allSettled(e2, { scope, params: 'hi2' }),
    allSettled(e1, { scope, params: 'hi1' }),
    allSettled(e3, { scope, params: 'WOOOOO' }),
  ]);
  expect(scope.getState($store)).toMatchInlineSnapshot(`
    Object {
      "e1": "hi1",
      "e2": "hi2",
      "e3": "WOOOOO",
    }
  `);
});

test('do not affects original store state', async () => {
  const app = createDomain();
  const e1 = app.createEvent<string>();
  const e2 = app.createEvent<string>();
  const e3 = app.createEvent<string>();
  const result = combineEvents({
    events: { e1, e2, e3 },
  });
  const $store = app
    .createStore({ e1: '', e2: '', e3: '' })
    .on(result, (_, payload) => payload);
  const scope = fork(app);
  await Promise.all([
    allSettled(e2, { scope, params: 'hi2' }),
    allSettled(e1, { scope, params: 'hi1' }),
    allSettled(e3, { scope, params: 'WOOOOO' }),
  ]);
  expect(scope.getState($store)).toMatchInlineSnapshot(`
    Object {
      "e1": "hi1",
      "e2": "hi2",
      "e3": "WOOOOO",
    }
  `);
  expect($store.getState()).toMatchInlineSnapshot(`
    Object {
      "e1": "",
      "e2": "",
      "e3": "",
    }
  `);
});

test('do not affects another scope', async () => {
  const app = createDomain();
  const e1 = app.createEvent<string>();
  const e2 = app.createEvent<string>();
  const e3 = app.createEvent<string>();
  const result = combineEvents({
    events: { e1, e2, e3 },
  });
  const $store = app
    .createStore({ e1: '', e2: '', e3: '' })
    .on(result, (_, payload) => payload);

  const scope1 = fork(app);
  const scope2 = fork(app);

  await Promise.all([
    allSettled(e2, { scope: scope1, params: '1hi2' }),
    allSettled(e2, { scope: scope2, params: '2 demo 2' }),
    allSettled(e3, { scope: scope2, params: 'that 3 for 2' }),
    allSettled(e1, { scope: scope1, params: 'hi1' }),
    allSettled(e3, { scope: scope1, params: 'WOOOOO' }),
    allSettled(e1, { scope: scope2, params: 'WOOOOO it 1 for 2' }),
  ]);

  expect(scope1.getState($store)).toMatchInlineSnapshot(`
    Object {
      "e1": "hi1",
      "e2": "1hi2",
      "e3": "WOOOOO",
    }
  `);
  expect(scope2.getState($store)).toMatchInlineSnapshot(`
    Object {
      "e1": "WOOOOO it 1 for 2",
      "e2": "2 demo 2",
      "e3": "that 3 for 2",
    }
  `);
});
