const { createEffect, createEvent, guard, is, sample } = require('effector');

function throttle({ source, timeout, target = createEvent({ named: 'tick' }) }) {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (typeof timeout !== 'number' || timeout < 0)
    throw new Error('timeout must be positive number or zero');

  const timerFx = createEffect({
    named: 'timer',
    handler: () => new Promise((resolve) => setTimeout(resolve, timeout)),
  });

  guard({
    source,
    filter: timerFx.pending.map((pending) => !pending),
    target: timerFx,
  });

  sample({ source, clock: timerFx.done, target });

  return target;
}

module.exports = { throttle };
