# Patronum/Snapshot

```ts
import { snapshot } from 'patronum/snapshot';
```

## `result = snapshot({ source, clock, fn })`

### Motivation

This method allows to copy any store on optional trigger event.
It useful when you want to save previous state of store before some actions.

### Formulae

```ts
result = snapshot({ source, clock, fn });
```

- Call `fn` with data from `source` while `clock` triggered, and create store with the value
- If function in `shape` returns `undefined`, the update will be skipped.

### Arguments

1. `source` ([_`Store`_]) — Source store, data from this unit passed to `fn`
2. `clock` ([_`Event`_]) — Trigger event
3. `fn` _(`(value: T) => U`)_ — Transformation function

### Returns

- `result` ([_`Store`_]) — Copied store

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store

### Examples

#### Exact copy of store

```ts
import { createStore } from 'effector';
import { snapshot } from 'patronum/snapshot';

const $original = createStore<string>('Example');

const $copy = snapshot({ source: $original });
```

#### Exact copy on trigger

```ts
import { restore, createEvent } from 'effector';
import { snapshot } from 'patronum/snapshot';

const changeText = createEvent<string>();
const createSnapshot = createEvent();

const $original = restore(changeText, 'Example');

const $snapshot = snapshot({
  source: $original,
  clock: createSnapshot,
});

changeText('New text');

// $original -> Store with "New text"
// $snapshot -> Store with "Example"

createSnapshot();

// $original -> Store with "New text"
// $snapshot -> Store with "New text"
```

#### Copy on trigger with transformation

```ts
import { restore, createEvent } from 'effector';
import { snapshot } from 'patronum/snapshot';

const changeText = createEvent<string>();
const createSnapshot = createEvent();

const $original = restore(changeText, 'Example');

const $lengthSnapshot = snapshot({
  source: $original,
  clock: createSnapshot,
  fn: (text) => text.length,
});

// $original -> Store with "Example"
// $lengthSnapshot -> Store with 7 (length of "Example")

changeText('New long text');

// $original -> Store with "New long text"
// $lengthSnapshot -> Store with 7 (length of "Example")

createSnapshot();

// $original -> Store with "New long text"
// $lengthSnapshot -> Store with 13 (length of "New long text")
```
