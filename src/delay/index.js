const { createEffect, createEvent, forward, is, sample } = require('effector');
const { readConfig } = require('../library');

function delay(argument) {
  const { source, timeout, loc, name = 'unknown', sid } = readConfig(argument, [
    'source',
    'timeout',

    'loc',
    'sid',
    'name',
  ]);

  if (!is.unit(source))
    throw new TypeError('source must be a unit from effector');
  const ms = validateTimeout(timeout);

  const tick = createEvent({ name: `${name}Delayed`, sid, loc });
  const timerFx = createEffect({
    config: { name: `${name}DelayTimer`, loc },
    handler: ({ payload, milliseconds }) =>
      new Promise((resolve) => {
        setTimeout(resolve, milliseconds, payload);
      }),
  });

  sample({
    // ms can be Store<number> | number
    // sample calls combine() on source to convert object of stores or object of values to store
    source: { milliseconds: ms },
    clock: source,
    fn: ({ milliseconds }, payload) => ({
      payload,
      milliseconds:
        typeof milliseconds === 'function'
          ? milliseconds(payload)
          : milliseconds,
    }),
    target: timerFx,
  });

  forward({
    from: timerFx.done.map((payload) => payload.result),
    to: tick,
  });

  return tick;
}

module.exports = { delay };

function validateTimeout(timeout) {
  if (
    is.store(timeout) ||
    typeof timeout === 'function' ||
    typeof timeout === 'number'
  ) {
    return timeout;
  }

  throw new TypeError(
    `'timeout' argument must be a function, Store, or a number. Passed "${typeof timeout}"`,
  );
}
