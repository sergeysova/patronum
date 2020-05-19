/* eslint-disable arrow-body-style */
import * as effector from 'effector';

const { is, createEffect, forward, createEvent, guard } = effector;

export function throttle(source, timeout, options = {}) {
  if (!is.unit(source)) throw new Error('callee must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0) {
    throw new Error('timeout must be positive number or zero');
  }

  const name = options.name || source.shortName || 'unknown';

  const tick = createEvent(`${name}ThrottleTick`);

  const timer = createEffect(`${name}ThrottleTimer`).use((parameter) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout, parameter);
    });
  });

  guard({
    source,
    filter: timer.pending.map((pending) => !pending),
    target: timer,
  });

  forward({
    from: timer.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}
