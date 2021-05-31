import { expectType } from 'tsd';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  Effect,
  Event,
  Store,
} from 'effector';
import { condition } from '../src/condition';

// Correct pass type from source to then, else, and if
{
  const $source = createStore(0);

  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (a) => a === 1,
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );

  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: (value: number) => value === 0,
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );

  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore<boolean>(false),
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore<boolean>(false),
      else: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: $source,
      if: createStore<boolean>(false),
      then: createEvent<number>(),
      else: createEvent<number>(),
    }),
  );
}

// Source can be any unit and correctly returns its type
{
  expectType<Store<string>>(
    condition({
      source: createStore(''),
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
  expectType<Effect<string, number, boolean>>(
    condition({
      source: createEffect<string, number, boolean>(),
      if: (a) => a === '',
      then: createEvent<string>(),
    }),
  );
}

// Then and Else can be void
{
  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<string>(),
      else: createEvent<void>(),
    }),
  );

  expectType<Event<string>>(
    condition({
      source: createEvent<string>(),
      if: (a) => a === '',
      then: createEvent<void>(),
      else: createEvent<void>(),
    }),
  );
}

// Infer type of source from result type
{
  expectType<Store<string>>(
    condition({
      source: createStore(''),
      if: (a: string) => true,
      then: condition({
        if: (a) => typeof a === 'string',
        then: createEvent(),
      }),
    }),
  );
}

// If can be Store, function, or value
{
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: (v) => v === 1,
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: createStore<boolean>(true),
      then: createEvent<number>(),
    }),
  );
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: (value: number) => value === 1,
      then: createEvent<number>(),
    }),
  );
  const source = createStore(0);
  const another = createStore(0);
  expectType<Store<number>>(
    condition({
      source,
      if: combine(source, another, (a, b) => a === b),
      then: createEvent<number>(),
    }),
  );
}

{
  expectType<Store<number>>(
    condition({
      source: createStore(0),
      if: 1,
      then: createEvent<number>(),
    }),
  );

  expectType<Store<string>>(
    condition({
      source: createStore('hi'),
      if: 'hi',
      then: createEvent<string>(),
    }),
  );

  expectType<Store<boolean>>(
    condition({
      source: createStore(true),
      if: true,
      then: createEvent<boolean>(),
    }),
  );
}

// Disallow pass invalid type to then/else
{
  condition({
    // @ts-expect-error
    source: createStore(0),
    if: 0,
    then: createEvent<string>(),
  });

  condition({
    // @ts-expect-error
    source: createStore<boolean>(false),
    if: console,
    then: createEvent(),
  });

  condition({
    // @ts-expect-error
    source: createStore<string>(''),
    if: (a) => 1,
    then: createEvent(),
  });
}

// Check source: void and if: Store<bool>
// https://github.com/effector/patronum/issues/81
{
  const fxVoid = createEffect<void, void, void>();
  const fxOtherVoid = createEffect<void, void, void>();
  const someEvent = createEvent<void>();
  const boolStore = createStore<boolean>(true);

  condition({
    source: someEvent,
    if: boolStore,
    then: fxVoid,
    else: fxOtherVoid,
  });
}
