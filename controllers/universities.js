'use strict';

const pinyin = require('pinyin');
const _ = require('lodash');

exports.index = function(req, res, next) {
  gModels.University
    .find({})
    .select('name')
    .lean()
    .sort({ ranking: 1 })
    .exec(function(err, result) {
      let itemsPinyin = {};
      let items = result.map(function(v) {
        itemsPinyin[v.name] = _.flatten(pinyin(v.name, {
          style: pinyin.STYLE_NORMAL
        })).join('');

        return v.name;
      })

      res.json({ items, itemsPinyin });
    })
};
