import { test, expect } from 'vitest';
import camelCase from '../src/utils/camelCase';

test('camel-cases a conventional action type', () => {
  expect(camelCase('MY_ACTION')).toBe('myAction');
});

test('includes forward slashes in words', () => {
  expect(camelCase('NAMESPACE/MY_ACTION')).toBe('namespace/myAction');
});

test('does nothing to an already camel-cased action type', () => {
  expect(camelCase('myAction')).toBe('myAction');
});
