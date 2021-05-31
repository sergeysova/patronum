import { Unit, Store, Event, Effect } from 'effector';

/**
 * Non inferential type parameter usage.
 *
 * @see https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546
 */
// type NoInfer<T> = [T][T extends any ? 0 : never];
type NoInfer<T> = T & { [K in keyof T]: T[K] };
type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
  else: Unit<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<State | void>;
  else: Unit<State | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  then: Unit<NoInfer<Params> | void>;
  else: Unit<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  then: Unit<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

export function condition<State>(options: {
  source: Event<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: Unit<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  source: Store<State>;
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: Unit<NoInfer<State> | void>;
}): Store<State>;
export function condition<Params, Done, Fail>(options: {
  source: Effect<Params, Done, Fail>;
  if: ((payload: Params) => boolean) | Store<boolean> | Params;
  else: Unit<NoInfer<Params> | void>;
}): Effect<Params, Done, Fail>;

// Without `source`

export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
  else: Unit<NoInfer<State> | void>;
}): EventAsReturnType<State>;
export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  then: Unit<NoInfer<State> | void>;
}): Event<State>;
export function condition<State>(options: {
  if: ((payload: State) => boolean) | Store<boolean> | State;
  else: Unit<NoInfer<State> | void>;
}): Event<State>;
