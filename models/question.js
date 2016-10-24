'use strict'

const mongoose = require('mongoose');

/*
 * 企业可以为每个职位提前设置一些问题，根据每个学生的回答情况
 * 评估学生的综合能力；学生可以在一定时间之内留下答案，这些答案
 * 是自由发挥的，学生可以凭自己的能力学习并解答，也可以直接从
 * 网上copy，但是企业应该可以通过简单的面试得到实际情况
 */
let Schema = mongoose.Schema;
let questionSchema = new Schema({
  content:  String, // 问题内容
  level:    Number, // 期望难度
  deleted:  Number, // 是否已删除：0：未删除，1：已删除

  _job:     {type: Schema.Types.ObjectId, ref: 'Job' }
}, {
  timestamps: true
});

const LEVEL_DESCS = [
  '非常简单', '简单', '有点难', '中等难度', '很难', '非常难'
];

questionSchema.methods.levelDesc = function() {
  return LEVEL_DESCS[this.level];
};

let Question = mongoose.model('question', questionSchema);

Question.LEVEL_DESCS = LEVEL_DESCS;

exports = module.exports = Question;
