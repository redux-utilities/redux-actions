import { createAction, createActions } from '../';

describe('createActions()', () => {
  describe('resulting action creator map', () => {
    const types = {
      ACTION: 'ACTION',
      MY_LONG_ACTION: 'MY_LONG_ACTION'
    };

    it(`apply a default string transformation function to action types
        when mapping to action creators`, () => {
      const actionCreators = createActions(types);

      expect(actionCreators).to.have.property('action');
      expect(actionCreators).to.have.property('myLongAction');
    });

    it(`may apply a string transformation function to action types
        when mapping to action creators`, () => {
      // upper snake case to kebab case
      const kebabize = s => s.toLowerCase().replace(/_/g, '-');

      const actionCreators = createActions(types, kebabize);

      expect(actionCreators).to.have.property('action');
      expect(actionCreators).to.have.property('my-long-action');
    });
  });
});
