import { handleActions } from '../';

describe('handleActions', () => {
  it('create a single handler from a map of multiple action handlers', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { body: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { body: amount }) => ({
        counter: counter - amount
      })
    });

    expect(reducer({ counter: 3 }, { type: 'INCREMENT', body: 7 }))
      .to.deep.equal({
        counter: 10
      });
    expect(reducer({ counter: 10 }, { type: 'DECREMENT', body: 7 }))
      .to.deep.equal({
        counter: 3
      });
  });

  it('accepts a default state as the second parameter', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { body: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { body: amount }) => ({
        counter: counter - amount
      })
    }, { counter: 3 });

    expect(reducer(undefined, { type: 'INCREMENT', body: 7 }))
      .to.deep.equal({
        counter: 10
      });
  });
});
