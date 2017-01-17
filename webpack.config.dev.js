const baseConfig        = require('./webpack.config.base.js');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
  plugins: [
    new ExtractTextPlugin({ filename: '[name].css' })
  ]
});
