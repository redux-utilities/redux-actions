redux-actions
=============

[![build status](https://img.shields.io/travis/acdlite/redux-actions/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-actions)
[![npm version](https://img.shields.io/npm/v/redux-actions.svg?style=flat-square)](https://www.npmjs.com/package/redux-actions)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux.

```js
npm install --save redux-actions
```
```js
import { createAction, createActions, handleAction, handleActions } from 'redux-actions';
```

### `createAction(type, payloadCreator = Identity, ?metaCreator)`

Wraps an action creator so that its return value is the payload of a Flux Standard Action. If no payload creator is passed, or if it's not a function, the identity function is used.

Example:

```js
let increment = createAction('INCREMENT', amount => amount);
// same as
increment = createAction('INCREMENT');

expect(increment(42)).to.deep.equal({
  type: 'INCREMENT',
  payload: 42
});
```

If the payload is an instance of an [Error
object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),
redux-actions will automatically set ```action.error``` to true.

Example:

```js
const increment = createAction('INCREMENT');

const error = new TypeError('not a number');
expect(increment(error)).to.deep.equal({
  type: 'INCREMENT',
  payload: error,
  error: true
});
```

`createAction` also returns its `type` when used as type in `handleAction` or `handleActions`.

Example:

```js
const increment = createAction('INCREMENT');

// As parameter in handleAction:
handleAction(increment, {
  next(state, action) {...},
  throw(state, action) {...}
});

// As object key in handleActions:
const reducer = handleActions({
  [increment]: (state, action) => ({
    counter: state.counter + action.payload
  })
}, { counter: 0 });
```

**NOTE:** The more correct name for this function is probably `createActionCreator()`, but that seems a bit redundant.

Use the identity form to create one-off actions:

```js
createAction('ADD_TODO')('Use Redux');
```

`metaCreator` is an optional function that creates metadata for the payload. It receives the same arguments as the payload creator, but its result becomes the meta field of the resulting action. If `metaCreator` is undefined or not a function, the meta field is omitted.

### `createActions(?actionMap, ?arrayDefTypes, ?optionMap)`

Create multiple actions and return an object mapping from the type to the actionCreator. This eliminates some of the repetitiveness when creating many actions.

If actionMap is provided as first argument, an action will be created for each item in the map. The key will be used for the type. The value will be treated as follows:

 - if value is a function then it will be assumed to be the payloadCreator function
 - if value is an object then it will accept as its keys payload and meta, both of which are functions that will serve as they payloadCreator and/or metaCreator. If payloadCreator is missing the default payloadCreator is used. If metaCreator is missing then it will not use one.
 - otherwise create a default actionCreator for the key type

If an array of string is provided as arrayDefTypes it will be used to create default actionCreators using the string for the action type.

If an optionMap object is supplied as last argument then it will adjust the options createActions uses in operation:

 - `prefix` - string, prefix all action types with this prefix, default ''

#### Example: simple default actions

```js
import { createActions } from 'redux-actions';
const a = createActions(['ONE', 'TWO', 'THREE']);

// is equivalent to
const a = {
  ONE: createAction('ONE'),
  TWO: createAction('TWO'),
  THREE: createAction('THREE')
;}
```

#### Example: simple default actions with prefix

```js
import { createActions } from 'redux-actions';
const a = createActions(['ONE', 'TWO', 'THREE'], { prefix: 'ns/');

// is equivalent to
const a = {
  ONE: createAction('ns/ONE'),
  TWO: createAction('ns/TWO'),
  THREE: createAction('ns/THREE')
;}
```

#### Example: using actionMap

```js
import { createActions } from 'redux-actions';
const a = createActions({
  ONE: (b, c) => ({ bar: b, cat: c }),  // payload creator
  TWO: {
    payload: (d, e) => [d, e]            // payload creator
    meta: (d, e) => ({ time: Date.now() }) // meta creator
  },
  THREE: {
    meta: f => ({ id: shortid() })
  }
});


// is equivalent to
const a = {
  ONE: createAction('ONE', (b, c) => ({ bar: b, cat: c })),
  TWO: createAction('TWO',
                    (d, e) => [d, e],
                    (d, e) => ({ time: Date.now() })),
  THREE: createAction('THREE',
                      undefined,  // used default payload creator
                      f => ({ id: shortid() }))
});
```

#### Example full createActions functionality

```js
import { createActions } from 'redux-actions';
const a = createActions(
  {
    ONE: (b, c) => ({ bar: b, cat: c }),  // payload creator
    TWO: {
      payload: (d, e) => [d, e]            // payload creator
      meta: (d, e) => ({ time: Date.now() }) // meta creator
    },
    THREE: {
      meta: f => ({ id: shortid() })
    }
  }, [ // arrayDefTypes creates defaultActions
    'FOUR',
    'FIVE',
    'SIX'
  ], {  // options
    prefix: 'ns/'
  }
);

// is equivalent to
const a = {
  ONE: createAction('ns/ONE', (b, c) => ({ bar: b, cat: c })),
  TWO: createAction('ns/TWO',
                    (d, e) => [d, e],
                    (d, e) => ({ time: Date.now() })),
  THREE: createAction('ns/THREE',
                      undefined,  // used default payload creator
                      f => ({ id: shortid() })),
  FOUR: createAction('ns/FOUR'),
  FIVE: createAction('ns/FIVE'),
  SIX: createAction('ns/SIX')
};
```


### `handleAction(type, reducer | reducerMap, ?defaultState)`

Wraps a reducer so that it only handles Flux Standard Actions of a certain type.

If a single reducer is passed, it is used to handle both normal actions and failed actions. (A failed action is analogous to a rejected promise.) You can use this form if you know a certain type of action will never fail, like the increment example above.

Otherwise, you can specify separate reducers for `next()` and `throw()`. This API is inspired by the ES6 generator interface.

```js
handleAction('FETCH_DATA', {
  next(state, action) {...},
  throw(state, action) {...}
});
```

The optional third parameter specifies a default or initial state, which is used when `undefined` is passed to the reducer.

### `handleActions(reducerMap, ?defaultState)`

Creates multiple reducers using `handleAction()` and combines them into a single reducer that handles multiple actions. Accepts a map where the keys are passed as the first parameter to `handleAction()` (the action type), and the values are passed as the second parameter (either a reducer or reducer map).

The optional second parameter specifies a default or initial state, which is used when `undefined` is passed to the reducer.

(Internally, `handleActions()` works by applying multiple reducers in sequence using [reduce-reducers](https://github.com/acdlite/reduce-reducers).)

Example:

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

## Usage with middleware

redux-actions is handy all by itself, however, its real power comes when you combine it with middleware.

The identity form of `createAction` is a great way to create a single action creator that handles multiple payload types. For example, using [redux-promise](https://github.com/acdlite/redux-promise) and [redux-rx](https://github.com/acdlite/redux-rx):

```js
const addTodo = createAction('ADD_TODO');

// A single reducer...
handleAction('ADD_TODO', (state = { todos: [] }, action) => ({
  ...state,
  todos: [...state.todos, action.payload]
}));

// ...that works with all of these forms:
// (Don't forget to use `bindActionCreators()` or equivalent.
// I've left that bit out)
addTodo('Use Redux')
addTodo(Promise.resolve('Weep with joy'));
addTodo(Observable.of(
  'Learn about middleware',
  'Learn about higher-order stores'
)).subscribe();
```

## See also

Use redux-actions in combination with FSA-compliant libraries.

- [redux-promise](https://github.com/acdlite/redux-promise) - Promise middleware
- [redux-rx](https://github.com/acdlite/redux-rx) - Includes observable middleware.
