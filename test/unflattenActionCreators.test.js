import unflattenActionCreators from '../src/utils/unflattenActionCreators';

test('unflattens a flattened action map and camel-case keys', () => {
  const actionMap = unflattenActionCreators({
    'APP/COUNTER/INCREMENT': amount => ({ amount }),
    'APP/COUNTER/DECREMENT': amount => ({ amount: -amount }),
    'APP/NOTIFY': (username, message) => ({
      message: `${username}: ${message}`
    }),
    LOGIN: username => ({ username })
  });

  expect(actionMap.login('yangmillstheory')).toEqual({
    username: 'yangmillstheory'
  });
  expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
    message: 'yangmillstheory: Hello World'
  });
  expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
  expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
});

test('unflattens a flattened action map with custom namespace', () => {
  const actionMap = unflattenActionCreators(
    {
      'APP--COUNTER--INCREMENT': amount => ({ amount }),
      'APP--COUNTER--DECREMENT': amount => ({ amount: -amount }),
      'APP--NOTIFY': (username, message) => ({
        message: `${username}: ${message}`
      }),
      LOGIN: username => ({ username })
    },
    { namespace: '--' }
  );

  expect(actionMap.login('yangmillstheory')).toEqual({
    username: 'yangmillstheory'
  });
  expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
    message: 'yangmillstheory: Hello World'
  });
  expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
  expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
});

test('unflattens a flattened action map with prefix', () => {
  const actionMap = unflattenActionCreators(
    {
      'my/feature/APP/COUNTER/INCREMENT': amount => ({ amount }),
      'my/feature/APP/COUNTER/DECREMENT': amount => ({ amount: -amount }),
      'my/feature/APP/NOTIFY': (username, message) => ({
        message: `${username}: ${message}`
      }),
      'my/feature/LOGIN': username => ({ username })
    },
    { prefix: 'my/feature' }
  );

  expect(actionMap.login('test')).toEqual({ username: 'test' });
  expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
    message: 'yangmillstheory: Hello World'
  });
  expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
  expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
});

test('unflattens a flattened action map with custom namespace and prefix', () => {
  const actionMap = unflattenActionCreators(
    {
      'my--feature--APP--COUNTER--INCREMENT': amount => ({ amount }),
      'my--feature--APP--COUNTER--DECREMENT': amount => ({ amount: -amount }),
      'my--feature--APP--NOTIFY': (username, message) => ({
        message: `${username}: ${message}`
      }),
      'my--feature--LOGIN': username => ({ username })
    },
    { namespace: '--', prefix: 'my--feature' }
  );

  expect(actionMap.login('test')).toEqual({ username: 'test' });
  expect(actionMap.app.notify('yangmillstheory', 'Hello World')).toEqual({
    message: 'yangmillstheory: Hello World'
  });
  expect(actionMap.app.counter.increment(100)).toEqual({ amount: 100 });
  expect(actionMap.app.counter.decrement(100)).toEqual({ amount: -100 });
});
