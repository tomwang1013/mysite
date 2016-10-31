'use strict'

const mongoose = require('mongoose');

/**
 * 学校：大专院校
 */
let Schema = mongoose.Schema;
let universitySchema = new Schema({
  name:         String,   // 学校名称
  province:     String,   // 所在省份或直辖市
  type:         String,   // 院校分类: 综合，理工，etc
  eduRank:      String,   // 学历层次: 本科，专科，etc
  ranking:      Number,   // 综合排名
  typeRanking:  Number,   // 所在分类排名
});

// 按省份和学校获取所有数据
universitySchema.statics.all = function() {
  let universities = {
    labels: ['省份', '学校名称'],
    data:   {}
  };

  return new Promise(function(resolve, reject) {
    gModels.University.find().select('name province').exec().then(function(result) {
      result.forEach(function(school) {
        if (!universities.data[school.province]) {
          universities.data[school.province] = [];
        }

        universities.data[school.province].push(school.name);
      });

      resolve(universities);
    }).catch(reject);
  });
}

let University = mongoose.model('University', universitySchema);

exports = module.exports =  University;
