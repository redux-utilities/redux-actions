```bash
npm install --save redux-actions
```

The [npm](https://www.npmjs.com) package provides a [CommonJS](http://webpack.github.io/docs/commonjs.html) build for use in Node.js, and with bundlers like [Webpack](http://webpack.github.io/) and [Browserify](http://browserify.org/). It also includes an [ES modules](http://jsmodules.io/) build that works well with [Rollup](http://rollupjs.org/) and [Webpack2](https://webpack.js.org)'s tree-shaking.

If you don’t use [npm](https://www.npmjs.com), you may grab the latest [UMD](https://unpkg.com/redux-actions@latest/dist) build from [unpkg](https://unpkg.com) (either a [development](https://unpkg.com/redux-actions@latest/dist/redux-actions.js) or a [production](https://unpkg.com/redux-actions@latest/dist/redux-actions.min.js) build). The UMD build exports a global called `window.ReduxActions` if you add it to your page via a `<script>` tag. We *don’t* recommend UMD builds for any serious application, as most of the libraries complementary to Redux are only available on [npm](https://www.npmjs.com/search?q=redux).
