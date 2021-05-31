import { Store } from 'effector';

export function every<T>(_: {
  predicate: (value: T) => boolean;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function every<T extends string>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function every<T>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;
