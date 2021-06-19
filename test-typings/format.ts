import { expectType } from 'tsd';
import {
  Store,
  createStore,
  createEffect,
  createEvent,
  createDomain,
} from 'effector';
import { format } from '../format';

// checks that accepts only store and primitives
{
  expectType<Store<string>>(format`store: ${createStore('')}`);

  expectType<Store<string>>(format`primitive: ${'primitive'}`);

  // @ts-expect-error
  format`event: ${createEvent()}`;

  // @ts-expect-error
  format`effect: ${createEffect()}`;

  // @ts-expect-error
  format`domain: ${createDomain()}`;
}

// checks that accepts different store types
{
  expectType<Store<string>>(format`store: ${createStore('')}`);

  expectType<Store<string>>(format`store: ${createStore(0)}`);
}

// checks that accepts multiple different store types
{
  expectType<Store<string>>(
    format`first store: ${createStore('')}, second store: ${createStore(0)}`,
  );

  expectType<Store<string>>(
    format`store: ${createStore('')}, primitive: ${'primitive'}`,
  );
}
