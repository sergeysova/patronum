# Patronum/Debug

```ts
import { debug } from 'patronum/debug';
```

It is helpful to debug your application's logic.

Just pass any effector's unit to `debug`.

## Motivation

Sometimes during development, it is necessary to display the value of the stores and payload of events, each time you write `console.log` inside `.watch` and copy/paste it is unpleasant. `debug` allows you to speed up this process a lot by passing all the necessary units for a debugging into a method arguments.

## Example

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
