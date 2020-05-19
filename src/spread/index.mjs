/* eslint-disable no-param-reassign */
import * as effector from 'effector';

const { createEvent, sample, guard } = effector;

/**
 * @examle
 * spread(dataObject, { first: targetA, second: targetB })
 * forward({
 *   to: spread({ first: targetA, second: targetB })
 * })
 */
export function spread(source, targetCases) {
  if (targetCases === undefined) {
    targetCases = source;
    source = createEvent();
  }
  for (const key in targetCases) {
    if (key in targetCases) {
      const correctKey = guard(source, {
        filter: (data) =>
          typeof data === 'object' && data !== null && key in data,
      });

      sample({
        source: correctKey,
        fn: (data) => data[key],
        target: targetCases[key],
      });
    }
  }

  return source;
}
