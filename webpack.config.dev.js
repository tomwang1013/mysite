const baseConfig        = require('./webpack.config.base.js');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({ filename: '[name].css' })
  ]
});
