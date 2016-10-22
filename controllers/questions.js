'use strict'

const co = require('co');

function index(req, res, next) {
  co(function* () {
    let jobId = req.params.jid;
    let job = yield gModels.Job.findById(jobId).exec();
    let questions = yield gModels.Question.find({
      _job: jobId
    }).exec();

    res.render('questions/index', {
      job: job,
      questions: questions
    });
  }).catch(next); 
}

function nnew(req, res, next) {
  let jobId = req.params.jid;

  gModels.Job.findById(jobId, function(err, job) {
    if (err) return next(err);

    res.render('questions/new', {
      job: job
    });
  });
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
