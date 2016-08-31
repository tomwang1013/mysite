'use strict'

const _        = require('lodash');
const mongoose = require('mongoose');

function index(req, res, next) {
  gModels.Job.find().populate('_creator').exec(function(err, jobs) {
    res.render('jobs/index', { jobs: jobs });
  });
}

function newJob(req, res, next) {
  res.render('jobs/new', {
    businesses: gModels.Business,
    types:      gModels.JobType,
    salaries:   gModels.Job.salaries
  });
}

function create(req, res, next) {
  if (!req.currentUser) {
    return res.json({ error: 1, message: 'not login' });
  }

  gModels.Job.create(_.merge(req.body, { _creator: req.currentUser.id })).then(function(job) {
    res.json({ error: 0, location: '/jobs' });
  }).catch(function(err) {
    if (err.errors) {
      res.json({ error: 1, errors: _.mapValues(err.errors, function(e) { return e.message; }) });
    } else {
      res.json({ error: 1, message: err.message });
    }
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

  co(function* () {
    yield gModels.Job.update({ _id: jobId }, {
      $push: { _appliers: userId }
    }).exec();

    yield gModels.User.update({ _id: userId }, {
      $inc:  { _appliersSize: 1 },
      $push: { _appliedJobs: jobId }
    }).exec();

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
