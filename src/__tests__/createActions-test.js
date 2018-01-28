import { createActions } from '../';
import { expect } from 'chai';

describe('createActions', () => {
  it('should throw an error when given arguments that contain a non-string', () => {
    const expectedError = 'Expected optional object followed by string action types';

    expect(() => createActions(1)).to.throw(Error, expectedError);
    expect(() => createActions({ ACTION_1: undefined }, [])).to.throw(Error, expectedError);
    expect(() => createActions('ACTION_1', true)).to.throw(Error, expectedError);
  });

  it('should throw an error when given bad payload creators', () => {
    expect(
      () => createActions({
        ACTION_1: () => {},
        ACTION_2: 'string'
      })
    ).to.throw(
      Error,
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
    );
  });

  it('should throw an error when given a bad payload or meta creator in array form', () => {
    expect(
      () => createActions({
        ACTION_1: [
          [],
          () => {}
        ]
      })
    ).to.throw(
      Error,
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
    );

    expect(
      () => createActions({
        ACTION_1: [
          () => {},
          () => {}
        ],
        ACTION_2: [
          () => {},
          1
        ]
      })
    ).to.throw(
      Error,
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_2'
    );
  });

  it('should throw an error when no meta creator is given in array form', () => {
    expect(
      () => createActions({
        ACTION_1: [() => {}]
      })
    ).to.throw(
      Error,
      'Expected function, undefined, null, or array with payload and meta functions for ACTION_1'
    );
  });

  it('should return a map of camel-cased action types to action creators', () => {
    const { actionOne, actionTwo } = createActions({
      ACTION_ONE: (key, value) => ({ [key]: value }),
      ACTION_TWO: (first, second) => ([first, second])
    });

    expect(actionOne('value', 1)).to.deep.equal({
      type: 'ACTION_ONE',
      payload: { value: 1 }
    });
    expect(actionTwo('value', 2)).to.deep.equal({
      type: 'ACTION_TWO',
      payload: ['value', 2]
    });
  });

  it('should honor special delimiters in action types', () => {
    const { p: { actionOne }, q: { actionTwo } } = createActions({
      'P/ACTION_ONE': (key, value) => ({ [key]: value }),
      'Q/ACTION_TWO': (first, second) => ([first, second])
    });

    expect(actionOne('value', 1)).to.deep.equal({
      type: 'P/ACTION_ONE',
      payload: { value: 1 }
    });
    expect(actionTwo('value', 2)).to.deep.equal({
      type: 'Q/ACTION_TWO',
      payload: ['value', 2]
    });
  });

  it('should use the identity if the payload creator is undefined in array form', () => {
    const { action1, action2 } = createActions({
      ACTION_1: [
        undefined,
        meta1 => ({ meta1 })
      ],
      ACTION_2: [
        undefined,
        ({ value }) => ({ meta2: value })
      ]
    });

    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: 1,
      meta: { meta1: 1 }
    });

    expect(action2({ value: 2 })).to.deep.equal({
      type: 'ACTION_2',
      payload: { value: 2 },
      meta: { meta2: 2 }
    });
  });

  it('should use the identity and meta creators in array form', () => {
    const { action1, action2 } = createActions({
      ACTION_1: [
        value => ({ value }),
        meta1 => ({ meta1 })
      ],
      ACTION_2: [
        ({ value }) => value,
        ({ value }) => ({ meta2: value })
      ]
    });

    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: { value: 1 },
      meta: { meta1: 1 }
    });

    expect(action2({ value: 2 })).to.deep.equal({
      type: 'ACTION_2',
      payload: 2,
      meta: { meta2: 2 }
    });
  });

  it('should use identity payload creators for trailing string action types', () => {
    const { action1, action2 } = createActions('ACTION_1', 'ACTION_2');

    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: 1
    });

    expect(action2(2)).to.deep.equal({
      type: 'ACTION_2',
      payload: 2
    });
  });

  it('should create actions from an action map and action types', () => {
    const { action1, action2, action3, action4 } = createActions({
      ACTION_1: (key, value) => ({ [key]: value }),
      ACTION_2: [
        (first) => [first],
        (first, second) => ({ second })
      ]
    }, 'ACTION_3', 'ACTION_4');

    expect(action1('value', 1)).to.deep.equal({
      type: 'ACTION_1',
      payload: { value: 1 }
    });
    expect(action2('value', 2)).to.deep.equal({
      type: 'ACTION_2',
      payload: ['value'],
      meta: { second: 2 }
    });
    expect(action3(3)).to.deep.equal({
      type: 'ACTION_3',
      payload: 3
    });
    expect(action4(4)).to.deep.equal({
      type: 'ACTION_4',
      payload: 4
    });
  });

  it('should create actions from a namespaced action map', () => {
    const actionCreators = createActions({
      APP: {
        COUNTER: {
          INCREMENT: amount => ({ amount }),
          DECREMENT: amount => ({ amount: -amount }),
          SET: undefined
        },
        NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
      },
      LOGIN: username => ({ username })
    }, 'ACTION_ONE', 'ACTION_TWO');

    expect(actionCreators.app.counter.increment(1)).to.deep.equal({
      type: 'APP/COUNTER/INCREMENT',
      payload: { amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
      type: 'APP/COUNTER/DECREMENT',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.counter.set(100)).to.deep.equal({
      type: 'APP/COUNTER/SET',
      payload: 100
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
      type: 'APP/NOTIFY',
      payload: { message: 'yangmillstheory: Hello World' }
    });
    expect(actionCreators.login('yangmillstheory')).to.deep.equal({
      type: 'LOGIN',
      payload: { username: 'yangmillstheory' }
    });
    expect(actionCreators.actionOne('one')).to.deep.equal({
      type: 'ACTION_ONE',
      payload: 'one'
    });
    expect(actionCreators.actionTwo('two')).to.deep.equal({
      type: 'ACTION_TWO',
      payload: 'two'
    });
  });

  it('should create namespaced actions with payload creators in array form', () => {
    const actionCreators = createActions({
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

    expect(actionCreators.app.counter.increment(1)).to.deep.equal({
      type: 'APP/COUNTER/INCREMENT',
      payload: { amount: 1 },
      meta: { key: 'value', amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
      type: 'APP/COUNTER/DECREMENT',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
      type: 'APP/NOTIFY',
      payload: { message: 'yangmillstheory: Hello World' },
      meta: { username: 'yangmillstheory', message: 'Hello World' }
    });
  });

  it('should create namespaced actions with a chosen namespace string', () => {
    const actionCreators = createActions({
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
    }, { namespace: '--' });

    expect(actionCreators.app.counter.increment(1)).to.deep.equal({
      type: 'APP--COUNTER--INCREMENT',
      payload: { amount: 1 },
      meta: { key: 'value', amount: 1 }
    });
    expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
      type: 'APP--COUNTER--DECREMENT',
      payload: { amount: -1 }
    });
    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
      type: 'APP--NOTIFY',
      payload: { message: 'yangmillstheory: Hello World' },
      meta: { username: 'yangmillstheory', message: 'Hello World' }
    });
  });

  it.skip('should create prefixed actions if `prefix` option exists', () => {
    const actionCreators = createActions(
      {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount }),
            SET: undefined
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      },
      'ACTION_ONE',
      'ACTION_TWO',
      { prefix: 'my-awesome-feature' },
    );

    expect(actionCreators.app.counter.increment(1)).to.deep.equal({
      type: 'my-awesome-feature/APP/COUNTER/INCREMENT',
      payload: { amount: 1 }
    });

    expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
      type: 'my-awesome-feature/APP/COUNTER/DECREMENT',
      payload: { amount: -1 }
    });

    expect(actionCreators.app.counter.set(100)).to.deep.equal({
      type: 'my-awesome-feature/APP/COUNTER/SET',
      payload: 100
    });

    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
      type: 'my-awesome-feature/APP/NOTIFY',
      payload: { message: 'yangmillstheory: Hello World' }
    });

    expect(actionCreators.login('yangmillstheory')).to.deep.equal({
      type: 'my-awesome-feature/LOGIN',
      payload: { username: 'yangmillstheory' }
    });

    expect(actionCreators.actionOne('one')).to.deep.equal({
      type: 'my-awesome-feature/ACTION_ONE',
      payload: 'one'
    });

    expect(actionCreators.actionTwo('two')).to.deep.equal({
      type: 'my-awesome-feature/ACTION_TWO',
      payload: 'two'
    });
  });

  it.skip('should properly handle `prefix` and `namespace` options provided together', () => {
    const actionCreators = createActions(
      {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount }),
            SET: undefined
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      },
      'ACTION_ONE',
      'ACTION_TWO',
      {
        prefix: 'my-awesome-feature',
        namespace: '--'
      },
    );

    expect(actionCreators.app.counter.increment(1)).to.deep.equal({
      type: 'my-awesome-feature--APP--COUNTER--INCREMENT',
      payload: { amount: 1 }
    });

    expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
      type: 'my-awesome-feature--APP--COUNTER--DECREMENT',
      payload: { amount: -1 }
    });

    expect(actionCreators.app.counter.set(100)).to.deep.equal({
      type: 'my-awesome-feature--APP--COUNTER--SET',
      payload: 100
    });

    expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
      type: 'my-awesome-feature--APP--NOTIFY',
      payload: { message: 'yangmillstheory: Hello World' }
    });

    expect(actionCreators.login('yangmillstheory')).to.deep.equal({
      type: 'my-awesome-feature--LOGIN',
      payload: { username: 'yangmillstheory' }
    });

    expect(actionCreators.actionOne('one')).to.deep.equal({
      type: 'my-awesome-feature--ACTION_ONE',
      payload: 'one'
    });

    expect(actionCreators.actionTwo('two')).to.deep.equal({
      type: 'my-awesome-feature--ACTION_TWO',
      payload: 'two'
    });
  });
});
