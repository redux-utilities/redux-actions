# redux-actions

[![build status](https://img.shields.io/travis/acdlite/redux-actions/master.svg?style=flat-square)](https://travis-ci.org/acdlite/redux-actions)

[![NPM](https://nodei.co/npm/redux-actions.png?downloads=true)](https://nodei.co/npm/redux-actions/)

[Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux.

### Table of Contents
* [Getting Started](#gettingstarted)
  * [Installation](#installation)
  * [Usage](#usage)
* [Documentation](#documentation)


# Getting Started

## Installation

```bash
$ npm install --save redux-actions
```

or

```
$ yarn add redux-actions
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

[See the full API documentation.](https://redux-actions.js.org/)

# Documentation

* [Introduction](https://redux-actions.js.org/docs/introduction/index.html)
* [API](https://redux-actions.js.org/docs/api/index.html)
* [Middleware](https://redux-actions.js.org/docs/middleware/index.html)
* [External Resources](https://redux-actions.js.org/docs/ExternalResources.html)
* [Change Log](https://redux-actions.js.org/docs/ChangeLog.html)
* [Contributors](https://redux-actions.js.org/docs/Contributors.html)
