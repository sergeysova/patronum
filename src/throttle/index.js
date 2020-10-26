const { createEffect, createEvent, guard, is, sample } = require('effector');
const { readConfig } = require('../library');

function throttle(argument) {
  const { source, timeout, target, sid, loc, name } = readConfig(argument, [
    'source',
    'timeout',
    'target',

    'loc',
    'name',
    'sid',
  ]);

  if (!is.unit(source))
    throw new TypeError('source must be unit from effector');
  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const actualName = name || source.shortName || 'unknown';

  const tick =
    target ||
    createEvent({
      name: `${actualName}ThrottleTick`,
      loc,
    });

  const timerFx = createEffect({
    name: `${actualName}ThrottleTimer`,
    sid,
    loc,
    handler: () => new Promise((resolve) => setTimeout(resolve, timeout)),
  });

  guard({
    source,
    filter: timerFx.pending.map((pending) => !pending),
    target: timerFx,
  });

  sample({
    source,
    clock: timerFx.done,
    target: tick,
  });

  return tick;
}

module.exports = { throttle };
