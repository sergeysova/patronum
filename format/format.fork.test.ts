import 'regenerator-runtime/runtime';
import { createDomain } from 'effector';
import { fork, serialize, allSettled } from 'effector/fork';
import { format } from '.';

test('format works in forked scope', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork(app);

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "b87jz2": "Bob",
    }
  `);

  expect(scope.getState($result)).toBe('My name is Bob');
});

test('format do not affect another forks', async () => {
  const app = createDomain();

  const changeName = app.createEvent<string>();
  const changeAge = app.createEvent<number>();
  const $name = app.createStore('Mike').on(changeName, (_, name) => name);
  const $age = app.createStore(28).on(changeAge, (_, age) => age);

  const $result = format`That ${$name} is a ${$age}`;

  const firstScope = fork(app);
  const secondScope = fork(app);

  await allSettled(changeName, {
    scope: firstScope,
    params: 'Bob',
  });

  await allSettled(changeName, {
    scope: secondScope,
    params: 'Kate',
  });

  await allSettled(changeAge, {
    scope: firstScope,
    params: 30,
  });

  await allSettled(changeAge, {
    scope: secondScope,
    params: 18,
  });

  expect(serialize(firstScope)).toMatchInlineSnapshot(`
    Object {
      "-s2vtl1": "Bob",
      "eyw8gf": 30,
    }
  `);
  expect(serialize(secondScope)).toMatchInlineSnapshot(`
    Object {
      "-s2vtl1": "Kate",
      "eyw8gf": 18,
    }
  `);

  expect(firstScope.getState($result)).toBe('That Bob is a 30');
  expect(secondScope.getState($result)).toBe('That Kate is a 18');
});

test('format do not affect original store value', async () => {
  const app = createDomain();

  const changeName = app.createEvent();
  const $name = app.createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  const scope = fork(app);

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  await allSettled(changeName, {
    scope,
    params: undefined,
  });

  expect(serialize(scope)).toMatchInlineSnapshot(`
    Object {
      "-q722u7": "Bob",
    }
  `);

  expect($result.getState()).toBe('My name is Mike');
});
