'use strict'

const mongoose = require('mongoose');

/**
 * 行业：IT，金融，房地产，etc
 */
let Schema = mongoose.Schema;
let businessSchema = new Schema({
  name: String
});

let Business = mongoose.model('Business', businessSchema);

exports = module.exports = [
  'IT', '金融', '房地产', '汽车', '医疗', '餐饮', '制造业', '零售', '服务业', '其他'
];
