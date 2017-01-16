'use strict'

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const emailValidFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const allEntryDates = [
  2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,
  2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,
  2020,2021,2022,2023,2024,2025,2026,2027,2028,2029,
  2030,2031,2032,2033,2034,2035,2036,2037,2038,2039
];
const gridfs = require('../lib/gridfs');

let Schema = mongoose.Schema;
let isStudent = function() { return this.userType === 0; };
let isCompany = function() { return this.userType === 1; };
let userSchema = new Schema({
  name: {
    type: String,
    required: [true, '这是必填字段'],
    unique: true
  },
  email: {
    type:     String,
    required: [true, '这是必填字段'],
    unique:   true,
    match:    [emailValidFormat, '请输入有效的电子邮件地址']
  },
  password: { type: String, required: [true, '这是必填字段'] },
  userType: Number, // 用户类型：0:student,1:company
  phone:    String, // 电话号码
  avatar:   String, // 头像

  // for password reset
  token:    String,
  tokenExp: Date,

  // 学生属性
  gender:     String, // 性别
  university: { type: String, required: [isStudent, '请选择学校名称'] }, // 学校名称
  major:      { type: String, required: [isStudent, '请选择专业名称'] }, // 专业
  entryDate:  { type: String, required: [isStudent, '请选择入学时间'] }, // 入学日期
  careerPlan: String, // 职业规划
  zuopin:     String, // 课外作品

  // 企业属性
  url: {
    type: String,
    required: [isCompany, '这是必填字段'],
    match: [/^http:\/\//, '{PATH}必须以http://开头']
  }, // 公司主页
  desc: {
    type: String,
    required: [isCompany, '这是必填字段'],
    minlength: [60, '对公司的描述不能少于{MINLEGNTH}个字符']
  }, // 公司介绍
  business:   { type: String, required: [isCompany, '这是必填字段'] }, // 行业
  scale:      { type: String, required: [isCompany, '这是必填字段'] }, // 规模：0~50,50~100，etc
  maturity:   { type: String, required: [isCompany, '这是必填字段'] }, // 成熟度：初创，A轮，B轮，C轮，上市，etc
});

userSchema.plugin(uniqueValidator, { message: '{VALUE} 已经存在' });

userSchema.methods.isStudent = function() {
  return this.userType === 0;
};

userSchema.methods.isCompany = function() {
  return this.userType === 1;
};

userSchema.methods.avatarUrl = function() {
  if (this.avatar) {
    return gridfs.getUrlByFileName(this.avatar);
  } else {
    return '/images/default_avatar.png';
  }
};

userSchema.methods.scaleValue = function() {
  return User.scales[this.scale];
};

userSchema.methods.maturityValue = function() {
  return User.maturities[this.maturity];
};

let User = mongoose.model('User', userSchema);

User.allEntryDates = allEntryDates;
User.scales = ['0~50','50~100','100~500','500~1000','1000~10000','10000以上'];
User.maturities = ['初创','天使轮','A轮','B轮','C轮','D轮','上市','非上市成熟型'];

exports = module.exports =  User;
