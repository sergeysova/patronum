const { restore, sample } = require('effector');

function snapshot({ source, clock, fn }) {
  const defaultValue = fn ? fn(source.defaultState) : source.defaultState;

  return restore(sample(source, clock, fn), defaultValue);
}

module.exports = { snapshot };
