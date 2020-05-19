# Patronum/Condition

```ts
import { condition } from 'patronum/condition';
```

## Formulae

```ts
condition({
  source,
  if: condition,
  then: unit,
  else: unit,
});
```

- When `source` triggered, check `if` condition
- If `if` is **truthy**, trigger `then` unit
- If `if` is **falsy**, trigger `else` unit

## Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Data from this unit should be passed to `if`, `then` and `else`
1. `if` _(`(payload: T) => boolean` | `Store<boolean>` | `T`)_ — Checker, if truthy trigger `then` branch, if falsy trigger `else` branch
1. `then` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Optional unit
1. `else` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Optional unit

## Example

### Checker is function

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

### Checker is Store

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

### Checker is literal

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
