'use strict'

var _ = require('lodash');
const mongoose = require('mongoose');

function index(req, res, next) {
  gModels.Job.find({}, function(err, jobs) {
    res.render('jobs/index', { jobs: jobs });
  });
}

function newJob(req, res, next) {
  res.render('jobs/new');
}

function create(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login');
  }

  gModels.Job.create(_.merge(req.body, { _creator: req.currentUser.id })).then(function(job) {
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
    res.json({ error: 1, location: '/login', message: '用户未登陆' });
    return;
  }

  var userId = req.currentUser.id;
  var jobId  = req.body.job_id;

  gModels.ApplyJob.create({
    status:  0,
    _job:    new mongoose.Types.ObjectId(jobId),
    _userId: new mongoose.Types.ObjectId(userId)
  }).then(function() {
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