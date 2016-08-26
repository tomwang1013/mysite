'use strict'

/**
 * connect to mongodb and initialize all the models
 */
const fs = require('fs');
const path = require('path');
const mongoose = require( 'mongoose');

mongoose.connect('mongodb://localhost/mysite', {
  config: {
    autoIndex: false
  }
});

let models = {};

fs.readdirSync(__dirname).filter(function(fn) {
  return fn[0] != '.' && fn != 'index.js';
}).forEach(function(fn) {
  let modelName = fn.slice(0, -3).split('_').map(function(a) {
    return a[0].toUpperCase() + a.slice(1);
  }).join('');

  models[modelName] = require(path.join(__dirname, fn));
});

exports = module.exports = models;
