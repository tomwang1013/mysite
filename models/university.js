'use strict'

const mongoose = require('mongoose');

/**
 * 学校：大专院校
 */
let Schema = mongoose.Schema;
let universitySchema = Schema({
  name:       String,   // 学校名称
  province:   String,   // 所在省份或直辖市
  type:       String,   // 院校分类
  eduRank:    String,   // 学历层次
});

let University = mongoose.model('University', universitySchema);

exports = module.exports =  University;
