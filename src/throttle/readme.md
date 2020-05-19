# Patronum/Throttle

```ts
import { throttle } from 'patronum/throttle';
```

## Example

```ts
import { createEvent } from 'effector';
import { throttle } from 'patronum/throttle';

const THROTTLE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const throttled = createThrottle(someHappened, THROTTLE_TIMEOUT_IN_MS);

throttled.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);
```
