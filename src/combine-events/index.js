const {
  createStore,
  createEvent,
  guard,
  merge,
  sample,
  withRegion,
  is,
} = require('effector');

const throwError = (message) => {
  throw new Error(message);
};

function combineEvents({ events, reset, target = createEvent({ named: 'target' }) }) {
  if (!is.unit(target)) throwError('target should be a unit');
  if (reset && !is.unit(reset)) throwError('reset should be a unit');

  withRegion(target, () => {
    const isArray = Array.isArray(events);
    const keys = Object.keys(events);
    const defaultShape = isArray ? [...keys].fill() : {};

    const $counter = createStore(keys.length, { named: 'counter' });
    const $results = createStore(defaultShape, { named: 'results' });

    $counter.reset(sample(target));
    $results.reset(target);

    if (reset) {
      $counter.reset(sample(reset));
      $results.reset(reset);
    }

    for (const key of keys) {
      const $isDone = createStore(false)
        .on(events[key], () => true)
        .reset(target);

      if (reset) {
        $isDone.reset(reset);
      }

      $counter.on($isDone, (value) => value - 1);
      $results.on(events[key], (shape, payload) => {
        const newShape = isArray ? [...shape] : { ...shape };
        newShape[key] = payload;
        return newShape;
      });
    }

    guard({
      source: sample($results, merge(Object.values(events))),
      filter: $counter.map((value) => value === 0),
      target,
    });
  });

  return target;
}

module.exports = { combineEvents };
