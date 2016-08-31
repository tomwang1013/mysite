'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let applyJobSchema = new Schema({
  _job:         { type: Schema.Types.ObjectId, ref: 'Job' },
  _user:        { type: Schema.Types.ObjectId, ref: 'User' },
  status:       Number, // 申请状态：0：刚申请 1：拒绝 2：通过
  message:      String, // 企业在拒绝或通过一个申请时对应聘者的消息
}, {
  timestamps: true
});

let ApplyJob = mongoose.model('apply_job', applyJobSchema);

exports = module.exports = ApplyJob;
