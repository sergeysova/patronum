# Patronum/Format

```ts
import { format } from 'patronum/format';
```

### Motivation

### Formulae

### Arguments

### Returns

### Example

```ts
import { createStore } from 'effector';
import { format } from 'patronum';

const $firstName = createStore('John');
const $lastName = createStore('Doe');

const $fullName = format`${$firstName} ${$lastName}`;
```
