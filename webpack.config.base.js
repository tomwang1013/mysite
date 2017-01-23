const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

let entries = {};

glob.sync('./assets/js/**/*.js').filter(f => {
  return f.indexOf('/common/') == -1;
}).forEach(f => {
  entries[f.slice(12, -3)] = f;
});

module.exports = {
  entry: entries,

  resolve: {
    modules: [
      path.resolve(__dirname, 'assets/js'),
      path.resolve(__dirname, 'assets/sass'),
      'node_modules'
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/assets')
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules\//,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: ["css-loader", "sass-loader"]
        })
      }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: 3
    }),
  ]
};
