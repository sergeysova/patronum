import { expectType } from 'tsd';
import {
  Store,
  Event,
  Effect,
  createStore,
  createEvent,
  createEffect,
  createDomain,
} from 'effector';
import { reshape } from '../src/reshape';

// Reshapes store with string
{
  const $original = createStore<string>('example');
  expectType<{
    length: Store<number>;
    lowercase: Store<string>;
    hasSpace: Store<boolean>;
  }>(
    reshape({
      source: $original,
      shape: {
        length: (string) => string.length,
        lowercase: (string) => string.toLowerCase(),
        hasSpace: (string) => string.includes(' '),
      },
    }),
  );
}

// Do not allows domain, event and effect
{
  const domain = createDomain();
  const event = createEvent();
  const effect = createEffect();

  // @ts-expect-error
  reshape({ source: domain, shape: {} });
  // @ts-expect-error
  reshape({ source: event, shape: {} });
  // @ts-expect-error
  reshape({ source: effect, shape: {} });
}

// Allows value | undefined
{
  const source = createStore<{ first: string; second?: number }>({ first: '' });

  const shape = reshape({
    source,
    shape: {
      first: (data) => data.first,
      second: (data) => data.second,
    },
  });

  expectType<{ first: Store<string>; second: Store<number | null> }>(shape);
}
