redux-fsa
=========

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utlities for Redux.

```js
npm install --save redux-fsa
```

### `createAction(type, actionCreator)`

Wraps an action creator so that its return value is the body of a Flux Standard Action. If no action creator is passed, or if the action creator is not a function, the identity function is used.

Example:

```js
let increment = createAction('INCREMENT', amount => amount);
// same as
increment = createAction('INCREMENT');

expect(increment(42)).to.deep.equal({
  type: 'INCREMENT',
  amount: 42
});
```

### `handleAction(type, reducer | reducerMap)`

Wraps a reducer so that only handles Flux Standard Actions of a certain type.

If a single reducer is passed, it is used to handle both successful and failed actions. You can use this form if you know a certain action will always be a success, like the increment example above.

Otherwise, you can specify reducers for `success` and `error`:

```js
handleAction('FETCH_DATA', {
  success(state, action) {...}
  error(state, action) {...}
});
```

### `handleActions(reducerMap, ?defaultState)`

Creates multiple reducers using `handleAction()` and combines them into a single reducer that handles multiple actions. Accepts a map where the keys are the passed as the first parameter to `handleAction()` (the action type), and the values are passed as the second parameter (either a reducer or reducer map).

The optional second parameter specifies a default or initial state, which is used when `undefined` is passed to the reducer.

```js
const reducer = handleActions({
  INCREMENT: (state, action) => ({
    counter: state.counter + amount.
  }),

  DECREMENT: ({ counter }, { body: amount }) => ({
    counter: counter - amount
  })
}, { counter: 0 });
```
