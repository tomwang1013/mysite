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
  title:        { type: String,   required: [true, '请给一个标题吧'] },       // 标题
  content:      { type: String,   required: [true, '忘记填问题内容了'] },     // 问题内容
  labels:       { type: [String], required: [true, '请至少指定一个标签'] },   // 标签
  tag:          { type: String,   required: [true, '请指定问题所属分类'] },   // 分类
  level:        { type: Number, default: 2 },   // 期望难度
  deleted:      { type: Number, default: 0 },   // 是否已删除：0：未删除，1：已删除
  answer_cnt:   { type: Number, default: 0 },   // 回答人数
  creator_name: String,   // 所属公司名称

  _job:         { type: Schema.Types.ObjectId, ref: 'Job' },
  _creator:     { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

const LEVEL_DESCS = [
  '很简单', '简单', '一般', '难', '很难'
];

questionSchema.methods.levelDesc = function() {
  return LEVEL_DESCS[this.level];
};

let Question = mongoose.model('Question', questionSchema);

Question.LEVEL_DESCS = LEVEL_DESCS;

exports = module.exports = Question;
