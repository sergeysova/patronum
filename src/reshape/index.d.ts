import { Store } from 'effector';

export function reshape<Type, Shape extends Record<string, unknown>>(_: {
  source: Store<Type>;
  shape: {
    [ShapeKey in keyof Shape]: (value: Type) => Shape[ShapeKey];
  };
}): {
  [ResultKey in keyof Shape]: Store<
    undefined extends Shape[ResultKey]
      ? Exclude<Shape[ResultKey], void> | null
      : Shape[ResultKey]
  >;
};
