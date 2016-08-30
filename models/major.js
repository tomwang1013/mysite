'use strict'

const mongoose = require('mongoose');

/**
 * 大专院校专业及其类别
 */
let Schema = mongoose.Schema;
let majorSchema = Schema({
  name:       String,   // 专业名称
  type:       String,   // 类别(工学，文学，...)
  eduRank:    String,   // 学历层次: 本科 专科
});

majorSchema.statics.all = function() {
  let majors = {
    labels: ['层次', '类别', '专业名称'],
    data:   { '本科': {}, '专科': {} }
  };

  return new Promise(function(resolve, reject) {
    gModels.Major.find().batchSize(200).exec().then(function(result) {
      result.forEach(function(major) {
        if (!majors.data[major.eduRank][major.type]) {
          majors.data[major.eduRank][major.type] = [];
        }

        majors.data[major.eduRank][major.type].push(major.name);
      });

      resolve(majors);
    }).catch(reject);
  });

}

let Major = mongoose.model('Major', majorSchema);

exports = module.exports =  Major;
