'use strict'

/**
 * 中国大专院校爬虫
 * http://gkcx.eol.cn/soudaxue/queryschool.html?keyWord1=%E5%B9%BF%E5%B7%9E&x=0&y=0
 */
const request = require('request');
const cheerio = require('cheerio');
const University = require('../../../models/university');
const mongoose = require( 'mongoose');

const provinces = ['辽宁', '广东', '上海', '河南', '山东', '四川', '安徽',
  '湖北', '重庆', '云南', '陕西', '江苏', '湖南', '江西', '河北', '贵州',
  '北京', '天津', '浙江', '山西', '福建', '广西', '海南', '青海', '吉林',
  '甘肃', '宁夏', '新疆', '西藏', '香港', '澳门', '内蒙古', '黑龙江'];
const types = ['综合', '理工', '农林', '医药', '师范', '语言', '财经',
  '政法', '体育', '艺术', '民族', '军事', '其它']
const eduRanks = ['普通本科', '独立学院', '高职高专', '中外合作办学',
  '远程教育学院', 'HND项目', '成人教育', '其它']
const url = 'http://data.api.gkcx.eol.cn/soudaxue/queryschool.html?size=30&messtype=json&page=';

mongoose.connect('mongodb://localhost/mysite');

let outPromises = [];
for (let i = 1; i <= 100; i++) {
  let req = new Promise(function(resolve, reject) {
    request(url + i, function (error, response, body) {
      if (error || response.statusCode != 200) {
        return reject(error);
      }

      let schools = JSON.parse(body);

      if (!schools.school || schools.school.length == 0) {
        return resolve();
      }

      Promise.all(schools.school.map(function(u) {
        return University.create({
          name:     u.schoolname,
          province: u.province,
          type:     u.schoolproperty.slice(0, 2),
          eduRank:  u.schooltype
        })
      })).then(resolve).catch(reject);
    })
  });

  outPromises.push(req);
}

University.remove({}).exec().then(function() {
  Promise.all(outPromises).then(function(results) {
    console.log('crawle university info successfully');
    process.exit(0);
  }).catch(function(err) {
    console.error('crawle university info failed');
    console.error(err);
    process.exit(-1);
  });
});
