const { combine } = require('effector');
const { readConfig } = require('../library');

function inFlight(argument) {
  const { effects, domain, sid, name, loc } = readConfig(argument, [
    'effects',
    'domain',

    'sid',
    'name',
    'loc',
  ]);

  if (domain) {
    const $inFlight = domain.createStore(0, { sid, name, loc });

    domain.onCreateEffect((fx) => {
      $inFlight
        .on(fx, (count) => count + 1)
        .on(fx.finally, (count) => count - 1);
    });

    return $inFlight;
  }

  return combine(
    effects.map((fx) => fx.inFlight),
    (inFlights) => inFlights.reduce((all, current) => all + current, 0),
  );
}

module.exports = { inFlight };
