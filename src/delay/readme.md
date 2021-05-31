# Patronum/Delay

```ts
import { delay } from 'patronum/delay';
```

## `delay({ source, timeout: number, target })`

### Formulae

```ts
target = delay({ source, timeout: number, target });
```

- When `source` is triggered, wait for `timeout`, then trigger `target` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `target` with.
1. `timeout` _(`number`)_ — time to wait before trigger `event`
1. `target` _(`Event<T>` | `Store<T>` | `Effect<T`>)_ — Optional. Target unit, that should be called after delay.

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

## `delay({ source, timeout: Function, target })`

### Motivation

This overload allows to calculate timeout from payload of `source`.
It is useful when you know that calculations requires more time if you have more data for payload.

### Formulae

```ts
target = delay({ source, timeout: Function, target });
```

- When `source` is triggered, call `timeout` with payload to get the timeout for delay, then trigger `target` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `target` with.
1. `timeout` _(`(payload: T) => number`)_ — Calculate delay for each `source` call. Receives the payload of `source` as argument. Should return `number` — delay in milliseconds.
1. `target` _(`Event<T>` | `Store<T>` | `Effect<T`>)_ — Optional. Target unit, that should be called after delay.

### Example

```ts
import { createEvent, createStore } from 'effector';
import { delay } from 'patronum/delay';

const update = createEvent<string>();
const logDelayed = createEvent<string>();
const $data = createStore('');

delay({
  source: $data,
  timeout: (string) => string.length * 100,
  target: logDelayed,
});

logDelayed.watch((data) => console.log('log', data));

update('Hello');
// after 500ms
// => log Hello

update('!');
// after 100ms
// => log !
```

## `delay({ source, timeout: Store<T>, target })`

### Motivation

This overload allows you to read timeout from another store.
It is useful when you writing music editor and need dynamic delay for your events.

### Formulae

```ts
target = delay({ source, timeout: $store, target });
```

- When `source` is triggered, read timeout from `timeout` store, then trigger `target` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `target` with.
1. `timeout` _(`Store<number>`)_ — Store with number — delay in milliseconds.
1. `target` _(`Event<T>` | `Store<T>` | `Effect<T`>)_ — Optional. Target unit, that should be called after delay.

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
