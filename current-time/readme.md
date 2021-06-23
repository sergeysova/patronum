# Patronum/CurrentTime

```ts
import { currentTime } from 'patronum/current-time';
```

## `now = currentTime({ start, stop, interval })`

### Motivation

This method creates store with automatically updated current `Date`.
It useful when you want to show timers and dates in UI, or add current time to some effects as argument.

### Formulae

```ts
now = currentTime({ start, stop });
```

- Start store updates after `start` triggered, stop updates after `stop` triggered.
- Use `interval` as update interval.

### Arguments

1. `start` ([_`Store`_]) — Event for start updates
2. `stop` ([_`Event`_]) — Event for stop updates
3. `interval` _(`number`)_ — Custom updates interval

### Returns

- `result` ([_`Store`_]) — Store with current `Date`

[_`event`_]: https://effector.dev/docs/api/effector/event
[_`effect`_]: https://effector.dev/docs/api/effector/effect
[_`store`_]: https://effector.dev/docs/api/effector/store

### Examples

#### Create simple time store

```ts
import { createEvent } from 'effector';
import { currentTime } from 'patronum/current-time';

const start = createEvent();
const stop = createEvent();

const $now = currentTime({ start, stop });

start();

// $now will recieve updates every 100ms
```

#### Use custom updates interval

```ts
import { createEvent } from 'effector';
import { currentTime } from 'patronum/current-time';

const start = createEvent();
const stop = createEvent();

const $now = currentTime({ start, stop, interval: 1000 });

start();

// wait for 1000ms
// $now updated
```

#### Stop updates on trigger

```ts
import { createEvent } from 'effector';
import { currentTime } from 'patronum/current-time';

const start = createEvent();
const stop = createEvent();

const $now = currentTime({ start, stop });

start();

// do some stuff

stop();

// $now will NOT recieve eny updates
```
