'use strict'

/**
 * 大专院校专业信息爬虫
 * http://zhuanye.eol.cn/
 */

const request = require('request');
const cheerio = require('cheerio');
const Major = require('../../../models/major');
const mongoose = require( 'mongoose');

mongoose.connect('mongodb://localhost/mysite');

const eduRanks = ['本科', '专科'];

let urls = ['http://gkcx.eol.cn/schoolhtm/specialty/10032/list.htm',
            'http://gkcx.eol.cn/schoolhtm/specialty/10033/list.htm'];
let outPromises = urls.map(function(url) {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (error || response.statusCode != 200) {
        return reject(error);
      }

      let eduRank = eduRanks[urls.indexOf(url)];
      let $ = cheerio.load(body);
      let majorType;
      let majorsToCreate = [];

      $('table#comapreTable tr').slice(1).each(function(i, tr) {
        let tds = $(this).children();
        let first = tds.first();

        if (first.attr('colspan')) return;

        if (first.attr('rowspan')) {
          majorType = first.find('a').text().trim();
          tds = tds.slice(1);
        }

        let major1 = tds.eq(0).find('a').text().trim();
        let major2 = tds.eq(3).find('a').text().trim();

        if (major1) {
          majorsToCreate.push({
            name: major1,
            type: majorType,
            eduRank: eduRank
          })
        }

        if (major2) {
          majorsToCreate.push({
            name: major2,
            type: majorType,
            eduRank: eduRank
          })
        }
      });

      Promise.all(majorsToCreate.map(function(major) {
        return Major.create(major);
      })).then(resolve).catch(reject);
    });
  });
})

Major.remove({}).exec().then(function() {
  Promise.all(outPromises).then(function(results) {
    console.log('crawle major info successfully');
    process.exit(0);
  }).catch(function(err) {
    console.error('crawle major info failed');
    console.error(err);
    process.exit(-1);
  });
});
