import { Unit, Event } from 'effector';

export function splitMap<
  S,
  Cases extends Record<string, (payload: S) => any | undefined>
>(_: {
  source: Unit<S>;
  cases: Cases;
}): {
  [K in keyof Cases]: Cases[K] extends (p: S) => infer R
    ? Event<Exclude<R, undefined>>
    : never;
} & { __: Event<S> };
