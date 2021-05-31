import { expectType, expectError } from 'tsd';
import { Store, createStore } from 'effector';
import { every } from '../src/every';

// Check invalid type for number predicate
{
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(every({ predicate: 0, stores: [$a, $b] }));

  // @ts-expect-error
  every({ predicate: 0, stores: [$a, $invalid] });
}

// Check types for string enum
{
  type Enum = 'a' | 'b' | 'c';
  const $a = createStore<Enum>('a');
  const $b = createStore<Enum>('c');
  const $invalid = createStore('d');

  const value: Enum = 'c';

  expectType<Store<boolean>>(every({ predicate: value, stores: [$a, $b] }));
  expectType<Store<boolean>>(
    every({ predicate: (c) => c === 'c', stores: [$a, $b] }),
  );

  // @ts-expect-error
  every({ predicate: value, stores: [$a, $invalid] });
  // @ts-expect-error
  every({ predicate: 'demo', stores: [$a, $b] });
  // @ts-expect-error
  every({ predicate: (v) => v === 'demo', stores: [$a, $b] });
}

// Check function predicate
{
  const predicate = (value: number) => value > 0;
  const $a = createStore(0);
  const $b = createStore(1);
  const $invalid = createStore('');

  expectType<Store<boolean>>(every({ predicate, stores: [$a, $b] }));

  // @ts-expect-error
  every({ predicate, stores: [$a, $invalid] });
}
