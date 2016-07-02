'use strict'

/**
 * load all controllers
 */

const fs = require('fs');
const path = require('path');

let controllers = {};

fs.readdirSync(__dirname).filter(function(fn) {
  return fn[0] != '.' && fn != 'index.js';
}).forEach(function(fn) {
  let ctrlName = fn.slice(0, -3);
  controllers[ctrlName] = require(path.join(__dirname, fn));
});

exports = module.exports = controllers;
