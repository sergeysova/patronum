const { createStore, is } = require('effector');
const { readConfig } = require('../library');

function map(argument) {
  const { source, fn, name, sid, loc } = readConfig(argument, [
    'source',
    'fn',

    'name',
    'sid',
    'loc',
  ]);

  if (is.store(source)) {
    return createStore(fn(source.defaultState), { name, sid, loc }).on(
      source,
      (_, state) => fn(state),
    );
  }

  return source.map({ fn, sid, loc, name });
}

module.exports = { map };
