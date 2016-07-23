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
  phone:    String,
  password: { type: String, required: [true, '请输入密码'] },
  userType: Number, // 用户类型：0:student,1:company

  // 学生属性
  university: { type: String, required: [isStudent, '请输入学校名称'] },
  major:      { type: String, required: [isStudent, '请输入专业名称'] },
  entryDate:  { type: Date,   required: [isStudent, '请选择入学年份'] },

  // 企业属性
  url:        { type: String, required: [isCompany, '请输入公司网址'] },
  desc:       { type: String, required: [isCompany, '请输入公司介绍'] }
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
