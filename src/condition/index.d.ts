import { Unit, Store } from 'effector';

export function condition<State>(options: {
  source: Unit<State>;
  if: Store<boolean> | ((payload: State) => boolean) | State;
  then?: Unit<State>;
  else?: Unit<State>;
}): void;
