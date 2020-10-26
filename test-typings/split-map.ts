import { expectType } from 'tsd';
import { Store, Event, createStore, createEvent, createEffect } from 'effector';
import { splitMap } from '../src/split-map';

// Allow any unit as source
{
  const event = createEvent<number>();
  const $store = createStore(0);
  const effect = createEffect<string, void>();

  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: event,
      cases: {
        demo: () => true,
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<number> }>(
    splitMap({
      source: $store,
      cases: {
        demo: () => true,
      },
    }),
  );
  expectType<{ demo: Event<boolean>; __: Event<string> }>(
    splitMap({
      source: effect,
      cases: {
        demo: () => true,
      },
    }),
  );
}

// Has default case
{
  expectType<{ __: Event<number> }>(
    splitMap({ source: createEvent<number>(), cases: {} }),
  );
  expectType<{ __: Event<{ demo: number }> }>(
    splitMap({ source: createEvent<{ demo: number }>(), cases: {} }),
  );
}

// Omit undefined from object type
{
  interface Payload {
    key?: string;
  }
  const source = createEvent<Payload>();

  expectType<{ example: Event<string>; __: Event<Payload> }>(
    splitMap({
      source,
      cases: {
        example: (object) => object.key,
      },
    }),
  );
}
