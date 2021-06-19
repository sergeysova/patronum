import { Store, Unit } from 'effector';

type StoreOrValue<T> = T extends Store<infer U>
  ? Store<U>
  : T extends Unit<any>
  ? never
  : T;

export function format(string: TemplateStringsArray): Store<string>;
export function format<A>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
): Store<string>;
export function format<A, B>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
): Store<string>;
export function format<A, B, C>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
): Store<string>;
export function format<A, B, C, D>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
): Store<string>;
export function format<A, B, C, D, E>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
): Store<string>;
export function format<A, B, C, D, E, F>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
): Store<string>;
export function format<A, B, C, D, E, F, G>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
  g: StoreOrValue<G>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
  g: StoreOrValue<G>,
  h: StoreOrValue<H>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H, I>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
  g: StoreOrValue<G>,
  h: StoreOrValue<H>,
  i: StoreOrValue<I>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H, I, J>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
  g: StoreOrValue<G>,
  h: StoreOrValue<H>,
  i: StoreOrValue<I>,
  j: StoreOrValue<J>,
): Store<string>;
export function format<A, B, C, D, E, F, G, H, I, J, K>(
  string: TemplateStringsArray,
  a: StoreOrValue<A>,
  b: StoreOrValue<B>,
  c: StoreOrValue<C>,
  d: StoreOrValue<D>,
  e: StoreOrValue<E>,
  f: StoreOrValue<F>,
  g: StoreOrValue<G>,
  h: StoreOrValue<H>,
  i: StoreOrValue<I>,
  j: StoreOrValue<J>,
  k: StoreOrValue<K>,
): Store<string>;
