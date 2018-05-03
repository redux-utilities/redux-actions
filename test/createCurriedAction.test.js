import createCurriedAction from '../src/createCurriedAction';

const type = 'TYPE';

test('returns curried function', () => {
  const curriedAction = createCurriedAction(type, (a, b) => a + b);

  const a = curriedAction(1);
  const b = a(2);

  expect(b).toEqual({ payload: 3, type });
});
