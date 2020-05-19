# Patronum/Debounce

```ts
import { debounce } from 'patronum/debounce';
```

## Example

```ts
import { createEvent } from 'effector';
import { debounce } from 'patronum/debounce';

const DEBOUNCE_TIMEOUT_IN_MS = 200;

const someHappened = createEvent<number>();
const debounced = debounce(someHappened, DEBOUNCE_TIMEOUT_IN_MS);

debounced.watch((payload) => {
  console.info('someHappened now', payload);
});

someHappened(1);
someHappened(2);
someHappened(3);
someHappened(4);

// someHappened now 4
```
