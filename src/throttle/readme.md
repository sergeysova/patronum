# Patronum/Throttle

```ts
import { throttle } from 'patronum/throttle';
```

## `throttle({ source, timeout })`

### Formulae

```ts
result = throttle({ source, timeout });
```

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

### Formulae

```ts
throttle({ source, timeout, target });
```

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
