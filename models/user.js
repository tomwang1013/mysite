'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const emailValidFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function isStudent() {
  return this.userType === 0;
};

function isCompany() {
  return this.userType === 1;
};

let Schema = mongoose.Schema;
let userSchema = Schema({
  name:     { type: String, required: [true, '这是必填字段'], unique: true },
  email:    {
    type:     String,
    required: [true, '这是必填字段'],
    unique:   true,
    match:    [emailValidFormat, '请输入有效的电子邮件地址']
  },
  password: { type: String, required: [true, '这是必填字段'] },
  userType: Number, // 用户类型：0:student,1:company

  // 学生属性
  university: String, // 学校名称
  major:      String, // 专业
  entryDate:  Date,   // 入学日期
  careerPlan: String, // 职业规划
  zuopin:     String, // 课外作品

  // 企业属性
  url:        String, // 公司主页
  desc:       String, // 公司介绍
  business:   String, // 行业
  scale:      Number, // 规模：0~50,50~100，etc
  maturity:   Number, // 成熟度：初创，A轮，B轮，C轮，上市，etc
});

userSchema.plugin(uniqueValidator, { message: '{VALUE} 已经存在' });
userSchema.index({ name: 1 },  { unique: true });
userSchema.index({ email: 1 }, { unique: true });

userSchema.methods.isStudent = function() {
  return this.userType === 0;
};

userSchema.methods.isCompany = function() {
  return this.userType === 1;
};

let User = mongoose.model('User', userSchema);

exports = module.exports =  User;
