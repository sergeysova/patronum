/* eslint-disable unicorn/consistent-function-scoping, arrow-body-style */
import * as effector from 'effector';

const { is, createEffect, forward, createEvent } = effector;

export function debounce(source, timeout, options = {}) {
  if (!is.unit(source)) throw new Error('callee must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0) {
    throw new Error('timeout must be positive number or zero');
  }
  const name = options.name || source.shortName || 'unknown';

  let rejectPromise = () => undefined;
  let timeoutId;
  const tick = createEvent(`${name}DebounceTick`);

  const timer = createEffect(`${name}DebounceTimer`).use((parameter) => {
    return new Promise((resolve, reject) => {
      rejectPromise = reject;
      timeoutId = setTimeout(resolve, timeout, parameter);
    });
  });

  timer.watch(() => {
    clearTimeout(timeoutId);
    rejectPromise();
  });

  forward({
    from: source,
    to: timer,
  });

  forward({
    from: timer.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}
