import { Unit, Event } from 'effector';

export function debounce<T>(
  source: Unit<T>,
  timeout: number,
  options?: { name?: string },
): Event<T>;
