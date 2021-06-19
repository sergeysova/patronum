import { createStore, createEvent } from 'effector';
import { argumentHistory } from '../test-library';
import { format } from './index';

test('works with same type of storage', () => {
  const fn = jest.fn();

  const changeName = createEvent();
  const $name = createStore('Mike').on(changeName, () => 'Bob');

  const $result = format`My name is ${$name}`;

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith('My name is Mike');

  changeName();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "My name is Mike",
      "My name is Bob",
    ]
  `);
});

test('works with different type of storage', () => {
  const fn = jest.fn();

  const changeName = createEvent();
  const changeAge = createEvent();
  const $name = createStore('Mike').on(changeName, () => 'Bob');
  const $age = createStore(28).on(changeAge, () => 30);

  const $result = format`That ${$name} is a ${$age} old`;

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith('That Mike is a 28 old');

  changeName();
  changeAge();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "That Mike is a 28 old",
      "That Bob is a 28 old",
      "That Bob is a 30 old",
    ]
  `);
});

test('works with primitives', () => {
  const fn = jest.fn();

  const APP_SETTINGS = {
    url: 'site.com',
    port: {
      prod: 443,
      dev: 8080,
    },
  };

  const switchPortToProd = createEvent();
  const $port = createStore(APP_SETTINGS.port.dev).on(
    switchPortToProd,
    () => APP_SETTINGS.port.prod,
  );

  const $result = format`Server is running at https://${APP_SETTINGS.url}:${$port}`;

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith('Server is running at https://site.com:8080');

  switchPortToProd();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "Server is running at https://site.com:8080",
      "Server is running at https://site.com:443",
    ]
  `);
});

describe('works with different combination of string template', () => {
  const $first = createStore('first');
  const $second = createStore('second');
  const $third = createStore('third');

  test('works with when stores is not provided', () => {
    const $result = format`1 2 3`;

    expect($result.getState()).toBe('1 2 3');
  });

  test('works with when only stores provided', () => {
    const $result = format`${$first} ${$second} ${$third}`;

    expect($result.getState()).toBe('first second third');
  });

  test('works with when last element is store', () => {
    const $result = format`1 2 ${$third}`;

    expect($result.getState()).toBe('1 2 third');
  });

  test('works with when last element is string', () => {
    const $result = format`1 ${$second} 3`;

    expect($result.getState()).toBe('1 second 3');
  });
});
