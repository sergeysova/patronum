import { Unit, Event } from 'effector';

export function throttle<T>(
  source: Unit<T>,
  timeout: number,
  options?: { name?: string },
): Event<T>;
