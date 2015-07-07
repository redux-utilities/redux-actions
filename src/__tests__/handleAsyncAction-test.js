import { handleAsyncAction } from '../';

describe('handleAsyncAction()', () => {
  const type = 'TYPE';
  const prevState = { counter: 3 };

  describe('single handler form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAsyncAction('NOTTYPE', () => null);
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('accepts single function as handler which will be used as success handler', () => {
        const reducer = handleAsyncAction(type, (state, action) => ({
          counter: state.counter + action.payload
        }));

        expect(reducer(prevState, { type, payload: 7, meta: { async: 'end' } }))
          .to.deep.equal({
            counter: 10
          });
      });
    });
  });

  describe('map of handlers form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAsyncAction('NOTTYPE', { next: () => null });
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('uses `begin()` if `meta.async` is `begin`', () => {
        const reducer = handleAsyncAction(type, {
          begin: (state, action) => ({
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7, meta: { async: 'begin' } }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('uses `end.next()` if `meta.async` is `end` and action does not represent an error', () => {
        const reducer = handleAsyncAction(type, {
          end: {
            next: (state, action) => ({
              counter: state.counter + action.payload
            })
          }
        });
        expect(reducer(prevState, { type, payload: 7, meta: { async: 'end' } }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('uses `end.throw()` if `meta.async` is `end` and action represents an error', () => {
        const reducer = handleAsyncAction(type, {
          end: {
            throw: (state, action) => ({
              counter: state.counter + action.payload
            })
          }
        });
        expect(reducer(prevState, { type, payload: 7, error: true, meta: { async: 'end' } }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('returns previous state if matching handler is not a function or non-existent', () => {
        const reducer = handleAsyncAction(type, { begin: false });
        expect(reducer(prevState, { type, payload: 123, meta: { async: 'begin' } }))
          .to.equal(prevState);
        expect(reducer(prevState, { type, payload: 123, meta: { async: 'end' } }))
          .to.equal(prevState);
        expect(reducer(prevState, { type, payload: 123, error: true, meta: { async: 'end' } }))
          .to.equal(prevState);
      });

      it('uses the appropriate `end` handler when receiving a non-async action', () => {
        const reducer = handleAsyncAction(type, {
          end: {
            next: (state, action) => ({
              counter: state.counter + action.payload * 2
            }),
            throw: (state, action) => ({
              counter: state.counter + action.payload
            })
          }
        });
        expect(reducer(prevState, { type, payload: 7, error: true}))
          .to.deep.equal({
            counter: 10
          });
        expect(reducer(prevState, { type, payload: 5}))
          .to.deep.equal({
            counter: 13
          });
      });
    });
  });
});
