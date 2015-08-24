import { handleActions } from '../';

describe('handleActions', () => {
  it('create a single handler from a map of multiple action handlers', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter - amount
      })
    });

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
    });

    expect(reducer({ counter: 3 }, { type: INCREMENT, payload: 7 }))
      .to.deep.equal({
        counter: 10
      });
  });

  it('accepts a default state as the second parameter', () => {
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
});
