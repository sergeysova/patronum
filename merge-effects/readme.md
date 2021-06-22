# Patronum/Merge Effects

```ts
import { mergeEffects } from 'patronum/merge-effects';
```

## Example

```ts
import { createEffect } from 'effector';
import { mergeEffects } from 'patronum/merge-effects';

const fx1 = createEffect({
  handler: () => 1,
});
const fx2 = createEffect({
  handler: () => 2,
});

mergeEffects([fx1, fx2]).done.watch(({ result }) => console.log(result));

// => 1
// => 2
```
