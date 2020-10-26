# Patronum/Pending

```ts
import { pending } from 'patronum/pending';
```

### Formulae

```ts
$inProcess = pending({ effects: [fx1, fx2] });
```

- When at least one effect from `effects` in pending state, result will be `true`

### Arguments

1. `effects` _(Array<Effect<any, any, any>>)_ - array of any effects

## Returns

- `$inProcess` _(Store<boolean>)_ - Store with boolean state

## Example

```ts
import { createEffect } from 'effector';
import { pending } from 'patronum/pending';

const loadFirst = createEffect().use(() => Promise.resolve(null));
const loadSecond = createEffect().use(() => Promise.resolve(2));
const $processing = pending({ effects: [loadFirst, loadSecond] });

$processing.watch((processing) => console.info(`processing: ${processing}`));
// => processing: false

loadFirst();
loadSecond();
// => processing: true
```
