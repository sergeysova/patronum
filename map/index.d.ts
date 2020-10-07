import { Event, Store, Effect } from 'effector';

export function map<A, B>(config: {
  source: Store<A>;
  fn: (source: A) => B;
}): Store<B>;

export function map<A, B>(config: {
  source: Event<A>;
  fn: (source: A) => B;
}): Event<B>;

export function map<A, B, D, F = Error>(config: {
  source: Effect<A, D, F>;
  fn: (source: A) => B;
}): Event<B>;
