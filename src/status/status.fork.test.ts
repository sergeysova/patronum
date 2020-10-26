import { createDomain } from 'effector';
import { fork, allSettled } from 'effector/fork';
import { status } from '.';

test('works in forked scope', async () => {
  const app = createDomain();
  const effect = app.createEffect(
    () => new Promise<number>((resolve) => setTimeout(resolve, 10, 1)),
  );
  const $status = status({ effect });
  const scope = fork(app);
  await allSettled(effect, { scope });
  expect(scope.getState($status)).toBe('done');
});

test('do not affects another scope', async () => {
  const app = createDomain();
  const effect = app.createEffect(
    (param: number) =>
      new Promise<number>((resolve, reject) => {
        if (param > 0) setTimeout(resolve, 10, 1);
        else setTimeout(reject, 10, 1);
      }),
  );
  const $status = status({ effect });
  const scope1 = fork(app);
  const scope2 = fork(app);
  await Promise.all([
    allSettled(effect, { scope: scope1, params: 1 }),
    allSettled(effect, { scope: scope2, params: 0 }),
  ]);
  expect(scope1.getState($status)).toBe('done');
  expect(scope2.getState($status)).toBe('fail');
});

test('do not affects original store state', async () => {
  const app = createDomain();
  const effect = app.createEffect(
    () => new Promise<number>((resolve) => setTimeout(resolve, 10, 1)),
  );
  const $status = status({ effect });
  const scope = fork(app);
  await allSettled(effect, { scope });
  expect(scope.getState($status)).toBe('done');
  expect($status.getState()).toBe('initial');
});
