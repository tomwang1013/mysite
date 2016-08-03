'use strict'

const mongoose = require('mongoose');

/**
 * 职位类别：研发，技工，销售，市场，etc
 */
let Schema = mongoose.Schema;
let jobTypeSchema = Schema({
  name: String
});

let jobType = mongoose.model('job_type', jobTypeSchema);

exports = module.exports =  jobType;
