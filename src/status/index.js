const { createStore } = require('effector');

function status({ effect, defaultValue = 'initial' }) {
  const $status = createStore(defaultValue, { named: 'status', sid: 'status' });

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}

module.exports = { status };
