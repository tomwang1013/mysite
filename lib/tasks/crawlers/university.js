'use strict'

/**
 * 中国大专院校爬虫
 * http://gkcx.eol.cn/soudaxue/queryschool.html?keyWord1=%E5%B9%BF%E5%B7%9E&x=0&y=0
 */
var request = require('request');
var cheerio = require('cheerio')

var provinces = ['辽宁', '广东', '上海', '河南', '山东', '四川', '安徽',
  '湖北', '重庆', '云南', '陕西', '江苏', '湖南', '江西', '河北', '贵州',
  '北京', '天津', '浙江', '山西', '福建', '广西', '海南', '青海', '吉林',
  '甘肃', '宁夏', '新疆', '西藏', '香港', '澳门', '内蒙古', '黑龙江'];

var types = ['综合', '理工', '农林', '医药', '师范', '语言', '财经',
  '政法', '体育', '艺术', '民族', '军事', '其它']

var eduRanks = ['普通本科', '独立学院', '高职高专', '中外合作办学',
  '远程教育学院', 'HND项目', '成人教育', '其它']

var url = 'http://data.api.gkcx.eol.cn/soudaxue/queryschool.html?size=30&messtype=json&page=';

do {
  let i = 1;
  let retSize = 0;

  request(url + i, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let schools = JSON.parse(body);

      retSize = schools.school.length;
    } else {
      console.error(error);
      console.error(body);
      process.exit(1);
    }
  })
} while(retSize >= 30)
