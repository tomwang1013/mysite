'use strict'

const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * 问题的标签
 */
let Schema = mongoose.Schema;
let quesLabelSchema = new Schema({
  name:     String, // 标签名称
  ques_cnt: Number  // 此标签下问题总数
});


let QuesLabel = mongoose.model('ques_label', quesLabelSchema);

exports = module.exports = QuesLabel;
