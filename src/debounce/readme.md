# Patronum/Debounce

```ts
import { debounce } from 'patronum/debounce';
```

## `debounce({ source, timeout: number })`

### Motivation

Method creates a new event, that will be triggered after some time. It is useful for handling user events such as scrolling, mouse movement, or keypressing.
It is useful when you want to pass created event immediately to another method as argument.

### Formulae

```ts
event = debounce({ source, timeout: number });
```

- Wait for `timeout` after the last time `source` was triggered, then trigger `event` with payload of the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used by the `event`
1. `timeout` _(`number`)_ — time to wait before trigger `event`

### Returns

- `event` _(`Event<T>`)_ — New event, that triggered after delay

### Example

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const debounced = debounce({
  source: someHappened,
  timeout: DEBOUNCE_TIMEOUT_IN_MS,
});

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
```

## `debounce({ source, timeout: number, target })`

### Motivation

This overload receives target as argument, that will be triggered after timeout.
It is useful when you already have an unit that you need to trigger.

### Formulae

```ts
event = debounce({ source, timeout: number, target });
```

- Wait for `timeout` after the last time `source` was triggered and call `target` with data from the `source`

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data from this unit used to trigger `target` with payload of the `source`
1. `timeout` _(`number`)_ — time to wait before trigger `event`
1. `target` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Target unit, data from the `source` will be passed to this unit

### Returns

- `target` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Target unit that was passed to input argument `target`

### Example

```ts
import { createEvent, createStore } from 'effector';
import { debounce } from 'patronum/debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const target = createStore<number>(0);
const debounced = debounce({
  source: someHappened,
  timeout: DEBOUNCE_TIMEOUT_IN_MS,
  target,
});

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

target.watch((payload) => {
  console.info('got data', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
// got data 4
```
