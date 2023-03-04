# redux-actions

[![Build Status](https://travis-ci.org/redux-utilities/redux-actions.svg?branch=master)](https://travis-ci.org/redux-utilities/redux-actions)
[![codecov](https://codecov.io/gh/redux-utilities/redux-actions/branch/master/graph/badge.svg)](https://codecov.io/gh/redux-utilities/redux-actions)
[![npm](https://img.shields.io/npm/v/redux-actions.svg)](https://www.npmjs.com/package/redux-actions)
[![npm](https://img.shields.io/npm/dm/redux-actions.svg)](https://www.npmjs.com/package/redux-actions)

> [Flux Standard Action](https://github.com/acdlite/flux-standard-action) utilities for Redux

### Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [Documentation](#documentation)

# Getting Started

## Installation

```bash
$ npm install --save redux-actions
```

or

```bash
$ yarn add redux-actions
```

The [npm](https://www.npmjs.com) package provides [ES modules](http://jsmodules.io/) that should be compatible with every modern build tooling.

## Usage

```js
import { createActions, handleActions, combineActions } from 'redux-actions';

const defaultState = { counter: 10 };

const { increment, decrement } = createActions({
  INCREMENT: (amount = 1) => ({ amount }),
  DECREMENT: (amount = 1) => ({ amount: -amount })
});

const reducer = handleActions(
  {
    [combineActions(increment, decrement)]: (
      state,
      { payload: { amount } }
    ) => {
      return { ...state, counter: state.counter + amount };
    }
  },
  defaultState
);

export default reducer;
```

[See the full API documentation.](https://redux-actions.js.org/)

## Documentation

- [Introduction](https://redux-actions.js.org/introduction)
- [API](https://redux-actions.js.org/api)
- [External Resources](https://redux-actions.js.org/externalresources)
- [Changelog](https://redux-actions.js.org/changelog)
- [Contributors](https://github.com/redux-utilities/redux-actions/graphs/contributors)
