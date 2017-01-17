const webpack           = require('webpack');
const baseConfig        = require('./webpack.config.base.js');
const webpackMerge      = require('webpack-merge');
const ManifestPlugin    = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = webpackMerge(baseConfig, {
  output: {
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new ManifestPlugin({ fileName: 'rev-manifest.json' }),
    new ExtractTextPlugin({ filename: '[name].[contenthash].css' }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      mangle: {
        // Skip mangling these
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ]
});
