import { expect } from 'chai';
import { handleAction, createAction, createActions } from '../';

describe('handleAction()', () => {
  const type = 'TYPE';
  const prevState = { counter: 3 };

  describe('single handler form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', () => null);
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('returns default state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', () => null, { counter: 7 });
        expect(reducer(undefined, { type }))
          .to.deep.equal({
            counter: 7
          });
      });

      it('accepts single function as handler', () => {
        const reducer = handleAction(type, (state, action) => ({
          counter: state.counter + action.payload
        }));
        expect(reducer(prevState, { type, payload: 7 }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('accepts action function as action type', () => {
        const incrementAction = createAction(type);
        const reducer = handleAction(incrementAction, (state, action) => ({
          counter: state.counter + action.payload
        }));

        expect(reducer(prevState, incrementAction(7)))
          .to.deep.equal({
            counter: 10
          });
      });

      it('accepts single function as handler and a default state', () => {
        const reducer = handleAction(type, (state, action) => ({
          counter: state.counter + action.payload
        }), { counter: 3 });
        expect(reducer(undefined, { type, payload: 7 }))
          .to.deep.equal({
            counter: 10
          });
      });
      
      it('should work with createActions action creators', () => {
        const { increment } = createActions('INCREMENT')
        
        const reducer = handleAction(increment, (state, { payload }) => ({
          counter: state.counter + payload
        }), { counter: 3 });

        expect(reducer(undefined, increment(7)))
          .to.deep.equal({
            counter: 10
          });
      })
    });
  });

  describe('map of handlers form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', { next: () => null });
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('uses `next()` if action does not represent an error', () => {
        const reducer = handleAction(type, {
          next: (state, action) => ({
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7 }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('uses `throw()` if action represents an error', () => {
        const reducer = handleAction(type, {
          throw: (state, action) => ({
            counter: state.counter + action.payload
          })
        });

        expect(reducer(prevState, { type, payload: 7, error: true }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('returns previous state if matching handler is not function', () => {
        const reducer = handleAction(type, { next: null, error: 123 });
        expect(reducer(prevState, { type, payload: 123 })).to.equal(prevState);
        expect(reducer(prevState, { type, payload: 123, error: true }))
          .to.equal(prevState);
      });
    });
  });
});
