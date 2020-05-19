# Patronum/Delay

```ts
import { delay } from 'patronum/delay';
```

## `delay(trigger, time)`

### Formulae

```ts
event = delay(trigger, time);
```

- When `trigger` is triggered, wait for `time`, then trigger `event` with payload of the `trigger`

### Arguments

1. `trigger` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `event` with.
2. `time` _(`number`)_ — time to wait before trigger `event`

### Returns

- `event` _(`Event<T>`)_ — New event, that triggered after delay

### Example

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = delay(trigger, 300);

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## `delay(trigger, { time: fn })`

### Formulae

```ts
event = delay(trigger, { time: fn });
```

- When `trigger` is triggered, call `time` with payload to get the timeout for delay, then trigger `event` with payload of the `trigger`

### Arguments

1. `trigger` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `event` with.
2. `options` _(`{ time: (payload: T) => number }`)_ — Setup delay options
   - `time` _(`(payload: T) => number`)_ — Calculate delay for each `trigger` call. Receives the payload of `trigger` as argument. Should return `number` — delay in milliseconds.

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $data = createStore('');

const logDelayed = delay($data, { time: (string) => string.length * 100 });

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello

update('!');
// after 100ms
// => log !
```
