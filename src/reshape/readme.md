# Patronum/Reshape

```ts
import { reshape } from 'patronum/reshape';
```

## `result = reshape({ source, shape })`

### Motivation

This method allows to create many stores from single store at once.
It useful when you want to read many properties from object to different stores.

### Formulae

```ts
result = reshape({ source, shape });
```

- Call each function in `shape` object with data from `source`, and create store with the same name as key in `shape`
- If function in `shape` returns `undefined`, the same store will contain `null`, because store cannot contain `undefined`.

### Arguments

1. `source` ([_`Store`_]) — Source store, data from this unit passed to each function in `shape`
1. `shape` (`{ [key: string]: (payload: T) => any }`) — Object of functions. Function receives payload of `source` as single argument, should return any value.

### Returns

- `result` (`{ [key: string]: Store<any> }`) — Object of stores, that created with the same structure as `shape`, with data from passed functions

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store

### Examples

#### Creates much stores from single string

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

#### Destructure object

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $user = createStore({
  name: 'Sergey',
  lastname: 'Sova',
  age: 26,
});

const { name, lastname, age } = reshape({
  source: $user,
  shape: {
    name: (user) => user.name,
    lastname: (user) => user.lastname,
    age: ({ age }) => age,
  },
});

name.watch((name) => console.info('name updated', name));
lastname.watch((lastname) => console.info('lastname updated', lastname));
age.watch((age) => console.info('age updated', age));

// => name updated Sergey
// => lastname updated Sova
// => age updated 26
```
