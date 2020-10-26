import { expectType } from 'tsd';
import { Event, createStore } from 'effector';
import { delay } from '../src/delay';

// Check valid type for source
{
  const $string = createStore('');
  const $number = createStore(0);

  expectType<Event<string>>(delay({ source: $string, timeout: 100 }));
  expectType<Event<number>>(delay({ source: $number, timeout: 100 }));
}

// Check timeout type for number
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: 100 }));

  // @ts-expect-error
  delay({ source, timeout: true });
  // @ts-expect-error
  delay({ source, timeout: null });
  // @ts-expect-error
  delay({ source, timeout: '' });
  // @ts-expect-error
  delay({ source, timeout: Symbol('example') });
  // @ts-expect-error
  delay({ source, timeout: undefined });
}

// Check timeout type for function
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: () => 0 }));

  // @ts-expect-error
  delay({ source, timeout: () => true });
  // @ts-expect-error
  delay({ source, timeout: () => null });
  // @ts-expect-error
  delay({ source, timeout: () => '' });
  // @ts-expect-error
  delay({ source, timeout: () => Symbol('example') });
  // @ts-expect-error
  delay({ source, timeout: () => undefined });
}

// Check timeout type for function argument
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: (p: string) => 0 }));

  // @ts-expect-error
  delay({ source, timeout: (p: number) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: symbol) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: null) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: undefined) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: Record<string, unknown>) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => '') => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => false) => 0 });
  // @ts-expect-error
  delay({ source, timeout: (p: () => []) => 0 });
}

// Check timeout type for store
{
  const source = createStore('');
  expectType<Event<string>>(delay({ source, timeout: createStore(0) }));

  // @ts-expect-error
  delay({ source, timeout: createStore(true) });
  // @ts-expect-error
  delay({ source, timeout: createStore(null) });
  // @ts-expect-error
  delay({ source, timeout: createStore('') });
  // @ts-expect-error
  delay({ source, timeout: createStore(Symbol('example')) });
  // @ts-expect-error
  delay({ source, timeout: createStore(undefined) });
}
