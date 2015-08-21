import { handleAction } from '../';
import { spy } from 'sinon';

describe('handleAction()', () => {
  const type = 'TYPE';
  const prevState = { counter: 3 };

  describe('single handler form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', () => null);
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('accepts single function as handler', () => {
        const reducer = handleAction(type, (state, action) => ({
          ...state,
          counter: state.counter + action.payload
        }));
        expect(reducer(prevState, { type, payload: 7 }))
          .to.eql({
            counter: 10
          });
      });

      it('passes extra arguments to handler', () => {
        const reducerSpy = spy();
        const reducer = handleAction(type, reducerSpy);
        const action = { type, payload: 7 };

        reducer(prevState, action, 'foo', 'bar');

        expect(reducerSpy.calledWith(prevState, action, 'foo', 'bar')).to.be.ok;
      });
    });
  });

  describe('map of handlers form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', { next: () => null });
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('uses `start()` if action signals start of action sequence', () => {
        const reducer = handleAction(type, {
          start: (state, action) => ({
            ...state,
            pending: [...state.pending, action.sequence.id]
          })
        });
        const initialState = { counter: 3, pending: [] };
        const action = { type, sequence: { type: 'start', id: 123 } };
        expect(reducer(initialState, action))
          .to.eql({
            counter: 3,
            pending: [123]
          });
      });

      it('uses `next()` if action does not represent an error', () => {
        const reducer = handleAction(type, {
          next: (state, action) => ({
            ...state,
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7 }))
          .to.eql({
            counter: 10
          });
      });

      it('uses `error()` if action represents an error', () => {
        const reducer = handleAction(type, {
          error: (state, action) => ({
            ...state,
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7, error: true }))
          .to.eql({
            counter: 10
          });
      });

      it('uses `complete()` if action signals end of action sequence', () => {
        const reducer = handleAction(type, {
          complete: (state, action) => ({
            ...state,
            pending: state.pending.filter(id => id !== action.sequence.id)
          })
        });
        const initialState = { counter: 3, pending: [123, 456, 789] };
        const action = { type, sequence: { type: 'complete', id: 123 } };
        expect(reducer(initialState, action))
          .to.eql({
            counter: 3,
            pending: [456, 789]
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
