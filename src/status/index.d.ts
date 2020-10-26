import { Store, Effect } from 'effector';

export type EffectState = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Done, Fail = Error>(_: {
  effect: Effect<Params, Done, Fail>;
  defaultValue?: EffectState;
}): Store<EffectState>;
