'use strict'

const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * 职位类别：研发，技工，销售，市场，etc
 */
let Schema = mongoose.Schema;
let jobTypeSchema = Schema({
  name:     String,
  subTypes: [String]
});

jobTypeSchema.statics.allAsHash = function() {
  return new Promise((resolve, reject) => {
    this.find().exec().then(function(types) {
      resolve(_.reduce(types, function(h, t) {
        h[t.name] = t.subTypes;
        return h;
      }, {}));
    }).catch(reject);
  });
};

let jobType = mongoose.model('job_type', jobTypeSchema);

exports = module.exports = [
  '研发', '技工', '销售', '财务', 'HR', '其他'
];
