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

// Check receive effects with strategy
{
  const fx1 = createEffect<void, void>();
  const fx2 = createEffect<number, boolean>();
  const fx3 = createEffect<string, number>();

  expectType<Store<boolean>>(pending({ effects: [fx1, fx2, fx3], of: 'some' }));
  expectType<Store<boolean>>(pending({ effects: [fx1, fx2, fx3], of: 'every' }));
}

// Fails on invalid units
{
  const event = createEvent<void>();
  const store = createStore<number>(0);
  const domain = createDomain();

  // @ts-expect-error
  pending({ effects: [event, store, domain] });
}

// Accept domain
{
  const domain = createDomain();

  expectType<Store<boolean>>(pending({ domain }));
}

// Accept domain with strategy
{
  const domain = createDomain();

  expectType<Store<boolean>>(pending({ domain, of: 'some' }));
  expectType<Store<boolean>>(pending({ domain, of: 'every' }));
}

// Do not allow invalid strategy
{
  const domain = createDomain();

  // @ts-expect-error
  expectType<Store<boolean>>(pending({ domain, of: 'failed' }));
}
