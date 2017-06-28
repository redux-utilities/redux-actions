# API Reference

* [Methods](#methods)
  * [createAction\(type, payloadCreator = Identity, ?metaCreator\)](#createactiontype-payloadcreator--identity-metacreator)

## Methods

### `createAction(type, payloadCreator = Identity, ?metaCreator)` {#createactiontype-payloadcreator--identity-metacreator}

```js
import { createAction } from 'redux-actions';
```

Wraps an action creator so that its return value is the payload of a Flux Standard Action.

`payloadCreator` must be a function, `undefined`, or `null`. If `payloadCreator` is `undefined` or `null`, the identity function is used.

For Example

```js
let noop = createAction('NOOP', amount => amount);
// same as
noop = createAction('NOOP');

expect(noop(42)).to.deep.equal({
  type: 'NOOP',
  payload: 42
});
```

If the payload is an instance of an [Error
object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Error),
redux-actions will automatically set ```action.error``` to true.

For Example

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

For Example

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

**NOTE:** The more correct name for this function is probably `createActionCreator()`, but that seems a bit redundant.

Use the identity form to create one-off actions:

```js
createAction('ADD_TODO')('Use Redux');
```

`metaCreator` is an optional function that creates metadata for the payload. It receives the same arguments as the payload creator, but its result becomes the meta field of the resulting action. If `metaCreator` is undefined or not a function, the meta field is omitted.
