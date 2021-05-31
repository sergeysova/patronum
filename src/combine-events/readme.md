# Patronum/CombineEvents

```ts
import { combineEvents } from 'patronum/combine-events';
```

## `combineEvents({ events: Record<key, Event<T>> })`

### Formulae

```ts
const target = combineEvents({
  events: {
    key1: event1,
    key2: event2,
  },
});
```

- When all events (`event1` and `event2` from example) is triggered, trigger `target` with data from events mapped to `key1` and `key2`

### Arguments

1. `events` — Object of events

### Returns

- `target` — Event with the same shape as `events`, that triggered after all `events` triggered

### Example

```ts
const first = createEvent<number>();
const second = createEvent<string>();
const third = createEvent<boolean>();

const target = combineEvents({
  events: {
    a: first,
    second,
    another: third,
  },
});

target.watch((object) => {
  console.log('first event data', object.a);
  console.log('second event data', object.second);
  console.log('third event data', object.another);
});

first(15); // nothing
second('wow'); // nothing
third(false); // target triggered with object
```

## `combineEvents({ events: Array<Event<T>> })`

### Formulae

```ts
const target = combineEvents({ events: [event1, event2] });
```

- When all events (`event1` and `event2` from example) is triggered, trigger `target` with array from events with the same order as events

### Example

```ts
const first = createEvent<number>();
const second = createEvent<string>();
const third = createEvent<boolean>();

const target = combineEvents({ events: [first, second, third] });

target.watch((list) => {
  console.log('first event data', list[0]);
  console.log('second event data', list[1]);
  console.log('third event data', list[2]);
});

first(15); // nothing
second('wow'); // nothing
third(false); // target triggered with array
```
