import { handleActions } from '../';

describe('handleActions', () => {
  it('create a single handler from a map of multiple action handlers', () => {
    const reducer = handleActions({
      INCREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter + amount
      }),

      DECREMENT: ({ counter }, { payload: amount }) => ({
        counter: counter - amount
      }),

      ASYNC_TEST: {
        begin: ({ counter}, { payload: amount }) => ({
          counter: counter + amount * 2
        }),
        end: {
          next: ({ counter}, { payload: amount }) => ({
            counter: counter + amount * 3
          }),

          throw: ({ counter}, { payload: amount }) => ({
            counter: counter + amount * 4
          })
        }
      }
    });

    expect(reducer({ counter: 3 }, { type: 'INCREMENT', payload: 7 }))
      .to.deep.equal({
        counter: 10
      });
    expect(reducer({ counter: 10 }, { type: 'DECREMENT', payload: 7 }))
      .to.deep.equal({
        counter: 3
      });

    expect(reducer({ counter: 10 }, { type: 'ASYNC_TEST', payload: 2, meta: { async: 'begin' }}))
      .to.deep.equal({
        counter: 14
      });
    expect(reducer({ counter: 10 }, { type: 'ASYNC_TEST', payload: 2, meta: { async: 'end' }}))
      .to.deep.equal({
        counter: 16
      });
    expect(reducer({ counter: 10 }, { type: 'ASYNC_TEST', payload: 2, error: true, meta: { async: 'end' }}))
      .to.deep.equal({
        counter: 18
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
