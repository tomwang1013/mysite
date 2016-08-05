'use strict'

const mongoose = require('mongoose');

/**
 * 学校：大专院校
 */
let Schema = mongoose.Schema;
let universitySchema = Schema({
  name:       String,   // 学校名称
  province:   Number,   // 所在省份或直辖市id
  type:       Number,   // 院校分类
  eduRank:    Number,   // 学历层次
});

let University = mongoose.model('University', universitySchema);

exports = module.exports =  University;
