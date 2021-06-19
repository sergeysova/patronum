const { combine } = require('effector');

function format(strings, ...stores) {
  return combine(stores, (stores) =>
    strings.reduce(
      (acc, value, index) =>
        acc.concat(
          isLastElement(strings, index) ? value : `${value}${stores[index]}`,
        ),
      '',
    ),
  );
}

module.exports = { format };

function isLastElement(array, index) {
  return index + 1 === array.length;
}
