'use strict'

const mongoose = require('mongoose');

/**
 * 职位标签：大数据，python，前端，etc
 */
let Schema = mongoose.Schema;
let jobLabelSchema = Schema({
  name: String
});

let jobLabel = mongoose.model('job_label', userSchema);

exports = module.exports =  jobLabel;
