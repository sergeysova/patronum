const { combine } = require('effector');

function inFlight({ effects, domain }) {
  if (domain) {
    const $inFlight = domain.createStore(0);

    domain.onCreateEffect((fx) => {
      $inFlight.on(fx, (count) => count + 1).on(fx.finally, (count) => count - 1);
    });

    return $inFlight;
  }

  return combine(
    effects.map((fx) => fx.inFlight),
    (inFlights) => inFlights.reduce((all, current) => all + current, 0),
  );
}

module.exports = { inFlight };
