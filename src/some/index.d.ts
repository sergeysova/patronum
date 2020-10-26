import { Store } from 'effector';

export function some<T>(_: {
  predicate: (value: T) => boolean;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function some<T extends string>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;

export function some<T>(_: {
  predicate: T;
  stores: Array<Store<T>>;
}): Store<boolean>;
