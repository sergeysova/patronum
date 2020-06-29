const { createEvent, sample, guard } = require('effector');
const { readConfig } = require('../library');

/**
 * @examle
 * spread({ source: dataObject, targets: { first: targetA, second: targetB } })
 * forward({
 *   from: ...,
 *   to: spread({ targets: { first: targetA, second: targetB } })
 * })
 */
function spread(argument) {
  const { source, targets } = readConfig(argument, ['source', 'targets']);
  const actualSource = source || createEvent();

  for (const key in targets) {
    if (key in targets) {
      const correctKey = guard(actualSource, {
        filter: (data) =>
          typeof data === 'object' && data !== null && key in data,
      });

      sample({
        source: correctKey,
        fn: (data) => data[key],
        target: targets[key],
      });
    }
  }

  return actualSource;
}

module.exports = { spread };
