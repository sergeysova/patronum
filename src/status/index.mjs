import * as effector from 'effector';

export function status(effect, initialValue = 'initial') {
  const $status = effector.createStore(initialValue);

  $status
    .on(effect, () => 'pending')
    .on(effect.done, () => 'done')
    .on(effect.fail, () => 'fail');

  return $status;
}
