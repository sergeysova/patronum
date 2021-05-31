import { createDomain, forward } from 'effector';
import { fork, allSettled } from 'effector/fork';
import { pending } from './index';

test('works in forked scope', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const $pending = pending({ effects: [effect1, effect2] });
  const scope = fork(app);

  const finish = allSettled(effect1, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});

test('works in forked scope with domain', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 1)),
  });
  const $pending = pending({ domain: app });
  const scope = fork(app);

  const finish = allSettled(effect1, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});

test('concurrent run of different effects', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 50)),
  });
  const $pending = pending({ effects: [effect1, effect2] });
  const run = app.createEvent();
  forward({ from: run, to: [effect1, effect2] });

  const scope = fork(app);
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);

  const finish = allSettled(run, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});

test('concurrent run of different effects with domain', async () => {
  const app = createDomain();
  const effect1 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 10)),
  });
  const effect2 = app.createEffect({
    handler: () => new Promise((resolve) => setTimeout(resolve, 50)),
  });
  const $pending = pending({ domain: app });
  const run = app.createEvent();
  forward({ from: run, to: [effect1, effect2] });

  const scope = fork(app);
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);

  const finish = allSettled(run, { scope });
  expect(scope.getState($pending)).toMatchInlineSnapshot(`true`);

  await finish;
  expect(scope.getState($pending)).toMatchInlineSnapshot(`false`);
});
