import { createDomain } from 'effector';
import { fork, allSettled } from 'effector/fork';
import { reshape } from '.';

test('works in forked scope', () => {
  const app = createDomain();
  const $original = app.createStore('some long value');

  const shape = reshape({
    source: $original,
    shape: {
      length: (original) => original.length,
      uppercase: (original) => original.toUpperCase(),
      hasSpace: (original) => original.includes(' '),
    },
  });
  const scope = fork(app);

  expect(scope.getState(shape.length)).toBe(15);
  expect(scope.getState(shape.uppercase)).toBe('SOME LONG VALUE');
  expect(scope.getState(shape.hasSpace)).toBe(true);
});

test('do not affects another scope', async () => {
  const app = createDomain();
  const change = app.createEvent<string>();
  const $original = app.createStore('some long value');

  const shape = reshape({
    source: $original,
    shape: {
      length: (original) => original.length,
      uppercase: (original) => original.toUpperCase(),
      hasSpace: (original) => original.includes(' '),
    },
  });
  $original.on(change, (_, value) => value);
  const scope1 = fork(app);
  const scope2 = fork(app);

  await Promise.all([
    allSettled(change, { scope: scope1, params: 'hello world' }),
    allSettled(change, { scope: scope2, params: 'Effector' }),
  ]);

  expect(scope1.getState(shape.length)).toBe(11);
  expect(scope1.getState(shape.uppercase)).toBe('HELLO WORLD');
  expect(scope1.getState(shape.hasSpace)).toBe(true);

  expect(scope2.getState(shape.length)).toBe(8);
  expect(scope2.getState(shape.uppercase)).toBe('EFFECTOR');
  expect(scope2.getState(shape.hasSpace)).toBe(false);
});

test('do not affects original store state', async () => {
  const app = createDomain();
  const change = app.createEvent<string>();
  const $original = app.createStore('some long value');

  const shape = reshape({
    source: $original,
    shape: {
      length: (original) => original.length,
      uppercase: (original) => original.toUpperCase(),
      hasSpace: (original) => original.includes(' '),
    },
  });
  $original.on(change, (_, value) => value);
  const scope = fork(app);
  await allSettled(change, { scope, params: 'demo' });

  expect(scope.getState(shape.length)).toBe(4);
  expect(scope.getState(shape.uppercase)).toBe('DEMO');
  expect(scope.getState(shape.hasSpace)).toBe(false);

  expect(shape.length.getState()).toBe(15);
  expect(shape.uppercase.getState()).toBe('SOME LONG VALUE');
  expect(shape.hasSpace.getState()).toBe(true);
});
