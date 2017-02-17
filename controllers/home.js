'use strict'

const co = require('co');
const _  = require('lodash');

function index(req,res, next) {
  co(function* () {
    let hots = yield {
      hotQs: gModels.Question.find().populate('_creator').
        sort({ answer_cnt: -1 }).limit(50).exec(),

      hotJobs: gModels.Job.find().populate('_creator').
        sort({ appliers_cnt: -1 }).limit(50).exec()
    };

    res.render('home/index', hots);
  }).catch(next);
}

module.exports = {
  index: index
};
