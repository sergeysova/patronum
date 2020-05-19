export function reshape($store, shape) {
  const result = {};

  for (const key in shape) {
    if (key in shape) {
      result[key] = $store.map(shape[key]);
    }
  }

  return result;
}
