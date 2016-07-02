'use strict'

/**
 * connect to mongodb and initialize all the models
 */
const fs = require('fs');
const path = require('path');
const mongoose = require( 'mongoose');

mongoose.connect('mongodb://localhost/mysite');

let models = {};

fs.readdirSync(__dirname).filter(function(fn) {
  return fn[0] != '.' && fn != 'index.js';
}).forEach(function(fn) {
  let modelName = fn.slice(0, -3);
  models[modelName[0].toUpperCase() + modelName.slice(1)] = require(path.join(__dirname, fn));
});

exports = module.exports = models;
