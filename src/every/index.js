const { combine } = require('effector');
const { readConfig } = require('../library');

function every(argument) {
  const { predicate, stores } = readConfig(argument, ['predicate', 'stores']);

  const checker = isFunction(predicate)
    ? predicate
    : (value) => value === predicate;

  return combine(stores, (values) => values.every(checker));
}

module.exports = { every };

function isFunction(value) {
  return typeof value === 'function';
}
