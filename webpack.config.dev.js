const baseConfig        = require('./webpack.config.base.js');
const webpackMerge      = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
  devServer: {
    contentBase: false,
    publicPath: '/assets/',
    host: "localhost",
    port: 4000
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
    })
  ]
});
