import { expectType } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
} from 'effector';
import { spread } from '../src/spread';

{
  const $source = createStore({ first: '', last: '' });
  const first = createEvent<string>();
  const last = createEvent<string>();

  expectType<Store<{ first: string; last: string }>>(
    spread({
      source: $source,
      targets: {
        first,
        last,
      },
    }),
  );
}

// Expect matching object types
{
  // @ts-expect-error
  spread({
    source: createEvent<{ first: string; last: string }>(),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });

  // @ts-expect-error
  spread({
    source: createStore({ first: '', last: '' }),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });

  // @ts-expect-error
  spread({
    source: createEffect<{ first: string; last: string }, void>(),
    targets: {
      first: createEvent<string>(),
      last: createEvent<number>(),
    },
  });
}

// Check input source type with output
{
  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );

  expectType<Store<{ random: string; bar: number }>>(
    spread({
      source: createStore({ random: '', bar: 5 }),
      targets: {
        random: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number }, void>(),
      targets: {
        foo: createEvent<string>(),
        bar: createEvent<number>(),
      },
    }),
  );
}

// Check target different units
{
  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );

  expectType<Store<{ foo: string; bar: number }>>(
    spread({
      source: createStore({ foo: '', bar: 5 }),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );

  expectType<Effect<{ foo: string; bar: number }, void>>(
    spread({
      source: createEffect<{ foo: string; bar: number }, void>(),
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
      },
    }),
  );
}

// Check target is prepended
{
  const foo = createEvent<number>();

  expectType<Event<{ foo: string; bar: number }>>(
    spread({
      source: createEvent<{ foo: string; bar: number }>(),
      targets: {
        foo: foo.prepend((string) => string.length),
        bar: createEvent<number>(),
      },
    }),
  );
}

// Check target different units without source
{
  expectType<Event<{ foo: string; bar: number; baz: boolean }>>(
    spread({
      targets: {
        foo: createStore(''),
        bar: createEffect<number, void>(),
        baz: createEvent<boolean>(),
      },
    }),
  );
}

// Example from readme with nullability
{
  interface Form {
    first: string;
    last: string;
  }

  const save = createEvent<Form | null>();
  const $form = createStore<Form | null>(null).on(save, (_, form) => form);

  const firstNameChanged = createEvent<string>();
  const lastNameChanged = createEvent<string>();

  spread({
    source: $form,
    targets: {
      first: firstNameChanged,
      last: lastNameChanged,
    },
  });
}

// Allow partial
{
  spread({
    source: createEvent<{ first: string; last: string }>(),
    targets: {
      first: createEvent<string>(),
    },
  });
  spread({
    source: createStore({ foo: '', bar: 5 }),
    targets: {
      foo: createEvent<string>(),
    },
  });
  spread({
    source: createEffect<{ first: string; last: string }, void>(),
    targets: {
      first: createEvent<string>(),
    },
  });
}
