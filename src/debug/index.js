/* eslint-disable no-console, prefer-template */
const { is } = require('effector');

function debug() {
  const units = Array.from(arguments);

  for (const unit of units) {
    const type = getType(unit);

    if (unit.watch) {
      log(unit, type);
    }

    if (type === 'effect') {
      logEffect(unit);
    }

    if (type === 'domain') {
      unit.onCreateEvent((event) => log(event, 'event'));
      unit.onCreateStore((store) => log(store, 'store'));
      unit.onCreateEffect(logEffect);
    }
  }
}

function getType(unit) {
  if (is.store(unit)) {
    return 'store';
  }
  if (is.effect(unit)) {
    return 'effect';
  }
  if (is.event(unit)) {
    return 'event';
  }
  if (is.domain(unit)) {
    return 'domain';
  }
  if (is.unit(unit)) {
    return 'unit';
  }
  return 'unknown';
}

function log(unit, type, prefix = '') {
  const name = prefix + getName(unit);

  unit.watch((payload) => {
    console.info(`[${type}] ${name}`, payload);
  });
}

function logEffect(unit) {
  log(unit.done, 'effect', getName(unit) + '.');
  log(unit.fail, 'effect', getName(unit) + '.');
}

function getName(unit) {
  if (unit.compositeName && unit.compositeName.fullName) {
    return unit.compositeName.fullName;
  }
  if (unit.shortName) {
    return unit.shortName;
  }
  if (unit.name) {
    return unit.name;
  }
  return '';
}

module.exports = { debug };
