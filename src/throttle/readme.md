# Patronum/Throttle

```ts
import { throttle } from 'patronum/throttle';
```

## `target = throttle({ source, timeout })`

### Motivation

This method allows to trigger `target` in equal timeouts regardless of source trigger frequency.
It is useful in live search in UI.

### Formulae

```ts
target = throttle({ source, timeout });
```

- Triggers `target` at most once per `timeout` after triggering `source`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
1. `timeout` ([_`number`_]) — time to wait before trigger `target` after last trigger or `source` trigger

### Returns

- `target` ([_`Event`_]) — new event, that triggered each time after triggering `source` with argument from `source`

### Usage

Create event that should be throttled:

```ts
import { createEvent } from 'effector';

const someHappened = createEvent<number>();
```

Create throttled event from it:

```ts
import { throttle } from 'patronum/throttle';

const THROTTLE_TIMEOUT_IN_MS = 200;

const throttled = throttle({
  source: someHappened,
  timeout: THROTTLE_TIMEOUT_IN_MS,
});
```

When you call `someHappened` it will make throttled call the `throttled` event:

```ts
throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// after 200 ms after first call
// => someHappened now 4
```

Also you can use `Effect` and `Store` as trigger. `throttle` always returns `Event`:

```ts
const event = createEvent<number>();
const throttledEvent: Event<number> = throttle({ source: event, timeout: 100 });

const fx = createEffect<number, void>();
const throttledEffect: Event<number> = throttle({ source: fx, timeout: 100 });

const $store = createStore<number>(0);
const throttledStore: Event<number> = throttle({
  source: $store,
  timeout: 100,
});
```

## `throttle({ source, timeout, target })`

### Motivation

This overload allows to receive target instead of returning it.
This is useful when you already have a unit that should be triggered.

### Formulae

```ts
throttle({ source, timeout, target });
```

- Triggers `target` at most once per `timeout` after triggering `source`

### Arguments

1. `source` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Source unit, data from this unit used by the `target`
1. `timeout` ([_`number`_]) — time to wait before trigger `target` after last trigger or `source` trigger
1. `target` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Target unit, that triggered each time after triggering `source` with argument from `source`

### Returns

- `target` ([_`Event`_] | [_`Store`_] | [_`Effect`_]) — Target unit passed to arguments

### Usage

```ts
const change = createEvent();
const $source = createStore(0).on(change, (state) => state + 1);

const $dumped = createStore(0);
$dumped.watch((payload) => {
  localStorage.setItem('dump', JSON.stringify(payload));
});

throttle({ source: $source, timeout: 40, target: $dumped });

change();
change();
change();

// after 40ms after first call, 3 will be saved to localStorage
```

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store
[_`number`_]: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number
