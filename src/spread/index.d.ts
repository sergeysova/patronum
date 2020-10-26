import { Unit, Event } from 'effector';

type NoInfer<T> = [T][T extends any ? 0 : never];

export function spread<Payload>(config: {
  targets: {
    [Key in keyof Payload]?: Unit<Payload[Key]>;
  };
}): Event<Payload>;

export function spread<
  Source,
  Payload extends Source extends Unit<infer S> ? S : never
>(config: {
  source: Source;
  targets: {
    [Key in keyof Payload]?: Unit<NoInfer<Payload[Key]>>;
  };
}): Source;
