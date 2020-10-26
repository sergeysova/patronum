const { is, guard, createEvent } = require('effector');
const { readConfig } = require('../library');

/**
 * if — (payload: T) => boolean,
 * if — Store<boolean>
 * if — T
 */
function condition(argument) {
  const {
    name = 'unknown',
    source = createEvent({ name: `${name}Source` }),
    if: test,
    then: thenBranch,
    else: elseBranch,
  } = readConfig(argument, ['name', 'source', 'if', 'then', 'else']);

  const checker =
    is.unit(test) || isFunction(test) ? test : (value) => value === test;

  if (thenBranch) {
    guard({
      source,
      filter: checker,
      target: thenBranch,
    });
  }

  if (elseBranch) {
    guard({
      source,
      filter: inverse(checker),
      target: elseBranch,
    });
  }

  return source;
}

function isFunction(value) {
  return typeof value === 'function';
}

function inverse(fnOrUnit) {
  if (is.unit(fnOrUnit)) {
    return fnOrUnit.map((value) => !value);
  }
  return (value) => !fnOrUnit(value);
}

module.exports = { condition };
