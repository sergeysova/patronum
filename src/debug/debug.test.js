// @ts-nocheck
const {
  createEvent,
  createEffect,
  createStore,
  createDomain,
} = require('effector');
const { argumentHistory } = require('../../test-library');
const { debug } = require('./index');

const original = global.console.info;
let fn;

beforeEach(() => {
  global.console.info = fn = jest.fn();
});
afterEach(() => {
  global.console.info = original;
});

test('debug event, store, effect simultaneously', async () => {
  const event = createEvent();
  const effect = createEffect().use((payload) =>
    Promise.resolve('result' + payload),
  );
  const $store = createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);

  debug($store, event, effect);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $store 0",
    ]
  `);

  event(5);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $store 0",
      "[event] event 5",
      "[store] $store 5",
    ]
  `);

  effect('demo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $store 0",
      "[event] event 5",
      "[store] $store 5",
      "[effect] effect demo",
    ]
  `);

  await 1;

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] $store 0",
      "[event] event 5",
      "[store] $store 5",
      "[effect] effect demo",
      "[effect] effect.done {\\"params\\":\\"demo\\",\\"result\\":\\"resultdemo\\"}",
      "[store] $store 50",
    ]
  `);
});

test('debug domain', async () => {
  const domain = createDomain();
  const event = domain.createEvent();
  const effect = domain
    .createEffect()
    .use((payload) => Promise.resolve('result' + payload));
  const $store = domain
    .createStore(0)
    .on(event, (state, value) => state + value)
    .on(effect.done, (state) => state * 10);

  debug(domain);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] domain/$store 0",
    ]
  `);

  event(5);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] domain/$store 0",
      "[event] domain/event 5",
      "[store] domain/$store 5",
    ]
  `);

  effect('demo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] domain/$store 0",
      "[event] domain/event 5",
      "[store] domain/$store 5",
    ]
  `);

  await 1;

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] domain/$store 0",
      "[event] domain/event 5",
      "[store] domain/$store 5",
      "[effect] domain/effect.done {\\"params\\":\\"demo\\",\\"result\\":\\"resultdemo\\"}",
      "[store] domain/$store 50",
    ]
  `);
});
