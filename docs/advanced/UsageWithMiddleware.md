# Usage with Middleware

redux-actions is handy all by itself, however, its real power comes when you combine it with middleware.

The identity form of `createAction` is a great way to create a single action creator that handles multiple payload types. For example, using [redux-promise](https://github.com/redux-utilities/redux-promise) and [redux-rx](https://github.com/acdlite/redux-rx):

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
addTodo('Use Redux');
addTodo(Promise.resolve('Weep with joy'));
addTodo(
  Observable.of('Learn about middleware', 'Learn about higher-order stores')
).subscribe();
```
