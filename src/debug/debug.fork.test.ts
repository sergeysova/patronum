import { createDomain } from 'effector';
import { fork, allSettled } from 'effector/fork';
import { argumentsHistory } from '../../test-library';
import { debug } from './index';

const stringArguments = (ƒ: any) =>
  argumentsHistory(ƒ).map((value) =>
    value.map((a) => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '),
  );

const original = global.console.info;
let fn: any;

beforeEach(() => {
  global.console.info = fn = jest.fn();
});
afterEach(() => {
  global.console.info = original;
});

test('works in forked scope', async () => {
  const app = createDomain();
  const event = app.createEvent<number>();
  const effect = app.createEffect(async (payload: string) => `result ${payload}`);
  const $store = app
    .createStore(0)
    .on(event, (counter, payload) => counter + payload)
    .on(effect.done, (counter) => counter * 100);
  debug($store, event, effect);
  const scope = fork(app);

  await allSettled(event, { scope, params: 5 });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] app/event 5",
      "[store] app/$store 5",
    ]
  `);

  allSettled(effect, { scope, params: 'demo' });
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] app/event 5",
      "[store] app/$store 5",
      "[effect] app/effect demo",
    ]
  `);

  await 1;
  expect(stringArguments(fn)).toMatchInlineSnapshot(`
    Array [
      "[store] app/$store 0",
      "[event] app/event 5",
      "[store] app/$store 5",
      "[effect] app/effect demo",
      "[effect] app/effect.done {\\"params\\":\\"demo\\",\\"result\\":\\"result demo\\"}",
      "[store] app/$store 500",
    ]
  `);
});
