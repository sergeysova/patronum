import { Event, Store } from 'effector';

export function snapshot<SourceType, TargetType = SourceType>(_: {
  source: Store<SourceType>;
  clock?: Event<any>;
  fn?(value: SourceType): TargetType;
}): Store<TargetType>;
