import { expectType } from 'tsd';
import {
  Event,
  Store,
  Effect,
  createEvent,
  createStore,
  createEffect,
} from 'effector';
import { combineEvents } from '../src/combine-events';

// Check simple combine of different events
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
  }

  const target = combineEvents({
    events: { foo, bar, baz },
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<{ foo: string; bar: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{ foo: string; bar: number; baz: number }> = target;
}

// With object
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();
  const bai = createEvent<{ foo: string }>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
    bai: { foo: string };
  }

  const target = combineEvents({
    events: { foo, bar, baz, bai },
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<{ foo: string; bar: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{ foo: string; bar: number; baz: number }> = target;

  // @ts-expect-error
  const _fail2: Event<{
    foo: string;
    bar: number;
    baz: number;
    bai: { demo: string };
  }> = target;
}

// Array combiner
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  type Target = [string, number, boolean];

  const target = combineEvents({
    events: [foo, bar, baz],
  });

  expectType<Event<Target>>(target);

  // @ts-expect-error
  const _fail1: Event<[string, number]> = target;

  // @ts-expect-error
  const _fail2: Event<[string, number, number]> = target;
}

// With target event

// Check simple combine of different events
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  const target = createEvent<{
    foo: string;
    bar: number;
    baz: boolean;
  }>();

  combineEvents({
    events: { foo, bar, baz },
    target,
  });

  combineEvents({
    events: { foo, bar, baz },
    target: createEvent<{ foo: string; bar: number }>(),
  });

  // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz },
    target: createEvent<{ foo: string; bar: number; baz: number }>(),
  });
}

// With object
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();
  const bai = createEvent<{ foo: string }>();

  const target = createEvent<{
    foo: string;
    bar: number;
    baz: boolean;
    bai: { foo: string };
  }>();

  combineEvents({
    events: { foo, bar, baz, bai },
    target,
  });

  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{ foo: string; bar: number }>(),
  });

  // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{ foo: string; bar: number; baz: number }>(),
  });

  // @ts-expect-error
  combineEvents({
    events: { foo, bar, baz, bai },
    target: createEvent<{
      foo: string;
      bar: number;
      baz: number;
      bai: { demo: string };
    }>(),
  });
}

// Array combiner
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  const target = createEvent<[string, number, boolean]>();

  combineEvents({
    events: [foo, bar, baz],
    target,
  });

  // @ts-expect-error
  combineEvents({
    events: [foo, bar, baz],
    target: createEvent<[string, number, number]>(),
  });

  // @ts-expect-error
  combineEvents({
    events: [foo, bar, baz],
    target: createEvent<[string]>(),
  });
}

// Check target Event
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
  }

  const target = createEvent<Target>();

  const event = combineEvents({
    events: { foo, bar, baz },
    target,
  });

  expectType<Event<Target>>(event);
}

// Check target Store
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
  }

  const target = createStore<Target>({
    foo: 'string',
    bar: 1,
    baz: true,
  });

  const store = combineEvents({
    events: { foo, bar, baz },
    target,
  });

  expectType<Store<Target>>(store);
}

// Check target Effect
{
  const foo = createEvent<string>();
  const bar = createEvent<number>();
  const baz = createEvent<boolean>();

  interface Target {
    foo: string;
    bar: number;
    baz: boolean;
  }

  const target = createEffect<Target, void>({
    handler: () => {},
  });

  const effect = combineEvents({
    events: { foo, bar, baz },
    target,
  });

  expectType<Effect<Target, void>>(effect);
}
