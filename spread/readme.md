# Patronum/Spread

```ts
import { spread } from 'patronum/spread';
```

## `spread({ source, targets })`

### Formulae

```ts
spread({ source, targets: { field: target, ... } })
```

- When `source` is triggered with **object**, extract `field` from source, and trigger `target`
- `targets` can have multiple properties
- If `source` is triggered with not object, nothing will be happen.
- If `source` is triggered with object but without required property `field`, target for this `field` will not be triggered

### Arguments

1. `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data passed to it should be an object with fields from `targets`
2. `targets` _(`Record<string, Event<T> | Store<T> | Effect<T>>`)_ — Flat object which key is key in `source` payload, and value is unit to store value to.

### Example

#### Save fields of payload to different stores

```ts
import { createStore, createEvent } from 'effector';
import { spread } from 'patronum/spread';

const $first = createStore('');
const $last = createStore('');

const formReceived = createEvent();

spread({
  source: formReceived,
  targets: {
    first: $first,
    last: $last,
  },
});

$first.watch((first) => console.log('First name', first));
$last.watch((last) => console.log('Last name', last));

formReceived({ first: 'Sergey', last: 'Sova' });
// => First name Sergey
// => Last name Sova

formReceived({ first: 'Patronum' });
// => First name Patronum
```

#### Call events on store changes

```ts
import { createStore, createEvent } from 'effector';
import { spread } from 'patronum/spread';

const save = createEvent();
const $form = createStore(null).on(save, (_, form) => form);

const firstNameChanged = createEvent();
const lastNameChanged = createEvent();

spread({
  source: $form,
  targets: {
    first: firstNameChanged,
    last: lastNameChanged,
  },
});

firstNameChanged.watch((first) => console.log('First name', first));
lastNameChanged.watch((last) => console.log('Last name', last));

save({ first: 'Sergey', last: 'Sova' });
// => First name Sergey
// => Last name Sova

save(null);
// Nothing, because store is null
```

## `spread({ targets })`

```ts
source = spread({ targets: { field: target, ... } })
```

- When `source` is triggered with **object**, extract `field` from data, and trigger `target`
- `targets` can have multiple properties
- If `source` is triggered with not object, nothing will be happen.
- If `source` is triggered with object but without propertpy `field`, target for this `field` will not be triggered

### Arguments

1. `targets` _(`Record<string, Event<T> | Store<T> | Effect<T>>`)_ — Flat object which key is key in `source` payload, and value is unit to store value to.

### Returns

- `source` _(`Event<T>` | `Store<T>` | `Effect<T>`)_ — Source unit, data passed to it should be an object with fields from `targets`

### Example

#### Conditionally save value to stores

```ts
import { createStore, createEvent, guard } from 'effector';
import { spread } from 'patronum/spread';

const $first = createStore('');
const $last = createStore('');

const formReceived = createEvent();

guard({
  source: formReceived,
  filter: (form) => form.first.length > 0 && form.last.length > 0,
  target: spread({
    targets: {
      first: $first,
      last: $last,
    },
  }),
});

// Or the same

spread({
  source: guard({
    source: formReceived,
    filter: (form) => form.first.length > 0 && form.last.length > 0,
  }),
  targets: {
    first: $first,
    last: $last,
  },
});

$first.watch((first) => console.log('First name', first));
$last.watch((last) => console.log('Last name', last));

formReceived({ first: '', last: '' });
// Nothing, because filter returned true

formReceived({ first: 'Hello', last: 'World' });
// => First name Hello
// => Last name World
```

#### Nested spreading

```ts
const trigger = createEvent();

const $targetA = createStore('');
const $targetB = createStore(0);
const $targetC = createStore(false);

spread({
  source: trigger,
  targets: {
    first: $targetA,
    second: spread({
      targets: {
        foo: $targetB,
        bar: $targetC,
      },
    }),
  },
});

$targetA.watch((payload) => console.log('targetA', payload));
$targetB.watch((payload) => console.log('targetB', payload));
$targetC.watch((payload) => console.log('targetC', payload));

trigger({
  first: 'Hello',
  second: {
    foo: 200,
    bar: true,
  },
});
// => targetA Hello
// => targetB 200
// => targetC true
```
