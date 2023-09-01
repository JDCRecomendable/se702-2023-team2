const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      "stream": "stream-browserify"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': '{}',
      process: {}
    }),
  ],
  devServer: {
    static: './',
  },
  mode: 'development'
};
