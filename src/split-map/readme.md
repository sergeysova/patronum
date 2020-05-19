# Patronum/SplitMap

```ts
import { splitMap } from 'patronum/split-map';
```

> No formulae yet

> No arguments yet

## Example

```ts
import { createEvent } from 'effector';
import { splitMap } from 'patronum/split-map';

const event = createEvent<object>();

const extractors = splitMap(event, {
  getType: (input) => input.type,
  getDemo: (input) => input.demo,
});

extractors.getType.watch((type) => console.log('TYPE', type));
extractors.getDemo.watch((demo) => console.log('DEMO', demo));
extractors.__.watch((other) => console.log('OTHER', other));

event({ type: 'demo' });
// => TYPE demo

event({ demo: 5 });
// => DEMO 5

event({});
// => OTHER {}
```
