'use strict'

const mongoose = require('mongoose');

const salaries = [
  '0~2000', '2000~4000', '4000~6000',
  '6000~8000', '8000以上', '面议'
];

let Schema = mongoose.Schema;
let jobSchema = new Schema({
  title:        String,   // 职位名称
  duty:         String,   // 职责
  requirement:  String,   // 要求
  address:      String,   // 工作地点(精确到市)
  salary:       Number,   // 薪资, 单位: 元/月, 默认为0, 表示面议
  notes:        String,   // 备注
  business:     String,   // 行业
  deleted:      { type: Number, default: 0 },   // 是否已删除：0：未删除，1：已删除

  // relations
  _creator:     { type: Schema.Types.ObjectId, ref: 'User' },       // 创建者
  _appliers:    [{ type: Schema.Types.ObjectId, ref: 'apply_job' }], // 申请记录列表
  _appliersSize:{ type: Number, default: 0 },  // 申请人数
},  {
  timestamps: true
});

let Job = mongoose.model('Job', jobSchema);

Job.salaries = salaries;

exports = module.exports = Job;
