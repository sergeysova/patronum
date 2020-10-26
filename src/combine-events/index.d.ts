import { Unit, Store, Event, Effect } from 'effector';

type Tuple<T = unknown> = [T] | T[];
type Shape = Record<string, unknown> | Tuple;

type Events<Result> = {
  [Key in keyof Result]: Event<Result[Key]>;
};

type ReturnTarget<Result, Target> = Target extends Store<infer S>
  ? S extends Result
    ? Store<S>
    : Store<Result>
  : Target extends Event<infer P>
  ? P extends Result
    ? Event<P>
    : Event<Result>
  : Target extends Effect<infer P, infer D, infer F>
  ? P extends Result
    ? Effect<P, D, F>
    : Effect<Result, D, F>
  : Unit<Result>;

export function combineEvents<P extends Shape>(config: {
  events: Events<P>;
  reset?: Unit<any>;
}): Event<P>;

export function combineEvents<
  P extends Shape,
  T extends Unit<P extends Tuple ? P : Partial<P>>
>(config: {
  events: Events<P>;
  target: T;
  reset?: Unit<any>;
}): ReturnTarget<P, T>;
