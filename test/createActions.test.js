import { test, expect } from 'vitest';

import createActions from '../src/createActions';

test('throws an error when given arguments that contain a non-string', () => {
  const expectedError =
    'Expected optional object followed by string action types';

  expect(() => createActions(1)).toThrow(expectedError);
  expect(() => createActions({ ACTION_1: undefined }, [])).toThrow(
    expectedError
  );
  expect(() => createActions('ACTION_1', true)).toThrow(expectedError);
});

test('throws an error when given bad payload creators', () => {
  expect(() =>
    createActions({
      ACTION_1() {},
      ACTION_2: 'string'
    })
  ).toThrow(
    'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
  );
});

test('throws an error when given a bad payload or meta creator in array form', () => {
  expect(() =>
    createActions({
      ACTION_1: [[], () => {}]
    })
  ).toThrow(
    'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
  );

  expect(() =>
    createActions({
      ACTION_1: [() => {}, () => {}],
      ACTION_2: [() => {}, 1]
    })
  ).toThrow(
    'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
  );
});

test('throws an error when no meta creator is given in array form', () => {
  expect(() =>
    createActions({
      ACTION_1: [() => {}]
    })
  ).toThrow(
    'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
  );
});

test('returns a map of camel-cased action types to action creators', () => {
  const { actionOne, actionTwo } = createActions({
    ACTION_ONE: (key, value) => ({ [key]: value }),
    ACTION_TWO: (first, second) => [first, second]
  });

  expect(actionOne('value', 1)).toEqual({
    type: 'ACTION_ONE',
    payload: { value: 1 }
  });
  expect(actionTwo('value', 2)).toEqual({
    type: 'ACTION_TWO',
    payload: ['value', 2]
  });
});

test('honors special delimiters in action types', () => {
  const {
    p: { actionOne },
    q: { actionTwo }
  } = createActions({
    'P/ACTION_ONE': (key, value) => ({ [key]: value }),
    'Q/ACTION_TWO': (first, second) => [first, second]
  });

  expect(actionOne('value', 1)).toEqual({
    type: 'P/ACTION_ONE',
    payload: { value: 1 }
  });
  expect(actionTwo('value', 2)).toEqual({
    type: 'Q/ACTION_TWO',
    payload: ['value', 2]
  });
});

test('uses the identity if the payload creator is undefined in array form', () => {
  const { action1, action2 } = createActions({
    ACTION_1: [undefined, (meta1) => ({ meta1 })],
    ACTION_2: [undefined, ({ value }) => ({ meta2: value })]
  });

  expect(action1(1)).toEqual({
    type: 'ACTION_1',
    payload: 1,
    meta: { meta1: 1 }
  });

  expect(action2({ value: 2 })).toEqual({
    type: 'ACTION_2',
    payload: { value: 2 },
    meta: { meta2: 2 }
  });
});

test('uses the identity and meta creators in array form', () => {
  const { action1, action2 } = createActions({
    ACTION_1: [(value) => ({ value }), (meta1) => ({ meta1 })],
    ACTION_2: [({ value }) => value, ({ value }) => ({ meta2: value })]
  });

  expect(action1(1)).toEqual({
    type: 'ACTION_1',
    payload: { value: 1 },
    meta: { meta1: 1 }
  });

  expect(action2({ value: 2 })).toEqual({
    type: 'ACTION_2',
    payload: 2,
    meta: { meta2: 2 }
  });
});

test('uses identity payload creators for trailing string action types', () => {
  const { action1, action2 } = createActions('ACTION_1', 'ACTION_2');

  expect(action1(1)).toEqual({
    type: 'ACTION_1',
    payload: 1
  });

  expect(action2(2)).toEqual({
    type: 'ACTION_2',
    payload: 2
  });
});

test('creates actions from an action map and action types', () => {
  const { action1, action2, action3, action4 } = createActions(
    {
      ACTION_1: (key, value) => ({ [key]: value }),
      ACTION_2: [(first) => [first], (first, second) => ({ second })]
    },
    'ACTION_3',
    'ACTION_4'
  );

  expect(action1('value', 1)).toEqual({
    type: 'ACTION_1',
    payload: { value: 1 }
  });
  expect(action2('value', 2)).toEqual({
    type: 'ACTION_2',
    payload: ['value'],
    meta: { second: 2 }
  });
  expect(action3(3)).toEqual({
    type: 'ACTION_3',
    payload: 3
  });
  expect(action4(4)).toEqual({
    type: 'ACTION_4',
    payload: 4
  });
});

test('creates actions from a namespaced action map', () => {
  const actionCreators = createActions(
    {
      APP: {
        COUNTER: {
          INCREMENT: (amount) => ({ amount }),
          DECREMENT: (amount) => ({ amount: -amount }),
          SET: undefined
        },
        NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
      },
      LOGIN: (username) => ({ username })
    },
    'ACTION_ONE',
    'ACTION_TWO'
  );

  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'APP/COUNTER/INCREMENT',
    payload: { amount: 1 }
  });
  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'APP/COUNTER/DECREMENT',
    payload: { amount: -1 }
  });
  expect(actionCreators.app.counter.set(100)).toEqual({
    type: 'APP/COUNTER/SET',
    payload: 100
  });
  expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual({
    type: 'APP/NOTIFY',
    payload: { message: 'yangmillstheory: Hello World' }
  });
  expect(actionCreators.login('yangmillstheory')).toEqual({
    type: 'LOGIN',
    payload: { username: 'yangmillstheory' }
  });
  expect(actionCreators.actionOne('one')).toEqual({
    type: 'ACTION_ONE',
    payload: 'one'
  });
  expect(actionCreators.actionTwo('two')).toEqual({
    type: 'ACTION_TWO',
    payload: 'two'
  });
});

test('creates namespaced actions with payload creators in array form', () => {
  const actionCreators = createActions({
    APP: {
      COUNTER: {
        INCREMENT: [
          (amount) => ({ amount }),
          (amount) => ({ key: 'value', amount })
        ],
        DECREMENT: (amount) => ({ amount: -amount })
      },
      NOTIFY: [
        (username, message) => ({ message: `${username}: ${message}` }),
        (username, message) => ({ username, message })
      ]
    }
  });

  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'APP/COUNTER/INCREMENT',
    payload: { amount: 1 },
    meta: { key: 'value', amount: 1 }
  });
  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'APP/COUNTER/DECREMENT',
    payload: { amount: -1 }
  });
  expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual({
    type: 'APP/NOTIFY',
    payload: { message: 'yangmillstheory: Hello World' },
    meta: { username: 'yangmillstheory', message: 'Hello World' }
  });
});

test('creates namespaced actions with a chosen namespace string', () => {
  const actionCreators = createActions(
    {
      APP: {
        COUNTER: {
          INCREMENT: [
            (amount) => ({ amount }),
            (amount) => ({ key: 'value', amount })
          ],
          DECREMENT: (amount) => ({ amount: -amount })
        },
        NOTIFY: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    },
    { namespace: '--' }
  );

  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'APP--COUNTER--INCREMENT',
    payload: { amount: 1 },
    meta: { key: 'value', amount: 1 }
  });
  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'APP--COUNTER--DECREMENT',
    payload: { amount: -1 }
  });
  expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual({
    type: 'APP--NOTIFY',
    payload: { message: 'yangmillstheory: Hello World' },
    meta: { username: 'yangmillstheory', message: 'Hello World' }
  });
});

test('creates prefixed actions if `prefix` option exists', () => {
  const actionCreators = createActions(
    {
      APP: {
        COUNTER: {
          INCREMENT: (amount) => ({ amount }),
          DECREMENT: (amount) => ({ amount: -amount }),
          SET: undefined
        },
        NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
      },
      LOGIN: (username) => ({ username })
    },
    'ACTION_ONE',
    'ACTION_TWO',
    { prefix: 'my-awesome-feature' }
  );

  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'my-awesome-feature/APP/COUNTER/INCREMENT',
    payload: { amount: 1 }
  });

  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'my-awesome-feature/APP/COUNTER/DECREMENT',
    payload: { amount: -1 }
  });

  expect(actionCreators.app.counter.set(100)).toEqual({
    type: 'my-awesome-feature/APP/COUNTER/SET',
    payload: 100
  });

  expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual({
    type: 'my-awesome-feature/APP/NOTIFY',
    payload: { message: 'yangmillstheory: Hello World' }
  });

  expect(actionCreators.login('yangmillstheory')).toEqual({
    type: 'my-awesome-feature/LOGIN',
    payload: { username: 'yangmillstheory' }
  });

  expect(actionCreators.actionOne('one')).toEqual({
    type: 'my-awesome-feature/ACTION_ONE',
    payload: 'one'
  });

  expect(actionCreators.actionTwo('two')).toEqual({
    type: 'my-awesome-feature/ACTION_TWO',
    payload: 'two'
  });
});

test('properly handles `prefix` and `namespace` options provided together', () => {
  const actionCreators = createActions(
    {
      APP: {
        COUNTER: {
          INCREMENT: (amount) => ({ amount }),
          DECREMENT: (amount) => ({ amount: -amount }),
          SET: undefined
        },
        NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
      },
      LOGIN: (username) => ({ username })
    },
    'ACTION_ONE',
    'ACTION_TWO',
    {
      prefix: 'my-awesome-feature',
      namespace: '--'
    }
  );

  expect(actionCreators.app.counter.increment(1)).toEqual({
    type: 'my-awesome-feature--APP--COUNTER--INCREMENT',
    payload: { amount: 1 }
  });

  expect(actionCreators.app.counter.decrement(1)).toEqual({
    type: 'my-awesome-feature--APP--COUNTER--DECREMENT',
    payload: { amount: -1 }
  });

  expect(actionCreators.app.counter.set(100)).toEqual({
    type: 'my-awesome-feature--APP--COUNTER--SET',
    payload: 100
  });

  expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).toEqual({
    type: 'my-awesome-feature--APP--NOTIFY',
    payload: { message: 'yangmillstheory: Hello World' }
  });

  expect(actionCreators.login('yangmillstheory')).toEqual({
    type: 'my-awesome-feature--LOGIN',
    payload: { username: 'yangmillstheory' }
  });

  expect(actionCreators.actionOne('one')).toEqual({
    type: 'my-awesome-feature--ACTION_ONE',
    payload: 'one'
  });

  expect(actionCreators.actionTwo('two')).toEqual({
    type: 'my-awesome-feature--ACTION_TWO',
    payload: 'two'
  });
});
