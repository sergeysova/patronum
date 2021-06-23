import { Domain, Event, Store } from 'effector';

export function currentTime(_: {
  start: Event<any>;
  stop: Event<any>;
  interval?: number;
}): Store<Date>;
