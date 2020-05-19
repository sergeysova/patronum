import { Unit, Event } from 'effector';

export function delay<T>(unit: Unit<T>, time: number): Event<T>;
export function delay<T>(
  unit: Unit<T>,
  options: { time: (payload: T) => number },
): Event<T>;
