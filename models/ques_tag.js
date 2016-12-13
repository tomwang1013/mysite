'use strict'

const mongoose = require('mongoose');

/**
 * 行业：IT，金融，房地产，etc
 */
let Schema = mongoose.Schema;
let quesTagSchema = new Schema({
  name: String
});

let QuesTag = mongoose.model('Ques_tag', quesTagSchema);

exports = module.exports = QuesTag;
