'use strict'

const mongoose = require('mongoose');

/**
 * 大专院校专业及其类别
 */
let Schema = mongoose.Schema;
let majorSchema = Schema({
  name:       String,   // 专业名称
  type:       Number,   // 类别(工学，文学，...)
  eduRank:    Number,   // 学历层次: 1 本科 2 专科
});

let Major = mongoose.model('Major', majorSchema);

exports = module.exports =  Major;
