import { createDomain, restore } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { spread } from './index';

test('works in forked scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const _$first = app.createStore('').on(first, (_, p) => p);
  const _$second = restore(second, 0);

  spread({
    source,
    targets: { first, second },
  });

  const scope = fork(app);

  await allSettled(source, { scope, params: { first: 'sergey', second: 26 } });
  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-xihhjw": 26,
      "nln5hw": "sergey",
    }
  `);
});

test('do not affects original store state', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const $first = app.createStore('').on(first, (_, p) => p);
  const $second = restore(second, 0);

  spread({
    source,
    targets: { first, second },
  });

  const scope = fork(app);

  await allSettled(source, { scope, params: { first: 'sergey', second: 26 } });
  expect(scope.getState($first)).toBe('sergey');
  expect(scope.getState($second)).toBe(26);
  expect($first.getState()).toBe('');
  expect($second.getState()).toBe(0);
});

test('do not affects another scope', async () => {
  const app = createDomain();
  const source = app.createEvent<{ first: string; second: number }>();
  const first = app.createEvent<string>();
  const second = app.createEvent<number>();

  const _$first = app.createStore('').on(first, (_, p) => p);
  const _$second = restore(second, 0);

  spread({
    source,
    targets: { first, second },
  });

  const scope1 = fork(app);
  const scope2 = fork(app);

  await Promise.all([
    allSettled(source, {
      scope: scope1,
      params: { first: 'sergey', second: 26 },
    }),
    allSettled(source, {
      scope: scope2,
      params: { first: 'Anon', second: 90 },
    }),
  ]);
  expect(serialize(scope1)).toMatchInlineSnapshot(`
    Object {
      "-w3pd79": 26,
      "f2h7kg": "sergey",
    }
  `);
  expect(serialize(scope2)).toMatchInlineSnapshot(`
    Object {
      "-w3pd79": 90,
      "f2h7kg": "Anon",
    }
  `);
});
