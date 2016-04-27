import { createAction } from '../';
import { createActions } from '../';
import isPlainObject from 'lodash.isplainobject';

describe('createActions()', () => {
  describe('resulting action creator map', () => {
    const types = { 
      ACTION: 'ACTION',
      MY_LONG_ACTION: 'MY_LONG_ACTION'
    };

    it('apply a default string transformation function to action types when mapping to action creators', () => {
      const actual = createActions(types);
      const expected = {
        action: createAction(types.ACTION),
        myLongAction: createAction(types.MY_LONG_ACTION)
      };
    
      expect(actual).to.deep.equal(expected);
    });
    
    it('may apply a string transformation function to action types when mapping to action creators', () => {
      // upper snake case to kebab case
      const kebabize = s => s.toLowerCase().replace('_', '-');
      
      const actual = createActions(types, kebabize);
      const expected = {
        'action': createAction(types.ACTION),
        'my-long-action': createAction(types.MY_LONG_ACTION)
      };
    
      expect(actual).to.deep.equal(expected);
    });
  });
});
