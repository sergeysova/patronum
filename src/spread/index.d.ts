import { Unit, Event } from 'effector';

type NoInfer<T> = [T][T extends any ? 0 : never];
type EventAsReturnType<Payload> = any extends Payload ? Event<Payload> : never;

export function spread<Payload>(config: {
  targets: {
    [Key in keyof Payload]?: Unit<Payload[Key]>;
  };
}): EventAsReturnType<Payload>;

export function spread<
  Source,
  Payload extends Source extends Unit<infer S> ? S : never,
>(config: {
  source: Source;
  targets: {
    [Key in keyof Payload]?: Unit<NoInfer<Payload[Key]>>;
  };
}): Source;
