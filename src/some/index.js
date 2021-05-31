const { combine } = require('effector');

function some({ predicate, stores }) {
  const checker = isFunction(predicate) ? predicate : (value) => value === predicate;

  return combine(stores, (values) => values.some(checker));
}

module.exports = { some };

function isFunction(value) {
  return typeof value === 'function';
}
