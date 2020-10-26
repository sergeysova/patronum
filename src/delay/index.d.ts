import { Unit, Event, Store } from 'effector';

export function delay<T>(_: {
  source: Unit<T>;
  timeout: (payload: T) => number;
}): Event<T>;
export function delay<T>(_: {
  source: Unit<T>;
  timeout: Store<number> | number;
}): Event<T>;
