# Patronum/InFlight

```ts
import { inFlight } from 'patronum/in-flight';
```

## `inFlight({ effects: [] })`

### Motivation

Method allows calculate total current in flight states of each passed effect.
It is useful when you want to show pending state of complex process.

### Formulae

```ts
$count = inFlight({ effects: [fx1, fx2] });
```

- Count all pending runs of effects in one store

### Arguments

1. `effects` _(Array<Effect<any, any, any>>)_ - array of any effects

## Returns

- `$count` _(Store<number>)_ - Store with count of run effects in pending state

## Example

```ts
import { createEffect } from 'effector';
import { inFlight } from 'patronum/in-flight';

const loadFirst = createEffect().use(() => Promise.resolve(null));
const loadSecond = createEffect().use(() => Promise.resolve(2));
const $count = inFlight({ effects: [loadFirst, loadSecond] });

$count.watch((count) => console.info(`count: ${count}`));
// => count: 0

loadFirst();
loadSecond();
// => count: 2

loadSecond();
loadSecond();
// => count: 4

// Wait to resolve all effects
// => count: 0
```

## `inFlight({ domain })`

### Motivation

This overload allows to count effects in flight of the whole domain.
It is usef when you want to show loading state of the whole application.

### Formulae

```ts
$count = inFlight({ domain });
```

- Count all pending runs of effects in passed domain in one store

### Arguments

1. `domain` _(Domain)_ - domain to count effects from

## Returns

- `$count` _(Store<number>)_ - Store with count of run effects in pending state

## Example

```ts
import { createDomain } from 'effector';
import { inFlight } from 'patronum/in-flight';

const app = createDomain();
const loadFirst = app.createEffect().use(() => Promise.resolve(null));
const loadSecond = app.createEffect().use(() => Promise.resolve(2));
const $count = inFlight({ domain: app });

$count.watch((count) => console.info(`count: ${count}`));
// => count: 0

loadFirst();
loadSecond();
// => count: 2

loadSecond();
loadSecond();
// => count: 4

// Wait to resolve all effects
// => count: 0
```
