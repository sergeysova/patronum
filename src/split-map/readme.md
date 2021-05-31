# Patronum/SplitMap

```ts
import { splitMap } from 'patronum/split-map';
```

## `shape = splitMap({ source, cases })`

### Motivation

The method is a combination of [`split`] and [`map`].
It is useful when you want add some kind of pattern matching.

[`split`]: https://effector.dev/docs/api/effector/split
[`map`]: https://effector.dev/docs/api/effector/event#mapfn

### Formulae

```ts
shape = splitMap({ source, cases });
```

- On each `source` trigger, call each function in `cases` object one after another until function returns non undefined, and call event in `shape` with the same name as function in `cases` object.
- If no function returned value event `__` in `shape` should be triggered

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit passed to each function in `cases` object and `__` event in `shape` as is
2. `cases` (`{ [key: string]: (payload: T) => any | void }`) — Object of functions. Function receives one argument is a payload from `source`, should return any value or `undefined`

### Returns

- `shape` (`{ [key: string]: Event<any>; __: Event<T> }`) — Object of events, with the same structure as `cases`, but with the _default_ event `__`, that triggered when each other function returns `undefined`

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store

### Examples

#### Extract passed fields from optional object

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

const event = createEvent<object>();

const shape = splitMap({
  source: event,
  cases: {
    getType: (input) => input.type,
    getDemo: (input) => input.demo,
  },
});

shape.getType.watch((type) => console.log('TYPE', type));
shape.getDemo.watch((demo) => console.log('DEMO', demo));
shape.__.watch((other) => console.log('OTHER', other));

event({ type: 'demo' });
// => TYPE demo

event({ demo: 5 });
// => DEMO 5

event({});
// => OTHER {}
```

#### Split WebSocket events to effector events

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

type WSEvent =
  | { type: 'init'; key: string }
  | { type: 'increment'; count: number; name: string }
  | { type: 'reset'; name: string };

export const websocketEventReceived = createEvent<WSEvent>();

const { init, increment, reset, __ } = splitMap({
  source: websocketEventReceived,
  cases: {
    init: (event) => {
      if (event.type === 'init') return event.key;
    },
    increment: ({ type, ...payload }) => {
      if (type === 'increment') return payload;
    },
    reset: ({ type, name }) => {
      if (type === 'reset') return name;
    },
  },
});

__.watch((payload) => {
  console.warn('Unknown type:', payload.type);
});

increment.watch((payload) => {
  console.info('should be incremented', payload.count, payload.name);
});

websocketEventReceived({ type: 'increment', name: 'demo', count: 5 });
// => should be incremented 5 'demo'

websocketEventReceived({ type: 'bang', random: 'unknown' });
// => Unknown type: 'bang'
```
