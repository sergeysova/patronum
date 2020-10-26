const { createStore } = require('effector');
const { readConfig } = require('../library');

function status(argument) {
  const {
    sid,
    name,
    loc,
    effect,
    defaultValue = 'initial',
  } = readConfig(argument, ['sid', 'name', 'loc', 'effect', 'defaultValue']);
  const $status = createStore(defaultValue, { sid, loc, name });

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}

module.exports = { status };
