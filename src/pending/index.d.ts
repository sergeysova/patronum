import { Store, Effect, Domain } from 'effector';

export type Strategy = 'some' | 'every';

export function pending(config: {
  effects: Array<Effect<any, any, any>>;
  of?: Strategy;
}): Store<boolean>;
export function pending(config: { domain: Domain; of?: Strategy }): Store<boolean>;
