import { flattenActionMap, unflattenActionCreators } from '../flattenUtils';
import { expect } from 'chai';

describe('namespacing actions', () => {
  describe('flattenActionMap', () => {
    it('should flatten an action map with the default namespacer', () => {
      const actionMap = {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount })
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      };

      expect(flattenActionMap(actionMap)).to.deep.equal({
        'APP/COUNTER/INCREMENT': actionMap.APP.COUNTER.INCREMENT,
        'APP/COUNTER/DECREMENT': actionMap.APP.COUNTER.DECREMENT,
        'APP/NOTIFY': actionMap.APP.NOTIFY,
        LOGIN: actionMap.LOGIN
      });
    });

    it('should do nothing to an already flattened map', () => {
      const actionMap = {
        INCREMENT: amount => ({ amount }),
        DECREMENT: amount => ({ amount: -amount }),
        LOGIN: username => ({ username })
      };

      expect(flattenActionMap(actionMap)).to.deep.equal(actionMap);
    });

    it('should be case-sensitive', () => {
      const actionMap = {
        app: {
          counter: {
            increment: amount => ({ amount }),
            decrement: amount => ({ amount: -amount })
          },
          notify: (username, message) => ({ message: `${username}: ${message}` })
        },
        login: username => ({ username })
      };

      expect(flattenActionMap(actionMap)).to.deep.equal({
        'app/counter/increment': actionMap.app.counter.increment,
        'app/counter/decrement': actionMap.app.counter.decrement,
        'app/notify': actionMap.app.notify,
        login: actionMap.login
      });
    });

    it('should use a custom namespace string', () => {
      const actionMap = {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount })
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      };

      expect(flattenActionMap(actionMap, { namespace: '-' })).to.deep.equal({
        'APP-COUNTER-INCREMENT': actionMap.APP.COUNTER.INCREMENT,
        'APP-COUNTER-DECREMENT': actionMap.APP.COUNTER.DECREMENT,
        'APP-NOTIFY': actionMap.APP.NOTIFY,
        LOGIN: actionMap.LOGIN
      });
    });
  });

  describe('unflattenActionCreators', () => {
    it('should unflatten a flattened action map and camel-case keys', () => {
      const actionMap = unflattenActionCreators({
        'APP/COUNTER/INCREMENT': amount => ({ amount }),
        'APP/COUNTER/DECREMENT': amount => ({ amount: -amount }),
        'APP/NOTIFY': (username, message) => ({ message: `${username}: ${message}` }),
        LOGIN: username => ({ username })
      });

      expect(actionMap.login('yangmillstheory')).to.deep.equal({ username: 'yangmillstheory' });
      expect(actionMap.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
        message: 'yangmillstheory: Hello World'
      });
      expect(actionMap.app.counter.increment(100)).to.deep.equal({ amount: 100 });
      expect(actionMap.app.counter.decrement(100)).to.deep.equal({ amount: -100 });
    });

    it('should unflatten a flattened action map with custom namespace', () => {
      const actionMap = unflattenActionCreators({
        'APP--COUNTER--INCREMENT': amount => ({ amount }),
        'APP--COUNTER--DECREMENT': amount => ({ amount: -amount }),
        'APP--NOTIFY': (username, message) => ({ message: `${username}: ${message}` }),
        LOGIN: username => ({ username })
      }, { namespace: '--' });

      expect(actionMap.login('yangmillstheory')).to.deep.equal({ username: 'yangmillstheory' });
      expect(actionMap.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
        message: 'yangmillstheory: Hello World'
      });
      expect(actionMap.app.counter.increment(100)).to.deep.equal({ amount: 100 });
      expect(actionMap.app.counter.decrement(100)).to.deep.equal({ amount: -100 });
    });
  });
});
