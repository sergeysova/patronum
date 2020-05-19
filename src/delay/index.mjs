import * as effector from 'effector';

const { createEffect, forward } = effector;

export function delay(unit, options) {
  const timer =
    typeof options === 'object'
      ? toFunction(options.time)
      : toFunction(options);

  const timeout = createEffect({
    handler: (data) =>
      new Promise((resolve) => {
        setTimeout(resolve, timer(data), data);
      }),
  });

  forward({
    from: unit,
    to: timeout,
  });

  return timeout.done.map(({ result }) => result);
}

function toFunction(time) {
  return typeof time === 'function' ? time : () => time;
}
