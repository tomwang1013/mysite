const baseConfig     = require('./webpack.config.base.js');
const webpackMerge   = require('webpack-merge');
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = webpackMerge(baseConfig, {
  output: {
    filename: '[name].[chunkhash].js'
  },

  plugins: [
    new WebpackMd5Hash(),
    new ManifestPlugin({ fileName: 'rev-manifest.json' })
  ]
});
