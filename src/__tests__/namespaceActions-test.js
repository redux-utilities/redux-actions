/* global describe, it, beforeEach */
import {nestActions, unnestActions} from './index'
import {createActions} from 'redux-actions'
import {expect} from 'chai'

describe('createActions', () => {
  describe('scoping', () => {
    const actionsMap = {
      'APP/COUNTER/INCREMENT': amount => ({amount}),
      'APP/COUNTER/DECREMENT': amount => ({amount: -amount}),
      'APP/NOTIFY': (username, message) => ({message: `${username}: ${message}`}),
      LOGIN: username => ({username}),
    }
    let actionCreators

    beforeEach(() => {
      actionCreators = unnestActions(createActions(actionsMap, 'LOGOUT'))
    })

    it('should create top-level action creators', () => {
      expect(actionCreators.login('yangmillstheory')).to.deep.equal({
        type: 'LOGIN',
        payload: {username: 'yangmillstheory'},
      })
      expect(actionCreators.logout()).to.deep.equal({type: 'LOGOUT'})
    })

    it('should create child action creators', () => {
      expect(actionCreators.app.notify('yangmillstheory', 'Hello, World!'))
        .to.deep.equal({
          type: 'APP/NOTIFY',
          message: 'yangmillstheory: Hello, World!',
        })
    })

    it('should create deeply nested action creators', () => {
      expect(actionCreators.app.counter.increment(1)).to.deep.equal({
        type: 'APP/COUNTER/INCREMENT',
        amount: 1,
      })
      expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
        type: 'APP/COUNTER/DECREMENT',
        amount: -1,
      })
    })
  })

  describe('packing', () => {
    it('should pack actions', () => {
      const unnestedActions = {
        APP: {
          COUNTER: {
            INCREMENT: amount => ({amount}),
            DECREMENT: amount => ({amount: -amount}),
          },
          NOTIFY: (username, message) => ({message: `${username}: ${message}`}),
        },
        LOGIN: username => ({username}),
      }

      expect(nestActions(unnestedActions)).to.deep.equal({
        'APP/COUNTER/INCREMENT': unnestedActions.APP.COUNTER.INCREMENT,
        'APP/COUNTER/DECREMENT': unnestedActions.APP.COUNTER.DECREMENT,
        'APP/NOTIFY': unnestedActions.APP.NOTIFY,
        'LOGIN': unnestedActions.LOGIN,
      })
    })

    it('should be case insensitive', () => {
      const unnestedActions = {
        app: {
          counter: {
            increment: amount => ({amount}),
            decrement: amount => ({amount: -amount}),
          },
          notify: (username, message) => ({message: `${username}: ${message}`}),
        },
        login: username => ({username}),
      }

      expect(nestActions(unnestedActions)).to.deep.equal({
        'app/counter/increment': unnestedActions.app.counter.increment,
        'app/counter/decrement': unnestedActions.app.counter.decrement,
        'app/notify': unnestedActions.app.notify,
        'login': unnestedActions.login,
      })
    })
  })
})
