'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let userSchema = Schema({
  name:     String, // 用户名
  email:    String, // 邮箱
  phone:    String, // 电话号码
  password: String, // 加密后的密码
  userType: Number, // 用户类型：0:student,1:company

  // 学生属性
  university: String, // 学校名称
  major:      String, // 专业
  entryDate:  Date,   // 入学年份

  // 企业属性
  url:        String, // 网址
  desc:       String, // 简介
});

userSchema.index({ name: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

userSchema.methods.isStudent = function() {
  return this.userType === 0;
};

let User = mongoose.model('User', userSchema);

exports = module.exports =  User;
