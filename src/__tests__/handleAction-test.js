import { handleAction} from '../';

describe('handleAction()', () => {
  const type = 'TYPE';
  const prevState = { counter: 3 };

  describe('single handler form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', () => null);
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('returns previous state if status defined but not one of "error" or "success"', () => {
        const reducer = handleAction(type, () => null);
        expect(reducer(prevState, { type, status: 'pending' }))
          .to.equal(prevState);
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
    });
  });

  describe('map of handlers form', () => {
    describe('resulting reducer', () => {
      it('returns previous state if type does not match', () => {
        const reducer = handleAction('NOTTYPE', { success: () => null });
        expect(reducer(prevState, { type })).to.equal(prevState);
      });

      it('uses `success()` if status is undefined', () => {
        const reducer = handleAction(type, {
          success: (state, action) => ({
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7 }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('uses `success()` if status is "success"', () => {
        const reducer = handleAction(type, {
          success: (state, action) => ({
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7, status: 'success' }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('uses `error()` if status is "error"', () => {
        const reducer = handleAction(type, {
          error: (state, action) => ({
            counter: state.counter + action.payload
          })
        });
        expect(reducer(prevState, { type, payload: 7, status: 'error' }))
          .to.deep.equal({
            counter: 10
          });
      });

      it('returns previous state if status defined but not one of "error" or "success"', () => {
        const reducer = handleAction(type, { success: () => null });
        expect(reducer(prevState, { type, status: 'pending' }))
          .to.equal(prevState);
      });

      it('throws if matching handler is not function', () => {
        const reducer = handleAction(type, { success: null, error: 123 });
        expect(() => reducer(prevState, { type, status: 'success' }))
          .to.throw(/is not a function/);
        expect(() => reducer(prevState, { type, status: 'error' }))
          .to.throw(/is not a function/);
      });
    });
  });
});
