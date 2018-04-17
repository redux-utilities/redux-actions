import handleAction from '../src/handleAction';
import createAction from '../src/createAction';
import createActions from '../src/createActions';
import combineActions from '../src/combineActions';

const type = 'TYPE';
const prevState = { counter: 3 };
const defaultState = { counter: 0 };

test('throws an error if the reducer is the wrong type', () => {
  const wrongTypeReducers = [1, 'string', [], null];

  wrongTypeReducers.forEach(wrongTypeReducer => {
    expect(() => {
      handleAction(type, wrongTypeReducer, defaultState);
    }).toThrow(
      'Expected reducer to be a function or object with next and throw reducers'
    );
  });
});

test('uses the identity if the specified reducer is undefined', () => {
  const reducer = handleAction(type, undefined, defaultState);

  expect(reducer(prevState, { type })).toBe(prevState);
  expect(reducer(prevState, { type, error: true, payload: new Error() })).toBe(
    prevState
  );
});

test('single handler form - throw an error if defaultState is not specified', () => {
  expect(() => {
    handleAction(type, undefined);
  }).toThrow('defaultState for reducer handling TYPE should be defined');
});

test('single handler form - resulting reducer - returns previous state if type does not match', () => {
  const reducer = handleAction('NOTTYPE', () => null, defaultState);
  expect(reducer(prevState, { type })).toBe(prevState);
});

test('single handler form - resulting reducer - returns default state if type does not match', () => {
  const reducer = handleAction('NOTTYPE', () => null, { counter: 7 });
  expect(reducer(undefined, { type })).toEqual({
    counter: 7
  });
});

test('single handler form - resulting reducer - accepts single function as handler', () => {
  const reducer = handleAction(
    type,
    (state, action) => ({
      counter: state.counter + action.payload
    }),
    defaultState
  );
  expect(reducer(prevState, { type, payload: 7 })).toEqual({
    counter: 10
  });
});

test('single handler form - resulting reducer - accepts action function as action type', () => {
  const incrementAction = createAction(type);
  const reducer = handleAction(
    incrementAction,
    (state, action) => ({
      counter: state.counter + action.payload
    }),
    defaultState
  );

  expect(reducer(prevState, incrementAction(7))).toEqual({
    counter: 10
  });
});

test('single handler form - resulting reducer - accepts a default state used when the previous state is undefined', () => {
  const reducer = handleAction(
    type,
    (state, action) => ({
      counter: state.counter + action.payload
    }),
    { counter: 3 }
  );

  expect(reducer(undefined, { type, payload: 7 })).toEqual({
    counter: 10
  });
});

test('single handler form - resulting reducer - works with createActions action creators', () => {
  const { increment } = createActions('INCREMENT');

  const reducer = handleAction(
    increment,
    (state, { payload }) => ({
      counter: state.counter + payload
    }),
    defaultState
  );

  expect(reducer(undefined, increment(7))).toEqual({
    counter: 7
  });
});

test('single handler form - resulting reducer - not throws and returns state when action is non-FSA', () => {
  const reducer = handleAction(type, state => state, defaultState);
  const action = {
    foo: {
      bar: 'baz'
    }
  };

  expect(() => reducer(undefined, action)).not.toThrow();
  expect(reducer(undefined, action)).toEqual({
    counter: 0
  });
});

test('map of handlers form - throws an error if defaultState is not specified', () => {
  expect(() => {
    handleAction(type, { next: () => null });
  }).toThrow('defaultState for reducer handling TYPE should be defined');
});

test('map of handlers form - resulting reducer - returns previous state if type does not match', () => {
  const reducer = handleAction('NOTTYPE', { next: () => null }, defaultState);
  expect(reducer(prevState, { type })).toBe(prevState);
});

test('map of handlers form - resulting reducer - uses `next()` if action does not represent an error', () => {
  const reducer = handleAction(
    type,
    {
      next: (state, action) => ({
        counter: state.counter + action.payload
      })
    },
    defaultState
  );
  expect(reducer(prevState, { type, payload: 7 })).toEqual({
    counter: 10
  });
});

test('map of handlers form - resulting reducer - uses `throw()` if action represents an error', () => {
  const reducer = handleAction(
    type,
    {
      throw: (state, action) => ({
        counter: state.counter + action.payload
      })
    },
    defaultState
  );

  expect(reducer(prevState, { type, payload: 7, error: true })).toEqual({
    counter: 10
  });
});

test('map of handlers form - resulting reducer - returns previous state if matching handler is not function', () => {
  const reducer = handleAction(type, { next: null, error: 123 }, defaultState);
  expect(reducer(prevState, { type, payload: 123 })).toBe(prevState);
  expect(reducer(prevState, { type, payload: 123, error: true })).toBe(
    prevState
  );
});

test('with combined actions - handle combined actions in reducer form', () => {
  const action1 = createAction('ACTION_1');
  const reducer = handleAction(
    combineActions(action1, 'ACTION_2', 'ACTION_3'),
    (state, { payload }) => ({ ...state, number: state.number + payload }),
    defaultState
  );

  expect(reducer({ number: 1 }, action1(1))).toEqual({ number: 2 });
  expect(reducer({ number: 1 }, { type: 'ACTION_2', payload: 2 })).toEqual({
    number: 3
  });
  expect(reducer({ number: 1 }, { type: 'ACTION_3', payload: 3 })).toEqual({
    number: 4
  });
});

test('with combined actions - handles combined actions in next/throw form', () => {
  const action1 = createAction('ACTION_1');
  const reducer = handleAction(
    combineActions(action1, 'ACTION_2', 'ACTION_3'),
    {
      next(state, { payload }) {
        return { ...state, number: state.number + payload };
      }
    },
    defaultState
  );

  expect(reducer({ number: 1 }, action1(1))).toEqual({ number: 2 });
  expect(reducer({ number: 1 }, { type: 'ACTION_2', payload: 2 })).toEqual({
    number: 3
  });
  expect(reducer({ number: 1 }, { type: 'ACTION_3', payload: 3 })).toEqual({
    number: 4
  });
});

test('with combined actions - handles combined error actions', () => {
  const action1 = createAction('ACTION_1');
  const reducer = handleAction(
    combineActions(action1, 'ACTION_2', 'ACTION_3'),
    {
      next(state, { payload }) {
        return { ...state, number: state.number + payload };
      },

      throw(state) {
        return { ...state, threw: true };
      }
    },
    defaultState
  );
  const error = new Error();

  expect(reducer({ number: 0 }, action1(error))).toEqual({
    number: 0,
    threw: true
  });
  expect(
    reducer({ number: 0 }, { type: 'ACTION_2', payload: error, error: true })
  ).toEqual({ number: 0, threw: true });
  expect(
    reducer({ number: 0 }, { type: 'ACTION_3', payload: error, error: true })
  ).toEqual({ number: 0, threw: true });
});

test('with combined actions - returns previous state if action is not one of the combined actions', () => {
  const reducer = handleAction(
    combineActions('ACTION_1', 'ACTION_2'),
    (state, { payload }) => ({ ...state, state: state.number + payload }),
    defaultState
  );

  const state = { number: 0 };

  expect(reducer(state, { type: 'ACTION_3', payload: 1 })).toBe(state);
});

test('with combined actions - uses the default state if the initial state is undefined', () => {
  const reducer = handleAction(
    combineActions('INCREMENT', 'DECREMENT'),
    (state, { payload }) => ({ ...state, counter: state.counter + payload }),
    defaultState
  );

  expect(reducer(undefined, { type: 'INCREMENT', payload: +1 })).toEqual({
    counter: +1
  });
  expect(reducer(undefined, { type: 'DECREMENT', payload: -1 })).toEqual({
    counter: -1
  });
});

test('with combined actions - handles combined actions with symbols', () => {
  const action1 = createAction('ACTION_1');
  const action2 = Symbol('ACTION_2');
  const action3 = createAction(Symbol('ACTION_3'));
  const reducer = handleAction(
    combineActions(action1, action2, action3),
    (state, { payload }) => ({ ...state, number: state.number + payload }),
    defaultState
  );

  expect(reducer({ number: 0 }, action1(1))).toEqual({ number: 1 });
  expect(reducer({ number: 0 }, { type: action2, payload: 2 })).toEqual({
    number: 2
  });
  expect(
    reducer({ number: 0 }, { type: Symbol('ACTION_3'), payload: 3 })
  ).toEqual({ number: 3 });
});
