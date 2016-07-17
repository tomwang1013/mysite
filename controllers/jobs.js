'use strict'

var _ = require('lodash');

function index(req, res, next) {
  gModels.Job.find({}, function(err, jobs) {
    res.render('jobs/index', { jobs: jobs });
  });
}

function newJob(req, res, next) {
  res.render('jobs/new');
}

function create(req, res, next) {
  gModels.Job.create(_.pick(req.body, ['title', 'duty', 'requirement'])).then(function(job) {
    res.redirect(301, '/jobs');
  });
}

function edit(req, res, next) {
}

function update(req, res, next) {
}

// apply for a job
function apply(req, res, next) {
  if (!req.currentUser) {
    res.redirect('/login');
    return;
  }

  var userId = req.currentUser.id;
  var jobId  = req.body.job_id;

  gModels.ApplyJob.create({ status: 0, _jobId: jobId, _userId: userId }).then(function() {
    res.json({ error: 0, message: '申请成功' });
  }).catch(function(err) {
    res.json({ error: 1, message: '申请失败' });
  });
}

exports = module.exports = {
  index:  index,
  newJob: newJob,
  create: create,
  edit:   edit,
  update: update,
  apply:  apply
};
