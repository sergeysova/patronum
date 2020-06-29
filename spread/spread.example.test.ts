import { createStore, createEvent, forward } from 'effector';
import { spread } from './index';

test('check', () => {
  const $first = createStore('');
  const $last = createStore('');
  const demo = createStore(0);

  const formReceived = createEvent<{ first: string; last?: string }>();

  const result = spread({
    source: formReceived,
    targets: {
      first: $first,
      last: $last,
    },
  });

  forward({
    from: formReceived,
    to: spread({
      targets: {
        first: demo,
      },
    }),
  });
});
