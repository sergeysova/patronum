/* eslint-disable no-param-reassign */
const { createEvent, sample, guard } = require('effector');
const { readConfig } = require('../library');

/**
 * @example
 * spread({ source: dataObject, targets: { first: targetA, second: targetB } })
 * forward({
 *   to: spread({targets: { first: targetA, second: targetB } })
 * })
 */
function spread(argument) {
  const {
    loc,
    name = 'unknown',
    source = createEvent({ loc, name: `${name}Source` }),
    targets,
  } = readConfig(argument, ['loc', 'name', 'source', 'targets']);

  for (const targetKey in targets) {
    if (targetKey in targets) {
      const hasTargetKey = guard({
        source,
        filter: (object) =>
          typeof object === 'object' && object !== null && targetKey in object,
      });

      sample({
        source: hasTargetKey,
        fn: (object) => object[targetKey],
        target: targets[targetKey],
      });
    }
  }

  return source;
}

module.exports = { spread };
