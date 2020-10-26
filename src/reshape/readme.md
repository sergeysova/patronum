# Patronum/Reshape

```ts
import { reshape } from 'patronum/reshape';
```

## Formulae

```ts
result = reshape(source, shape);
```

- Call each function in `shape` object with data from `source`, and create store with the same name as key in `shape`
- If function in `shape` returns `undefined`, the same store will contain `null`, because store cannot contain `undefined`.

> No arguments yet

## Example

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $original = createStore<string>('Example');

const result = reshape({
  source: $original,
  shape: {
    length: (string) => string.length,
    lowercase: (string) => string.toLowerCase(),
    uppercase: (string) => string.toUpperCase(),
  },
});

// result.length: Store<number>;
// result.lowercase: Store<string>;
// result.uppercase: Store<string>;

result.length.watch((length) => console.log('String length:', length));
result.lowercase.watch((lowercase) => console.log('lowercase:', lowercase));
```
