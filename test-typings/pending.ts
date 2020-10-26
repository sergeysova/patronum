import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createEvent,
  createEffect,
  createDomain,
} from 'effector';
import { pending } from '../src/pending';

// Check receive effects
{
  const fx1 = createEffect<void, void>();
  const fx2 = createEffect<number, boolean>();
  const fx3 = createEffect<string, number>();

  expectType<Store<boolean>>(pending({ effects: [fx1, fx2, fx3] }));
}

// Fails on invalid units
{
  const event = createEvent<void>();
  const store = createStore<number>(0);
  const domain = createDomain();

  // @ts-expect-error
  pending({ effects: [event, store, domain] });
}
