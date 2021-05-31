import { Unit, Event, Store } from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function delay<T>(_: {
  source: Unit<T>;
  timeout: (payload: T) => number;
  target?: Unit<T>;
}): EventAsReturnType<T>;
export function delay<T>(_: {
  source: Unit<T>;
  timeout: Store<number> | number;
  target?: Unit<T>;
}): EventAsReturnType<T>;
