const { createStore, createEvent, restore } = require('effector');
const { argumentHistory } = require('../../test-library');
const { condition } = require('./index');

test('source: event, if: store, then: event', () => {
  const source = createEvent();
  const $if = createStore(false);
  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source,
    if: $if,
    then: target,
  });

  source('bar');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  $if.setState(true);
  source('foo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "foo",
    ]
  `);
});

test('source: event, if: store, then: event, else: event', () => {
  const source = createEvent();
  const $if = createStore(false);
  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source,
    if: $if,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  source('bar');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: bar",
    ]
  `);

  $if.setState(true);
  source('foo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: bar",
      "then: foo",
    ]
  `);
});

test('source: store, if: store, then: event, else: event', () => {
  const change = createEvent();
  const $source = restore(change, 0);

  const setCond = createEvent();
  const $if = restore(setCond, false);

  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: $if,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
    ]
  `);

  setCond(true);
  change(2);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
      "then: 2",
    ]
  `);
});

test('source: store, if: function, then: event, else: event', () => {
  const change = createEvent();
  const $source = restore(change, 0);

  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: (value) => value > 2,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
    ]
  `);

  change(3);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
      "then: 3",
    ]
  `);
});

test('source: store, if: literal, then: event, else: event', () => {
  const change = createEvent();
  const $source = restore(change, 0);

  const target = createEvent();
  const fn = jest.fn();
  target.watch(fn);

  condition({
    source: $source,
    if: 2,
    then: target.prepend((value) => `then: ${value}`),
    else: target.prepend((value) => `else: ${value}`),
  });

  change(1);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
    ]
  `);

  change(2);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      "else: 1",
      "then: 2",
    ]
  `);
});
