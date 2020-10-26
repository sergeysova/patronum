const { performance } = require('perf_hooks');

function waitFor(unit) {
  return new Promise((resolve) => {
    const unsubscribe = unit.watch((payload) => {
      resolve(payload);
      unsubscribe();
    });
  });
}

function argumentHistory(ƒ) {
  return ƒ.mock.calls.map(([value]) => value);
}

function argumentsHistory(ƒ) {
  return ƒ.mock.calls;
}

function time() {
  const start = performance.now();

  const result = {
    diff: () => {
      const end = performance.now();

      return end - start;
    },
  };
  return result;
}

function toBeCloseWithThreshold(received, expected, threshold) {
  const minimum = expected - threshold;
  const maximum = expected + threshold;

  if (received < minimum) {
    return {
      pass: false,
      message: () =>
        `expected ${received} to be close to ${expected}, but it is smaller that minimum ${minimum} with threshold ${threshold}`,
    };
  }
  if (received > maximum) {
    return {
      pass: false,
      message: () =>
        `expected ${received} to be close to ${expected}, but it is bigger that maximum ${maximum} with threshold ${threshold}`,
    };
  }
  return {
    pass: true,
    message: () => `expected ${received} to be close to ${expected}, it is ok`,
  };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  argumentHistory,
  argumentsHistory,
  time,
  toBeCloseWithThreshold,
  wait,
  waitFor,
};
