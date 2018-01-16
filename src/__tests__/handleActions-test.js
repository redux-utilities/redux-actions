import { expect } from 'chai';
import { handleActions, createAction, createActions, combineActions } from '../';

describe('handleActions', () => {
  const defaultState = { counter: 0 };

  it('should throw an error when defaultState is not defined', () => {
    expect(() => {
      handleActions({
        INCREMENT: ({ counter }, { payload: amount }) => ({
          counter: counter + amount
        }),

        DECREMENT: ({ counter }, { payload: amount }) => ({
          counter: counter - amount
        })
      });
    }).to.throw(
      Error,
      'defaultState for reducer handling INCREMENT should be defined'
    );
  });

  it('should throw an error when defaultState is not defined for combinedActions', () => {
    expect(() => {
      handleActions({
        [
          combineActions(
            'INCREMENT',
            'DECREMENT'
          )
        ]: ({ counter }, { type, payload: amount }) => ({
          counter: counter + (type === 'INCREMENT' ? +1 : -1) * amount
        })
      });
    }).to.throw(
      Error,
      'defaultState for reducer handling INCREMENT, DECREMENT should be defined'
    );
  });

  it('create a single handler from a map of multiple action handlers', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter - amount
      })
    }, defaultState);

    expect(reducer({ counter: 3 }, { type: 'INCREMENT', payload: 7 }))
      .to.deep.equal({
        counter: 10
      });
    expect(reducer({ counter: 10 }, { type: 'DECREMENT', payload: 7 }))
      .to.deep.equal({
        counter: 3
      });
  });

  it('works with symbol action types', () => {
    const INCREMENT = Symbol();

    const reducer = handleActions({
      [INCREMENT]: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      })
    }, defaultState);

    expect(reducer({ counter: 3 }, { type: INCREMENT, payload: 7 }))
      .to.deep.equal({
        counter: 10
      });
  });

  it('accepts a default state used when previous state is undefined', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter - amount
      })
    }, { counter: 3 });

    expect(reducer(undefined, { type: 'INCREMENT', payload: 7 }))
      .to.deep.equal({
        counter: 10
      });
  });

  it('accepts action function as action type', () => {
    const incrementAction = createAction('INCREMENT');
    const reducer = handleActions({
      [incrementAction]: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      })
    }, defaultState);

    expect(reducer({ counter: 3 }, incrementAction(7)))
      .to.deep.equal({
        counter: 10
      });
  });

  it('should accept combined actions as action types in single reducer form', () => {
    const { increment, decrement } = createActions({
      INCREMENT: amount => ({ amount }),
      DECREMENT: amount => ({ amount: -amount })
    });

    const initialState = { counter: 10 };

    const reducer = handleActions({
      [combineActions(increment, decrement)](state, { payload: { amount } }) {
        return { ...state, counter: state.counter + amount };
      }
    }, defaultState);

    expect(reducer(initialState, increment(5))).to.deep.equal({ counter: 15 });
    expect(reducer(initialState, decrement(5))).to.deep.equal({ counter: 5 });
    expect(reducer(initialState, { type: 'NOT_TYPE', payload: 1000 })).to.equal(initialState);
    expect(reducer(undefined, increment(5))).to.deep.equal({ counter: 5 });
  });

  it('should accept a regexp as action types in single reducer form', () => {
    const { a: { action1, b: { action2 } }, c: { actionX } } = createActions({
      a: {
        action1: undefined,
        b: {
          action2: undefined
        }
      },
      c: {
        actionX: undefined
      }
    });

    const reducer = handleActions({
      [/.*action(\d+)?$/](state, { payload: value }) {
        return value;
      }
    }, {});

    expect(reducer(undefined, action1(1))).to.deep.equal(1);
    expect(reducer(undefined, action2(2))).to.deep.equal(2);
    expect(reducer(0, actionX('x'))).to.deep.equal(0);
  });

  it('should accept combined actions as action types in the next/throw form', () => {
    const { increment, decrement } = createActions({
      INCREMENT: amount => ({ amount }),
      DECREMENT: amount => ({ amount: -amount })
    });

    const initialState = { counter: 10 };

    const reducer = handleActions({
      [combineActions(increment, decrement)]: {
        next(state, { payload: { amount } }) {
          return { ...state, counter: state.counter + amount };
        },

        throw(state) {
          return { ...state, counter: 0 };
        }
      }
    }, defaultState);
    const error = new Error;

    // non-errors
    expect(reducer(initialState, increment(5))).to.deep.equal({ counter: 15 });
    expect(reducer(initialState, decrement(5))).to.deep.equal({ counter: 5 });
    expect(reducer(initialState, { type: 'NOT_TYPE', payload: 1000 })).to.equal(initialState);
    expect(reducer(undefined, increment(5))).to.deep.equal({ counter: 5 });

    // errors
    expect(
      reducer(initialState, { type: 'INCREMENT', payload: error, error: true })
    ).to.deep.equal({ counter: 0 });
    expect(
      reducer(initialState, decrement(error))
    ).to.deep.equal({ counter: 0 });
  });

  it('should work with createActions action creators', () => {
    const { increment, decrement } = createActions('INCREMENT', 'DECREMENT');

    const reducer = handleActions({
      [increment]: ({ counter }, { payload }) => ({
        counter: counter + payload
      }),

      [decrement]: ({ counter }, { payload }) => ({
        counter: counter - payload
      })
    }, defaultState);

    expect(reducer({ counter: 3 }, increment(2)))
      .to.deep.equal({
        counter: 5
      });
    expect(reducer({ counter: 10 }, decrement(3)))
      .to.deep.equal({
        counter: 7
      });
  });

  it('should work with namespaced actions', () => {
    const {
      app: {
        counter: {
          increment,
          decrement
        },
        notify
      }
    } = createActions({
      APP: {
        COUNTER: {
          INCREMENT: [
            amount => ({ amount }),
            amount => ({ key: 'value', amount })
          ],
          DECREMENT: amount => ({ amount: -amount })
        },
        NOTIFY: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    });

    // note: we should be using combineReducers in production, but this is just a test
    const reducer = handleActions({
      [combineActions(increment, decrement)]: ({ counter, message }, { payload: { amount } }) => ({
        counter: counter + amount,
        message
      }),

      [notify]: ({ counter, message }, { payload }) => ({
        counter,
        message: `${message}---${payload.message}`
      })
    }, { counter: 0, message: '' });

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).to.deep.equal({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).to.deep.equal({
      counter: 7,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))).to.deep.equal({
      counter: 10,
      message: 'hello---me: goodbye'
    });
  });

  it('should return default state with empty handlers and undefined previous state', () => {
    const { unhandled } = createActions('UNHANDLED');
    const reducer = handleActions({}, defaultState);

    expect(reducer(undefined, unhandled())).to.deep.equal(defaultState);
  });

  it('should return previous defined state with empty handlers', () => {
    const { unhandled } = createActions('UNHANDLED');
    const reducer = handleActions({}, defaultState);

    expect(reducer({ counter: 10 }, unhandled())).to.deep.equal({ counter: 10 });
  });

  it('should throw an error if handlers object has the wrong type', () => {
    const wrongTypeHandlers = [1, 'string', [], null];

    wrongTypeHandlers.forEach(wrongTypeHandler => {
      expect(
        () => handleActions(wrongTypeHandler, defaultState)
      ).to.throw(Error, 'Expected handlers to be a plain object.');
    });
  });

  it('should work with nested reducerMap', () => {
    const {
      app: {
        counter: {
          increment,
          decrement
        },
        notify
      }
    } = createActions({
      APP: {
        COUNTER: {
          INCREMENT: [
            amount => ({ amount }),
            amount => ({ key: 'value', amount })
          ],
          DECREMENT: amount => ({ amount: -amount })
        },
        NOTIFY: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    });

    // note: we should be using combineReducers in production, but this is just a test
    const reducer = handleActions({
      [combineActions(increment, decrement)]: ({ counter, message }, { payload: { amount } }) => ({
        counter: counter + amount,
        message
      }),

      APP: {
        NOTIFY: {
          next: ({ counter, message }, { payload }) => ({
            counter,
            message: `${message}---${payload.message}`
          }),
          throw: ({ counter, message }, { payload }) => ({
            counter: 0,
            message: `${message}-x-${payload.message}`
          })
        }
      }
    }, { counter: 0, message: '' });

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).to.deep.equal({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).to.deep.equal({
      counter: 7,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))).to.deep.equal({
      counter: 10,
      message: 'hello---me: goodbye'
    });

    const error = new Error('no notification');
    expect(reducer({ counter: 10, message: 'hello' }, notify(error))).to.deep.equal({
      counter: 0,
      message: 'hello-x-no notification'
    });
  });

  it('should work with nested reducerMap and namespace', () => {
    const {
      app: {
        counter: {
          increment,
          decrement
        },
        notify
      }
    } = createActions({
      APP: {
        COUNTER: {
          INCREMENT: [
            amount => ({ amount }),
            amount => ({ key: 'value', amount })
          ],
          DECREMENT: amount => ({ amount: -amount })
        },
        NOTIFY: [
          (username, message) => ({ message: `${username}: ${message}` }),
          (username, message) => ({ username, message })
        ]
      }
    }, { namespace: ':' });

    // note: we should be using combineReducers in production, but this is just a test
    const reducer = handleActions({
      [combineActions(increment, decrement)]: ({ counter, message }, { payload: { amount } }) => ({
        counter: counter + amount,
        message
      }),

      APP: {
        NOTIFY: {
          next: ({ counter, message }, { payload }) => ({
            counter,
            message: `${message}---${payload.message}`
          }),
          throw: ({ counter, message }, { payload }) => ({
            counter: 0,
            message: `${message}-x-${payload.message}`
          })
        }
      }
    }, { counter: 0, message: '' }, { namespace: ':' });

    expect(String(increment)).to.equal('APP:COUNTER:INCREMENT');

    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).to.deep.equal({
      counter: 5,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, decrement(3))).to.deep.equal({
      counter: 7,
      message: 'hello'
    });
    expect(reducer({ counter: 10, message: 'hello' }, notify('me', 'goodbye'))).to.deep.equal({
      counter: 10,
      message: 'hello---me: goodbye'
    });

    const error = new Error('no notification');
    expect(reducer({ counter: 10, message: 'hello' }, notify(error))).to.deep.equal({
      counter: 0,
      message: 'hello-x-no notification'
    });
  });

  it('should work with nested reducerMap and identity handlers', () => {
    const noop = createAction('APP/NOOP');
    const increment = createAction('APP/INCREMENT');

    const reducer = handleActions({
      APP: {
        NOOP: undefined,
        INCREMENT: {
          next: (state, { payload }) => ({
            ...state,
            counter: state.counter + payload
          }),
          throw: null
        }
      }
    }, { counter: 0, message: '' });

    expect(reducer({ counter: 3, message: 'hello' }, noop('anything'))).to.deep.equal({
      counter: 3,
      message: 'hello'
    });
    expect(reducer({ counter: 3, message: 'hello' }, increment(2))).to.deep.equal({
      counter: 5,
      message: 'hello'
    });

    const error = new Error('cannot increment by Infinity');
    expect(reducer({ counter: 3, message: 'hello' }, increment(error))).to.deep.equal({
      counter: 3,
      message: 'hello'
    });
  });
});
