const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

let entries = {};

glob.sync('./assets/js/**/*.js').filter(f => {
  return f.indexOf('/common/') == -1;
}).forEach(f => {
  entries[f.slice(12, -3)] = f;
});

module.exports = {
  entry: entries,

  resolve: {
    modules: [path.resolve(__dirname, 'assets/js'), 'node_modules']
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public/js')
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
      minChunks: 3
    }),
  ]
};
