const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      'process': 'process/browser'
    },
    fallback: {
      "stream": "stream-browserify"
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
  ],
  devServer: {
    static: './',
  },
  mode: 'development'
};
