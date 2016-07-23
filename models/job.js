'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let jobSchema = Schema({
  title:        String, // 职位名称
  duty:         String, // 职责
  requirement:  String, // 要求
  _creator:     Schema.Types.ObjectId, // 创建者
  address:      String, // 工作地点(精确到市)
  salary:       Number, // 薪资, 单位: 元/月, 默认为0, 表示面议
  notes:        String, // 备注
},  {
  timestamps: true
});

let Job = mongoose.model('Job', jobSchema);

exports = module.exports = Job;
