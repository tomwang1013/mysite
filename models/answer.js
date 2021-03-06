'use strict'

const mongoose = require('mongoose');

/*
 * 学生对企业的职位中的问题给出的答案
 */
let Schema = mongoose.Schema;
let answerSchema = new Schema({
  content:  String, // 答案内容
  score:    Number, // 评分
  sysScore: Number, // 系统评分：如根据学生提交问题的时间，双方认为的问题的难度偏差等
  comment:  String, // 评语
  isScored: Boolean,// 是否已评分过 

  // relations
  _question:  { type: Schema.Types.ObjectId, ref: 'Question' },
  _job:       { type: Schema.Types.ObjectId, ref: 'Job' },
  _user:      { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

let Answer = mongoose.model('Answer', answerSchema);

exports = module.exports = Answer;
