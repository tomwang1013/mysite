'use strict'

const co = require('co');

function index(req, res, next) {
  co(function* () {
    let jobId = req.params.id;
    let job = yield gModels.Job.findById(jobId).exec();
    let questions = yield gModels.Question.find({
      _job: jobId
    }).exec();
  }).catch(next); 
}

function nnew(req, res, next) {
}

function create(req, res, next) {
}

function edit(req, res, next) {
}

function update(req, res, next) {
}

exports = module.exports = {
  index:  index,
  nnew:   nnew,
  create: create,
  edit:   edit,
  update: update
};
