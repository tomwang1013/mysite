const baseConfig        = require('./webpack.config.base.js');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path              = require('path');

module.exports = webpackMerge(baseConfig, {
  devServer: {
    contentBase: false,
    publicPath: '/assets/',
    host: "0.0.0.0",
    port: 8080
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
    })
  ]
});
