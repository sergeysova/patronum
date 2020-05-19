import { Store, Effect } from 'effector';

type Status = 'initial' | 'pending' | 'done' | 'fail';

export function status<Params, Result>(
  effect: Effect<P, R>,
  initialValue?: Status,
): Store<Status>;
