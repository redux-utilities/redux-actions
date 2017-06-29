# redux-actions

[![build status](https://img.shields.io/travis/acdlite/redux-actions/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-actions)

[![NPM](https://nodei.co/npm/redux-actions.png?downloads=true)](https://nodei.co/npm/redux-actions/)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux.

## Installation

```bash
npm install --save redux-actions
```

or

```
yarn add redux-actions
```

The [npm](https://www.npmjs.com) package provides a [CommonJS](http://webpack.github.io/docs/commonjs.html) build for use in Node.js, and with bundlers like [Webpack](http://webpack.github.io/) and [Browserify](http://browserify.org/). It also includes an [ES modules](http://jsmodules.io/) build that works well with [Rollup](http://rollupjs.org/) and [Webpack2](https://webpack.js.org)'s tree-shaking.

The [UMD](https://unpkg.com/redux-actions@latest/dist) build exports a global called `window.ReduxActions` if you add it to your page via a `<script>` tag. We *don’t* recommend UMD builds for any serious application, as most of the libraries complementary to Redux are only available on [npm](https://www.npmjs.com/search?q=redux).

## Usage

```js
import { createActions, handleActions, combineActions } from 'redux-actions'

const defaultState = { counter: 10 };

const { increment, decrement } = createActions({
  INCREMENT: amount => ({ amount }),
  DECREMENT: amount => ({ amount: -amount })
});

const reducer = handleActions({
  [combineActions(increment, decrement)](state, { payload: { amount } }) {
    return { ...state, counter: state.counter + amount };
  }
}, defaultState);

export default reducer;
```

For more complex scenarios we recommend reading our documentation.

## [Documentation](https://vinnymac.gitbooks.io/redux-actions/content/)

* [Introduction](/docs/introduction)
* [API](/docs/api)
* [Middleware](/docs/middleware)
* [External Resources](/docs/ExternalResources.md)
* [Change Log](/docs/ChangeLog.md)
