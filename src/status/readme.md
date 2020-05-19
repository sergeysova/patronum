# Patronum/Status

```ts
import { status } from 'patronum/status';
```

## Formulae

```ts
$status = status(effect, initial);
```

- When `status` is run, set `initial` value to `$status`
- When `effect` is called, set `pending` status.
- When `effect` is succeeded, set `done` status.
- When `effect` is failed, set `fail` status.

## Arguments

1. `effect` _(Effect<P, R>)_ — any effect, that you need to watch status
2. `initial` _('initial' | 'pending' | 'done' | 'fail')_ _optional_ — when `$status` initializes, set initial value for it. By default value is `"initial"`

## Returns

- `$status` _(Store<'initial' | 'pending' | 'done' | 'fail'>)_ — Store that saves current state of the effects

> Note: use can manually reset status, just use `$status.reset(event)`

## Example

### Successful effect call changing status to "done"

```ts
import { createEvent, createEffect } from 'effector';
import { status } from 'patronum/status';

const effect = createEffect().use(() => Promise.resolve(null));
const $status = status(effect);

$status.watch((value) => console.log(`status: ${value}`));
// => status: "initial"

effect();
// => status: "pending"
// => status: "done"
```

### Initial status

```ts
import { createEvent, createEffect } from 'effector';
import { status } from 'patronum/status';

const effect = createEffect().use(() => Promise.resolve(null));
const $status = status(effect, 'pending');

$status.watch((value) => console.log(`status: ${value}`));
// => status: "pending"

effect();
// Nothing, because $status is already pending
// => status: "done"
```

### Clear (reset) status

```ts
import { createEvent, createEffect } from 'effector';
import { status } from 'patronum/status';

const reset = createEvent();
const effect = createEffect().use(
  () => new Promise((resolve) => setTimeout(resolve, 100)),
);

const $status = status(effect);
$status.reset(reset);

$status.watch((value) => console.log(`status: ${value}`));
// => status: "initial"

effect();
// => status: "pending"
// => status: "done"

reset();
// => status: "initial"
```
