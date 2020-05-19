// @ts-nocheck
const { createEvent, createStore, forward } = require('effector');
const { spread } = require('./index');

describe('spread(source, targets)', () => {
  test('event to events', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('event to stores', () => {
    const source = createEvent();
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to stores', () => {
    const change = createEvent();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to events', () => {
    const change = createEvent();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });
});

describe('spread(targets)', () => {
  test('event to events', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        first: targetA,
        second: targetB,
      }),
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('event to stores', () => {
    const source = createEvent();
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        first: targetA,
        second: targetB,
      }),
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to stores', () => {
    const change = createEvent();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        first: targetA,
        second: targetB,
      }),
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to events', () => {
    const change = createEvent();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        first: targetA,
        second: targetB,
      }),
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });
});

describe('edge', () => {
  test('array in source', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      0: targetA,
      1: targetB,
    });

    source(['Hello', 200]);

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('nested targets', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();
    const targetC = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    const fnC = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);
    targetC.watch(fnC);

    spread(source, {
      first: targetA,
      second: spread({
        foo: targetB,
        bar: targetC,
      }),
    });

    source({
      first: 'Hello',
      second: {
        foo: 200,
        bar: true,
      },
    });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
    expect(fnC).toBeCalledWith(true);
  });
});

describe('invalid', () => {
  test('no field in source', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source({ second: 200 });

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledWith(200);
  });

  test('empty object in source', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source({});

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });

  test('null/undefined in source', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source(null);
    source(undefined);

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });

  test('no object in source', () => {
    const source = createEvent();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread(source, {
      first: targetA,
      second: targetB,
    });

    source();
    source(1);
    source('');
    source(false);
    source(() => {});
    source(Symbol(1));

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });
});
