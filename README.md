# effecto patronum ✨

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](http://prettier.io) ![Node.js CI](https://github.com/sergeysova/patronum/workflows/Node.js%20CI/badge.svg)

☄️ Effector utility library delivering modularity and convenience

## Table of contents

- [Condition](#condition)
- [Debounce](#debounce)
- [Debug](#debug)
- [Delay](#delay)
- [Spread](#spread)
- [Status](#status)
- [Throttle](#throttle)

---

- [Reshape](#reshape)
- [SplitMap](#splitmap)

## Usage

```bash
npm install patronum
# or
yarn add patronum
```

Import function by its name from `patronum`:

```ts
import { delay } from 'patronum/delay';
```

Also use can import it from index:

> Be careful, with this method, all functions will be at your bundle

```ts
import { delay } from 'patronum';
```

## [Condition](/src/condition 'Documentation')

```ts
import { createEvent } from 'effector';
import { condition } from 'patronum/condition';

const trigger = createEvent<string>();

const longString = createEvent<string>();
const shortString = createEvent<string>();

condition({
  source: trigger,
  if: (string) => string.length > 8,
  then: longString,
  else: shortString,
});
```

## [Delay](/src/delay 'Documentation')

```ts
import { createEvent } from 'effector';
import { delay } from 'patronum/delay';

const trigger = createEvent<string>(); // createStore or createEffect
const delayed = delay(trigger, 300);

delayed.watch((payload) => console.info('triggered', payload));

trigger('hello');
// after 300ms
// => triggered hello
```

## [Debounce](/src/debounce 'Documentation')

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

// You should call this event
const trigger = createEvent<number>();

const target = debounce(trigger, 200);

target.watch((payload) => console.info('debounced', payload));

trigger(1);
trigger(2);
trigger(3);
trigger(4);
// after 200ms
// => debounced 4
```

## [Throttle](/src/throttle 'Documentation')

```ts
import { createEvent } from 'effector';
import { throttle } from 'patronum/throttle';

// You should call this event
const trigger = createEvent<number>();

const target = throttle(trigger, 200);

target.watch((payload) => console.info('throttled', payload));

trigger(1);
trigger(2);
trigger(3);
trigger(4);
// 200ms after trigger(1)
// => throttled 1
```

## [Debug](/src/debug 'Documentation')

```ts
import { createStore, createEvent, createEffect } from 'effector';
import { debug } from 'patronum/debug';

const event = createEvent();
const effect = createEffect().use((payload) =>
  Promise.resolve('result' + payload),
);
const $store = createStore(0)
  .on(event, (state, value) => state + value)
  .on(effect.done, (state) => state * 10);

debug($store, event, effect);

event(5);
effect('demo');

// => [store] $store 1
// => [event] event 5
// => [store] $store 6
// => [effect] effect demo
// => [effect] effect.done {"params":"demo", "result": "resultdemo"}
// => [store] $store 60
```

## [Status](/src/status 'Documentation')

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

## [Spread](/src/spread 'Documentation')

```ts
import { createEvent, createStore } from 'effector';
import { spread } from 'patronum/spread';

const trigger = createEvent<{ first: string; second: string }>();

const $first = createStore('');
const $second = createStore('');

spread(trigger, {
  first: $first,
  second: $second,
});

trigger({ first: 'Hello', second: 'World' });

$first.getState(); // "Hello"
$second.getState(); // "World"
```

---

## [Reshape](/src/reshape 'Documentation')

> No tests yet

```ts
import { createStore } from 'effector';
import { reshape } from 'patronum/reshape';

const $original = createStore<string>('Hello world');

const parts = reshape($original, {
  length: (string) => string.length,
  first: (string) => string.split(' ')[0] || '',
  second: (string) => string.split(' ')[1] || '',
});

parts.length.watch(console.info); // 11
parts.first.watch(console.log); // "Hello"
parts.second.watch(console.log); // "Second"
```

## [SplitMap](/src/split-map 'Documentation')

> No tests yet

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

const nameReceived = createEvent<string>();

const received = splitMap(nameReceived, {
  firstName: (string) => string.split(' ')[0], // string | undefined
  lastName: (string) => string.split(' ')[1], // string | undefined
});

received.firstName.watch((first) => console.info('firstname received', first));
received.lastName.watch((last) => console.info('lastname received', last));

nameReceived('Sergey');
// firstname received "Sergey"

nameReceived('Sergey Sova');
// firstname received "Sergey"
// lastname received "Sova"
```
