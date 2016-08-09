'use strict'

/**
 * 大专院校专业信息爬虫
 * http://zhuanye.eol.cn/
 */

const request = require('request');
const cheerio = require('cheerio');
const University = require('../../../models/major');
const mongoose = require( 'mongoose');

mongoose.connect('mongodb://localhost/mysite');

let urls = ['http://gkcx.eol.cn/schoolhtm/specialty/10032/list.htm',
            'http://gkcx.eol.cn/schoolhtm/specialty/10033/list.htm'];
let outPromises = urls.map(function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (error || response.statusCode != 200) {
        return reject(error);
      }

      //console.log(body);
      resolve();
    });
  });
})

Promise.all(outPromises).then(function(results) {
  console.log('crawle major info successfully');
  process.exit(0);
}).catch(function(err) {
  console.error('crawle major info failed');
  console.error(err);
  process.exit(-1);
});
