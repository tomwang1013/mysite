'use strict'

const co = require('co');
const _  = require('lodash');

function index(req,res, next) {
  co(function* () {
    let hots = yield {
      hotQs: gModels.Question.find({}),
      hotJobs: gModels.Job.find({})
    };

    res.render('home/index', hots);
  }).catch(next);
}

module.exports = {
  index: index
};
