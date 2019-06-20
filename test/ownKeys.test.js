import handleActions from '../src/handleActions';
import ownKeys from '../src/utils/ownKeys';

const defaultState = { counter: 0 };
const expectedValue = ['length', 'name', 'prototype'];

test('should return correct data for a single handler from a map of multiple action handlers', () => {
  const object = handleActions(
    {
      INCREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter - amount
      })
    },
    defaultState
  );
  expect(ownKeys(object)).toEqual(expectedValue);
});

test('should return correct data for a single handler from a JavaScript Map of multiple action handlers', () => {
  const object = handleActions(
    new Map([
      [
        'INCREMENT',
        (state, action) => ({
          counter: state.counter + action.payload
        })
      ],

      [
        'DECREMENT',
        (state, action) => ({
          counter: state.counter - action.payload
        })
      ]
    ]),
    defaultState
  );
  expect(ownKeys(object)).toEqual(expectedValue);
});

test('should return correct data for a single handler from a JavaScript Map of multiple action handlers when Reflect is not supported', () => {
  const object = handleActions(
    new Map([
      [
        'INCREMENT',
        (state, action) => ({
          counter: state.counter + action.payload
        })
      ],

      [
        'DECREMENT',
        (state, action) => ({
          counter: state.counter - action.payload
        })
      ]
    ]),
    defaultState
  );
  window.Reflect = undefined;
  expect(ownKeys(object)).toEqual(expectedValue);
});
