import {
  Unit,
  Event,
  Store,
  is,
  createEvent,
  createEffect,
  sample,
  combine,
  forward,
} from 'effector';
import { readConfig, throwTypeError } from '../library';

type Timeout<T> = ((_payload: T) => number) | number;

export function delay<T>(_config: {
  source: Unit<T>;
  timeout: (_payload: T) => number;
}): Event<T>;
export function delay<T>(_config: {
  source: Unit<T>;
  timeout: Store<number> | number;
}): Event<T>;
export function delay<T>(config: {
  source: Unit<T>;
  timeout: Timeout<T> | Store<number>;
}): Event<T> {
  const {
    source,
    timeout,

    loc,
    name,
  } = readConfig(config, ['source', 'timeout', 'loc', 'name']);

  if (!is.unit(source)) throwTypeError('source must be a unit from effector');
  assertTimeout<T>(timeout);

  const tick = createEvent<T>({
    name: `${name}Delayed`,
    loc,
    named: 'delay.tick',
  } as any);

  const timerFx = createEffect<{ payload: T; ms: number }, T>({
    config: { name: `${name}DelayTimer`, loc, named: 'delay.timerFx' },
    handler: ({ payload, ms }: { payload: T; ms: number }) =>
      new Promise<T>((resolve) => setTimeout(resolve, ms, payload)),
  } as any);

  sample({
    // ms can be Store<number> | number
    source: combine({ ms: timeout }),
    clock: source,
    fn: ({ ms }, payload) => ({
      payload,
      ms: isFunction(ms) ? ms(payload) : ms,
    }),
    target: timerFx,
  });

  forward({
    from: timerFx.doneData,
    to: tick,
  });

  return tick;
}

function isFunction<T>(
  input: number | ((_payload: T) => number),
): input is (_payload: T) => number {
  return typeof input === 'function';
}

function assertTimeout<T>(timeout: unknown): asserts timeout is Timeout<T> {
  if (
    is.store(timeout) ||
    typeof timeout === 'function' ||
    typeof timeout === 'function'
  ) {
    return;
  }
  throwTypeError(
    `'timeout' argument must be a function, Store, or a number. Passed "${typeof timeout}"`,
  );
}
