const { is, createEffect, forward, createEvent } = require('effector');

function debounce({ source, timeout, target }) {
  if (!is.unit(source)) throw new TypeError('source must be unit from effector');

  if (is.domain(source)) throw new TypeError('source cannot be domain');

  if (typeof timeout !== 'number' || timeout < 0 || !Number.isFinite(timeout))
    throw new Error(
      `timeout must be positive number or zero. Received: "${timeout}"`,
    );

  let rejectPromise;
  let timeoutId;

  const tick = target || createEvent({ named: 'tick' });

  const timerFx = createEffect({
    named: 'timerFx',
    handler: (parameter) => {
      clearTimeout(timeoutId);
      if (rejectPromise) rejectPromise();
      return new Promise((resolve, reject) => {
        rejectPromise = reject;
        timeoutId = setTimeout(resolve, timeout, parameter);
      });
    },
  });

  forward({
    from: source,
    to: timerFx,
  });

  forward({
    from: timerFx.done.map(({ result }) => result),
    to: tick,
  });

  return tick;
}

module.exports = { debounce };
