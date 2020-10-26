import {
  createStore,
  createEvent,
  guard,
  merge,
  sample,
  withRegion,
  is,
  Unit,
  Store,
  Event,
  Effect,
} from 'effector';
import { readConfig } from '../library';

const throwError = (message: string) => {
  throw new Error(message);
};
const throwTypeError = (message: string) => {
  throw new TypeError(message);
};

export function combineEvents(config: unknown) {
  const {
    loc,
    name = 'unknown',
    events,
    reset,
    target: givenTarget,
  } = readConfig(config, ['loc', 'name', 'events', 'reset', 'target']);
}
