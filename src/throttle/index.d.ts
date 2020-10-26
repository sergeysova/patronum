import { Unit, Event } from 'effector';

export function throttle<T>(_: {
  source: Unit<T>;
  timeout: number;
  name?: string;
}): Event<T>;
export function throttle<T, R extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number;
  target: R;
  name?: string;
}): R;
