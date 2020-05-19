import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { debounce } from './index.mjs';

test('debounce works in forked scope', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = debounce(trigger, 40);

  $counter.on(debounced, (value) => value + 1);

  const scope = fork(app);

  await allSettled(trigger, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "6uer59": 1,
    }
  `);
});

test('debounce do not affect another forks', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);

  const trigger = app.createEvent();

  const debounced = debounce(trigger, 40);

  $counter.on(debounced, (value, parameter) => value + parameter);

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
      "-8xxk2": 2,
    }
  `);

  expect(serialize(scopeB)).toMatchInlineSnapshot(`
    Object {
      "-8xxk2": 200,
    }
  `);
});

test('debounce do not affect original store value', async () => {
  const app = createDomain();
  const $counter = app.createStore(0);
  const trigger = app.createEvent();

  const debounced = debounce(trigger, 40);

  $counter.on(debounced, (value, parameter) => value + parameter);

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
      "-9q749w": 2,
    }
  `);

  expect($counter.getState()).toMatchInlineSnapshot(`0`);
});
