import { expectType } from 'tsd';
import {
  Store,
  Event,
  createStore,
  createEvent,
  createEffect,
  sample,
} from 'effector';
import { splitMap } from '../src/split-map';

// partial destructuring throws an error #71
{
  const $settings = createStore({
    MIN_LVL: 42,
  });

  const someEvt = createEvent<{ lvl: number }>();

  const happened = sample({
    source: $settings,
    clock: someEvt,
    fn: (settings, payload) => ({ settings, payload }),
  });

  const { highLvl, lowLvl } = splitMap({
    source: happened,
    cases: {
      highLvl: ({ payload }) => (payload.lvl >= 50 ? payload.lvl : undefined),
      lowLvl: ({ settings, payload }) =>
        payload.lvl < settings.MIN_LVL ? payload.lvl : undefined,
    },
  });

  expectType<Event<number>>(highLvl);
  expectType<Event<number>>(lowLvl);
}

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
