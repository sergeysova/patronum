# Patronum/Delay

```ts
import { delay } from 'patronum/delay';
```

## `delay({ source, timeout: number })`

### Formulae

```ts
event = delay({ source, timeout: number });
```

- When `source` is triggered, wait for `timeout`, then trigger `event` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `event` with.
1. `timeout` _(`number`)_ — time to wait before trigger `event`

### Returns

- `event` _(`Event<T>`)_ — New event, that triggered after delay

### Example

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = delay({ source: trigger, timeout: 300 });

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## `delay({ source, timeout: Function })`

### Formulae

```ts
event = delay({ source, timeout: Function });
```

- When `source` is triggered, call `timeout` with payload to get the timeout for delay, then trigger `event` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `event` with.
1. `timeout` _(`(payload: T) => number`)_ — Calculate delay for each `source` call. Receives the payload of `source` as argument. Should return `number` — delay in milliseconds.

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $data = createStore('');

const logDelayed = delay({
  source: $data,
  timeout: (string) => string.length * 100,
});

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello

update('!');
// after 100ms
// => log !
```

## `delay({ source, timeout: Store })`

### Formulae

```ts
event = delay({ source, timeout: $store });
```

- When `source` is triggered, read timeout from `timeout` store, then trigger `event` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `event` with.
1. `timeout` _(`Store<number>`)_ — Store with number — delay in milliseconds.

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const $data = createStore('');
const $timeout = createStore(500);

const logDelayed = delay({
  source: $data,
  timeout: $timeout,
});

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello
```
