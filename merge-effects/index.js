const { merge, combine } = require('effector');

function mergeEffects(list) {
  const done = merge(list.map((fx) => fx.done));
  const fail = merge(list.map((fx) => fx.fail));
  const doneData = merge(list.map((fx) => fx.doneData));
  const failData = merge(list.map((fx) => fx.failData));
  const pending = combine(
    list.map((fx) => fx.pending),
    (pendings) => pendings.some(Boolean),
  );
  const inFlight = combine(
    list.map((fx) => fx.inFlight),
    (counters) => counters.reduce((all, current) => all + current, 0),
  );
  const anyway = merge(list.map((fx) => fx.finally));

  return {
    done,
    fail,
    inFlight,
    failData,
    doneData,
    pending,
    finally: anyway,
  };
}

module.exports = { mergeEffects };
