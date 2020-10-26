const { combine } = require('effector');
const { readConfig } = require('../library');

function pending(argument) {
  const { effects } = readConfig(argument, ['effects']);

  return combine(
    effects.map((fx) => fx.pending),
    (pendings) => pendings.some(Boolean),
  );
}

module.exports = { pending };
