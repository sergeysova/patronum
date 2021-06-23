const { createEffect, restore, sample } = require('effector');

function currentTime({ start, stop, interval = 100 }) {
  const getCurrentDateFx = createEffect(() => new Date());
  const startIntervalFx = createEffect(() => setInterval(getCurrentDateFx, interval));
  const stopIntervalFx = createEffect((interval) => {
    if (interval) {
      clearInterval(interval);
    }
  });

  const $time = restore(getCurrentDateFx, new Date(), {
    named: 'currentTime',
    sid: 'currentTime',
  });
  const $interval = restore(startIntervalFx, null).reset(stopIntervalFx);

  sample({ clock: start, target: startIntervalFx });

  sample({
    clock: stop,
    target: [stopIntervalFx, getCurrentDateFx],
    source: $interval,
  });

  return $time;
}

module.exports = { currentTime };
