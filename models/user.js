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

let Schema = mongoose.Schema;
let userSchema = new Schema({
  name:     { type: String, required: [true, '这是必填字段'], unique: true },
  email:    {
    type:     String,
    required: [true, '这是必填字段'],
    unique:   true,
    match:    [emailValidFormat, '请输入有效的电子邮件地址']
  },
  password: { type: String, required: [true, '这是必填字段'] },
  userType: Number, // 用户类型：0:student,1:company
  phone:    String, // 电话号码

  // 学生属性
  university: String, // 学校名称
  major:      String, // 专业
  entryDate:  Number, // 入学日期
  careerPlan: String, // 职业规划
  zuopin:     String, // 课外作品
  _appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],  // 申请的职位列表

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

User.allEntryDates = allEntryDates;
User.scales = ['0~50','50~100','100~500','500~1000','1000~10000','10000以上'];
User.maturities = ['初创','天使轮','A轮','B轮','C轮','D轮','上市','非上市成熟型'];

exports = module.exports =  User;
