// @ts-nocheck
/* eslint-disable no-underscore-dangle */
const { createEvent, createStore, is } = require('effector');
const { argumentHistory } = require('../../test-library');
const { splitMap } = require('./index');

test('map from event', () => {
  const source = createEvent();
  const out = splitMap(source, {
    first: (payload) => payload.first,
  });
  expect(is.event(out.first)).toBe(true);

  const fn = jest.fn();
  out.first.watch(fn);

  source({ first: 'Demo' });
  expect(fn).toBeCalledTimes(1);
  expect(fn).toBeCalledWith('Demo');

  source({ another: true });
  expect(fn).toBeCalledTimes(1);
});

test('default case from event', () => {
  const source = createEvent();
  const out = splitMap(source, {
    first: (payload) => payload.first,
  });
  expect(is.event(out.first)).toBe(true);

  const fnFirst = jest.fn();
  out.first.watch(fnFirst);
  const fnDefault = jest.fn();
  out.__.watch(fnDefault);

  source({ another: 'Demo' });
  expect(fnFirst).toBeCalledTimes(0);

  expect(fnDefault).toBeCalledTimes(1);
  expect(argumentHistory(fnDefault)).toMatchInlineSnapshot(`
    Array [
      "{\\"another\\":\\"Demo\\"}",
    ]
  `);
});

test('fall through from event', () => {
  const source = createEvent();
  const out = splitMap(source, {
    first: (payload) => (payload.first ? 'first' : undefined),
    second: (payload) => (payload.second ? 'second' : undefined),
  });
  expect(is.event(out.first)).toBe(true);

  const fn = jest.fn();
  out.first.watch(fn);
  out.second.watch(fn);
  out.__.watch(fn);

  source({ first: 'Demo' });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
    ]
  `);

  source({ second: true });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
      "second",
    ]
  `);

  source({ default: 1000 });
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "first",
      "second",
      "{\\"default\\":1000}",
    ]
  `);
});

test('map from store', () => {
  const change = createEvent();
  const $source = createStore('').on(change, (_, value) => value);

  const out = splitMap($source, {
    twoWords: (payload) => {
      const pair = payload.split(' ');
      return pair.length === 2 ? pair : undefined;
    },
    word: (payload) => (payload.match(/\w+/gim) ? payload : undefined),
  });
  expect(is.event(out.twoWords)).toBe(true);
  expect(is.event(out.word)).toBe(true);

  const fn = jest.fn();
  out.twoWords.watch(fn);
  out.word.watch(fn);

  change('Demo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "Demo",
    ]
  `);

  change('Hello World');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "Demo",
      "[\\"Hello\\",\\"World\\"]",
    ]
  `);
});
