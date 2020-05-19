# Patronum/Reshape

```ts
import { reshape } from 'patronum/reshape';
```

## Formulae

```ts
shape = reshape(store, cases);
```

- Call each function in `cases` object with data from `store`, and create store with the same name as key in `cases`

> No arguments yet

## Example

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $original = createStore<string>('Example');

const shape = reshape($original, {
  length: (string) => string.length,
  lowercase: (string) => string.toLowerCase(),
  uppercase: (string) => string.toUpperCase(),
});

// shape.length: Store<number>;
// shape.lowercase: Store<string>;
// shape.uppercase: Store<string>;

shape.length.watch((length) => console.log('String length:', length));
shape.lowercase.watch((lowercase) => console.log('lowercase:', lowercase));
```
