# Patronum/Condition

```ts
import { condition } from 'patronum/condition';
```

## Motivation

Condition is very similar to [`guard`], but allows you to have `else` branch along with simple `if` matcher.

[`guard`]: https://effector.dev/docs/api/effector/guard

## `condition({ source: Unit, if: Store, then?: Unit, else?: Unit })`

### Formulae

```ts
result = condition({
  source,
  if: $checker,
  then,
  else,
});
```

- When `source` is triggered, check value of `$checker`, if it equals `true`, trigger `then` with value from `source`, otherwise trigger `else` with value from `source`
- `result` is the same unit as `source` allows to nest `condition` to another `condition` or `sample`

### Arguments

1. `source` _(`Unit<T>`)_ — Data from this unit will be passed to `then` or `else`
1. `if` _(`Store<boolean>`)_ — Updates of this store will not trigger `then` and `else`
1. `then` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `true`. Required if `else` is not provided
1. `else` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `false`. Required if `then` is not provided

### Returns

1. _(`Unit<T>`)_ — The same unit type that passed to `source`

### Example

```ts
const change = createEvent();
const $source = createStore('data').on(change, (_, payload) => payload);

const toggle = createEvent();
const $isEnabled = createStore(false).on(toggle, (is) => !is);

const enabled = createEvent();
const disabled = createEvent();

condition({
  source: $source,
  if: $isEnabled,
  then: enabled,
  else: disabled,
});
enabled.watch((payload) => console.log('enabled -', payload));
disabled.watch((payload) => console.log('disabled -', payload));

change('newdata');
// => disabled - newdata

toggle();
change('data');
// => enabled - data
```

## `condition({ source: Unit<T>, if: T, then?: Unit, else?: Unit })`

### Formulae

```ts
result = condition({
  source,
  if: value,
  then,
  else,
});
```

- When `source` is triggered, compare `value` literal with `source` payload, if it equals trigger `then` with value from `source`, otherwise trigger `else` with value from `source`
- `result` is the same unit as `source` allows to nest `condition` to another `condition` or `sample`

### Arguments

1. `source` _(`Unit<T>`)_ — Data from this unit will be passed to `then` or `else`
1. `if` _(`T`)_ — Just value to compare with `source` payload. _Note: objects will be compared by reference_
1. `then` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `true`. Required if `else` is not provided
1. `else` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `false`. Required if `then` is not provided

### Returns

1. _(`Unit<T>`)_ — The same unit type that passed to `source`

### Example

```ts
const increment = createEvent();
const $source = createStore(0).on(increment, (state) => state + 1);

const log = createEvent();
const run = createEffect().use((data) => {
  console.info('FAKE RUN EFFECT', data);
});

condition({
  source: $source,
  if: 4,
  then: run,
  else: log,
});

log.watch((payload) => console.log('LOG ABOUT IT', payload));

increment(); // => LOG ABOUT IT 1
increment(); // => LOG ABOUT IT 2
increment(); // => LOG ABOUT IT 3
increment(); // => FAKE RUN EFFECT 4
increment(); // => LOG ABOUT IT 5
```

## `condition({ source: Unit<T>, if: Function, then?: Unit, else?: Unit })`

### Formulae

```ts
result = condition({
  source,
  if: (payload) => boolean,
  then,
  else,
});
```

- When `source` is triggered, call `if` with `source` payload, if it returns `true` trigger `then` with value from `source`, otherwise trigger `else` with value from `source`
- `result` is the same unit as `source` allows to nest `condition` to another `condition` or `sample`

### Arguments

1. `source` _(`Unit<T>`)_ — Data from this unit will be passed to `then` or `else`
1. `if` _(`(payload: T) => boolean`)_ — Function comparator. It should return boolean
1. `then` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `true`. Required if `else` is not provided
1. `else` _(`Unit<T>`)_ — This unit will be triggered with data from `source` if `$checker` contains `false`. Required if `then` is not provided

### Returns

1. _(`Unit<T>`)_ — The same unit type that passed to `source`

### Example

```ts
const change = createEvent();
const $source = createStore('data').on(change, (_, payload) => payload);
const target = createEvent();
const another = createEvent();

condition({
  source: $source,
  if: (source) => source.length > 3,
  then: target,
  else: another,
});
target.watch((payload) => console.log('triggered', payload));
another.watch((payload) => console.log('condition else:', payload));

change('newdata');
// => triggered newdata

change('old');
// => condition else: old
```

## Examples

### Source is event

```ts
const inputChanged = createEvent();
const $value = createStore('');
const $error = createStore(false);

const setError = createEvent();
const setValue = createEvent();

$value.on(setValue, (_, value) => value);
$error.on(setError, () => true).on(setValue, () => false);

condition({
  source: inputChanged,
  if: isValid,
  then: setValue,
  else: setError,
});

function isValid(value) {
  return value.trim().length > 0;
}
```

### Condition can be nested

```ts
const $value = createStore('hello@world');
const updateEmail = createEvent<string>();

condition({
  source: $value,
  if: (length) => length > 0,
  then: condition({
    if: (string) => string.includes('@'),
    then: updateEmail,
  }),
});
```
