# API Reference for createAction(s)

* [Methods](#methods)
  * [createAction](#createaction)
    * [`createAction(type)`](#createactiontype)
    * [`createAction(type, payloadCreator)`](#createactiontype-payloadcreator)
    * [`createAction(type, payloadCreator, metaCreator)`](#createactiontype-payloadcreator-metacreator)
  * [createActions](#createactions)
    * [`createActions(actionMap)`](#createactionsactionmap)
    * [`createActions(actionMap, ...identityActions)`](#createactionsactionmap-identityactions)

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
export const increment = createAction('INCREMENT');
export const decrement = createAction('DECREMENT');

increment(); // { type: 'INCREMENT' }
decrement(); // { type: 'DECREMENT' }
increment(10); // { type: 'INCREMENT', payload: 10 }
decrement([1, 42]); // { type: 'DECREMENT', payload: [1, 42] }
```

If the payload is an instance of an [Error object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),
`redux-actions` will automatically set `action.error` to true.

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

Use the identity form to create one-off actions.

###### EXAMPLE

```js
createAction('ADD_TODO')('Use Redux');
```

#### `createAction(type, payloadCreator)` {#createactiontype-payloadcreator}

`payloadCreator` must be a function, `undefined`, or `null`. If `payloadCreator` is `undefined` or `null`, the identity function is used.

**NOTE:** If payload is an instance of an [Error object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),
`payloadCreator` will not be called.

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
const updateAdminUser = createAction(
  'UPDATE_ADMIN_USER',
  updates => updates,
  () => ({ admin: true })
);

updateAdminUser({ name: 'Foo' });
// {
//   type: 'UPDATE_ADMIN_USER',
//   payload: { name: 'Foo' },
//   meta: { admin: true },
// }
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
  ADD_TODO: todo => ({ todo }), // payload creator
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
      INCREMENT: [amount => ({ amount }), amount => ({ key: 'value', amount })],
      DECREMENT: amount => ({ amount: -amount }),
      SET: undefined // given undefined, the identity function will be used
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
expect(actionCreators.app.counter.set(100)).to.deep.equal({
  type: 'APP/COUNTER/SET',
  payload: 100
});
expect(
  actionCreators.app.notify('yangmillstheory', 'Hello World')
).to.deep.equal({
  type: 'APP/NOTIFY',
  payload: { message: 'yangmillstheory: Hello World' },
  meta: { username: 'yangmillstheory', message: 'Hello World' }
});
```

When using this form, you can pass an object with key `namespace` as the last positional argument (the default is `/`).

###### EXAMPLE

```js
createActions({ ... }, 'INCREMENT', { namespace: '--' })
```

#### `createActions(actionMap, ...identityActions)`{#createactionsactionmap-identityactions}

`identityActions` is an optional list of positional string arguments that are action type strings; these action types will use the identity payload creator.

```js
const { actionOne, actionTwo, actionThree } = createActions(
  {
    // function form; payload creator defined inline
    ACTION_ONE: (key, value) => ({ [key]: value }),

    // array form
    ACTION_TWO: [
      first => [first], // payload
      (first, second) => ({ second }) // meta
    ]

    // trailing action type string form; payload creator is the identity
  },
  'ACTION_THREE'
);

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
  payload: 3
});
```
