# API Reference

* [Methods](#methods)
  * [createAction](#createaction)
    * [`createAction(type)`](#createactiontype)
    * [`createAction(type, payloadCreator)`](#createactiontype-payloadcreator)
    * [`createAction(type, payloadCreator, metaCreator)`](#createactiontype-payloadcreator-metacreator)
  * [createActions](#createactions)
    * [`createActions(actionMap)`](#createactionsactionmap)
    * [`createActions(actionMap, ...identityActions)`](#createactionsactionmap-identityactions)
  * [handleAction](#handleaction)
    * [`handleAction(type, reducer, defaultState)`](#handleactiontype-reducer-defaultstate)
    * [`handleAction(type, reducerMap, defaultState)`](#handleactiontype-reducermap-defaultstate)
  * [handleActions](#handleactions)
    * [`handleActions(reducerMap, defaultState)`](#handleactionsreducermap-defaultstate)
  * [combineActions](#combineactions)
    * [`combineActions(...types)`](#combineactionstypes)

## Methods

### createAction

```js
createAction(
  type,
  payloadCreator = Identity,
  ?metaCreator
)
```

Wraps an action creator so that its return value is the payload of a Flux Standard Action.

```js
import { createAction } from 'redux-actions';
```

**NOTE:** The more correct name for this function is probably `createActionCreator()`, but that seems a bit redundant.

#### `createAction(type)` {#createactiontype}

Calling `createAction` with a `type` will return an action creator for dispatching actions. `type` must implement `toString` and is the only required parameter for `createAction`.

###### EXAMPLE

```js
export const increment = createAction('INCREMENT')
export const decrement = createAction('DECREMENT')

increment() // { type: 'INCREMENT' }
decrement() // { type: 'DECREMENT' }
increment(10) // { type: 'INCREMENT', payload: 10 }
decrement([1, 42]) // { type: 'DECREMENT', payload: [1, 42] }
```

#### `createAction(type, payloadCreator)` {#createactiontype-payloadcreator}

`payloadCreator` must be a function, `undefined`, or `null`. If `payloadCreator` is `undefined` or `null`, the identity function is used.

###### EXAMPLE

```js
let noop = createAction('NOOP', amount => amount);
// same as
noop = createAction('NOOP');

expect(noop(42)).to.deep.equal({
  type: 'NOOP',
  payload: 42
});
```


#### `createAction(type, payloadCreator, metaCreator)` {#createactiontype-payloadcreator-metacreator}

`metaCreator` is an optional function that creates metadata for the payload. It receives the same arguments as the payload creator, but its result becomes the meta field of the resulting action. If `metaCreator` is undefined or not a function, the meta field is omitted.

###### EXAMPLE

```js
TODO METACREATOR EXAMPLE
```

If the payload is an instance of an [Error  
object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),  
redux-actions will automatically set `action.error` to true.

###### EXAMPLE

```js
const noop = createAction('NOOP');

const error = new TypeError('not a number');
expect(noop(error)).to.deep.equal({
  type: 'NOOP',
  payload: error,
  error: true
});
```

`createAction` also returns its `type` when used as type in `handleAction` or `handleActions`.

###### EXAMPLE

```js
const noop = createAction('INCREMENT');

// As parameter in handleAction:
handleAction(noop, {
  next(state, action) {...},
  throw(state, action) {...}
});

// As object key in handleActions:
const reducer = handleActions({
  [noop]: (state, action) => ({
    counter: state.counter + action.payload
  })
}, { counter: 0 });
```
Use the identity form to create one-off actions:

```js
createAction('ADD_TODO')('Use Redux');
```

### createActions

```js
createActions(
  actionMap,
  ?...identityActions,
)
```

Returns an object mapping action types to action creators. The keys of this object are camel-cased from the keys in `actionMap` and the string literals of `identityActions`; the values are the action creators.

```js
import { createActions } from 'redux-actions';
```

#### `createActions(actionMap)` {#createactionsactionmap}

`actionMap` is an object which can optionally have a recursive data structure, with action types as keys, and whose values **must** be either

* a function, which is the payload creator for that action
* an array with `payload` and `meta` functions in that order, as in [`createAction`](#createaction)
  * `meta` is **required** in this case \(otherwise use the function form above\)
* an `actionMap`

###### EXAMPLE
```js
createActions({
  ADD_TODO: todo => ({ todo }) // payload creator,
  REMOVE_TODO: [
    todo => ({ todo }), // payload creator
    (todo, warn) => ({ todo, warn }) // meta
  ]
});
```

If `actionMap` has a recursive structure, its leaves are used as payload and meta creators, and the action type for each leaf is the combined path to that leaf:

###### EXAMPLE
```js
const actionCreators = createActions({
  APP: {
    COUNTER: {
      INCREMENT: [
        amount => ({ amount }),
        amount => ({ key: 'value', amount })
      ],
      DECREMENT: amount => ({ amount: -amount })
    },
    NOTIFY: [
      (username, message) => ({ message: `${username}: ${message}` }),
      (username, message) => ({ username, message })
    ]
  }
});

expect(actionCreators.app.counter.increment(1)).to.deep.equal({
  type: 'APP/COUNTER/INCREMENT',
  payload: { amount: 1 },
  meta: { key: 'value', amount: 1 }
});
expect(actionCreators.app.counter.decrement(1)).to.deep.equal({
  type: 'APP/COUNTER/DECREMENT',
  payload: { amount: -1 }
});
expect(actionCreators.app.notify('yangmillstheory', 'Hello World')).to.deep.equal({
  type: 'APP/NOTIFY',
  payload: { message: 'yangmillstheory: Hello World' },
  meta: { username: 'yangmillstheory', message: 'Hello World' }
});
```

When using this form, you can pass an object with key `namespace` as the last positional argument, instead of the default `/`.

###### EXAMPLE
```js
createActions({ ... }, 'INCREMENT', { namespace: '--' })
```

#### `createActions(actionMap, ...identityActions)`{#createactionsactionmap-identityactions}

`identityActions` is an optional list of positional string arguments that are action type strings; these action types will use the identity payload creator.

```js
const { actionOne, actionTwo, actionThree } = createActions({
  // function form; payload creator defined inline
  ACTION_ONE: (key, value) => ({ [key]: value }),

  // array form
  ACTION_TWO: [
    (first) => [first],             // payload
    (first, second) => ({ second }) // meta
  ],

  // trailing action type string form; payload creator is the identity
}, 'ACTION_THREE');

expect(actionOne('key', 1)).to.deep.equal({
  type: 'ACTION_ONE',
  payload: { key: 1 }
});

expect(actionTwo('first', 'second')).to.deep.equal({
  type: 'ACTION_TWO',
  payload: ['first'],
  meta: { second: 'second' }
});

expect(actionThree(3)).to.deep.equal({
  type: 'ACTION_THREE',
  payload: 3,
});
```

### handleAction

```js
handleAction(
  type,
  reducer | reducerMap = Identity,
  defaultState,
)
```

Wraps a reducer so that it only handles Flux Standard Actions of a certain type.

```js
import { handleAction } from 'redux-actions';
```

#### `handleAction(type, reducer, defaultState)`{#handleactiontype-reducer-defaultstate}

If a `reducer` function is passed, it is used to handle both normal actions and failed actions. (A failed action is analogous to a rejected promise.) You can use this form if you know a certain type of action will never fail, like the increment example above.

If the reducer argument (`reducer`) is `undefined`, then the identity function is used.

The third parameter `defaultState` is required, and is used when `undefined` is passed to the reducer.

###### EXAMPLE
```js
handleAction('APP/COUNTER/INCREMENT', (state, action) => ({
  counter: state.counter + action.payload.amount,
}), defaultState);
```

#### `handleAction(type, reducerMap, defaultState)`{#handleactiontype-reducermap-defaultstate}

Otherwise, you can specify separate reducers for `next()` and `throw()` using the `reducerMap` form. This API is inspired by the ES6 generator interface.

If the reducer argument (`reducerMap`) is `undefined`, then the identity function is used.

###### EXAMPLE
```js
handleAction('FETCH_DATA', {
  next(state, action) {...},
  throw(state, action) {...},
}, defaultState);
```

If either `next()` or `throw()` are `undefined` or `null`, then the identity function is used for that reducer.

### handleActions

```js
handleActions(
  reducerMap,
  defaultState,
)
```

Creates multiple reducers using `handleAction()` and combines them into a single reducer that handles multiple actions. Accepts a map where the keys are passed as the first parameter to `handleAction()` (the action type), and the values are passed as the second parameter (either a reducer or reducer map). The map must not be empty.

```js
import { handleActions } from 'redux-actions';
```

#### `handleActions(reducerMap, defaultState)` {#handleactionsreducermap-defaultstate}

The second parameter `defaultState` is required, and is used when `undefined` is passed to the reducer.

(Internally, `handleActions()` works by applying multiple reducers in sequence using [reduce-reducers](https://github.com/acdlite/reduce-reducers).)

###### EXAMPLE

```js
const reducer = handleActions({
  INCREMENT: (state, action) => ({
    counter: state.counter + action.payload
  }),

  DECREMENT: (state, action) => ({
    counter: state.counter - action.payload
  })
}, { counter: 0 });
```

### combineActions

```js
combineActions(
  ...types,
)
```

Combine any number of action types or action creators. `types` is a list of positional arguments which can be action type strings, symbols, or action creators.

```js
import { combineActions } from 'redux-actions';
```

#### `combineActions(...types)` {#combineactionstypes}

This allows you to reduce multiple distinct actions with the same reducer.

```js
const { increment, decrement } = createActions({
  INCREMENT: amount => ({ amount }),
  DECREMENT: amount => ({ amount: -amount }),
})

const reducer = handleAction(combineActions(increment, decrement), {
  next: (state, { payload: { amount } }) => ({ ...state, counter: state.counter + amount }),
  throw: state => ({ ...state, counter: 0 }),
}, { counter: 10 })

expect(reducer(undefined, increment(1)).to.deep.equal({ counter: 11 })
expect(reducer(undefined, decrement(1)).to.deep.equal({ counter: 9 })
expect(reducer(undefined, increment(new Error)).to.deep.equal({ counter: 0 })
expect(reducer(undefined, decrement(new Error)).to.deep.equal({ counter: 0 })
```

Below is how you would use `combineActions` and `handleActions` together

###### EXAMPLE
```js
const { increment, decrement } = createActions({
  INCREMENT: amount => ({ amount }),
  DECREMENT: amount => ({ amount: -amount })
});

const reducer = handleActions({
  [combineActions(increment, decrement)](state, { payload: { amount } }) {
    return { ...state, counter: state.counter + amount };
  }
}, { counter: 10 });

expect(reducer({ counter: 5 }, increment(5))).to.deep.equal({ counter: 10 });
expect(reducer({ counter: 5 }, decrement(5))).to.deep.equal({ counter: 0 });
expect(reducer({ counter: 5 }, { type: 'NOT_TYPE', payload: 1000 })).to.equal({ counter: 5 });
expect(reducer(undefined, increment(5))).to.deep.equal({ counter: 15 });
```
