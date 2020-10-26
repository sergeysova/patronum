import { expectType } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
} from 'effector';
import { throttle } from '../src/throttle';

// Returns the same type as source
{
  const $source = createStore(0);
  expectType<Event<number>>(throttle({ source: $source, timeout: 10 }));

  const source = createEvent<string>();
  expectType<Event<string>>(throttle({ source, timeout: 10 }));

  const sourceUnion = createEvent<'demo' | 'another'>();
  expectType<Event<'demo' | 'another'>>(
    throttle({ source: sourceUnion, timeout: 10 }),
  );

  const sourceFx = createEffect<boolean, void>();
  expectType<Event<boolean>>(throttle({ source: sourceFx, timeout: 10 }));
}

// Source should be unit
{
  // @ts-expect-error
  throttle({ timeout: 10 });
  // @ts-expect-error
  throttle({ timeout: 10, source: null });
  // @ts-expect-error
  throttle({ timeout: 10, source: undefined });
  // @ts-expect-error
  throttle({ timeout: 10, source: true });
  // @ts-expect-error
  throttle({ timeout: 10, source: 'f' });
  // @ts-expect-error
  throttle({ timeout: 10, source: Symbol() });
  // @ts-expect-error
  throttle({ timeout: 10, source: () => {} });
  // @ts-expect-error
  throttle({ timeout: 10, source: {} });
  // @ts-expect-error
  throttle({ timeout: 10, source: [] });
}

// Timeout should be only number
{
  const source = createEvent();
  expectType<Event<void>>(throttle({ source, timeout: 10 }));

  // @ts-expect-error
  throttle({ source });
  // @ts-expect-error
  throttle({ source, timeout: null });
  // @ts-expect-error
  throttle({ source, timeout: undefined });
  // @ts-expect-error
  throttle({ source, timeout: true });
  // @ts-expect-error
  throttle({ source, timeout: 'f' });
  // @ts-expect-error
  throttle({ source, timeout: Symbol() });
  // @ts-expect-error
  throttle({ source, timeout: () => {} });
  // @ts-expect-error
  throttle({ source, timeout: {} });
  // @ts-expect-error
  throttle({ source, timeout: [] });
}

// Source and target should be compatible
// Returns the same type as target
{
  expectType<Event<number>>(
    throttle({
      source: createStore(0),
      timeout: 10,
      target: createEvent<number>(),
    }),
  );

  expectType<Effect<string, void>>(
    throttle({
      source: createStore(''),
      timeout: 10,
      target: createEffect<string, void>(),
    }),
  );

  expectType<Store<string>>(
    throttle({
      source: createEffect<string, void>(),
      timeout: 10,
      target: createStore(''),
    }),
  );
}

// Name argument is a string without target
{
  const source = createEvent();
  expectType<Event<void>>(throttle({ source, timeout: 10 }));
  expectType<Event<void>>(throttle({ source, timeout: 10, name: undefined }));
  expectType<Event<void>>(throttle({ source, timeout: 10, name: 'demo' }));

  // @ts-expect-error
  throttle({ source, timeout: 10, name: null });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: true });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: Symbol() });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: 6 });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: () => {} });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: {} });
  // @ts-expect-error
  throttle({ source, timeout: 10, name: [] });
}

// Name argument is a string with target
{
  const source = createEvent<number>();
  const target = createStore(0);
  expectType<Store<number>>(throttle({ source, target, timeout: 10 }));
  expectType<Store<number>>(
    throttle({ source, target, timeout: 10, name: undefined }),
  );
  expectType<Store<number>>(
    throttle({ source, target, timeout: 10, name: 'demo' }),
  );

  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: null });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: true });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: Symbol() });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: 6 });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: () => {} });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: {} });
  // @ts-expect-error
  throttle({ source, target, timeout: 10, name: [] });
}
