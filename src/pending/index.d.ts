import { Store, Effect } from 'effector';

export function pending(_: {
  effects: Array<Effect<any, any, any>>;
}): Store<boolean>;
