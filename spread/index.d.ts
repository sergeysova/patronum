import { Unit } from 'effector';

type In<T extends Unit<any>> = T extends Unit<infer I> ? I : never;

export function spread<
  S extends Unit<object>, // derive targets from source here
  T extends { [Key in keyof In<S>]: Unit<In<S>[Key]> }
>(_: { targets: T }): S;

export function spread<
  S extends Unit<object>,
  T extends { [Key in keyof In<S>]: Unit<In<S>[Key]> }
>(_: { source: S; targets: T }): S;
