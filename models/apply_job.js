'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let applyJobSchema = Schema({
  status:       Number, // 当前申请状态，如发出申请，企业已回复，否定，录取等
  _jobId:       Schema.Types.ObjectId,
  _userId:      Schema.Types.ObjectId
});

let ApplyJob = mongoose.model('apply_job', applyJobSchema);

exports = module.exports = ApplyJob;
