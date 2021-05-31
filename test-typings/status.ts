import { expectType } from 'tsd';
import {
  Store,
  createEffect,
  createStore,
  createEvent,
  createDomain,
} from 'effector';
import { status, EffectState } from '../src/status';

// Check that accepts only effect
{
  expectType<Store<EffectState>>(status({ effect: createEffect<number, string>() }));

  // @ts-expect-error
  status({ effect: createEvent() });
  // @ts-expect-error
  status({ effect: createStore(0) });
  // @ts-expect-error
  status({ effect: createDomain() });
}

// Check that accept effect with fail type
{
  const fx = createEffect<number, boolean, string>();

  expectType<Store<EffectState>>(status({ effect: fx }));
}
