'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

function isStudent() {
  return this.userType === 0;
};

function isCompany() {
  return this.userType === 1;
};

let Schema = mongoose.Schema;
let userSchema = Schema({
  name:     { type: String, required: [true, '请输入用户名'], unique: true },
  email:    {
    type:     String,
    required: [true, '请输入邮箱地址'],
    unique:   true,
    match:    [/\w+@\w+(\.[a-z0-9]{2,12})?\.[a-z]{2,12}/, '邮箱格式错误']
  },
  password: { type: String, required: [true, '请输入密码'] },
  userType: Number, // 用户类型：0:student,1:company

  // 学生属性
  university: String, // 学校名称
  major:      String, // 专业
  entryDate:  Date,   // 入学日期
  careerPlan: String, // 职业规划
  zuopin:     String, // 课外作品
  grade:      Number, // 成绩

  // 企业属性
  url:        String, // 公司主页
  desc:       String, // 公司介绍
  _business:  Schema.Types.ObjectId,  // 行业
  scale:      Number, // 规模：0~50,50~100，etc
  maturity:   Number, // 成熟度：初创，A轮，B轮，C轮，上市，etc
});

userSchema.plugin(uniqueValidator, { message: '{VALUE}已经存在' });
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
