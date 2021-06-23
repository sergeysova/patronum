import { expectType } from 'tsd';
import { Store, createStore, createEvent } from 'effector';
import { currentTime } from '../current-time';

// Check invalid type for start/stop
{
  const correctStart = createEvent();
  const correctStop = createEvent();

  const a = createStore(null);
  // @ts-expect-error
  currentTime({ start: a, stop: correctStop });

  const b = createStore(null);
  // @ts-expect-error
  currentTime({ start: correctStart, stop: b });

  const c = 12;
  // @ts-expect-error
  snapshot({ start: c, stop: correctStop });
}

// Check types for Store
{
  const start = createEvent();
  const stop = createEvent();

  expectType<Store<Date>>(currentTime({ start, stop }));
}

// Check invalid type for interval
{
  const start = createEvent();
  const stop = createEvent();

  // @ts-expect-error
  currentTime({ start, stop, interval: '133' });

  // @ts-expect-error
  currentTime({ start, stop, interval: new Date() });

  // @ts-expect-error
  currentTime({ start, stop, interval: false });
}
