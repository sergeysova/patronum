import { createEvent, createStore, forward } from 'effector';
import { spread } from './index';

describe('spread(source, targets)', () => {
  test('event to events', () => {
    const source = createEvent<{ first: string; second: number }>();
    const targetA = createEvent<string>();
    const targetB = createEvent<number>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('event to stores', () => {
    const source = createEvent<{ first: string; second: number }>();
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to stores', () => {
    const change = createEvent<{ first: string; second: number }>();
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

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to events', () => {
    const change = createEvent<{ first: string; second: number }>();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createEvent<string>();
    const targetB = createEvent<number>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });
});

describe('spread(targets)', () => {
  test('event to events', () => {
    const source = createEvent<{ first: string; second: number }>();
    const targetA = createEvent<string>();
    const targetB = createEvent<number>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        targets: {
          first: targetA,
          second: targetB,
        },
      }),
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('event to stores', () => {
    const source = createEvent<{ first: string; second: number }>();
    const targetA = createStore('');
    const targetB = createStore(0);

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        targets: {
          first: targetA,
          second: targetB,
        },
      }),
    });

    source({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to stores', () => {
    const change = createEvent<{ first: string; second: number }>();
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
        targets: {
          first: targetA,
          second: targetB,
        },
      }),
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('store to events', () => {
    const change = createEvent<{ first: string; second: number }>();
    const source = createStore({ first: 'hello', second: 200 }).on(
      change,
      (_, value) => value,
    );
    const targetA = createEvent<string>();
    const targetB = createEvent<number>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    forward({
      from: source,
      to: spread({
        targets: {
          first: targetA,
          second: targetB,
        },
      }),
    });

    change({ first: 'Hello', second: 200 });

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });
});

describe('edge', () => {
  test('array in source', () => {
    // Eslint brokes here // createEvent<[string, number]>();
    const source = createEvent<any>();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        0: targetA,
        1: targetB,
      },
    });

    source(['Hello', 200]);

    expect(fnA).toBeCalledWith('Hello');
    expect(fnB).toBeCalledWith(200);
  });

  test('nested targets', () => {
    const source =
      createEvent<{
        first: string;
        second: { foo: number; bar: boolean };
      }>();
    const targetA = createEvent<string>();
    const targetB = createEvent<number>();
    const targetC = createEvent<boolean>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    const fnC = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);
    targetC.watch(fnC);

    spread({
      source,
      targets: {
        first: targetA,
        second: spread({
          targets: {
            foo: targetB,
            bar: targetC,
          },
        }),
      },
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
    const source = createEvent<{ second: number }>();
    const targetA = createEvent();
    const targetB = createEvent<number>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    // @ts-expect-error Types do not allows extra targets
    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    source({ second: 200 });

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledWith(200);
  });

  test('empty object in source', () => {
    const source = createEvent<Record<string, unknown>>();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    source({});

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });

  test('null/undefined in source', () => {
    const source =
      createEvent<null | void | {
        first: number;
        second: boolean;
      }>();
    const targetA = createEvent<number>();
    const targetB = createEvent<boolean>();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    source(null);
    source(undefined);

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });

  test('no object in source', () => {
    const source = createEvent<unknown>();
    const targetA = createEvent();
    const targetB = createEvent();

    const fnA = jest.fn();
    const fnB = jest.fn();
    targetA.watch(fnA);
    targetB.watch(fnB);

    spread({
      source,
      targets: {
        first: targetA,
        second: targetB,
      },
    });

    // @ts-expect-error no argument
    source();
    source(1);
    source('');
    source(false);
    source(() => undefined);
    source(Symbol(1));

    expect(fnA).toBeCalledTimes(0);
    expect(fnB).toBeCalledTimes(0);
  });
});
