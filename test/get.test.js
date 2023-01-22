import { test, expect } from 'vitest';

import get from '../src/utils/get';

test('get util helper', () => {
  const map = new Map([['foo', 'bar']]);
  const obj = { foo: 'baz' };

  expect(get('foo', map)).toBe('bar');
  expect(get('foo', obj)).toBe('baz');
});
