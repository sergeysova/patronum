import { createEvent, restore, Event } from 'effector';
import { argumentHistory } from '../../test-library';
import { combineEvents } from './index';

test('source: shape', () => {
  const fn = jest.fn();

  const event1 = createEvent<string | void>();
  const event2 = createEvent<string | void>();
  const event3 = createEvent<string | void>();
  const event4 = createEvent<string | void>();
  const event5 = createEvent<string | void>();

  type Target = Event<{
    event1: string | void;
    event2: string | void;
    event3: string | void;
    event4: string | void;
    event5: string | void;
  }>;

  const event: Target = combineEvents({
    events: {
      event1,
      event2,
      event3,
      event4,
      event5,
    },
  });

  event.watch(fn);

  event1();
  event1();
  event2('-');
  event3('c');
  event2('b');
  event2();
  event4();
  event4('d');
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
    ]
  `);

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3();

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
    ]
  `);
  event4('-');
  event4();
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
    ]
  `);

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');
  event4('-');
  event4('4');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
    ]
  `);

  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": undefined,
        "event2": undefined,
        "event3": "c",
        "event4": "d",
        "event5": "e",
      },
      Object {
        "event1": "a",
        "event2": "b",
        "event3": undefined,
        "event4": undefined,
        "event5": "e",
      },
      Object {
        "event1": "1",
        "event2": "2",
        "event3": "3",
        "event4": "4",
        "event5": "5",
      },
    ]
  `);
});

test('source: array', () => {
  const fn = jest.fn();

  const event1 = createEvent<string | void>();
  const event2 = createEvent<string | void>();
  const event3 = createEvent<string | void>();
  const event4 = createEvent<string | void>();
  const event5 = createEvent<string | void>();

  type Target = Event<
    [string | void, string | void, string | void, string | void, string | void]
  >;

  const event: Target = combineEvents({
    events: [event1, event2, event3, event4, event5],
  });

  event.watch(fn);

  event1();
  event1();
  event2('-');
  event3('c');
  event2('b');
  event2();
  event4();
  event4('d');
  event5('e');

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3();
  event4('-');
  event4();
  event5('e');

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');
  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        undefined,
        undefined,
        "c",
        "d",
        "e",
      ],
      Array [
        "a",
        "b",
        undefined,
        undefined,
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);
});

test('example from readme', () => {
  const fn = jest.fn();

  const event1 = createEvent<boolean>();
  const event2 = createEvent<string>();
  const event3 = createEvent<number>();

  type Target = Event<{
    event1: boolean;
    event2: string;
    event3: number;
  }>;

  const event: Target = combineEvents({
    events: {
      event1,
      event2,
      event3,
    },
  });

  event.watch(fn);

  event1(true);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event2('demo');
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event3(5);
  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Object {
        "event1": true,
        "event2": "demo",
        "event3": 5,
      },
    ]
  `);
});

test('reset', () => {
  const fn = jest.fn();

  const event1 = createEvent<string | void>();
  const event2 = createEvent<string | void>();
  const event3 = createEvent<string | void>();
  const event4 = createEvent<string | void>();
  const event5 = createEvent<string | void>();

  const reset = createEvent();

  type Target = Event<
    [string | void, string | void, string | void, string | void, string | void]
  >;

  const event: Target = combineEvents({
    events: [event1, event2, event3, event4, event5],
    reset,
  });

  event.watch(fn);

  event1();
  event1('a');
  event2('-');
  event3('c');
  event2('b');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event2();
  event4();
  reset(); // reset

  event4('d');
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3(); // triggers

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4();
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  reset();

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  event4('-');
  event4('4');
  reset();
  event5('5');
  event5('-');

  const a = createEvent<{ x: number }>();
  const b = createEvent<() => boolean>();
  const c = createEvent<void>();
  const renew = createEvent<number>();
  const store = restore(renew, null);

  type ABCTarget = Event<{
    a: { x: number };
    b: () => boolean;
    c: void;
  }>;

  const abc: ABCTarget = combineEvents({
    events: { a, b, c },
    reset: store,
  });

  abc.watch(fn);

  a({ x: 0 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  b(() => true);
  c();

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => false);
  renew(1);
  a({ x: 1 });
  c();
  a({ x: 2 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => true);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
      Object {
        "a": Object {
          "x": 2,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);
});

test('target', () => {
  const fn = jest.fn();

  const event1 = createEvent<string | void>();
  const event2 = createEvent<string | void>();
  const event3 = createEvent<string | void>();
  const event4 = createEvent<string | void>();
  const event5 = createEvent<string | void>();

  const reset = createEvent();

  type Target5XData = [
    string | void,
    string | void,
    string | void,
    string | void,
    string | void,
  ];

  interface TargetAbcData {
    a: { x: number };
    b: () => boolean;
    c: void;
  }

  type Target = Event<Target5XData | TargetAbcData>;

  const target = createEvent<Target>();

  // Inferred, but checked
  const _target: Event<Target5XData> = combineEvents({
    events: [event1, event2, event3, event4, event5],
    reset,
    target,
  });

  target.watch(fn);

  event1();
  event1('a');
  event2('-');
  event3('c');
  event2('b');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event2();
  event4();
  reset(); // reset

  event4('d');
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

  event1('a');
  event2('-');
  event3();
  event2('b');
  event3(); // triggers

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4();
  event5('e');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  reset();

  event1('1');
  event2('-');
  event3('-');
  event2('2');
  event3('3');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
    ]
  `);

  event4('-');
  event4('4');
  event5('5');
  event5('-');

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  event4('-');
  event4('4');
  reset();
  event5('5');
  event5('-');

  const a = createEvent<{ x: number }>();
  const b = createEvent<() => boolean>();
  const c = createEvent<void>();
  const renew = createEvent<number>();
  const store = restore(renew, null);

  // Inferred, but checked
  const _targetAbc: Event<TargetAbcData> = combineEvents({
    events: { a, b, c },
    reset: store,
    target,
  });

  a({ x: 0 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
    ]
  `);

  b(() => true);
  c();

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => false);
  renew(1);
  a({ x: 1 });
  c();
  a({ x: 2 });

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);

  b(() => true);

  expect(argumentHistory(fn)).toMatchInlineSnapshot(`
    Array [
      Array [
        "a",
        "-",
        undefined,
        "d",
        "e",
      ],
      Array [
        "1",
        "2",
        "3",
        "4",
        "5",
      ],
      Object {
        "a": Object {
          "x": 0,
        },
        "b": [Function],
        "c": undefined,
      },
      Object {
        "a": Object {
          "x": 2,
        },
        "b": [Function],
        "c": undefined,
      },
    ]
  `);
});
