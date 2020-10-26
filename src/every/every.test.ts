import { createStore, createEvent } from 'effector';
import { argumentHistory } from '../test-library';
import { every } from './index';

test('boolean predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(true);
  const $second = createStore(false).on(change, () => true);
  const $third = createStore(true);

  const $result = every({ predicate: true, stores: [$first, $second, $third] });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);
});

test('number predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(4);
  const $second = createStore(2).on(change, () => 4);
  const $third = createStore(4);

  const $result = every({ predicate: 4, stores: [$first, $second, $third] });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);
});

test('function predicate', () => {
  const fn = jest.fn();
  const change = createEvent();

  const $first = createStore(10);
  const $second = createStore(0).on(change, () => 5);
  const $third = createStore(3);

  const $result = every({
    predicate: (value) => value > 0,
    stores: [$first, $second, $third],
  });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(false);

  change();
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      false,
      true,
    ]
  `);
});

test('initially true', () => {
  const fn = jest.fn();

  const $first = createStore(10);
  const $second = createStore(2);
  const $third = createStore(3);

  const $result = every({
    predicate: (value) => value > 0,
    stores: [$first, $second, $third],
  });

  $result.watch(fn);
  expect(fn).toHaveBeenCalledWith(true);
});
