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

let extractTextLoader = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: ["css-loader?minimize", 'resolve-url-loader', "sass-loader?sourceMap"]
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
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: '/assets/'
  },

  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 20000,
            name:  'images/[name].[ext]',
          }
        }
      },

      {
        test: /\.(eot|woff|woff2|ttf|svg)/,
        use: {
          loader: 'file-loader',
          options: {
            name:  'fonts/[name].[ext]',
          }
        }
      },

      {
        test: /\.scss$/,
        exclude: /node_modules\//,
        use: extractTextLoader
      },

      {
        test: /\.vue&/,
        use:  {
          loader: 'vue-loader',
          options: {
            loaders: {
              scss: extractTextLoader
            }
          }
        }
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
