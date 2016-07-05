'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let userSchema = Schema({
  name:     String, // 用户名
  email:    String, // 邮箱
  phone:    String, // 电话号码
  password: String, // 加密后的密码
  userType: Number  // 用户类型：0:student,1:company
});

let User = mongoose.model('User', userSchema);

exports = module.exports =  User;
