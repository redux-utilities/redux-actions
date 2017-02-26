import { flattenActions, unflattenActions } from '../namespaceActions';
import { expect } from 'chai';

describe('flattenActions', () => {
  it('should flatten an action creators map with the default namespacer', () => {
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

    expect(flattenActions(actionsMap)).to.deep.equal({
      'APP/COUNTER/INCREMENT': actionsMap.APP.COUNTER.INCREMENT,
      'APP/COUNTER/DECREMENT': actionsMap.APP.COUNTER.DECREMENT,
      'APP/NOTIFY': actionsMap.APP.NOTIFY,
      LOGIN: actionsMap.LOGIN
    });
  });

  it('should be casesensitive', () => {
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

    expect(flattenActions(actionsMap)).to.deep.equal({
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

    expect(flattenActions(actionsMap, '-')).to.deep.equal({
      'APP-COUNTER-INCREMENT': actionsMap.APP.COUNTER.INCREMENT,
      'APP-COUNTER-DECREMENT': actionsMap.APP.COUNTER.DECREMENT,
      'APP-NOTIFY': actionsMap.APP.NOTIFY,
      LOGIN: actionsMap.LOGIN
    });
  });
});

describe('unflattenActions', () => {
  beforeEach(() => {
    this.actionsMap = {
      'APP/COUNTER/INCREMENT': amount => ({ amount }),
      'APP/COUNTER/DECREMENT': amount => ({ amount: -amount }),
      'APP/NOTIFY': (username, message) => ({ message: `${username}: ${message}` }),
      LOGIN: username => ({ username })
    };
  });

  it('should unflatten a flattened actions map', () => {
    const actionsMap = unflattenActions(this.actionsMap);

    expect(actionsMap.LOGIN('yangmillstheory')).to.deep.equal({ username: 'yangmillstheory' });
    expect(actionsMap.APP.COUNTER.INCREMENT(100)).to.deep.equal({ amount: 100 });
    expect(actionsMap.APP.COUNTER.DECREMENT(100)).to.deep.equal({ amount: -100 });
    expect(actionsMap.APP.NOTIFY('yangmillstheory', 'Hello World')).to.deep.equal({ message: 'yangmillstheory: Hello World' });
  });
});
