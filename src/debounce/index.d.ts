import { Unit, Event } from 'effector';

type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function debounce<T>(_: {
  source: Unit<T>;
  timeout: number;
  name?: string;
}): EventAsReturnType<T>;
export function debounce<T, Target extends Unit<T>>(_: {
  source: Unit<T>;
  timeout: number;
  target: Target;
  name?: string;
}): Target;
