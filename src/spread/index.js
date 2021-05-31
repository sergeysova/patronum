/* eslint-disable no-param-reassign */
const { createEvent, sample, guard } = require('effector');

/**
 * @example
 * spread({ source: dataObject, targets: { first: targetA, second: targetB } })
 * forward({
 *   to: spread({targets: { first: targetA, second: targetB } })
 * })
 */
function spread({ targets, source = createEvent({ named: 'source' }) }) {
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
