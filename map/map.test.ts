import {
  createEffect,
  createEvent,
  createStore,
  Event,
  is,
  Store,
} from 'effector';
import { argumentHistory } from '../test-library';
import { map } from './index';

describe('store', () => {
  test('default state for store', () => {
    const $original = createStore(12);
    const $derived: Store<number> = map({
      source: $original,
      fn: (a) => a * 100,
    });

    expect($derived.defaultState).toMatchInlineSnapshot(`1200`);
    expect($derived.getState()).toMatchInlineSnapshot(`1200`);
    expect(is.store($derived)).toBe(true);
  });

  test('trigger derived store', () => {
    const $original = createStore(12);
    const $derived: Store<number> = map({
      source: $original,
      fn: (a) => a * 100,
    });
    const fn = jest.fn();
    $derived.watch(fn);

    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        1200,
      ]
    `);

    // @ts-expect-error setState is an internal method
    $original.setState(88);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        1200,
        8800,
      ]
    `);
  });

  test('do not change original', () => {
    const $original = createStore(12);
    const $derived: Store<number> = map({
      source: $original,
      fn: (a) => a * 100,
    });
    const fn = jest.fn();
    $derived.watch(fn);

    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        1200,
      ]
    `);

    // @ts-expect-error setState is an internal method
    $derived.setState(88);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        1200,
        88,
      ]
    `);

    expect($original.getState()).toMatchInlineSnapshot(`12`);
  });
});

describe('event', () => {
  test('trigger derived event', () => {
    const original = createEvent<number>();
    const derived: Event<number> = map({
      source: original,
      fn: (a) => a * 100,
    });
    const fn = jest.fn();
    derived.watch(fn);

    expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

    original(88);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        8800,
      ]
    `);
  });

  test('do not trigger original', () => {
    const original = createEvent<number>();
    const derived: Event<number> = map({
      source: original,
      fn: (a) => a * 100,
    });
    const fnDerived = jest.fn();
    const fnOriginal = jest.fn();
    derived.watch(fnDerived);
    original.watch(fnOriginal);

    expect(argumentHistory(fnDerived)).toMatchInlineSnapshot(`Array []`);

    derived(88);
    expect(argumentHistory(fnDerived)).toMatchInlineSnapshot(`
      Array [
        88,
      ]
    `);

    expect(argumentHistory(fnOriginal)).toMatchInlineSnapshot(`Array []`);
  });
});

describe('effect', () => {
  test('trigger derived event', () => {
    const original = createEffect((a: number) => a);
    const derived: Event<number> = map({
      source: original,
      fn: (a) => a * 100,
    });
    const fn = jest.fn();
    derived.watch(fn);

    expect(argumentHistory(fn)).toMatchInlineSnapshot(`Array []`);

    original(88);
    expect(argumentHistory(fn)).toMatchInlineSnapshot(`
      Array [
        8800,
      ]
    `);
  });

  test('do not trigger original', () => {
    const original = createEffect((a: number) => a);
    const derived: Event<number> = map({
      source: original,
      fn: (a) => a * 100,
    });
    const fnDerived = jest.fn();
    const fnOriginal = jest.fn();
    derived.watch(fnDerived);
    original.watch(fnOriginal);

    expect(argumentHistory(fnDerived)).toMatchInlineSnapshot(`Array []`);

    derived(88);
    expect(argumentHistory(fnDerived)).toMatchInlineSnapshot(`
      Array [
        88,
      ]
    `);

    expect(argumentHistory(fnOriginal)).toMatchInlineSnapshot(`Array []`);
  });
});
