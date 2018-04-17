import path from 'path';
import webpack from 'webpack';

const { NODE_ENV } = process.env;
const production = NODE_ENV === 'production';

export default {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `redux-actions${production ? '.min' : ''}.js`,
    library: 'ReduxActions',
    libraryTarget: 'umd'
  },
  mode: production ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
  ]
};
