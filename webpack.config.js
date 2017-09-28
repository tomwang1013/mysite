const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// entries
let entry = glob.sync('./assets/js/**/*.js').filter(f => {
  return f.indexOf('/common/') === -1;
}).reduce((e, f) => {
  e[f.slice(12, -3)] = f;
  return e;
}, { vendor: ['vue', 'lodash', 'jquery', 'vue-router'] });

// resolve
let resolve = {
  modules: [
    path.resolve(__dirname, 'assets/js'),
    path.resolve(__dirname, 'assets/sass'),
    'node_modules'
  ],

  alias: {
    'vue$': 'vue/dist/vue.esm.js',
    'vue-router$': 'vue-router/dist/vue-router.common.js',
    'vue-form-validator$': 'vue-auto-validator'
  }
};

// output
let output = {
  filename: '[name].js',
  path: path.resolve(__dirname, 'public/assets'),
  publicPath: '/assets/'
};

// module
let scssExactLoader = ExtractTextPlugin.extract({
  fallback: "style-loader",
  use: ["css-loader?minimize", 'resolve-url-loader', "sass-loader?sourceMap"]
});

let mod = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    },

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
      use: scssExactLoader
    },

    {
      test: /\.vue$/,
      use:  {
        loader: 'vue-loader',
        options: {
          loaders: { sass: scssExactLoader }
        }
      }
    }
  ]
};

// plugins
let plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    names: ['common', 'vendor', 'manifest'],
    minChunks: 3
  }),
];


module.exports = function buildConfig(env) {
  if (env.dev) {
    plugins.push(new ExtractTextPlugin({
      filename: '[name].css',
    }));
  } else {
    output.filename = '[name].[chunkhash].js';
    plugins = plugins.concat([
      new webpack.HashedModuleIdsPlugin(),
      new ManifestPlugin({ fileName: 'rev-manifest.json' }),
      new ExtractTextPlugin({ filename: '[name].[contenthash].css' }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new UglifyJSPlugin(),
      //new BundleAnalyzerPlugin()
    ]);
  }

  let cfg = {
    entry, output, resolve, module: mod, plugins
  };

  if (env.dev) {
    cfg.devServer = {
      contentBase: path.resolve(__dirname, 'public'),
      publicPath: '/assets/',
      host: "localhost",
      port: 4000,
      headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      }
    };
  }

  return cfg;
};
