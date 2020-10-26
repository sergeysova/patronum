import { expectType } from 'tsd';
import { createEvent, createDomain, createEffect, createStore } from 'effector';
import { debug } from '../src/debug';

// Allows each unit of effector
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();
  expectType<void>(debug(event, $store, fx, domain));
}

// Allows single argument
{
  const event = createEvent<number>();
  const $store = createStore('');
  const fx = createEffect<boolean, void, number>();
  const domain = createDomain();

  debug(event);
  debug($store);
  debug(fx);
  debug(domain);
}
