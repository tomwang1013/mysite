'use strict'

const mongoose = require('mongoose');

let Schema = mongoose.Schema;
let jobSchema = Schema({
  title:        String, // 职位名称
  duty:         String, // 职责
  requirement:  String, // 要求
  _entId:       Schema.Types.ObjectId
},  {
  timestamps: true
});

let Job = mongoose.model('Job', jobSchema);

exports = module.exports = Job;
