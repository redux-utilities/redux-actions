import { flattenActionsMap, unflattenActionCreators } from '../namespaceActions';
import { expect } from 'chai';

describe('namespacing actions', () => {
  describe('flattenActionsMap', () => {
    it('should flatten an actions map with the default namespacer', () => {
      const actionsMap = {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount })
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      };

      expect(flattenActionsMap(actionsMap)).to.deep.equal({
        'APP/COUNTER/INCREMENT': actionsMap.APP.COUNTER.INCREMENT,
        'APP/COUNTER/DECREMENT': actionsMap.APP.COUNTER.DECREMENT,
        'APP/NOTIFY': actionsMap.APP.NOTIFY,
        LOGIN: actionsMap.LOGIN
      });
    });

    it('should do nothing to an already flattened map', () => {
      const actionsMap = {
        INCREMENT: amount => ({ amount }),
        DECREMENT: amount => ({ amount: -amount }),
        LOGIN: username => ({ username })
      };

      expect(flattenActionsMap(actionsMap)).to.deep.equal(actionsMap);
    });

    it('should be case-sensitive', () => {
      const actionsMap = {
        app: {
          counter: {
            increment: amount => ({ amount }),
            decrement: amount => ({ amount: -amount })
          },
          notify: (username, message) => ({ message: `${username}: ${message}` })
        },
        login: username => ({ username })
      };

      expect(flattenActionsMap(actionsMap)).to.deep.equal({
        'app/counter/increment': actionsMap.app.counter.increment,
        'app/counter/decrement': actionsMap.app.counter.decrement,
        'app/notify': actionsMap.app.notify,
        login: actionsMap.login
      });
    });

    it('should use a custom namespace string', () => {
      const actionsMap = {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({ amount }),
            DECREMENT: amount => ({ amount: -amount })
          },
          NOTIFY: (username, message) => ({ message: `${username}: ${message}` })
        },
        LOGIN: username => ({ username })
      };

      expect(flattenActionsMap(actionsMap, '-')).to.deep.equal({
        'APP-COUNTER-INCREMENT': actionsMap.APP.COUNTER.INCREMENT,
        'APP-COUNTER-DECREMENT': actionsMap.APP.COUNTER.DECREMENT,
        'APP-NOTIFY': actionsMap.APP.NOTIFY,
        LOGIN: actionsMap.LOGIN
      });
    });
  });

  describe('unflattenActionCreators', () => {
    it('should unflatten a flattened action creators map and camel-case keys', () => {
      const actionsMap = unflattenActionCreators({
        'APP/COUNTER/INCREMENT': amount => ({ amount }),
        'APP/COUNTER/DECREMENT': amount => ({ amount: -amount }),
        'APP/NOTIFY': (username, message) => ({ message: `${username}: ${message}` }),
        LOGIN: username => ({ username })
      });

      expect(actionsMap.login('yangmillstheory')).to.deep.equal({ username: 'yangmillstheory' });
      expect(actionsMap.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
        message: 'yangmillstheory: Hello World'
      });
      expect(actionsMap.app.counter.increment(100)).to.deep.equal({ amount: 100 });
      expect(actionsMap.app.counter.decrement(100)).to.deep.equal({ amount: -100 });
    });

    it('should unflatten a flattened action creators map with custom namespace', () => {
      const actionsMap = unflattenActionCreators({
        'APP--COUNTER--INCREMENT': amount => ({ amount }),
        'APP--COUNTER--DECREMENT': amount => ({ amount: -amount }),
        'APP--NOTIFY': (username, message) => ({ message: `${username}: ${message}` }),
        LOGIN: username => ({ username })
      }, '--');

      expect(actionsMap.login('yangmillstheory')).to.deep.equal({ username: 'yangmillstheory' });
      expect(actionsMap.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
        message: 'yangmillstheory: Hello World'
      });
      expect(actionsMap.app.counter.increment(100)).to.deep.equal({ amount: 100 });
      expect(actionsMap.app.counter.decrement(100)).to.deep.equal({ amount: -100 });
    });
  });
});
