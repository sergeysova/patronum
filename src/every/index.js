const { combine } = require('effector');

function every({ predicate, stores }) {
  const checker = isFunction(predicate) ? predicate : (value) => value === predicate;

  return combine(stores, (values) => values.every(checker));
}

module.exports = { every };

function isFunction(value) {
  return typeof value === 'function';
}
