import { Store } from 'effector';

export function reshape<T, S extends {}>(
  store: Store<T>,
  shape: { [K in keyof S]: (v: T) => S[K] },
): { [K in keyof S]: Store<S[K]> };
