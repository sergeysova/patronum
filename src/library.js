/* eslint-disable no-param-reassign */

function readProperties(part, target, properties) {
  properties
    .filter((name) => Boolean(part[name]))
    .forEach((name) => {
      target[name] = part[name];
    });
}

const readConfig = (part, properties, target = {}) => {
  if (typeof part !== 'object' || part === null) return target;

  if (part.config) readConfig(part.config, properties, target);

  readProperties(part, target, properties);

  if (part.ɔ) readConfig(part.ɔ, properties, target);

  return target;
};

module.exports = { readConfig };
