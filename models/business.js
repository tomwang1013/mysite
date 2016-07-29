'use strict'

const mongoose = require('mongoose');

/**
 * 行业：IT，金融，房地产，etc
 */
let Schema = mongoose.Schema;
let businessSchema = Schema({
  name: String
});

let Business = mongoose.model('Business', businessSchema);

exports = module.exports =  Business;
