import { createStore, createEvent } from 'effector';
import { reshape } from './index';

test('reshape from string to different types', () => {
  const $original = createStore('some long value');

  const shape = reshape({
    source: $original,
    shape: {
      length: (original) => original.length,
      uppercase: (original) => original.toUpperCase(),
      hasSpace: (original) => original.includes(' '),
    },
  });

  expect(shape.length.getState()).toBe(15);
  expect(shape.uppercase.getState()).toBe('SOME LONG VALUE');
  expect(shape.hasSpace.getState()).toBe(true);
});

test('reshaped stores updates correctly', () => {
  const $original = createStore('some long value');
  const update = createEvent<string>();
  $original.on(update, (_, v) => v);

  const shape = reshape({
    source: $original,
    shape: {
      length: (original) => original.length,
      uppercase: (original) => original.toUpperCase(),
      hasSpace: (original) => original.includes(' '),
    },
  });

  expect(shape.length.getState()).toBe(15);
  expect(shape.uppercase.getState()).toBe('SOME LONG VALUE');
  expect(shape.hasSpace.getState()).toBe(true);

  update('another');

  expect(shape.length.getState()).toBe(7);
  expect(shape.uppercase.getState()).toBe('ANOTHER');
  expect(shape.hasSpace.getState()).toBe(false);
});

test('reshape ejects values from object', () => {
  const $user = createStore({ id: 1, name: 'Sergey', surname: 'Sova' });

  const shape = reshape({
    source: $user,
    shape: {
      id: (user) => user.id,
      name: (user) => user.name,
      surname: (user) => user.surname,
    },
  });

  expect(shape.id.getState()).toBe(1);
  expect(shape.name.getState()).toBe('Sergey');
  expect(shape.surname.getState()).toBe('Sova');
});

test('reshape returns null in shape if fn returned undefined', () => {
  const $user = createStore<{ first: string; second?: number }>({ first: '' });

  const shape = reshape({
    source: $user,
    shape: {
      first: (user) => user.first,
      second: (user) => user.second,
    },
  });

  expect(shape.first.getState()).toBe('');
  expect(shape.second.getState()).toBe(null);
});
