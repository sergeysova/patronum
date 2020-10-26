import { Store, Effect, Domain } from 'effector';

export function inFlight(_: {
  effects: Array<Effect<any, any, any>>;
}): Store<number>;

export function inFlight(_: { domain: Domain }): Store<number>;
