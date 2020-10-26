import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createEvent,
  createEffect,
  createDomain,
} from 'effector';
import { inFlight } from '../src/in-flight';

// Check receive effects
{
  const fx1 = createEffect<void, void>();
  const fx2 = createEffect<number, boolean>();
  const fx3 = createEffect<string, number>();

  expectType<Store<number>>(inFlight({ effects: [fx1, fx2, fx3] }));
}

// Fails on invalid units
{
  const event = createEvent<void>();
  const store = createStore<number>(0);
  const domain = createDomain();

  // @ts-expect-error
  inFlight({ effects: [event, store, domain] });
}

// Check receive domain
{
  const app = createDomain();
  const fx1 = app.createEffect<void, void>();
  const fx2 = app.createEffect<number, boolean>();
  const fx3 = app.createEffect<string, number>();

  expectType<Store<number>>(inFlight({ domain: app }));
}
